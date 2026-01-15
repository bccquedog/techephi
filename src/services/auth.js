import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import databaseService from './database.js';

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is not set');
    }
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    this.saltRounds = 12;
  }

  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: this.jwtExpiresIn,
      issuer: 'techephi-crm',
      audience: 'techephi-users'
    });
  }

  // Generate refresh token
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' }, 
      this.jwtSecret, 
      { expiresIn: this.refreshTokenExpiresIn }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Hash password
  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  // Compare password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await databaseService.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Validate password strength
      this.validatePassword(userData.password);

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user with hashed password
      const user = await databaseService.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || 'CLIENT',
        isActive: true
      });

      // Generate tokens
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshToken = this.generateRefreshToken(user.id);

      // Store refresh token in database
      await databaseService.createRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Create audit log
      await databaseService.createAuditLog({
        userId: user.id,
        action: 'USER_REGISTERED',
        entityType: 'USER',
        entityId: user.id,
        ipAddress: userData.ipAddress,
        userAgent: userData.userAgent
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role
        },
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password, ipAddress = null, userAgent = null) {
    try {
      // Get user by email
      const user = await databaseService.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isValidPassword = await this.comparePassword(password, user.password);
      if (!isValidPassword) {
        // Log failed login attempt
        await databaseService.createAuditLog({
          userId: user.id,
          action: 'LOGIN_FAILED',
          entityType: 'USER',
          entityId: user.id,
          ipAddress,
          userAgent,
          newValues: JSON.stringify({ reason: 'Invalid password' })
        });
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshToken = this.generateRefreshToken(user.id);

      // Store refresh token
      await databaseService.createRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Update last login
      await databaseService.updateUser(user.id, {
        lastLoginAt: new Date()
      });

      // Create audit log
      await databaseService.createAuditLog({
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        entityType: 'USER',
        entityId: user.id,
        ipAddress,
        userAgent
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          profile: user.profile
        },
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = this.verifyToken(refreshToken);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // Check if refresh token exists in database
      const storedToken = await databaseService.getRefreshToken(refreshToken);
      if (!storedToken || storedToken.expiresAt < new Date() || storedToken.isRevoked) {
        throw new Error('Refresh token expired or invalid');
      }

      // Get user
      const user = await databaseService.getUserById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const newToken = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const newRefreshToken = this.generateRefreshToken(user.id);

      // Update refresh token in database
      await databaseService.updateRefreshToken(storedToken.id, {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(refreshToken) {
    try {
      if (refreshToken) {
        // Invalidate refresh token
        await databaseService.invalidateRefreshToken(refreshToken);
      }
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await databaseService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await this.comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      this.validatePassword(newPassword);

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update password
      await databaseService.updateUser(userId, {
        password: hashedPassword,
        passwordChangedAt: new Date()
      });

      // Create audit log
      await databaseService.createAuditLog({
        userId,
        action: 'PASSWORD_CHANGED',
        entityType: 'USER',
        entityId: userId
      });

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Reset password (forgot password)
  async requestPasswordReset(email) {
    try {
      const user = await databaseService.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return { success: true };
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, type: 'password_reset' },
        this.jwtSecret,
        { expiresIn: '1h' }
      );

      // Store reset token
      await databaseService.createPasswordReset({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      });

      // TODO: Send email with reset link
      // This would integrate with your email service

      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      // Verify reset token
      const decoded = jwt.verify(token, this.jwtSecret);
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid reset token');
      }

      // Check if reset token exists and is valid
      const resetRecord = await databaseService.getPasswordReset(token);
      if (!resetRecord || resetRecord.expiresAt < new Date()) {
        throw new Error('Reset token expired or invalid');
      }

      // Validate new password
      this.validatePassword(newPassword);

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update password
      await databaseService.updateUser(decoded.userId, {
        password: hashedPassword,
        passwordChangedAt: new Date()
      });

      // Invalidate reset token
      await databaseService.invalidatePasswordReset(token);

      // Create audit log
      await databaseService.createAuditLog({
        userId: decoded.userId,
        action: 'PASSWORD_RESET',
        entityType: 'USER',
        entityId: decoded.userId
      });

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Validate password strength
  validatePassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }
  }

  // Middleware to verify JWT token
  verifyTokenMiddleware(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const decoded = this.verifyToken(token);

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  // Middleware to check role permissions
  requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRole = req.user.role;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }
}

const authService = new AuthService();
export default authService;
