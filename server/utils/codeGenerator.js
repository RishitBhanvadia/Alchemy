const crypto = require('crypto');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a secure random alphanumeric code of the specified length.
 * Uses crypto.randomInt to avoid modulo bias.
 *
 * @param {number} length - The length of the code to generate.
 * @returns {string} The generated code.
 */
function generateSecureCode(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(crypto.randomInt(0, CHARS.length));
  }
  return code;
}

module.exports = { generateSecureCode };
