import authService from '../../src/services/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Get client IP and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Login user
    const result = await authService.login(email, password, ipAddress, userAgent);

    // Set secure HTTP-only cookie for refresh token
    const isProd = process.env.NODE_ENV === 'production';
    const baseCookie = [
      `refreshToken=${result.refreshToken}`,
      'HttpOnly',
      'SameSite=Strict',
      `Max-Age=${7 * 24 * 60 * 60}`,
      'Path=/'
    ];
    if (isProd) baseCookie.push('Secure');
    res.setHeader('Set-Cookie', [baseCookie.join('; ')]);

    return res.status(200).json({
      success: true,
      user: result.user,
      token: result.token
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({ error: error.message });
    }
    
    if (error.message.includes('Account is deactivated')) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
}
