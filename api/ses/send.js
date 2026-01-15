import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailData, sesConfig } = req.body;

    // Validate required fields
    if (!emailData || !sesConfig) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Configure AWS SES
    AWS.config.update({
      region: sesConfig.region,
      accessKeyId: sesConfig.accessKeyId,
      secretAccessKey: sesConfig.secretAccessKey
    });

    const ses = new AWS.SES();

    // Send email via SES
    const result = await ses.sendEmail(emailData).promise();

    return res.status(200).json({
      success: true,
      messageId: result.MessageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('SES Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      code: error.code
    });
  }
}
