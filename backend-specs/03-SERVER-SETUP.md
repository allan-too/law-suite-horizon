
# Server Setup and Express Configuration

## server.ts - Application Entry Point

```typescript
import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';
import { connectDatabase } from '@/config/database';
import { logger } from '@/utils/logger';
import { createUploadsDirectories } from '@/utils/storage';

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    // Initialize database connection
    logger.info('Connecting to database...');
    await connectDatabase();
    logger.info('Database connected successfully');

    // Create upload directories
    await createUploadsDirectories();
    logger.info('Upload directories initialized');

    // Create HTTP server
    const server = createServer(app);

    // Start listening
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`API endpoints available at http://localhost:${PORT}/api`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

## src/app.ts - Express Application Setup

```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import 'express-async-errors';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/requestLogger';
import { authenticateToken } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import clientRoutes from '@/routes/clients';
import documentRoutes from '@/routes/documents';
import contractRoutes from '@/routes/contracts';
import formRoutes from '@/routes/forms';
import billingRoutes from '@/routes/billing';
import adminRoutes from '@/routes/admin';

import { logger } from '@/utils/logger';

const app: Application = express();

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later',
    resetTime: new Date(Date.now() + parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
}));

// Health check endpoint (before other middleware)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/documents', authenticateToken, documentRoutes);
app.use('/api/contracts', authenticateToken, contractRoutes);
app.use('/api/forms', authenticateToken, formRoutes);
app.use('/api/billing', authenticateToken, billingRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
```

## src/config/database.ts - MySQL Connection Pool

```typescript
import mysql from 'mysql2/promise';
import { logger } from '@/utils/logger';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
  reconnect: boolean;
  charset: string;
  timezone: string;
}

class DatabaseConnection {
  private pool: mysql.Pool | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'john',
      password: process.env.DB_PASSWORD || 'secure_##John27paul',
      database: process.env.DB_NAME || 'legal_crm',
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      charset: 'utf8mb4',
      timezone: '+00:00',
    };
  }

  async connect(): Promise<void> {
    try {
      if (this.pool) {
        logger.warn('Database pool already exists');
        return;
      }

      this.pool = mysql.createPool({
        ...this.config,
        waitForConnections: true,
        queueLimit: 0,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      // Test the connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      logger.info(`Database connected successfully to ${this.config.host}:${this.config.port}/${this.config.database}`);
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool;
  }

  async execute<T = any>(query: string, params?: any[]): Promise<T[]> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    try {
      const [rows] = await this.pool.execute(query, params);
      return rows as T[];
    } catch (error) {
      logger.error('Database query error:', { query, params, error });
      throw error;
    }
  }

  async executeOne<T = any>(query: string, params?: any[]): Promise<T | null> {
    const results = await this.execute<T>(query, params);
    return results.length > 0 ? results[0] : null;
  }

  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info('Database connection closed');
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

export const connectDatabase = () => dbConnection.connect();
export const getDatabase = () => dbConnection.getPool();
export const executeQuery = <T = any>(query: string, params?: any[]) => 
  dbConnection.execute<T>(query, params);
export const executeQueryOne = <T = any>(query: string, params?: any[]) => 
  dbConnection.executeOne<T>(query, params);
export const executeTransaction = <T>(callback: (connection: mysql.PoolConnection) => Promise<T>) =>
  dbConnection.transaction(callback);
export const closeDatabase = () => dbConnection.close();

export default dbConnection;
```

## src/config/jwt.ts - JWT Configuration

```typescript
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'staff';
  subscription_status?: string;
  subscription_tier?: string;
}

export interface RefreshTokenPayload {
  id: string;
  email: string;
  tokenVersion: number;
}

class JWTService {
  private jwtSecret: string;
  private refreshSecret: string;
  private jwtExpiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRET || '';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

    if (!this.jwtSecret || !this.refreshSecret) {
      throw new Error('JWT secrets must be provided in environment variables');
    }
  }

  generateAccessToken(payload: JWTPayload): string {
    try {
      return jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
        issuer: 'legal-crm',
        audience: 'legal-crm-users',
      });
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  generateRefreshToken(payload: RefreshTokenPayload): string {
    try {
      return jwt.sign(payload, this.refreshSecret, {
        expiresIn: this.refreshExpiresIn,
        issuer: 'legal-crm',
        audience: 'legal-crm-users',
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw new Error('Token verification failed');
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Refresh token verification failed');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;
    return expiration.getTime() < Date.now();
  }
}

export const jwtService = new JWTService();
export default jwtService;
```
