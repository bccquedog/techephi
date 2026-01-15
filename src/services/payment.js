import Stripe from 'stripe';
import databaseService from './database.js';

class PaymentService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key');
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Test Stripe connection
      await this.stripe.paymentMethods.list({ limit: 1 });
      this.isInitialized = true;
      console.log('✅ Stripe payment service initialized successfully');
    } catch (error) {
      console.error('❌ Stripe initialization failed:', error);
      throw error;
    }
  }

  // Create a payment intent for an invoice
  async createPaymentIntent(invoiceId, amount, currency = 'usd') {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get invoice details from database
      const invoice = await databaseService.getInvoiceById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Create payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: {
          invoiceId: invoiceId,
          invoiceNumber: invoice.invoiceNumber,
          clientId: invoice.clientId
        },
        description: `Payment for invoice ${invoice.invoiceNumber}`,
        receipt_email: invoice.client.email
      });

      // Create payment record in database
      const payment = await databaseService.createPayment({
        invoiceId: invoiceId,
        amount: amount,
        method: 'CREDIT_CARD',
        status: 'PENDING',
        transactionId: paymentIntent.id,
        gateway: 'stripe',
        gatewayData: {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret
        }
      });

      // Attach paymentId to Stripe metadata for downstream webhooks/confirmation
      await this.stripe.paymentIntents.update(paymentIntent.id, {
        metadata: {
          ...paymentIntent.metadata,
          paymentId: payment.id
        }
      });

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        amount: amount,
        currency: currency
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm payment after client-side confirmation
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      // Confirm the payment with Stripe
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      if (paymentIntent.status === 'succeeded') {
        // Update payment status in database
        const paymentRecord = await databaseService.getPaymentByTransactionId(paymentIntent.id);
        if (!paymentRecord) {
          throw new Error('Payment record not found for intent');
        }

        const payment = await databaseService.updatePaymentStatus(
          paymentRecord.id,
          'COMPLETED',
          {
            stripePaymentIntent: paymentIntent,
            confirmedAt: new Date().toISOString()
          }
        );

        // Update invoice status
        await databaseService.updateInvoiceStatus(payment.invoiceId, 'PAID');

        // Create notification for client
        await databaseService.createNotification({
          userId: payment.invoice.clientId,
          type: 'PAYMENT',
          title: 'Payment Successful',
          message: `Your payment of $${payment.amount} for invoice ${payment.invoice.invoiceNumber} has been processed successfully.`,
          priority: 'NORMAL',
          data: {
            invoiceId: payment.invoiceId,
            paymentId: payment.id,
            amount: payment.amount
          }
        });

        return {
          success: true,
          payment: payment,
          paymentIntent: paymentIntent
        };
      } else {
        throw new Error(`Payment failed: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(paymentId, amount, reason = 'requested_by_customer') {
    try {
      // Get payment details
      const payment = await databaseService.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Create refund with Stripe
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: Math.round(amount * 100), // Convert to cents
        reason: reason
      });

      // Update payment status
      await databaseService.updatePaymentStatus(paymentId, 'REFUNDED', {
        refundId: refund.id,
        refundAmount: amount,
        refundReason: reason,
        refundedAt: new Date().toISOString()
      });

      // Create notification
      await databaseService.createNotification({
        userId: payment.invoice.clientId,
        type: 'PAYMENT',
        title: 'Refund Processed',
        message: `A refund of $${amount} has been processed for invoice ${payment.invoice.invoiceNumber}.`,
        priority: 'NORMAL',
        data: {
          invoiceId: payment.invoiceId,
          paymentId: paymentId,
          refundAmount: amount
        }
      });

      return {
        success: true,
        refund: refund,
        amount: amount
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Create customer in Stripe
  async createCustomer(userData) {
    try {
      const customer = await this.stripe.customers.create({
        email: userData.email,
        name: userData.displayName,
        phone: userData.phone,
        metadata: {
          userId: userData.id,
          role: userData.role
        }
      });

      // Update user with Stripe customer ID
      await databaseService.updateUser(userData.id, {
        stripeCustomerId: customer.id
      });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  // Save payment method for future use
  async savePaymentMethod(customerId, paymentMethodId) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      // Set as default payment method
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      return paymentMethod;
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error;
    }
  }

  // Get customer's saved payment methods
  async getCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Error getting customer payment methods:', error);
      throw error;
    }
  }

  // Create subscription for recurring billing
  async createSubscription(customerId, priceId, metadata = {}) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: metadata,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Handle webhook events
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSuccess(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailure(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(paymentIntent) {
    try {
      const payment = await databaseService.getPaymentByTransactionId(paymentIntent.id);
      if (payment) {
        await databaseService.updatePaymentStatus(payment.id, 'COMPLETED', {
          stripePaymentIntent: paymentIntent,
          processedAt: new Date().toISOString()
        });

        await databaseService.updateInvoiceStatus(payment.invoiceId, 'PAID');
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  // Handle failed payment
  async handlePaymentFailure(paymentIntent) {
    try {
      const payment = await databaseService.getPaymentByTransactionId(paymentIntent.id);
      if (payment) {
        await databaseService.updatePaymentStatus(payment.id, 'FAILED', {
          stripePaymentIntent: paymentIntent,
          failureReason: paymentIntent.last_payment_error?.message,
          failedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  // Handle successful invoice payment
  async handleInvoicePaymentSuccess(invoice) {
    try {
      // Handle subscription invoice payment
      console.log('Subscription invoice payment succeeded:', invoice.id);
    } catch (error) {
      console.error('Error handling invoice payment success:', error);
    }
  }

  // Handle failed invoice payment
  async handleInvoicePaymentFailure(invoice) {
    try {
      // Handle subscription invoice payment failure
      console.log('Subscription invoice payment failed:', invoice.id);
    } catch (error) {
      console.error('Error handling invoice payment failure:', error);
    }
  }

  // Get payment analytics
  async getPaymentAnalytics(filters = {}) {
    try {
      const payments = await databaseService.getPayments(filters);
      
      const analytics = {
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
        successfulPayments: payments.filter(p => p.status === 'COMPLETED').length,
        failedPayments: payments.filter(p => p.status === 'FAILED').length,
        pendingPayments: payments.filter(p => p.status === 'PENDING').length,
        averagePaymentAmount: payments.length > 0 ? 
          payments.reduce((sum, p) => sum + p.amount, 0) / payments.length : 0,
        paymentMethods: payments.reduce((acc, p) => {
          acc[p.method] = (acc[p.method] || 0) + 1;
          return acc;
        }, {})
      };

      return analytics;
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      throw error;
    }
  }

  // Validate webhook signature
  validateWebhookSignature(payload, signature, secret) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
      return event;
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      await this.stripe.paymentMethods.list({ limit: 1 });
      return { status: 'healthy', initialized: this.isInitialized };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, initialized: false };
    }
  }
}

// Create singleton instance
const paymentService = new PaymentService();

export default paymentService;
