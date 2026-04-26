const crypto = require('crypto');

/**
 * Generates a cryptographically secure random alphanumeric code.
 * @param {number} length The length of the code to generate.
 * @returns {string} The generated code.
 */
function generateSecureCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

module.exports = { generateSecureCode };
