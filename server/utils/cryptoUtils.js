const crypto = require('crypto');

/**
 * Generates a cryptographically secure random alphanumeric string.
 * @param {number} length - The length of the code to generate.
 * @returns {string} The securely generated code.
 */
function generateSecureCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    code += chars.charAt(randomIndex);
  }
  return code;
}

module.exports = {
  generateSecureCode,
};
