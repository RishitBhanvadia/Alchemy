const crypto = require('crypto');

/**
 * Generates a secure random alphanumeric code of the specified length.
 * Uses crypto.randomInt instead of Math.random() for better security.
 *
 * @param {number} length - The length of the code to generate. Default is 6.
 * @returns {string} - The generated secure code.
 */
function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(chars.length));
  }
  return code;
}

module.exports = generateCode;
