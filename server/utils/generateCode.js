const crypto = require('crypto');
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, CHARS.length);
    code += CHARS.charAt(randomIndex);
  }
  return code;
}

module.exports = { generateCode };
