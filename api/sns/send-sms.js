import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { smsData, snsConfig } = req.body;

    // Validate required fields
    if (!smsData || !snsConfig) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Configure AWS SNS
    AWS.config.update({
      region: snsConfig.region,
      accessKeyId: snsConfig.accessKeyId,
      secretAccessKey: snsConfig.secretAccessKey
    });

    const sns = new AWS.SNS();

    // Send SMS via SNS
    const result = await sns.publish(smsData).promise();

    return res.status(200).json({
      success: true,
      messageId: result.MessageId,
      message: 'SMS sent successfully'
    });

  } catch (error) {
    console.error('SNS Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS',
      code: error.code
    });
  }
}
