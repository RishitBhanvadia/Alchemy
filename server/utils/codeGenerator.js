const crypto = require('crypto');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateSecureCode(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(crypto.randomInt(0, CHARS.length));
  }
  return code;
}

module.exports = { generateSecureCode };
