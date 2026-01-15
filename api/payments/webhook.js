import paymentService from '../../src/services/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(400).json({ 
        error: 'Missing Stripe signature or webhook secret' 
      });
    }

    // Validate webhook signature
    let event;
    try {
      event = paymentService.validateWebhookSignature(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return res.status(400).json({ 
        error: 'Invalid webhook signature' 
      });
    }

    // Handle the webhook event
    await paymentService.handleWebhook(event);

    return res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process webhook'
    });
  }
}

// Configure body parsing for webhooks
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll handle it manually
  },
};

async function getRawBody(req) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
