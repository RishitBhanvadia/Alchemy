const crypto = require('crypto');

/**
 * Generates a secure, unbiased alphanumeric code of the specified length.
 *
 * @param {number} length - The desired length of the code.
 * @returns {string} - The generated secure code.
 */
function generateSecureCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

module.exports = { generateSecureCode };
