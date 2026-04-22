const crypto = require('crypto');

/**
 * Generates a secure random alphanumeric string of the specified length.
 * Uses cryptographically secure random integers to prevent predictable code generation vulnerabilities.
 * @param {number} length - The length of the string to generate.
 * @param {string} chars - The character set to use for generation. Defaults to uppercase alphanumeric.
 * @returns {string} - The generated secure code.
 */
function generateSecureCode(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
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
