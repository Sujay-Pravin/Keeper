import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { executeQuery } from '../db/setup.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Register new user
export const register = async (req, res) => {
  try {
    const { username, password, full_name, pin } = req.body;

    // Validate input
    if (!username || !password || !full_name || !pin) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: username, password, full_name, and pin' 
      });
    }

    // Validate PIN (must be exactly 4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: 'PIN must be exactly 4 digits'
      });
    }

    // Check if username already exists
    const existingUsers = await executeQuery('SELECT id FROM users WHERE username = ?', [username]);
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    // Hash password and PIN
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedPin = await bcrypt.hash(pin, saltRounds);

    // Insert new user
    const result = await executeQuery(
      'INSERT INTO users (username, password, full_name, pin) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, full_name, hashedPin]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        username,
        full_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find user by username
    const users = await executeQuery('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout user
export const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logout successful' });
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user from database (excluding password and PIN)
    const users = await executeQuery(
      'SELECT id, username, full_name, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 