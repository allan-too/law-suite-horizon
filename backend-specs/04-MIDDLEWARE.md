
# Middleware Implementation

## src/middleware/auth.ts - Authentication & RBAC

```typescript
import { Request, Response, NextFunction } from 'express';
import { jwtService, JWTPayload } from '@/config/jwt';
import { executeQueryOne } from '@/config/database';
import { logger } from '@/utils/logger';
import { User } from '@/models/User';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & {
        subscription_status: string;
        subscription_tier: string;
      };
      rawBody?: Buffer;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required',
      });
      return;
    }

    // Verify JWT token
    const decoded = jwtService.verifyAccessToken(token);

    // Get fresh user data from database
    const user = await executeQueryOne<User>(
      'SELECT id, email, role, subscription_status, subscription_tier, email_verified FROM users WHERE id = ? AND email_verified = TRUE',
      [decoded.id]
    );

    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found or email not verified',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      subscription_status: user.subscription_status,
      subscription_tier: user.subscription_tier,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        res.status(401).json({
          error: 'TokenExpired',
          message: 'Access token has expired',
        });
        return;
      }
      
      if (error.message.includes('invalid')) {
        res.status(401).json({
          error: 'InvalidToken',
          message: 'Invalid access token',
        });
        return;
      }
    }

    res.status(500).json({
      error: 'AuthenticationError',
      message: 'Authentication failed',
    });
  }
};

export const requireRole = (allowedRoles: ('user' | 'admin' | 'staff')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        required_roles: allowedRoles,
        user_role: req.user.role,
      });
      return;
    }

    next();
  };
};

export const requireSubscription = (allowedTiers: string[] = ['basic', 'premium', 'enterprise']) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // Check if user has active subscription
    if (req.user.subscription_status !== 'active' && req.user.subscription_status !== 'trial') {
      res.status(403).json({
        error: 'SubscriptionRequired',
        message: 'Active subscription required',
        subscription_status: req.user.subscription_status,
      });
      return;
    }

    // Check subscription tier
    if (!allowedTiers.includes(req.user.subscription_tier)) {
      res.status(403).json({
        error: 'SubscriptionTierInsufficient',
        message: 'Higher subscription tier required',
        required_tiers: allowedTiers,
        current_tier: req.user.subscription_tier,
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwtService.verifyAccessToken(token);
      const user = await executeQueryOne<User>(
        'SELECT id, email, role, subscription_status, subscription_tier FROM users WHERE id = ?',
        [decoded.id]
      );

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          subscription_status: user.subscription_status,
          subscription_tier: user.subscription_tier,
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    logger.warn('Optional auth failed:', error);
    next();
  }
};
```

## src/middleware/upload.ts - File Upload Handling

```typescript
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';

// File type validation
const allowedMimeTypes = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  all: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
};

// Storage configuration
const createStorage = (subfolder: string) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        if (!req.user?.id) {
          return cb(new Error('User authentication required for file upload'), '');
        }

        const uploadPath = path.join(
          process.env.UPLOAD_DIRECTORY || './uploads',
          subfolder,
          req.user.id
        );

        // Ensure directory exists
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (error) {
        logger.error('Error creating upload directory:', error);
        cb(error as Error, '');
      }
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = uuidv4();
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9\-_]/g, '_') // Sanitize filename
        .slice(0, 50); // Limit length
      
      const filename = `${baseName}_${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  });
};

// File filter function
const createFileFilter = (allowedTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
  };
};

// Multer configurations for different upload types
export const uploadDocument = multer({
  storage: createStorage('documents'),
  fileFilter: createFileFilter(allowedMimeTypes.documents),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    files: 5, // Maximum 5 files per request
  },
});

export const uploadContract = multer({
  storage: createStorage('contracts'),
  fileFilter: createFileFilter(allowedMimeTypes.documents),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    files: 1, // Single file for contracts
  },
});

export const uploadProfileImage = multer({
  storage: createStorage('profile'),
  fileFilter: createFileFilter(allowedMimeTypes.images),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for images
    files: 1,
  },
});

export const uploadFormAttachment = multer({
  storage: createStorage('forms/attachments'),
  fileFilter: createFileFilter(allowedMimeTypes.all),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    files: 10, // Multiple attachments allowed
  },
});

// Error handling middleware for multer
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(413).json({
          error: 'FileTooLarge',
          message: `File size exceeds limit of ${Math.round(parseInt(process.env.MAX_FILE_SIZE || '10485760') / 1024 / 1024)}MB`,
        });
        return;
      case 'LIMIT_FILE_COUNT':
        res.status(413).json({
          error: 'TooManyFiles',
          message: 'Too many files uploaded',
        });
        return;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({
          error: 'UnexpectedField',
          message: 'Unexpected file field',
        });
        return;
      default:
        res.status(400).json({
          error: 'UploadError',
          message: error.message,
        });
        return;
    }
  }

  if (error.message.includes('File type') && error.message.includes('not allowed')) {
    res.status(415).json({
      error: 'UnsupportedMediaType',
      message: error.message,
    });
    return;
  }

  logger.error('Upload error:', error);
  res.status(500).json({
    error: 'UploadFailed',
    message: 'File upload failed',
  });
};

// Utility function to delete uploaded files
export const deleteUploadedFiles = async (filePaths: string[]): Promise<void> => {
  try {
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await fs.unlink(filePath);
          logger.info(`Deleted file: ${filePath}`);
        } catch (error) {
          logger.warn(`Failed to delete file: ${filePath}`, error);
        }
      })
    );
  } catch (error) {
    logger.error('Error deleting uploaded files:', error);
  }
};

// Middleware to clean up files on request failure
export const cleanupOnError = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(body: any) {
    // If response status indicates error and files were uploaded, clean them up
    if (res.statusCode >= 400 && req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      const filePaths = files.map((file: any) => file.path);
      
      // Delete files asynchronously (don't wait)
      deleteUploadedFiles(filePaths).catch((error) => {
        logger.error('Error cleaning up files on error:', error);
      });
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};
```

## src/middleware/validation.ts - Request Validation

```typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import Joi from 'joi';
import { logger } from '@/utils/logger';

// Express-validator middleware wrapper
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid request data',
        details: errors.array(),
      });
      return;
    }

    next();
  };
};

// Joi schema validation middleware
export const validateSchema = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type,
      }));

      res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid request data',
        details,
      });
      return;
    }

    // Replace request property with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Common Joi schemas
export const commonSchemas = {
  // UUID validation
  uuid: Joi.string().uuid().required(),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().default('created_at'),
  }),

  // User schemas
  userRegistration: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }),
    name: Joi.string().min(2).max(100).required(),
    firm_name: Joi.string().max(200).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).max(20).optional(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  userUpdate: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    firm_name: Joi.string().max(200).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).max(20).optional(),
    address: Joi.string().max(500).optional(),
  }),

  passwordChange: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
  }),

  // Client schemas
  clientCreate: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).max(20).optional(),
    address: Joi.string().max(500).optional(),
    jurisdiction: Joi.string().max(100).required(),
    issue_description: Joi.string().max(2000).optional(),
    status: Joi.string().valid('New', 'Active', 'Done', 'VIP', 'Inactive').default('New'),
    matter_type: Joi.string().max(100).optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    retainer_amount: Joi.number().positive().optional(),
    hourly_rate: Joi.number().positive().optional(),
    notes: Joi.string().max(2000).optional(),
  }),

  // Contract schemas
  contractCreate: Joi.object({
    title: Joi.string().min(2).max(255).required(),
    client_id: Joi.string().uuid().required(),
    jurisdiction: Joi.string().max(100).required(),
    status: Joi.string().valid('Draft', 'Under Review', 'Signed', 'Executed', 'Expired', 'Canceled', 'Flagged').default('Draft'),
    contract_type: Joi.string().max(100).optional(),
    description: Joi.string().max(2000).optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    expiration_date: Joi.date().optional(),
    value: Joi.number().positive().optional(),
    currency: Joi.string().length(3).default('USD'),
    terms_summary: Joi.string().max(2000).optional(),
    governing_law: Joi.string().max(100).optional(),
    notes: Joi.string().max(2000).optional(),
  }),

  // Document schemas
  documentCreate: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    client_id: Joi.string().uuid().optional(),
    category: Joi.string().valid('contract', 'intake', 'correspondence', 'court', 'evidence', 'other').required(),
    subcategory: Joi.string().max(100).optional(),
    description: Joi.string().max(2000).optional(),
    is_confidential: Joi.boolean().default(false),
  }),

  // Form schemas
  formCreate: Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(2000).optional(),
    category: Joi.string().max(100).optional(),
    form_schema: Joi.object().required(),
    ui_schema: Joi.object().optional(),
    validation_rules: Joi.object().optional(),
    auto_save: Joi.boolean().default(true),
    allow_partial_submission: Joi.boolean().default(false),
    requires_signature: Joi.boolean().default(false),
    public_access: Joi.boolean().default(false),
    expires_at: Joi.date().optional(),
    submission_limit: Joi.number().integer().positive().optional(),
  }),
};

// Custom validation middleware for specific business rules
export const validateBusinessRules = {
  // Ensure user can only access their own resources
  validateOwnership: (resourceType: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const resourceId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
          res.status(401).json({
            error: 'Unauthorized',
            message: 'User authentication required',
          });
          return;
        }

        // This would be implemented based on the specific resource type
        // For now, we'll pass through and let the controller handle it
        next();
      } catch (error) {
        logger.error('Ownership validation error:', error);
        res.status(500).json({
          error: 'ValidationError',
          message: 'Failed to validate resource ownership',
        });
      }
    };
  },

  // Validate subscription limits
  validateSubscriptionLimits: (feature: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const subscriptionTier = req.user?.subscription_tier;
      
      // Define limits per subscription tier
      const limits = {
        basic: {
          clients: 50,
          documents: 100,
          contracts: 25,
          forms: 10,
        },
        premium: {
          clients: 200,
          documents: 500,
          contracts: 100,
          forms: 50,
        },
        enterprise: {
          clients: -1, // unlimited
          documents: -1,
          contracts: -1,
          forms: -1,
        },
      };

      // This would check current usage against limits
      // For now, we'll pass through
      next();
    };
  },
};

// File validation middleware
export const validateFileUpload = {
  documents: (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file && !req.files) {
      res.status(400).json({
        error: 'ValidationError',
        message: 'File upload is required',
      });
      return;
    }
    next();
  },

  optional: (req: Request, res: Response, next: NextFunction): void => {
    // File upload is optional, just proceed
    next();
  },
};
```

## src/middleware/errorHandler.ts - Global Error Handler

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code || 'INTERNAL_ERROR';

  // MySQL errors
  if (error.message.includes('ER_DUP_ENTRY')) {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_ENTRY';
  } else if (error.message.includes('ER_NO_REFERENCED_ROW')) {
    statusCode = 400;
    message = 'Referenced resource does not exist';
    code = 'INVALID_REFERENCE';
  } else if (error.message.includes('ER_ACCESS_DENIED')) {
    statusCode = 500;
    message = 'Database access denied';
    code = 'DATABASE_ERROR';
  }

  // JWT errors
  if (error.message.includes('jwt')) {
    statusCode = 401;
    message = 'Invalid or expired token';
    code = 'TOKEN_ERROR';
  }

  // File upload errors
  if (error.message.includes('LIMIT_FILE_SIZE')) {
    statusCode = 413;
    message = 'File too large';
    code = 'FILE_TOO_LARGE';
  }

  // Validation errors
  if (error.message.includes('validation')) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  }

  // Log error details
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    code,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  });

  // Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    error: code,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

## src/middleware/requestLogger.ts - Request Logging

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Extend Request interface to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Skip logging for health checks and static files
  if (req.path === '/api/health' || req.path.startsWith('/uploads/')) {
    return next();
  }

  // Log incoming request
  logger.info('Incoming request', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  });

  // Capture original response methods
  const originalSend = res.send;
  const originalJson = res.json;

  // Override response methods to log completion
  res.send = function(body: any) {
    logResponse();
    return originalSend.call(this, body);
  };

  res.json = function(body: any) {
    logResponse();
    return originalJson.call(this, body);
  };

  const logResponse = () => {
    const duration = Date.now() - (req.startTime || 0);
    
    logger.info('Request completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });

    // Log slow requests
    if (duration > 5000) {
      logger.warn('Slow request detected', {
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
      });
    }
  };

  next();
};
```
