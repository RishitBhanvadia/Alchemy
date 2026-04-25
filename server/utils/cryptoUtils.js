const crypto = require('crypto');

/**
 * Generates a secure random alphanumeric code of the specified length.
 * Replaces predictable Math.random() usage for sensitive IDs.
 *
 * @param {number} length - The length of the code to generate.
 * @returns {string} The generated secure code.
 */
function generateSecureCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

module.exports = {
  generateSecureCode
};
