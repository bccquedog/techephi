import authService from '../../src/services/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    // Refresh the token
    const result = await authService.refreshToken(refreshToken);

    // Set new secure HTTP-only cookie for refresh token
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
      token: result.token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear the invalid refresh token cookie
    const isProd = process.env.NODE_ENV === 'production';
    const baseCookie = [
      'refreshToken=',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=0',
      'Path=/'
    ];
    if (isProd) baseCookie.push('Secure');
    res.setHeader('Set-Cookie', [baseCookie.join('; ')]);

    return res.status(401).json({ 
      error: 'Invalid or expired refresh token' 
    });
  }
}
