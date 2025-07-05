import { executeQuery } from '../db/setup.js';
import { encryptApiKey, decryptApiKey } from '../utils/encryption.js';
import bcrypt from 'bcrypt';

// Get all API keys for a user (only titles, not actual keys)
export const getAllApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get API keys from database (excluding the actual key value)
    const keys = await executeQuery(
      'SELECT id, title, web_link, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    return res.status(200).json({
      success: true,
      keys
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get a specific API key with decryption (requires PIN verification)
export const getApiKeyById = async (req, res) => {
  try {
    const keyId = req.params.id;
    const userId = req.user.id;
    const { pin } = req.body;
    
    // Validate PIN
    if (!pin) {
      return res.status(400).json({ success: false, message: 'PIN is required' });
    }
    
    // Get user's PIN from database for verification
    const users = await executeQuery('SELECT pin FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify PIN
    const isValidPin = await bcrypt.compare(pin, users[0].pin);
    
    if (!isValidPin) {
      return res.status(401).json({ success: false, message: 'Invalid PIN' });
    }
    
    // Get API key from database
    const keys = await executeQuery(
      'SELECT * FROM api_keys WHERE id = ? AND user_id = ?',
      [keyId, userId]
    );
    
    if (keys.length === 0) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }

    const apiKey = keys[0];
    
    // Decrypt the API key
    const decryptedKeyValue = decryptApiKey(apiKey.key_value);
    
    return res.status(200).json({
      success: true,
      key: {
        id: apiKey.id,
        title: apiKey.title,
        key_value: decryptedKeyValue,
        web_link: apiKey.web_link,
        created_at: apiKey.created_at
      }
    });
  } catch (error) {
    console.error('Get API key error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create a new API key
export const createApiKey = async (req, res) => {
  try {
    const { title, key_value, web_link } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || !key_value) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and key value are required' 
      });
    }

    // Encrypt the API key
    const encryptedKeyValue = encryptApiKey(key_value);
    
    // Insert new API key
    const result = await executeQuery(
      'INSERT INTO api_keys (user_id, title, key_value, web_link) VALUES (?, ?, ?, ?)',
      [userId, title, encryptedKeyValue, web_link || null]
    );

    return res.status(201).json({
      success: true,
      message: 'API key created successfully',
      key: {
        id: result.insertId,
        title,
        web_link: web_link || null
      }
    });
  } catch (error) {
    console.error('Create API key error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update an API key
export const updateApiKey = async (req, res) => {
  try {
    const keyId = req.params.id;
    const { title, key_value, web_link } = req.body;
    const userId = req.user.id;

    // Check if key exists and belongs to user
    const existingKeys = await executeQuery(
      'SELECT * FROM api_keys WHERE id = ? AND user_id = ?',
      [keyId, userId]
    );
    
    if (existingKeys.length === 0) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }

    // Prepare update data
    let updateData = {};
    let updateParams = [];
    let updateQuery = 'UPDATE api_keys SET ';

    if (title !== undefined) {
      updateData.title = title;
    }
    
    if (key_value !== undefined) {
      updateData.key_value = encryptApiKey(key_value);
    }
    
    if (web_link !== undefined) {
      updateData.web_link = web_link;
    }

    // Build update query
    const updates = [];
    for (const [key, value] of Object.entries(updateData)) {
      updates.push(`${key} = ?`);
      updateParams.push(value);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No data to update' });
    }

    updateQuery += updates.join(', ');
    updateQuery += ' WHERE id = ? AND user_id = ?';
    updateParams.push(keyId, userId);

    // Execute update
    await executeQuery(updateQuery, updateParams);

    return res.status(200).json({
      success: true,
      message: 'API key updated successfully'
    });
  } catch (error) {
    console.error('Update API key error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete an API key
export const deleteApiKey = async (req, res) => {
  try {
    const keyId = req.params.id;
    const userId = req.user.id;

    // Delete API key
    const result = await executeQuery(
      'DELETE FROM api_keys WHERE id = ? AND user_id = ?',
      [keyId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 