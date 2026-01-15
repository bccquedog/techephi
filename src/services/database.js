import { PrismaClient } from '@prisma/client';

class DatabaseService {
  constructor() {
    this.prisma = new PrismaClient();
    this.isConnected = false;
  }

  async connect() {
    try {
      await this.prisma.$connect();
      this.isConnected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
      this.isConnected = false;
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  }

  // User Management
  async createUser(userData) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role || 'CLIENT',
          phone: userData.phone,
          password: userData.password,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          profile: userData.profile ? {
            create: userData.profile
          } : undefined
        },
        include: {
          profile: true
        }
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          jobs: true,
          assignedJobs: true,
          invoices: true,
          notifications: {
            where: { read: false },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        include: {
          profile: true
        }
      });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: userData,
        include: {
          profile: true
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Job Management
  async createJob(jobData) {
    try {
      return await this.prisma.job.create({
        data: {
          title: jobData.title,
          description: jobData.description,
          status: jobData.status || 'PENDING',
          priority: jobData.priority || 'MEDIUM',
          estimatedHours: jobData.estimatedHours,
          budget: jobData.budget,
          startDate: jobData.startDate ? new Date(jobData.startDate) : null,
          dueDate: jobData.dueDate ? new Date(jobData.dueDate) : null,
          location: jobData.location,
          clientId: jobData.clientId,
          contractorId: jobData.contractorId,
          tags: jobData.tags || [],
          notes: jobData.notes
        },
        include: {
          client: true,
          contractor: true,
          tasks: true
        }
      });
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async getJobs(filters = {}) {
    try {
      const where = {};
      
      if (filters.clientId) where.clientId = filters.clientId;
      if (filters.contractorId) where.contractorId = filters.contractorId;
      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;

      return await this.prisma.job.findMany({
        where,
        include: {
          client: true,
          contractor: true,
          tasks: true,
          invoices: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting jobs:', error);
      throw error;
    }
  }

  async getJobById(id) {
    try {
      return await this.prisma.job.findUnique({
        where: { id },
        include: {
          client: true,
          contractor: true,
          tasks: {
            include: {
              assignee: true,
              timeEntries: true
            }
          },
          invoices: {
            include: {
              items: true,
              payments: true
            }
          },
          timeEntries: true,
          files: true,
          events: true
        }
      });
    } catch (error) {
      console.error('Error getting job:', error);
      throw error;
    }
  }

  async updateJob(id, jobData) {
    try {
      return await this.prisma.job.update({
        where: { id },
        data: jobData,
        include: {
          client: true,
          contractor: true,
          tasks: true
        }
      });
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Invoice Management
  async createInvoice(invoiceData) {
    try {
      const { items, ...invoiceFields } = invoiceData;
      
      return await this.prisma.invoice.create({
        data: {
          ...invoiceFields,
          items: {
            create: items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.amount
            }))
          }
        },
        include: {
          client: true,
          createdBy: true,
          job: true,
          items: true,
          payments: true
        }
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async getInvoices(filters = {}) {
    try {
      const where = {};
      
      if (filters.clientId) where.clientId = filters.clientId;
      if (filters.status) where.status = filters.status;
      if (filters.jobId) where.jobId = filters.jobId;

      return await this.prisma.invoice.findMany({
        where,
        include: {
          client: true,
          createdBy: true,
          job: true,
          items: true,
          payments: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  }

  async updateInvoiceStatus(id, status) {
    try {
      return await this.prisma.invoice.update({
        where: { id },
        data: { 
          status,
          paidDate: status === 'PAID' ? new Date() : null
        },
        include: {
          client: true,
          items: true,
          payments: true
        }
      });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // Payment Processing
  async getInvoiceById(id) {
    try {
      return await this.prisma.invoice.findUnique({
        where: { id },
        include: {
          client: true,
          items: true,
          payments: true
        }
      });
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  }

  async createPayment(paymentData) {
    try {
      return await this.prisma.payment.create({
        data: {
          invoiceId: paymentData.invoiceId,
          amount: paymentData.amount,
          method: paymentData.method,
          status: paymentData.status || 'PENDING',
          transactionId: paymentData.transactionId,
          gateway: paymentData.gateway,
          gatewayData: paymentData.gatewayData,
          processedAt: paymentData.processedAt ? new Date(paymentData.processedAt) : null
        },
        include: {
          invoice: true
        }
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id, status, gatewayData = null) {
    try {
      return await this.prisma.payment.update({
        where: { id },
        data: {
          status,
          gatewayData,
          processedAt: status === 'COMPLETED' ? new Date() : null
        },
        include: {
          invoice: true
        }
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async getPaymentById(id) {
    try {
      return await this.prisma.payment.findUnique({
        where: { id },
        include: { invoice: true }
      });
    } catch (error) {
      console.error('Error getting payment by id:', error);
      throw error;
    }
  }

  async getPaymentByTransactionId(transactionId) {
    try {
      return await this.prisma.payment.findUnique({
        where: { transactionId },
        include: { invoice: true }
      });
    } catch (error) {
      console.error('Error getting payment by transaction id:', error);
      throw error;
    }
  }

  async getPayments(filters = {}) {
    try {
      const where = {};
      if (filters.invoiceId) where.invoiceId = filters.invoiceId;
      if (filters.status) where.status = filters.status;
      if (filters.method) where.method = filters.method;

      return await this.prisma.payment.findMany({
        where,
        include: { invoice: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }

  // Notification Management
  async createNotification(notificationData) {
    try {
      return await this.prisma.notification.create({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          priority: notificationData.priority || 'NORMAL',
          actionUrl: notificationData.actionUrl,
          actionText: notificationData.actionText,
          data: notificationData.data,
          deliveryStatus: notificationData.deliveryStatus
        }
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getNotifications(userId, filters = {}) {
    try {
      const where = { userId };
      
      if (filters.read !== undefined) where.read = filters.read;
      if (filters.type) where.type = filters.type;

      return await this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(id) {
    try {
      return await this.prisma.notification.update({
        where: { id },
        data: {
          read: true,
          readAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      return await this.prisma.notification.updateMany({
        where: { 
          userId,
          read: false
        },
        data: {
          read: true,
          readAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // File Management
  async createFile(fileData) {
    try {
      return await this.prisma.file.create({
        data: {
          name: fileData.name,
          originalName: fileData.originalName,
          size: fileData.size,
          type: fileData.type,
          url: fileData.url,
          thumbnailUrl: fileData.thumbnailUrl,
          category: fileData.category,
          jobId: fileData.jobId,
          uploadedById: fileData.uploadedById,
          clientAccess: fileData.clientAccess || false,
          clientId: fileData.clientId,
          description: fileData.description,
          tags: fileData.tags || []
        },
        include: {
          uploadedBy: true,
          job: true,
          client: true
        }
      });
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  async getFiles(filters = {}) {
    try {
      const where = {};
      
      if (filters.jobId) where.jobId = filters.jobId;
      if (filters.uploadedById) where.uploadedById = filters.uploadedById;
      if (filters.category) where.category = filters.category;
      if (filters.clientAccess !== undefined) where.clientAccess = filters.clientAccess;

      return await this.prisma.file.findMany({
        where,
        include: {
          uploadedBy: true,
          job: true,
          client: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting files:', error);
      throw error;
    }
  }

  // Time Tracking
  async createTimeEntry(timeEntryData) {
    try {
      return await this.prisma.timeEntry.create({
        data: {
          userId: timeEntryData.userId,
          jobId: timeEntryData.jobId,
          taskId: timeEntryData.taskId,
          description: timeEntryData.description,
          hours: timeEntryData.hours,
          date: new Date(timeEntryData.date),
          startTime: timeEntryData.startTime ? new Date(timeEntryData.startTime) : null,
          endTime: timeEntryData.endTime ? new Date(timeEntryData.endTime) : null,
          isBillable: timeEntryData.isBillable !== undefined ? timeEntryData.isBillable : true,
          rate: timeEntryData.rate,
          amount: timeEntryData.amount
        },
        include: {
          user: true,
          job: true,
          task: true
        }
      });
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  }

  async getTimeEntries(filters = {}) {
    try {
      const where = {};
      
      if (filters.userId) where.userId = filters.userId;
      if (filters.jobId) where.jobId = filters.jobId;
      if (filters.taskId) where.taskId = filters.taskId;
      if (filters.date) where.date = new Date(filters.date);

      return await this.prisma.timeEntry.findMany({
        where,
        include: {
          user: true,
          job: true,
          task: true
        },
        orderBy: { date: 'desc' }
      });
    } catch (error) {
      console.error('Error getting time entries:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getJobStats(filters = {}) {
    try {
      const where = {};
      if (filters.clientId) where.clientId = filters.clientId;
      if (filters.contractorId) where.contractorId = filters.contractorId;

      const jobs = await this.prisma.job.findMany({ where });
      
      const stats = {
        total: jobs.length,
        pending: jobs.filter(j => j.status === 'PENDING').length,
        inProgress: jobs.filter(j => j.status === 'IN_PROGRESS').length,
        completed: jobs.filter(j => j.status === 'COMPLETED').length,
        cancelled: jobs.filter(j => j.status === 'CANCELLED').length,
        totalHours: jobs.reduce((sum, j) => sum + (j.actualHours || 0), 0),
        totalBudget: jobs.reduce((sum, j) => sum + (j.budget || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting job stats:', error);
      throw error;
    }
  }

  async getInvoiceStats(filters = {}) {
    try {
      const where = {};
      if (filters.clientId) where.clientId = filters.clientId;

      const invoices = await this.prisma.invoice.findMany({ where });
      
      const stats = {
        total: invoices.length,
        draft: invoices.filter(i => i.status === 'DRAFT').length,
        sent: invoices.filter(i => i.status === 'SENT').length,
        paid: invoices.filter(i => i.status === 'PAID').length,
        overdue: invoices.filter(i => i.status === 'OVERDUE').length,
        totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
        paidAmount: invoices.reduce((sum, i) => sum + i.paidAmount, 0),
        outstandingAmount: invoices.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting invoice stats:', error);
      throw error;
    }
  }

  // Audit Logging
  async createAuditLog(auditData) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          userId: auditData.userId,
          action: auditData.action,
          entityType: auditData.entityType,
          entityId: auditData.entityId,
          oldValues: auditData.oldValues,
          newValues: auditData.newValues,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent
        },
        include: {
          user: true
        }
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw error for audit logs to avoid breaking main operations
    }
  }

  // Database Health Check
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', connected: this.isConnected };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, connected: false };
    }
  }

  // Migration and Seeding
  async seedDatabase() {
    try {
      // Create default admin user
      const adminUser = await this.createUser({
        email: 'support@techephi.com',
        displayName: 'System Administrator',
        role: 'ADMIN',
        profile: {
          company: 'Tech ePhi',
          position: 'System Administrator'
        }
      });

      console.log('✅ Database seeded successfully');
      return { success: true, adminUser };
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  // Authentication & Session Management
  async createRefreshToken(refreshTokenData) {
    try {
      return await this.prisma.refreshToken.create({
        data: {
          userId: refreshTokenData.userId,
          token: refreshTokenData.token,
          expiresAt: refreshTokenData.expiresAt
        }
      });
    } catch (error) {
      console.error('Error creating refresh token:', error);
      throw error;
    }
  }

  async getRefreshToken(token) {
    try {
      return await this.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true }
      });
    } catch (error) {
      console.error('Error getting refresh token:', error);
      throw error;
    }
  }

  async updateRefreshToken(id, updateData) {
    try {
      return await this.prisma.refreshToken.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating refresh token:', error);
      throw error;
    }
  }

  async invalidateRefreshToken(token) {
    try {
      return await this.prisma.refreshToken.update({
        where: { token },
        data: { isRevoked: true }
      });
    } catch (error) {
      console.error('Error invalidating refresh token:', error);
      throw error;
    }
  }

  async createPasswordReset(passwordResetData) {
    try {
      return await this.prisma.passwordReset.create({
        data: {
          userId: passwordResetData.userId,
          token: passwordResetData.token,
          expiresAt: passwordResetData.expiresAt
        }
      });
    } catch (error) {
      console.error('Error creating password reset:', error);
      throw error;
    }
  }

  async getPasswordReset(token) {
    try {
      return await this.prisma.passwordReset.findUnique({
        where: { token },
        include: { user: true }
      });
    } catch (error) {
      console.error('Error getting password reset:', error);
      throw error;
    }
  }

  async invalidatePasswordReset(token) {
    try {
      return await this.prisma.passwordReset.update({
        where: { token },
        data: { isUsed: true }
      });
    } catch (error) {
      console.error('Error invalidating password reset:', error);
      throw error;
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;
