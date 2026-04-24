const crypto = require('crypto');

function generateSecureCode(length = 6) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    code += CHARS[randomBytes[i] % CHARS.length];
  }
  return code;
}

module.exports = { generateSecureCode };
