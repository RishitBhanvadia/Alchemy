export function generateSecureCode(length = 6, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  let code = '';
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  return code;
}
