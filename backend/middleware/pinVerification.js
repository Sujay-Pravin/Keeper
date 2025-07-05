import bcrypt from 'bcrypt';
import { executeQuery } from '../db/setup.js';

export const verifyPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id;

    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN is required' });
    }

    // Get user from database
    const users = await executeQuery('SELECT pin FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, user.pin);
    
    if (!isPinValid) {
      return res.status(401).json({ success: false, message: 'Invalid PIN' });
    }

    next();
  } catch (error) {
    console.error('PIN verification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 