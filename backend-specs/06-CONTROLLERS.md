
# Controllers Implementation

## src/controllers/authController.ts - Authentication Controller

```typescript
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { executeQuery, executeQueryOne, executeTransaction } from '@/config/database';
import { jwtService } from '@/config/jwt';
import { emailService } from '@/services/email';
import { logger } from '@/utils/logger';
import { User, CreateUserData, LoginCredentials, PasswordChangeData } from '@/models/User';
import { CustomError } from '@/middleware/errorHandler';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, name, firm_name, phone }: CreateUserData = req.body;

    // Check if user already exists
    const existingUser = await executeQueryOne<User>(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      throw new CustomError('User already exists with this email', 409, 'USER_EXISTS');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const email_verification_token = crypto.randomBytes(32).toString('hex');

    await executeTransaction(async (connection) => {
      // Create user
      const [result] = await connection.execute(
        `INSERT INTO users (email, password_hash, name, firm_name, phone, email_verification_token, subscription_status, subscription_tier, trial_ends_at)
         VALUES (?, ?, ?, ?, ?, ?, 'trial', 'basic', DATE_ADD(NOW(), INTERVAL 14 DAY))`,
        [email, password_hash, name, firm_name || null, phone || null, email_verification_token]
      );

      const userId = (result as any).insertId;

      // Send verification email
      await emailService.sendVerificationEmail(email, name, email_verification_token);

      // Log registration
      await connection.execute(
        'INSERT INTO system_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, 'user_registered', 'user', userId, req.ip, req.get('User-Agent'), 'info']
      );
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: { email, name },
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const { email, password }: LoginCredentials = req.body;

    // Get user with password hash
    const user = await executeQueryOne<User>(
      'SELECT id, email, password_hash, name, role, subscription_status, subscription_tier, email_verified, failed_login_attempts, locked_until FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new CustomError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new CustomError('Account is temporarily locked due to multiple failed login attempts', 423, 'ACCOUNT_LOCKED');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new CustomError('Please verify your email address before logging in', 403, 'EMAIL_NOT_VERIFIED');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      // Increment failed login attempts
      const failedAttempts = user.failed_login_attempts + 1;
      const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // Lock for 30 minutes

      await executeQuery(
        'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
        [failedAttempts, lockUntil, user.id]
      );

      throw new CustomError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Reset failed login attempts and update last login
    await executeQuery(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate tokens
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      subscription_status: user.subscription_status,
      subscription_tier: user.subscription_tier,
    });

    const refreshToken = jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      tokenVersion: 1,
    });

    // Store refresh token in database
    await executeQuery(
      'INSERT INTO user_sessions (user_id, refresh_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [user.id, refreshToken, req.ip, req.get('User-Agent')]
    );

    // Log successful login
    await executeQuery(
      'INSERT INTO system_logs (user_id, action, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?)',
      [user.id, 'user_login', req.ip, req.get('User-Agent'), 'info']
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription_status: user.subscription_status,
          subscription_tier: user.subscription_tier,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: '7d',
        },
      },
    });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const refreshToken = req.body.refresh_token;

    if (refreshToken) {
      // Invalidate refresh token
      await executeQuery(
        'UPDATE user_sessions SET is_active = FALSE WHERE refresh_token = ?',
        [refreshToken]
      );
    }

    // Log logout
    if (req.user?.id) {
      await executeQuery(
        'INSERT INTO system_logs (user_id, action, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'user_logout', req.ip, req.get('User-Agent'), 'info']
      );
    }

    res.json({
      success: true,
      message: 'Logout successful',
    });
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new CustomError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN');
    }

    // Verify refresh token
    const decoded = jwtService.verifyRefreshToken(refresh_token);

    // Check if refresh token exists in database and is active
    const session = await executeQueryOne(
      'SELECT id, user_id, expires_at FROM user_sessions WHERE refresh_token = ? AND is_active = TRUE',
      [refresh_token]
    );

    if (!session || new Date(session.expires_at) < new Date()) {
      throw new CustomError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Get user data
    const user = await executeQueryOne<User>(
      'SELECT id, email, name, role, subscription_status, subscription_tier FROM users WHERE id = ?',
      [session.user_id]
    );

    if (!user) {
      throw new CustomError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Generate new access token
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      subscription_status: user.subscription_status,
      subscription_tier: user.subscription_tier,
    });

    // Update session last activity
    await executeQuery(
      'UPDATE user_sessions SET last_activity = NOW() WHERE id = ?',
      [session.id]
    );

    res.json({
      success: true,
      data: {
        access_token: accessToken,
        expires_in: '7d',
      },
    });
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const user = await executeQueryOne<User>(
      'SELECT id, email, name FROM users WHERE email = ? AND email_verified = TRUE',
      [email]
    );

    if (!user) {
      // Don't reveal whether email exists
      res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await executeQuery(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [resetToken, resetExpires, user.id]
    );

    // Send reset email
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    // Log password reset request
    await executeQuery(
      'INSERT INTO system_logs (user_id, action, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?)',
      [user.id, 'password_reset_requested', req.ip, req.get('User-Agent'), 'info']
    );

    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
    });
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, new_password } = req.body;

    const user = await executeQueryOne<User>(
      'SELECT id, email, name, password_reset_expires FROM users WHERE password_reset_token = ?',
      [token]
    );

    if (!user || !user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
      throw new CustomError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const password_hash = await bcrypt.hash(new_password, saltRounds);

    await executeTransaction(async (connection) => {
      // Update password and clear reset token
      await connection.execute(
        'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
        [password_hash, user.id]
      );

      // Invalidate all user sessions
      await connection.execute(
        'UPDATE user_sessions SET is_active = FALSE WHERE user_id = ?',
        [user.id]
      );

      // Log password reset
      await connection.execute(
        'INSERT INTO system_logs (user_id, action, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?)',
        [user.id, 'password_reset_completed', req.ip, req.get('User-Agent'), 'info']
      );
    });

    // Send confirmation email
    await emailService.sendPasswordResetConfirmation(user.email, user.name);

    res.json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  },

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.params;

    const user = await executeQueryOne<User>(
      'SELECT id, email, name FROM users WHERE email_verification_token = ? AND email_verified = FALSE',
      [token]
    );

    if (!user) {
      throw new CustomError('Invalid or expired verification token', 400, 'INVALID_VERIFICATION_TOKEN');
    }

    await executeTransaction(async (connection) => {
      // Mark email as verified
      await connection.execute(
        'UPDATE users SET email_verified = TRUE, email_verification_token = NULL WHERE id = ?',
        [user.id]
      );

      // Log email verification
      await connection.execute(
        'INSERT INTO system_logs (user_id, action, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?)',
        [user.id, 'email_verified', req.ip, req.get('User-Agent'), 'info']
      );
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in to your account.',
    });
  },

  async changePassword(req: Request, res: Response): Promise<void> {
    const { current_password, new_password }: PasswordChangeData = req.body;
    const userId = req.user!.id;

    // Get current password hash
    const user = await executeQueryOne<User>(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new CustomError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);

    if (!isValidPassword) {
      throw new CustomError('Current password is incorrect', 400, 'INVALID_CURRENT_PASSWORD');
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const password_hash = await bcrypt.hash(new_password, saltRounds);

    await executeTransaction(async (connection) => {
      // Update password
      await connection.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [password_hash, userId]
      );

      // Invalidate all other user sessions
      await connection.execute(
        'UPDATE user_sessions SET is_active = FALSE WHERE user_id = ? AND user_agent != ?',
        [userId, req.get('User-Agent')]
      );

      // Log password change
      await connection.execute(
        'INSERT INTO system_logs (user_id, action, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?)',
        [userId, 'password_changed', req.ip, req.get('User-Agent'), 'info']
      );
    });

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  },
};
```

## src/controllers/userController.ts - User Management Controller

```typescript
import { Request, Response } from 'express';
import { executeQuery, executeQueryOne } from '@/config/database';
import { User, UpdateUserData, UserProfile } from '@/models/User';
import { CustomError } from '@/middleware/errorHandler';
import { deleteUploadedFiles } from '@/middleware/upload';
import path from 'path';

export const userController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const user = await executeQueryOne<UserProfile>(
      `SELECT id, email, name, role, firm_name, phone, address, profile_image, 
              subscription_status, subscription_tier, trial_ends_at, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      throw new CustomError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: user,
    });
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const updateData: UpdateUserData = req.body;

    // Handle profile image upload
    if (req.file) {
      updateData.profile_image = `/uploads/profile/${userId}/${req.file.filename}`;
    }

    // Build update query dynamically
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof UpdateUserData] !== undefined);
    const values = fields.map(key => updateData[key as keyof UpdateUserData]);
    
    if (fields.length === 0) {
      throw new CustomError('No valid fields to update', 400, 'NO_UPDATE_DATA');
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(userId);

    await executeQuery(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Get updated user data
    const updatedUser = await executeQueryOne<UserProfile>(
      `SELECT id, email, name, role, firm_name, phone, address, profile_image, 
              subscription_status, subscription_tier, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    // Log profile update
    await executeQuery(
      'INSERT INTO system_logs (user_id, action, entity_type, entity_id, new_values, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, 'profile_updated', 'user', userId, JSON.stringify(updateData), req.ip, req.get('User-Agent'), 'info']
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  },

  async deleteAccount(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { password } = req.body;

    // Verify password before deletion
    const user = await executeQueryOne<User>(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new CustomError('User not found', 404, 'USER_NOT_FOUND');
    }

    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new CustomError('Invalid password', 400, 'INVALID_PASSWORD');
    }

    // Delete user (cascade will handle related records)
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);

    // Clean up user files
    const uploadsPath = path.join(process.env.UPLOAD_DIRECTORY || './uploads');
    const userPaths = [
      path.join(uploadsPath, 'documents', userId),
      path.join(uploadsPath, 'contracts', userId),
      path.join(uploadsPath, 'forms', userId),
      path.join(uploadsPath, 'profile', userId),
    ];

    // Delete files asynchronously (don't wait)
    deleteUploadedFiles(userPaths).catch(console.error);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  },

  async getUsageStats(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const [stats] = await Promise.all([
      executeQuery(`
        SELECT 
          (SELECT COUNT(*) FROM clients WHERE user_id = ?) as client_count,
          (SELECT COUNT(*) FROM documents WHERE user_id = ?) as document_count,
          (SELECT COUNT(*) FROM contracts WHERE user_id = ?) as contract_count,
          (SELECT COUNT(*) FROM intake_forms WHERE user_id = ?) as form_count,
          (SELECT COALESCE(SUM(file_size), 0) FROM documents WHERE user_id = ?) as storage_used
      `, [userId, userId, userId, userId, userId])
    ]);

    const usageStats = stats[0];

    res.json({
      success: true,
      data: {
        clients: usageStats.client_count,
        documents: usageStats.document_count,
        contracts: usageStats.contract_count,
        forms: usageStats.form_count,
        storage_used: usageStats.storage_used,
        storage_used_mb: Math.round(usageStats.storage_used / 1024 / 1024 * 100) / 100,
      },
    });
  },
};
```

## src/controllers/clientController.ts - Client Management Controller

```typescript
import { Request, Response } from 'express';
import { executeQuery, executeQueryOne, executeTransaction } from '@/config/database';
import { Client, CreateClientData, UpdateClientData, ClientFilters } from '@/models/Client';
import { CustomError } from '@/middleware/errorHandler';
import { PaginationOptions, PaginatedResponse } from '@/types/common';

export const clientController = {
  async getClients(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20, sort = 'desc', sortBy = 'created_at' } = req.query as any;
    const filters: ClientFilters = {
      status: req.query.status ? (req.query.status as string).split(',') : undefined,
      jurisdiction: req.query.jurisdiction ? (req.query.jurisdiction as string).split(',') : undefined,
      priority: req.query.priority ? (req.query.priority as string).split(',') : undefined,
      search: req.query.search as string,
    };

    // Build WHERE clause
    let whereClause = 'WHERE user_id = ?';
    const params: any[] = [userId];

    if (filters.status && filters.status.length > 0) {
      whereClause += ` AND status IN (${filters.status.map(() => '?').join(',')})`;
      params.push(...filters.status);
    }

    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      whereClause += ` AND jurisdiction IN (${filters.jurisdiction.map(() => '?').join(',')})`;
      params.push(...filters.jurisdiction);
    }

    if (filters.priority && filters.priority.length > 0) {
      whereClause += ` AND priority IN (${filters.priority.map(() => '?').join(',')})`;
      params.push(...filters.priority);
    }

    if (filters.search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR issue_description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const [countResult] = await executeQuery(
      `SELECT COUNT(*) as total FROM clients ${whereClause}`,
      params
    );
    const total = countResult.total;

    // Get paginated data
    const offset = (page - 1) * limit;
    const clients = await executeQuery<Client>(
      `SELECT * FROM clients ${whereClause} 
       ORDER BY ${sortBy} ${sort.toUpperCase()} 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const response: PaginatedResponse<Client> = {
      data: clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: page > 1,
      },
    };

    res.json({
      success: true,
      data: response,
    });
  },

  async getClient(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const clientId = req.params.id;

    const client = await executeQueryOne<Client>(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?',
      [clientId, userId]
    );

    if (!client) {
      throw new CustomError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    res.json({
      success: true,
      data: client,
    });
  },

  async createClient(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const clientData: CreateClientData = req.body;

    const [result] = await executeQuery(
      `INSERT INTO clients (user_id, name, email, phone, address, jurisdiction, issue_description, 
                           status, matter_type, priority, retainer_amount, hourly_rate, notes, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        clientData.name,
        clientData.email || null,
        clientData.phone || null,
        clientData.address || null,
        clientData.jurisdiction,
        clientData.issue_description || null,
        clientData.status || 'New',
        clientData.matter_type || null,
        clientData.priority || 'medium',
        clientData.retainer_amount || null,
        clientData.hourly_rate || null,
        clientData.notes || null,
        clientData.tags ? JSON.stringify(clientData.tags) : null,
      ]
    );

    const clientId = (result as any).insertId;

    // Get created client
    const newClient = await executeQueryOne<Client>(
      'SELECT * FROM clients WHERE id = ?',
      [clientId]
    );

    // Log client creation
    await executeQuery(
      'INSERT INTO system_logs (user_id, action, entity_type, entity_id, entity_name, new_values, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, 'client_created', 'client', clientId, clientData.name, JSON.stringify(clientData), req.ip, req.get('User-Agent'), 'info']
    );

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: newClient,
    });
  },

  async updateClient(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const clientId = req.params.id;
    const updateData: UpdateClientData = req.body;

    // Verify client exists and belongs to user
    const existingClient = await executeQueryOne<Client>(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?',
      [clientId, userId]
    );

    if (!existingClient) {
      throw new CustomError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    // Build update query dynamically
    const fields = Object.keys(updateData).filter(key => updateData[key as keyof UpdateClientData] !== undefined);
    const values = fields.map(key => {
      const value = updateData[key as keyof UpdateClientData];
      return key === 'tags' && Array.isArray(value) ? JSON.stringify(value) : value;
    });

    if (fields.length === 0) {
      throw new CustomError('No valid fields to update', 400, 'NO_UPDATE_DATA');
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(clientId);

    await executeQuery(
      `UPDATE clients SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Get updated client
    const updatedClient = await executeQueryOne<Client>(
      'SELECT * FROM clients WHERE id = ?',
      [clientId]
    );

    // Log client update
    await executeQuery(
      'INSERT INTO system_logs (user_id, action, entity_type, entity_id, entity_name, old_values, new_values, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, 'client_updated', 'client', clientId, existingClient.name, JSON.stringify(existingClient), JSON.stringify(updateData), req.ip, req.get('User-Agent'), 'info']
    );

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient,
    });
  },

  async deleteClient(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const clientId = req.params.id;

    // Verify client exists and belongs to user
    const client = await executeQueryOne<Client>(
      'SELECT name FROM clients WHERE id = ? AND user_id = ?',
      [clientId, userId]
    );

    if (!client) {
      throw new CustomError('Client not found', 404, 'CLIENT_NOT_FOUND');
    }

    await executeTransaction(async (connection) => {
      // Delete client (this will cascade to related records)
      await connection.execute('DELETE FROM clients WHERE id = ?', [clientId]);

      // Log client deletion
      await connection.execute(
        'INSERT INTO system_logs (user_id, action, entity_type, entity_id, entity_name, ip_address, user_agent, severity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, 'client_deleted', 'client', clientId, client.name, req.ip, req.get('User-Agent'), 'info']
      );
    });

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  },

  async getClientSummary(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const summary = await executeQuery(`
      SELECT 
        status,
        COUNT(*) as count
      FROM clients 
      WHERE user_id = ? 
      GROUP BY status
    `, [userId]);

    const statusCounts = summary.reduce((acc: any, item: any) => {
      acc[item.status] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total: summary.reduce((acc: number, item: any) => acc + item.count, 0),
        by_status: statusCounts,
      },
    });
  },
};
```

I'll continue with the remaining controller specifications in the next part to ensure comprehensive coverage while maintaining readability.
