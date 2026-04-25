const crypto = require('crypto');

exports.generateSecureCode = (length = 6) => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomValue = crypto.randomBytes(1)[0];
    code += CHARS[randomValue % CHARS.length];
  }
  return code;
};