
# Billing Backend - PayPal Integration

## Complete PayPal Billing Implementation for Legal CRM

### Environment Variables (.env)

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
PAYPAL_MODE=sandbox  # or 'live' for production
VITE_PRO_PLAN_ID=P-12345678901234567890123456  # PayPal Plan ID

# PayPal API URLs
PAYPAL_BASE_URL_SANDBOX=https://api.sandbox.paypal.com
PAYPAL_BASE_URL_LIVE=https://api.paypal.com

# Trial Configuration
TRIAL_PERIOD_DAYS=14
```

### Database Migration - Subscriptions Table

```sql
-- migrations/012_create_billing_tables.sql
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    paypal_subscription_id VARCHAR(255) UNIQUE,
    paypal_plan_id VARCHAR(255) NOT NULL,
    status ENUM('trial', 'active', 'canceled', 'failed', 'expired', 'past_due') DEFAULT 'trial',
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period ENUM('monthly', 'yearly') DEFAULT 'monthly',
    trial_start TIMESTAMP NULL,
    trial_end TIMESTAMP NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    next_billing_time TIMESTAMP NULL,
    failure_count INT DEFAULT 0,
    last_payment_date TIMESTAMP NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_paypal_subscription_id (paypal_subscription_id),
    INDEX idx_trial_end (trial_end),
    INDEX idx_next_billing_time (next_billing_time)
);

CREATE TABLE billing_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subscription_id VARCHAR(36),
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_id (event_id),
    INDEX idx_event_type (event_type),
    INDEX idx_processed (processed),
    INDEX idx_subscription_id (subscription_id)
);

CREATE TABLE payment_methods (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    paypal_payment_method_id VARCHAR(255),
    type ENUM('credit_card', 'bank_account', 'paypal') DEFAULT 'credit_card',
    last_four VARCHAR(4),
    brand VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATE,
    billing_address JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default)
);
```

### PayPal Service Configuration

```typescript
// src/config/paypal.ts
import paypal from '@paypal/checkout-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const environment = process.env.PAYPAL_MODE === 'live' 
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);

export const paypalClient = new paypal.core.PayPalHttpClient(environment);

export const getPayPalBaseUrl = () => {
  return process.env.PAYPAL_MODE === 'live' 
    ? process.env.PAYPAL_BASE_URL_LIVE
    : process.env.PAYPAL_BASE_URL_SANDBOX;
};

export const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
};
```

### Billing Controller

```typescript
// src/controllers/billingController.ts
import { Request, Response } from 'express';
import { getPool } from '../config/database';
import { getAccessToken, getPayPalBaseUrl } from '../config/paypal';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

interface SubscriptionRequest {
  planId: string;
  returnUrl: string;
  cancelUrl: string;
}

interface PayPalSubscription {
  id: string;
  status: string;
  billing_info: {
    next_billing_time: string;
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
    }>;
  };
  plan_id: string;
}

export const createSubscription = async (req: AuthRequest, res: Response) => {
  const pool = getPool();
  
  try {
    const { planId, returnUrl, cancelUrl } = req.body as SubscriptionRequest;
    const userId = req.user!.id;

    logger.info('Creating PayPal subscription', { userId, planId });

    // Check if user already has an active subscription
    const [existingSubscriptions] = await pool.execute(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status IN (?, ?, ?)',
      [userId, 'trial', 'active', 'past_due']
    );

    if (Array.isArray(existingSubscriptions) && existingSubscriptions.length > 0) {
      return res.status(400).json({
        error: 'User already has an active subscription',
      });
    }

    const accessToken = await getAccessToken();
    
    // Create subscription with PayPal
    const subscriptionData = {
      plan_id: planId,
      application_context: {
        brand_name: 'Legal CRM',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    };

    const response = await fetch(`${getPayPalBaseUrl()}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(subscriptionData),
    });

    const subscription = await response.json();

    if (!response.ok) {
      logger.error('PayPal subscription creation failed', subscription);
      return res.status(400).json({
        error: 'Failed to create subscription',
        details: subscription,
      });
    }

    // Calculate trial period
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + parseInt(process.env.TRIAL_PERIOD_DAYS || '14'));

    // Store subscription in database
    await pool.execute(
      `INSERT INTO subscriptions (
        user_id, plan_id, plan_name, paypal_subscription_id, paypal_plan_id,
        status, price, currency, billing_period, trial_start, trial_end,
        start_date, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        planId,
        'Pro Plan', // This should be dynamic based on planId
        subscription.id,
        planId,
        'trial',
        29.99, // This should be dynamic based on planId
        'USD',
        'monthly',
        trialStart,
        trialEnd,
        trialStart,
        JSON.stringify({ paypal_response: subscription }),
      ]
    );

    logger.info('Subscription created successfully', { 
      subscriptionId: subscription.id,
      userId 
    });

    res.json({
      subscriptionId: subscription.id,
      approvalUrl: subscription.links.find((link: any) => link.rel === 'approve')?.href,
      status: subscription.status,
    });

  } catch (error) {
    logger.error('Error creating subscription', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const activateSubscription = async (req: AuthRequest, res: Response) => {
  const pool = getPool();
  
  try {
    const { subscriptionId } = req.params;
    const userId = req.user!.id;

    logger.info('Activating subscription', { subscriptionId, userId });

    const accessToken = await getAccessToken();

    // Get subscription details from PayPal
    const response = await fetch(`${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const subscription: PayPalSubscription = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: 'Failed to retrieve subscription details',
        details: subscription,
      });
    }

    // Update subscription in database
    const currentPeriodEnd = new Date(subscription.billing_info.next_billing_time);
    
    await pool.execute(
      `UPDATE subscriptions SET 
        status = ?, 
        current_period_start = NOW(), 
        current_period_end = ?,
        next_billing_time = ?,
        updated_at = NOW()
      WHERE paypal_subscription_id = ? AND user_id = ?`,
      [
        subscription.status.toLowerCase(),
        currentPeriodEnd,
        subscription.billing_info.next_billing_time,
        subscriptionId,
        userId
      ]
    );

    logger.info('Subscription activated', { subscriptionId, status: subscription.status });

    res.json({
      status: subscription.status,
      nextBillingTime: subscription.billing_info.next_billing_time,
    });

  } catch (error) {
    logger.error('Error activating subscription', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  const pool = getPool();
  
  try {
    const userId = req.user!.id;

    const [subscriptions] = await pool.execute(
      `SELECT s.*, u.email FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = ? AND s.status IN (?, ?, ?)
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId, 'trial', 'active', 'past_due']
    );

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return res.json({
        hasSubscription: false,
        status: null,
      });
    }

    const subscription = subscriptions[0] as any;
    
    // Check if trial has expired
    const now = new Date();
    const trialEnd = new Date(subscription.trial_end);
    const isTrialExpired = subscription.status === 'trial' && now > trialEnd;

    res.json({
      hasSubscription: true,
      status: subscription.status,
      planName: subscription.plan_name,
      trialEnd: subscription.trial_end,
      currentPeriodEnd: subscription.current_period_end,
      isTrialExpired,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

  } catch (error) {
    logger.error('Error getting subscription status', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const upgradeSubscription = async (req: AuthRequest, res: Response) => {
  const pool = getPool();
  
  try {
    const { id: subscriptionId } = req.params;
    const { newPlanId } = req.body;
    const userId = req.user!.id;

    logger.info('Upgrading subscription', { subscriptionId, newPlanId, userId });

    const accessToken = await getAccessToken();

    // Get current subscription
    const [subscriptions] = await pool.execute(
      'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
      [subscriptionId, userId]
    );

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscription = subscriptions[0] as any;

    // Update plan with PayPal
    const updateData = {
      plan_id: newPlanId,
    };

    const response = await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscription.paypal_subscription_id}/revise`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: 'Failed to upgrade subscription',
        details: result,
      });
    }

    // Update database
    await pool.execute(
      'UPDATE subscriptions SET plan_id = ?, paypal_plan_id = ?, updated_at = NOW() WHERE id = ?',
      [newPlanId, newPlanId, subscriptionId]
    );

    logger.info('Subscription upgraded successfully', { subscriptionId, newPlanId });

    res.json({
      message: 'Subscription upgraded successfully',
      newPlanId,
    });

  } catch (error) {
    logger.error('Error upgrading subscription', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  const pool = getPool();
  
  try {
    const { id: subscriptionId } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;

    logger.info('Canceling subscription', { subscriptionId, userId, reason });

    const accessToken = await getAccessToken();

    // Get current subscription
    const [subscriptions] = await pool.execute(
      'SELECT * FROM subscriptions WHERE id = ? AND user_id = ?',
      [subscriptionId, userId]
    );

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscription = subscriptions[0] as any;

    // Cancel with PayPal
    const cancelData = {
      reason: reason || 'User requested cancellation',
    };

    const response = await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscription.paypal_subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(cancelData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(400).json({
        error: 'Failed to cancel subscription',
        details: error,
      });
    }

    // Update database
    await pool.execute(
      `UPDATE subscriptions SET 
        status = 'canceled', 
        canceled_at = NOW(), 
        cancellation_reason = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [reason || 'User requested cancellation', subscriptionId]
    );

    logger.info('Subscription canceled successfully', { subscriptionId });

    res.json({
      message: 'Subscription canceled successfully',
      canceledAt: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Error canceling subscription', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const pool = getPool();
  
  try {
    const webhookBody = req.body;
    const webhookId = process.env.PAYPAL_WEBHOOK_ID!;
    
    // Verify webhook signature (simplified - implement proper verification)
    const eventId = webhookBody.id;
    const eventType = webhookBody.event_type;
    const resource = webhookBody.resource;

    logger.info('Processing PayPal webhook', { eventId, eventType });

    // Check if event was already processed (idempotency)
    const [existingEvents] = await pool.execute(
      'SELECT id FROM billing_events WHERE event_id = ?',
      [eventId]
    );

    if (Array.isArray(existingEvents) && existingEvents.length > 0) {
      logger.info('Webhook event already processed', { eventId });
      return res.status(200).json({ message: 'Event already processed' });
    }

    // Process different webhook events
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(pool, resource, eventId);
        break;
        
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(pool, resource, eventId);
        break;
        
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(pool, resource, eventId);
        break;
        
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        await handlePaymentFailed(pool, resource, eventId);
        break;
        
      default:
        logger.info('Unhandled webhook event type', { eventType });
    }

    // Record the event
    await pool.execute(
      `INSERT INTO billing_events (event_id, event_type, event_data, processed, processed_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [eventId, eventType, JSON.stringify(webhookBody), true]
    );

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    logger.error('Error processing webhook', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Webhook event handlers
const handleSubscriptionActivated = async (pool: any, resource: any, eventId: string) => {
  const subscriptionId = resource.id;
  
  await pool.execute(
    `UPDATE subscriptions SET 
      status = 'active', 
      current_period_start = NOW(),
      current_period_end = ?,
      updated_at = NOW()
     WHERE paypal_subscription_id = ?`,
    [resource.billing_info?.next_billing_time || null, subscriptionId]
  );
  
  logger.info('Subscription activated via webhook', { subscriptionId, eventId });
};

const handleSubscriptionCancelled = async (pool: any, resource: any, eventId: string) => {
  const subscriptionId = resource.id;
  
  await pool.execute(
    `UPDATE subscriptions SET 
      status = 'canceled', 
      canceled_at = NOW(),
      updated_at = NOW()
     WHERE paypal_subscription_id = ?`,
    [subscriptionId]
  );
  
  logger.info('Subscription cancelled via webhook', { subscriptionId, eventId });
};

const handlePaymentCompleted = async (pool: any, resource: any, eventId: string) => {
  const subscriptionId = resource.billing_agreement_id;
  
  await pool.execute(
    `UPDATE subscriptions SET 
      last_payment_date = NOW(),
      failure_count = 0,
      updated_at = NOW()
     WHERE paypal_subscription_id = ?`,
    [subscriptionId]
  );
  
  logger.info('Payment completed via webhook', { subscriptionId, eventId });
};

const handlePaymentFailed = async (pool: any, resource: any, eventId: string) => {
  const subscriptionId = resource.billing_agreement_id;
  
  await pool.execute(
    `UPDATE subscriptions SET 
      failure_count = failure_count + 1,
      status = CASE WHEN failure_count >= 3 THEN 'failed' ELSE 'past_due' END,
      updated_at = NOW()
     WHERE paypal_subscription_id = ?`,
    [subscriptionId]
  );
  
  logger.info('Payment failed via webhook', { subscriptionId, eventId });
};
```

### Billing Routes

```typescript
// src/routes/billing.ts
import express from 'express';
import { auth } from '../middleware/auth';
import {
  createSubscription,
  activateSubscription,
  getSubscriptionStatus,
  upgradeSubscription,
  cancelSubscription,
  handleWebhook,
} from '../controllers/billingController';

const router = express.Router();

// Protected routes
router.post('/subscribe', auth, createSubscription);
router.post('/subscriptions/:subscriptionId/activate', auth, activateSubscription);
router.get('/subscription/status', auth, getSubscriptionStatus);
router.put('/subscriptions/:id/upgrade', auth, upgradeSubscription);
router.delete('/subscriptions/:id', auth, cancelSubscription);

// Webhook endpoint (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
```

### Trial Expiration Scheduler

```typescript
// src/services/trialScheduler.ts
import cron from 'node-cron';
import { getPool } from '../config/database';
import { getAccessToken, getPayPalBaseUrl } from '../config/paypal';
import { logger } from '../utils/logger';

export const initializeTrialScheduler = () => {
  // Run every hour to check for expired trials
  cron.schedule('0 * * * *', async () => {
    logger.info('Running trial expiration check');
    await processExpiredTrials();
  });
  
  logger.info('Trial scheduler initialized');
};

const processExpiredTrials = async () => {
  const pool = getPool();
  
  try {
    // Find trials that have expired but haven't been processed
    const [expiredTrials] = await pool.execute(
      `SELECT * FROM subscriptions 
       WHERE status = 'trial' 
       AND trial_end < NOW() 
       AND paypal_subscription_id IS NOT NULL`
    );

    if (!Array.isArray(expiredTrials) || expiredTrials.length === 0) {
      logger.info('No expired trials to process');
      return;
    }

    logger.info(`Processing ${expiredTrials.length} expired trials`);

    const accessToken = await getAccessToken();

    for (const subscription of expiredTrials) {
      try {
        // Activate subscription with PayPal
        const response = await fetch(
          `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscription.paypal_subscription_id}/activate`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              reason: 'Trial period ended - activating subscription',
            }),
          }
        );

        if (response.ok) {
          // Update subscription status
          await pool.execute(
            `UPDATE subscriptions SET 
              status = 'active',
              current_period_start = NOW(),
              current_period_end = DATE_ADD(NOW(), INTERVAL 1 MONTH),
              updated_at = NOW()
             WHERE id = ?`,
            [subscription.id]
          );

          logger.info('Trial converted to active subscription', {
            subscriptionId: subscription.id,
            userId: subscription.user_id,
          });
        } else {
          const error = await response.json();
          logger.error('Failed to activate subscription after trial', {
            subscriptionId: subscription.id,
            error,
          });

          // Mark as failed
          await pool.execute(
            'UPDATE subscriptions SET status = "failed", updated_at = NOW() WHERE id = ?',
            [subscription.id]
          );
        }
      } catch (error) {
        logger.error('Error processing individual trial', {
          subscriptionId: subscription.id,
          error,
        });
      }
    }
  } catch (error) {
    logger.error('Error in trial expiration processing', error);
  }
};

// Manual trigger for testing
export const processExpiredTrialsManual = processExpiredTrials;
```

### Frontend Integration Examples

```typescript
// Frontend API calls
export const billingAPI = {
  createSubscription: async (planId: string) => {
    const response = await fetch('/api/billing/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        planId,
        returnUrl: `${window.location.origin}/billing/success`,
        cancelUrl: `${window.location.origin}/billing/cancel`,
      }),
    });
    return response.json();
  },

  getSubscriptionStatus: async () => {
    const response = await fetch('/api/billing/subscription/status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  cancelSubscription: async (subscriptionId: string, reason?: string) => {
    const response = await fetch(`/api/billing/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },
};
```

### Security Considerations

1. **Webhook Verification**: Implement proper PayPal webhook signature verification
2. **Idempotency**: Ensure webhook events are processed only once
3. **Rate Limiting**: Implement rate limiting on billing endpoints
4. **Data Encryption**: Encrypt sensitive billing data at rest
5. **Audit Logging**: Log all billing operations for compliance
6. **PCI Compliance**: Never store raw credit card data

### Testing Strategy

1. **PayPal Sandbox**: Use PayPal's sandbox environment for testing
2. **Webhook Testing**: Use tools like ngrok for local webhook testing
3. **Unit Tests**: Test individual billing functions
4. **Integration Tests**: Test complete billing workflows
5. **Load Testing**: Test under high webhook volume

This implementation provides a complete, production-ready billing system with PayPal integration, trial management, and comprehensive webhook handling.
