
# Database Schema and Migrations

## Complete MySQL Database Schema

### Migration 001: Create Users Table

```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'staff') DEFAULT 'user',
    firm_name VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    profile_image VARCHAR(255),
    subscription_id VARCHAR(36),
    subscription_status ENUM('active', 'canceled', 'expired', 'trial') DEFAULT 'trial',
    subscription_tier ENUM('basic', 'premium', 'enterprise') DEFAULT 'basic',
    trial_ends_at TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_subscription_status (subscription_status),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);
```

### Migration 002: Create Clients Table

```sql
-- migrations/002_create_clients.sql
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    jurisdiction VARCHAR(100) NOT NULL,
    issue_description TEXT,
    status ENUM('New', 'Active', 'Done', 'VIP', 'Inactive') DEFAULT 'New',
    matter_type VARCHAR(100),
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    retainer_amount DECIMAL(10, 2),
    hourly_rate DECIMAL(10, 2),
    notes TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_jurisdiction (jurisdiction),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (name, email, issue_description, notes)
);
```

### Migration 003: Create Documents Table

```sql
-- migrations/003_create_documents.sql
CREATE TABLE documents (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    mime_type VARCHAR(100),
    category ENUM('contract', 'intake', 'correspondence', 'court', 'evidence', 'other') NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    tags JSON,
    is_confidential BOOLEAN DEFAULT FALSE,
    ai_analyzed BOOLEAN DEFAULT FALSE,
    ai_analysis_results JSON,
    ai_analysis_date TIMESTAMP NULL,
    checksum VARCHAR(64),
    version INT DEFAULT 1,
    parent_document_id VARCHAR(36),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_document_id) REFERENCES documents(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_client_id (client_id),
    INDEX idx_category (category),
    INDEX idx_ai_analyzed (ai_analyzed),
    INDEX idx_uploaded_at (uploaded_at),
    FULLTEXT idx_search (name, original_name, description)
);
```

### Migration 004: Create Contracts Table

```sql
-- migrations/004_create_contracts.sql
CREATE TABLE contracts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    document_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    contract_type VARCHAR(100),
    jurisdiction VARCHAR(100) NOT NULL,
    status ENUM('Draft', 'Under Review', 'Signed', 'Executed', 'Expired', 'Canceled', 'Flagged') DEFAULT 'Draft',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    expiration_date DATE,
    value DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    terms_summary TEXT,
    key_provisions JSON,
    renewal_terms VARCHAR(500),
    governing_law VARCHAR(100),
    dispute_resolution VARCHAR(500),
    signatures_required INT DEFAULT 1,
    signatures_obtained INT DEFAULT 0,
    last_review_date DATE,
    next_review_date DATE,
    notes TEXT,
    tags JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_jurisdiction (jurisdiction),
    INDEX idx_expiration_date (expiration_date),
    INDEX idx_next_review_date (next_review_date),
    FULLTEXT idx_search (title, description, terms_summary)
);
```

### Migration 005: Create Contract Alerts Table

```sql
-- migrations/005_create_contract_alerts.sql
CREATE TABLE contract_alerts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contract_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    alert_type ENUM('missing_signature', 'expiration_warning', 'review_due', 'clause_issue', 'deadline', 'renewal_due', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3, 2),
    trigger_date DATE,
    due_date DATE,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(36),
    resolution_notes TEXT,
    auto_generated BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_contract_id (contract_id),
    INDEX idx_user_id (user_id),
    INDEX idx_alert_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_resolved (resolved),
    INDEX idx_due_date (due_date),
    INDEX idx_created_at (created_at)
);
```

### Migration 006: Create Intake Forms Table

```sql
-- migrations/006_create_intake_forms.sql
CREATE TABLE intake_forms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_version VARCHAR(20) DEFAULT '1.0',
    form_schema JSON NOT NULL,
    ui_schema JSON,
    validation_rules JSON,
    auto_save BOOLEAN DEFAULT TRUE,
    allow_partial_submission BOOLEAN DEFAULT FALSE,
    requires_signature BOOLEAN DEFAULT FALSE,
    notification_settings JSON,
    active BOOLEAN DEFAULT TRUE,
    public_access BOOLEAN DEFAULT FALSE,
    access_code VARCHAR(100),
    expires_at TIMESTAMP NULL,
    submission_limit INT,
    current_submissions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_active (active),
    INDEX idx_public_access (public_access),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (title, description)
);
```

### Migration 007: Create Form Submissions Table

```sql
-- migrations/007_create_form_submissions.sql
CREATE TABLE form_submissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    form_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36),
    submitter_name VARCHAR(255),
    submitter_email VARCHAR(255),
    submitter_ip VARCHAR(45),
    responses JSON NOT NULL,
    metadata JSON,
    status ENUM('draft', 'submitted', 'reviewed', 'processed', 'archived') DEFAULT 'submitted',
    review_notes TEXT,
    processed_by VARCHAR(36),
    processed_at TIMESTAMP NULL,
    signature_data JSON,
    attachments JSON,
    validation_errors JSON,
    submission_source VARCHAR(50) DEFAULT 'web',
    referrer VARCHAR(500),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (form_id) REFERENCES intake_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    INDEX idx_form_id (form_id),
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_submitter_email (submitter_email),
    INDEX idx_submitted_at (submitted_at),
    FULLTEXT idx_search (submitter_name, submitter_email, review_notes)
);
```

### Migration 008: Create Subscriptions Table

```sql
-- migrations/008_create_subscriptions.sql
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    payment_provider ENUM('paypal', 'stripe', 'other') NOT NULL,
    payment_provider_id VARCHAR(255),
    subscription_id VARCHAR(255),
    status ENUM('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'failed', 'expired') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period ENUM('monthly', 'yearly', 'one-time') DEFAULT 'monthly',
    trial_start DATE,
    trial_end DATE,
    start_date DATE NOT NULL,
    end_date DATE,
    current_period_start DATE,
    current_period_end DATE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    metadata JSON,
    features JSON,
    usage_limits JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_active (user_id, status),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_plan_id (plan_id),
    INDEX idx_payment_provider (payment_provider),
    INDEX idx_end_date (end_date),
    INDEX idx_created_at (created_at)
);
```

### Migration 009: Create Billing Transactions Table

```sql
-- migrations/009_create_billing_transactions.sql
CREATE TABLE billing_transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    subscription_id VARCHAR(36),
    transaction_id VARCHAR(255) NOT NULL,
    payment_provider ENUM('paypal', 'stripe', 'other') NOT NULL,
    payment_method VARCHAR(100),
    type ENUM('payment', 'refund', 'chargeback', 'dispute', 'fee') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'canceled', 'disputed') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    fee_amount DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2),
    description TEXT,
    invoice_number VARCHAR(100),
    receipt_url VARCHAR(500),
    failure_reason TEXT,
    metadata JSON,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    UNIQUE KEY unique_transaction (transaction_id, payment_provider),
    INDEX idx_user_id (user_id),
    INDEX idx_subscription_id (subscription_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_processed_at (processed_at),
    INDEX idx_created_at (created_at)
);
```

### Migration 010: Create System Logs Table

```sql
-- migrations/010_create_system_logs.sql
CREATE TABLE system_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    entity_name VARCHAR(255),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    severity ENUM('debug', 'info', 'warning', 'error', 'critical') DEFAULT 'info',
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_severity (severity),
    INDEX idx_created_at (created_at),
    INDEX idx_composite_search (entity_type, entity_id, created_at)
);
```

### Migration 011: Create Sessions Table

```sql
-- migrations/011_create_sessions.sql
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    device_info JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    location JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_refresh_token (refresh_token),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at),
    INDEX idx_last_activity (last_activity)
);
```

## File Storage Structure

```
uploads/
├── documents/
│   └── [user_id]/
│       ├── contracts/
│       ├── correspondence/
│       ├── court-filings/
│       ├── evidence/
│       └── other/
├── contracts/
│   └── [user_id]/
│       ├── executed/
│       ├── drafts/
│       └── templates/
├── forms/
│   └── [user_id]/
│       ├── templates/
│       ├── submissions/
│       └── attachments/
└── profile/
    └── [user_id]/
        ├── avatar.jpg
        └── firm-logo.png
```

## Database Indexes and Optimization

### Performance Indexes

```sql
-- Additional performance indexes
CREATE INDEX idx_users_subscription_active ON users(subscription_status, subscription_tier);
CREATE INDEX idx_contracts_review_alerts ON contracts(user_id, next_review_date, status);
CREATE INDEX idx_documents_recent ON documents(user_id, uploaded_at DESC);
CREATE INDEX idx_form_submissions_recent ON form_submissions(form_id, submitted_at DESC);
CREATE INDEX idx_billing_recent ON billing_transactions(user_id, created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_clients_user_status ON clients(user_id, status, created_at);
CREATE INDEX idx_contracts_user_status ON contracts(user_id, status, expiration_date);
CREATE INDEX idx_alerts_user_unresolved ON contract_alerts(user_id, resolved, severity);
```

### Database Views for Common Queries

```sql
-- View for active client summary
CREATE VIEW active_clients_summary AS
SELECT 
    c.user_id,
    COUNT(*) as total_clients,
    SUM(CASE WHEN c.status = 'New' THEN 1 ELSE 0 END) as new_clients,
    SUM(CASE WHEN c.status = 'VIP' THEN 1 ELSE 0 END) as vip_clients,
    SUM(CASE WHEN c.status = 'Active' THEN 1 ELSE 0 END) as active_clients
FROM clients c
WHERE c.status IN ('New', 'Active', 'VIP')
GROUP BY c.user_id;

-- View for contract alerts summary
CREATE VIEW contract_alerts_summary AS
SELECT 
    ca.user_id,
    COUNT(*) as total_alerts,
    SUM(CASE WHEN ca.severity = 'critical' THEN 1 ELSE 0 END) as critical_alerts,
    SUM(CASE WHEN ca.severity = 'high' THEN 1 ELSE 0 END) as high_alerts,
    SUM(CASE WHEN ca.resolved = FALSE THEN 1 ELSE 0 END) as unresolved_alerts
FROM contract_alerts ca
GROUP BY ca.user_id;
```
