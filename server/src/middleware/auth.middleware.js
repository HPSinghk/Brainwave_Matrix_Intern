const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

module.exports = async (req, res, next) => {
  try {
    
    // Get token from header or cookie
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    try {
      // Verify token with explicit algorithm
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', {
        algorithms: ['HS256']
      });

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      throw jwtError;
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Not authorized' });
  }
}; 