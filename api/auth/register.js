import authService from '../../src/services/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, displayName, role, phone } = req.body;

    // Validate required fields
    if (!email || !password || !displayName) {
      return res.status(400).json({ 
        error: 'Email, password, and display name are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate role
    const validRoles = ['ADMIN', 'CONTRACTOR', 'CLIENT'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Get client IP and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Register user
    const result = await authService.register({
      email,
      password,
      displayName,
      role: role || 'CLIENT',
      phone,
      ipAddress,
      userAgent
    });

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

    return res.status(201).json({
      success: true,
      user: result.user,
      token: result.token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    if (error.message.includes('Password must')) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
}
