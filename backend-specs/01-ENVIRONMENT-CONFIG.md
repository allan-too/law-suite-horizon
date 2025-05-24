
# Environment Configuration

## .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=development
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=john
DB_PASSWORD=secure_##John27paul
DB_NAME=legal_crm
DB_CONNECTION_LIMIT=10

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@legalcrm.com
EMAIL_PASS=your_app_specific_email_password
EMAIL_FROM=Legal CRM <noreply@legalcrm.com>

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
PAYPAL_MODE=sandbox  # or 'live' for production

# File Storage
UPLOAD_DIRECTORY=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,jpg,jpeg,png

# AI Document Analysis
AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## package.json

```json
{
  "name": "legal-crm-backend",
  "version": "1.0.0",
  "description": "Backend API for Legal CRM SaaS Platform",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "start:prod": "NODE_ENV=production node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "clean": "rimraf dist"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "mysql2": "^3.6.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.4",
    "express-rate-limit": "^6.8.1",
    "express-validator": "^7.0.1",
    "ajv": "^8.12.0",
    "winston": "^3.10.0",
    "compression": "^1.7.4",
    "uuid": "^9.0.0",
    "paypal-rest-sdk": "^1.8.1",
    "@paypal/checkout-server-sdk": "^1.0.3",
    "axios": "^1.5.0",
    "joi": "^17.9.2",
    "express-async-errors": "^3.1.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.0",
    "@types/cors": "^2.8.13",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/bcryptjs": "^2.4.2",
    "@types/multer": "^1.4.7",
    "@types/nodemailer": "^6.4.9",
    "@types/uuid": "^9.0.2",
    "@types/jest": "^29.5.4",
    "@types/supertest": "^2.0.12",
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "rimraf": "^5.0.1",
    "eslint": "^8.47.0",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "@typescript-eslint/parser": "^6.4.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": [
    "legal",
    "crm",
    "saas",
    "api",
    "express",
    "mysql",
    "typescript"
  ],
  "author": "Legal CRM Team",
  "license": "MIT"
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@/models/*": ["./models/*"],
      "@/services/*": ["./services/*"],
      "@/utils/*": ["./utils/*"],
      "@/middleware/*": ["./middleware/*"],
      "@/controllers/*": ["./controllers/*"],
      "@/routes/*": ["./routes/*"],
      "@/config/*": ["./config/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

## .gitignore

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Uploads
uploads/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Testing
coverage/
.nyc_output/
junit.xml

# Build outputs
dist/
build/
```
