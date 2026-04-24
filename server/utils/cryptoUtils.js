const crypto = require('crypto');

function generateSecureCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    code += chars.charAt(randomIndex);
  }
  return code;
}

module.exports = {
  generateSecureCode
};
