
# Legal CRM SaaS Platform

This repository contains the frontend for the Legal CRM SaaS platform, a specialized legal practice management system designed for attorneys and law firms. The application is built with React, TypeScript, and Tailwind CSS.

## Frontend Overview

The frontend is built with:
- React + TypeScript
- Tailwind CSS for styling
- Shadcn UI component library
- React Router for navigation
- React Query for data fetching

## Backend Setup Instructions

The backend for this Legal CRM platform should be built with Node.js + Express.js and use MySQL as the database. Follow these setup instructions to create a backend that integrates with this frontend.

### Prerequisites

- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

### Initial Setup

```bash
# Create and navigate to backend directory
mkdir backend && cd backend

# Initialize a new Node.js project
npm init -y

# Install required dependencies
npm install express cors dotenv jsonwebtoken mysql2 bcryptjs multer nodemailer

# Install development dependencies
npm install --save-dev typescript ts-node nodemon @types/express @types/node
```

### Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── auth.ts       # Authentication logic
│   │   ├── clients.ts    # Client management
│   │   ├── documents.ts  # Document handling
│   │   ├── contracts.ts  # Contract management
│   │   ├── forms.ts      # Intake forms
│   │   ├── billing.ts    # Subscription/billing
│   │   └── admin.ts      # Admin operations
│   ├── middleware/
│   │   ├── auth.ts       # JWT verification
│   │   ├── upload.ts     # File upload handling
│   │   ├── validation.ts # Input validation
│   │   └── rbac.ts       # Role-based access control
│   ├── models/           # Database models
│   │   ├── user.ts
│   │   ├── client.ts
│   │   ├── document.ts
│   │   ├── contract.ts
│   │   ├── form.ts
│   │   └── subscription.ts
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── clients.ts
│   │   ├── documents.ts
│   │   ├── contracts.ts
│   │   ├── forms.ts
│   │   ├── billing.ts
│   │   └── admin.ts
│   ├── services/         # Business logic
│   │   ├── email.ts      # Email notifications
│   │   ├── ai.ts         # AI document analysis
│   │   └── payment.ts    # Payment processing
│   ├── utils/            # Utility functions
│   │   ├── logger.ts
│   │   └── helpers.ts
│   ├── config/           # Configuration files
│   │   └── database.ts   # Database connection
│   └── app.ts            # Express application setup
├── uploads/              # File storage directory
├── .env                  # Environment variables
├── tsconfig.json         # TypeScript configuration
└── server.ts             # Entry point
```

### Environment Variables (.env)

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=john
DB_PASSWORD=secure_##John27paul
DB_NAME=legal_crm

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=noreply@legalcrm.com
EMAIL_PASS=your_email_password

# Payment Processing (PayPal)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# File Storage
UPLOAD_DIRECTORY=./uploads
MAX_FILE_SIZE=10485760 # 10MB

# AI Document Analysis
AI_API_ENDPOINT=https://api.example.com/analyze
AI_API_KEY=your_ai_api_key
```

### Database Schema

Below is a MySQL schema design for the Legal CRM platform:

```sql
-- Users/Attorneys Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'staff') DEFAULT 'user',
    firm_name VARCHAR(255),
    phone VARCHAR(50),
    profile_image VARCHAR(255),
    subscription_id VARCHAR(36),
    subscription_status ENUM('active', 'canceled', 'expired', 'trial') DEFAULT 'trial',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients Table
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    status ENUM('active', 'inactive', 'potential') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Documents Table
CREATE TABLE documents (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    category ENUM('contract', 'intake', 'correspondence', 'court', 'other') NOT NULL,
    tags JSON,
    ai_analyzed BOOLEAN DEFAULT FALSE,
    ai_results JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Contracts Table
CREATE TABLE contracts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    document_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    status ENUM('draft', 'sent', 'signed', 'expired', 'canceled') DEFAULT 'draft',
    expiration_date DATE,
    value DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Contract Alerts (from AI analysis)
CREATE TABLE contract_alerts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contract_id VARCHAR(36) NOT NULL,
    alert_type ENUM('missing_signature', 'clause_issue', 'deadline', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Intake Forms Table
CREATE TABLE intake_forms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    template JSON,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Completed Forms Table
CREATE TABLE completed_forms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    form_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36),
    responses JSON NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES intake_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    payment_provider ENUM('paypal', 'stripe', 'other') NOT NULL,
    payment_id VARCHAR(255),
    status ENUM('active', 'canceled', 'failed', 'expired') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_period ENUM('monthly', 'yearly') DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System Logs (for admin)
CREATE TABLE system_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Storage Buckets

For file storage, set up the following directory structure:

```
uploads/
├── documents/        # Legal documents
│   └── [user_id]/    # Organized by user
├── contracts/        # Contract files
│   └── [user_id]/
├── forms/            # Form templates and submissions
│   └── [user_id]/
└── profile/          # User profile images
```

### Key API Endpoints

The backend should expose the following REST API endpoints that match the frontend routes:

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Send password reset link
- `POST /api/auth/reset-password` - Reset password with token

#### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/password` - Change password

#### Client Management
- `GET /api/clients` - List all clients for current user
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

#### Document Management
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents` - Upload new document
- `PUT /api/documents/:id` - Update document metadata
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/analyze` - Trigger AI analysis

#### Contract Management
- `GET /api/contracts` - List all contracts
- `GET /api/contracts/:id` - Get contract details
- `POST /api/contracts` - Create new contract
- `PUT /api/contracts/:id` - Update contract
- `DELETE /api/contracts/:id` - Delete contract
- `GET /api/contracts/:id/alerts` - Get contract alerts

#### Intake Forms
- `GET /api/forms` - List all intake forms
- `GET /api/forms/:id` - Get form details
- `POST /api/forms` - Create new form template
- `PUT /api/forms/:id` - Update form template
- `DELETE /api/forms/:id` - Delete form template
- `POST /api/forms/:id/submissions` - Submit completed form
- `GET /api/forms/:id/submissions` - List form submissions

#### Subscription/Billing
- `GET /api/billing/plans` - List available subscription plans
- `GET /api/billing/subscriptions` - Get current subscription
- `POST /api/billing/subscribe` - Create new subscription
- `PUT /api/billing/subscriptions/:id` - Update subscription
- `DELETE /api/billing/subscriptions/:id` - Cancel subscription
- `GET /api/billing/transactions` - List billing transactions

#### Admin Endpoints
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `PUT /api/admin/users/:id/role` - Change user role
- `GET /api/admin/subscriptions` - List all subscriptions
- `GET /api/admin/logs` - Get system logs
- `PUT /api/admin/settings` - Update platform settings

### Basic Server Setup (server.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './src/config/database';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file directory for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
import authRoutes from './src/routes/auth';
import clientRoutes from './src/routes/clients';
import documentRoutes from './src/routes/documents';
import contractRoutes from './src/routes/contracts';
import formRoutes from './src/routes/forms';
import billingRoutes from './src/routes/billing';
import adminRoutes from './src/routes/admin';

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
```

### Authentication Middleware (src/middleware/auth.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: 'user' | 'admin' | 'staff';
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
```

### Integration Recommendations

1. **AI Document Analysis**: Set up a separate microservice or use an existing AI service with an API to analyze legal documents. The backend should have an endpoint to forward documents to this service and store the results.

2. **Payment Processing**: Implement PayPal subscription API integration for handling subscription payments. Set up webhook endpoints to receive payment status updates.

3. **Email Notifications**: Use a service like Nodemailer to send transactional emails for important events (document uploads, contract deadlines, etc.).

4. **File Storage**: For production, consider using AWS S3 or similar cloud storage for document management instead of local storage.

5. **Authentication**: Implement JWT-based authentication with refresh tokens for better security.

6. **Logging**: Set up structured logging for debugging and auditing purposes.

7. **Testing**: Create unit and integration tests for critical components using Jest or Mocha.

### Next Steps

1. Set up the basic Express server structure
2. Configure MySQL database and create tables
3. Implement authentication system
4. Build core API endpoints
5. Add file upload functionality
6. Implement subscription management
7. Set up admin controls
8. Add document analysis integration
9. Deploy to a production environment

## Development and Deployment

### Local Development

```bash
# Start the backend server in development mode
npm run dev

# Start the frontend development server
cd ../frontend
npm run dev
```

### Production Deployment

For production deployment, you may want to consider:
- Using PM2 or Docker for process management
- Setting up NGINX as a reverse proxy
- Implementing HTTPS with Let's Encrypt
- Using a managed database service
- Setting up CI/CD pipelines for automated testing and deployment

```bash
# Build the frontend
cd frontend
npm run build

# Start the backend server in production mode
cd ../backend
npm run start:prod
```
