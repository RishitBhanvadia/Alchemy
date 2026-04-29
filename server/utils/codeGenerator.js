const crypto = require('crypto');

function generateSecureCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(chars.length));
  }
  return code;
}

module.exports = { generateSecureCode };
