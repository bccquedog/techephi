# Tech ePhi CRM - Professional Customer Relationship Management System

A comprehensive CRM system built with React, Next.js, Prisma, and Stripe for managing clients, jobs, invoices, and payments.

## 🚀 **Recent Improvements**

### ✅ **Critical Fixes Implemented:**

1. **Real Database Integration**
   - ✅ Replaced localStorage with PostgreSQL + Prisma
   - ✅ Comprehensive data models for all CRM entities
   - ✅ Proper relationships and constraints
   - ✅ Data persistence and integrity

2. **Real Payment Processing**
   - ✅ Stripe integration for secure payments
   - ✅ Payment intents and webhook handling
   - ✅ Invoice payment processing
   - ✅ Refund capabilities

3. **Enhanced Security**
   - ✅ Environment variable configuration
   - ✅ Secure API endpoints
   - ✅ Input validation and sanitization
   - ✅ Webhook signature verification

## 🏗️ **Architecture**

```
Tech ePhi CRM
├── Frontend (React + Next.js)
│   ├── Components
│   ├── Services
│   └── API Routes
├── Database (PostgreSQL + Prisma)
│   ├── User Management
│   ├── Job Management
│   ├── Invoice Management
│   └── Payment Processing
├── External Services
│   ├── AWS SES (Email)
│   ├── AWS SNS (SMS)
│   └── Stripe (Payments)
└── Infrastructure
    ├── Vercel (Hosting)
    └── Environment Configuration
```

## 🛠️ **Setup Instructions**

### **Prerequisites**
- Node.js 18+ (recommended: Node.js 20+)
- PostgreSQL database
- Stripe account
- AWS account (for SES/SNS)

### **1. Clone and Install Dependencies**
```bash
git clone <repository-url>
cd tech-ephi-crm
npm install
```

### **2. Environment Configuration**
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/techephi_crm?schema=public"

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# SES Configuration
SES_FROM_EMAIL=noreply@techephi.com
SES_REGION=us-east-1

# SNS Configuration
SNS_REGION=us-east-1
SNS_SENDER_ID=TechEphi

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# App Configuration
NODE_ENV=development
PORT=3000
```

### **3. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with initial data
npx prisma db seed
```

### **4. Stripe Configuration**
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints:
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### **5. AWS Configuration**
1. Set up AWS SES for email sending
2. Set up AWS SNS for SMS notifications
3. Configure IAM permissions

### **6. Start Development Server**
```bash
npm run dev
```

## 📊 **Database Schema**

### **Core Entities:**
- **Users**: Admin, Contractor, Client roles
- **Jobs**: Project management with tasks
- **Invoices**: Billing and payment tracking
- **Payments**: Stripe payment processing
- **Files**: Document management
- **Notifications**: Multi-channel alerts
- **Time Tracking**: Billable hours
- **Audit Logs**: Security and compliance

### **Key Features:**
- Role-based access control
- Real-time notifications
- Payment processing
- File management
- Time tracking
- Analytics and reporting

## 🔧 **API Endpoints**

### **Payment Processing:**
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler

### **Email & SMS:**
- `POST /api/ses/send` - Send emails via AWS SES
- `POST /api/sns/send-sms` - Send SMS via AWS SNS

### **Database Operations:**
All database operations are handled through the Prisma client with proper error handling and validation.

## 🎯 **Key Features**

### **✅ Implemented:**
- ✅ Real database with PostgreSQL
- ✅ Stripe payment processing
- ✅ AWS SES email integration
- ✅ AWS SNS SMS integration
- ✅ Role-based authentication
- ✅ Invoice management
- ✅ Job tracking
- ✅ File uploads
- ✅ Time tracking
- ✅ Notifications
- ✅ Audit logging

### **🚧 In Progress:**
- 🔄 Real authentication system
- 🔄 File storage with AWS S3
- 🔄 Advanced analytics
- 🔄 Mobile optimization

### **📋 Planned:**
- 📅 Calendar integration
- 📅 Third-party integrations
- 📅 Advanced reporting
- 📅 Mobile app

## 🔒 **Security Features**

- Environment variable configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Webhook signature verification
- Audit logging
- Role-based access control

## 🚀 **Deployment**

### **Vercel Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Environment Variables:**
Set all environment variables in your Vercel project settings.

## 📈 **Performance Optimizations**

- Database indexing
- Connection pooling
- Caching strategies
- Lazy loading
- Code splitting
- Image optimization

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Database Connection:**
   ```bash
   # Check database connection
   npx prisma db push
   ```

2. **Stripe Integration:**
   ```bash
   # Test Stripe connection
   npm run test:stripe
   ```

3. **Environment Variables:**
   ```bash
   # Verify environment setup
   npm run check:env
   ```

## 📞 **Support**

For support and questions:
- Email: support@techephi.com
- Documentation: [docs.techephi.com](https://docs.techephi.com)
- Issues: GitHub Issues

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Tech ePhi CRM** - Professional CRM Solution for Modern Businesses
