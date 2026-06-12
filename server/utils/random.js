const crypto = require('crypto');

/**
 * Generates a cryptographically secure random string of a given length.
 * @param {number} length - The length of the generated string.
 * @param {string} [chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'] - The characters to use.
 * @returns {string} The generated string.
 */
function generateSecureCode(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

module.exports = { generateSecureCode };
