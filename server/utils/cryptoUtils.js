const crypto = require('crypto');

/**
 * Generates a random alphanumeric code of the specified length using a CSPRNG.
 * @param {number} length - The length of the code to generate.
 * @returns {string} The generated code.
 */
function generateRandomCode(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
}

module.exports = {
  generateRandomCode,
};
