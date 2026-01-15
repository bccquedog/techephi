import paymentService from '../../src/services/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    // Validate required fields
    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({ 
        error: 'Missing required fields: paymentIntentId and paymentMethodId are required' 
      });
    }

    // Confirm payment
    const result = await paymentService.confirmPayment(paymentIntentId, paymentMethodId);

    return res.status(200).json({
      success: true,
      data: {
        payment: result.payment,
        paymentIntent: result.paymentIntent
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to confirm payment'
    });
  }
}
