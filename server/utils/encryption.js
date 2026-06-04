const crypto = require('crypto');
const logger = require('./logger');

// Use a fallback key ONLY for local dev. In production, this should be a secure environment variable.
// Using a static default ensures we don't lock ourselves out on server restarts.
const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY || 'default_dev_secret_key_alchemistry';

// Hash the secret to guarantee a 32-byte key buffer regardless of what string is provided
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest();

const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return null;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (err) {
    logger.error('[Encryption] Failed to encrypt:', err.message);
    return null;
  }
}

function decrypt(text) {
  if (!text) return null;
  try {
    const textParts = text.split(':');
    if (textParts.length !== 2) throw new Error('Invalid encrypted format');

    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    logger.error('[Encryption] Failed to decrypt:', err.message);
    return null; // Return null so callers treat the data as missing/expired
  }
}

module.exports = { encrypt, decrypt };
