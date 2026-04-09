const crypto = require('crypto');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a cryptographically secure random alphanumeric string of a given length.
 * @param {number} length
 * @returns {string}
 */
exports.generateRandomCode = (length) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(crypto.randomInt(0, CHARS.length));
  }
  return code;
};
