const crypto = require('crypto');

/**
 * Generates a secure random alphanumeric code of a specified length.
 * Replaces insecure Math.random() usage for generating class/meeting codes.
 *
 * @param {number} length The length of the code to generate
 * @returns {string} The randomly generated alphanumeric string
 */
function generateSecureCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(chars.length));
  }
  return code;
}

module.exports = { generateSecureCode };
