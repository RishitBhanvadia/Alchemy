const { encrypt, decrypt } = require('../utils/encryption');

test('encryption and decryption work', () => {
  const text = 'test-token-123';
  const encrypted = encrypt(text);
  expect(encrypted).not.toBe(text);
  const decrypted = decrypt(encrypted);
  expect(decrypted).toBe(text);
});

test('encrypting null returns null', () => {
  expect(encrypt(null)).toBeNull();
});

test('decrypting null returns null', () => {
  expect(decrypt(null)).toBeNull();
});
