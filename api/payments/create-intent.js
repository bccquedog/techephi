import paymentService from '../../src/services/payment.js';
import databaseService from '../../src/services/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { invoiceId, amount, currency = 'usd' } = req.body;

    // Validate required fields
    if (!invoiceId || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: invoiceId and amount are required' 
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ 
        error: 'Amount must be greater than 0' 
      });
    }

    // Get invoice from database
    const invoice = await databaseService.getInvoiceById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ 
        error: 'Invoice not found' 
      });
    }

    // Check if invoice is already paid
    if (invoice.status === 'PAID') {
      return res.status(400).json({ 
        error: 'Invoice is already paid' 
      });
    }

    // Check if amount matches invoice total
    if (Math.abs(amount - invoice.totalAmount) > 0.01) {
      return res.status(400).json({ 
        error: 'Payment amount does not match invoice total' 
      });
    }

    // Create payment intent
    const paymentIntent = await paymentService.createPaymentIntent(
      invoiceId, 
      amount, 
      currency
    );

    return res.status(200).json({
      success: true,
      data: {
        paymentIntentId: paymentIntent.paymentIntentId,
        clientSecret: paymentIntent.clientSecret,
        paymentId: paymentIntent.paymentId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment intent'
    });
  }
}
