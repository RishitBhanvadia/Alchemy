const crypto = require('crypto');

function generateSecureCode(length = 6, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return code;
}

module.exports = { generateSecureCode };
