import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

// Get the encryption key from environment variables or use a default (for development only)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your32characterencryptionkey12345';

// Encrypt API key
export function encryptApiKey(apiKey) {
  return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
}

// Decrypt API key
export function decryptApiKey(encryptedApiKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedApiKey, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
} 