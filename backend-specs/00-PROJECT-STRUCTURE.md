
# Legal CRM Backend - Project Structure

## Complete Directory Structure

```
legal-crm-backend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── server.ts                     # Entry point
├── src/
│   ├── app.ts                    # Express app setup
│   ├── config/
│   │   ├── database.ts           # MySQL connection pool
│   │   └── jwt.ts                # JWT configuration
│   ├── middleware/
│   │   ├── auth.ts               # Authentication & RBAC
│   │   ├── upload.ts             # File upload handling
│   │   ├── validation.ts         # Request validation
│   │   ├── errorHandler.ts       # Global error handling
│   │   └── rateLimiter.ts        # Rate limiting
│   ├── routes/
│   │   ├── auth.ts               # Authentication routes
│   │   ├── users.ts              # User management
│   │   ├── clients.ts            # Client management
│   │   ├── documents.ts          # Document handling
│   │   ├── contracts.ts          # Contract management
│   │   ├── forms.ts              # Intake forms
│   │   ├── billing.ts            # Billing & subscriptions
│   │   └── admin.ts              # Admin routes
│   ├── controllers/
│   │   ├── authController.ts     # Auth business logic
│   │   ├── userController.ts     # User operations
│   │   ├── clientController.ts   # Client operations
│   │   ├── documentController.ts # Document operations
│   │   ├── contractController.ts # Contract operations
│   │   ├── formController.ts     # Form operations
│   │   ├── billingController.ts  # Billing operations
│   │   └── adminController.ts    # Admin operations
│   ├── models/
│   │   ├── User.ts               # User model interface
│   │   ├── Client.ts             # Client model interface
│   │   ├── Document.ts           # Document model interface
│   │   ├── Contract.ts           # Contract model interface
│   │   ├── Form.ts               # Form model interface
│   │   ├── Subscription.ts       # Subscription model interface
│   │   └── index.ts              # Model exports
│   ├── services/
│   │   ├── email.ts              # Email service
│   │   ├── payment.ts            # PayPal integration
│   │   ├── ai.ts                 # AI document analysis
│   │   └── storage.ts            # File storage service
│   ├── templates/
│   │   ├── welcome.html          # Welcome email template
│   │   ├── passwordReset.html    # Password reset template
│   │   ├── contractAlert.html    # Contract alert template
│   │   ├── invoice.html          # Invoice template
│   │   └── intakeForm.html       # Intake form request template
│   ├── utils/
│   │   ├── logger.ts             # Logging utility
│   │   ├── validators.ts         # Custom validators
│   │   ├── encryption.ts         # Encryption helpers
│   │   └── constants.ts          # Application constants
│   └── types/
│       ├── express.d.ts          # Express type extensions
│       ├── paypal.d.ts           # PayPal type definitions
│       └── common.d.ts           # Common type definitions
├── uploads/                      # File storage
│   ├── documents/                # Legal documents
│   │   └── [user_id]/           # User-specific folders
│   ├── contracts/                # Contract files
│   │   └── [user_id]/           # User-specific folders
│   ├── forms/                    # Form templates/submissions
│   │   └── [user_id]/           # User-specific folders
│   └── profile/                  # Profile images
├── migrations/                   # Database migrations
│   ├── 001_create_users.sql
│   ├── 002_create_clients.sql
│   ├── 003_create_documents.sql
│   ├── 004_create_contracts.sql
│   ├── 005_create_forms.sql
│   ├── 006_create_subscriptions.sql
│   └── 007_create_logs.sql
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/                         # Documentation
    ├── API.md                    # API documentation
    └── DEPLOYMENT.md             # Deployment guide
```

## Key Design Principles

1. **Modular Architecture**: Clear separation of concerns with dedicated folders for routes, controllers, services, and models
2. **Type Safety**: Full TypeScript implementation with custom type definitions
3. **Security First**: JWT authentication, RBAC, input validation, and rate limiting
4. **Scalable File Storage**: Organized upload structure with user-specific directories
5. **Comprehensive Error Handling**: Centralized error handling with proper HTTP status codes
6. **Database Migrations**: Version-controlled database schema changes
7. **Service Layer**: Business logic separated from route handlers
8. **Template-Based Emails**: HTML email templates for professional communication
9. **Middleware Pipeline**: Reusable middleware for authentication, validation, and file handling
10. **Documentation**: Comprehensive API documentation and deployment guides
