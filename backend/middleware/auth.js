import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_change_in_production';

export const verifyToken = (req, res, next) => {
  // Get token from request
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}; 