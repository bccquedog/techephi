import authService from '../../src/services/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Invalidate refresh token
      await authService.logout(refreshToken);
    }

    // Clear the refresh token cookie
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

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear the cookie even if there's an error
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

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}
