const { generateSecureCode } = require('../../utils/cryptoUtils');

describe('generateSecureCode', () => {
  it('generates a code of correct length', () => {
    const code = generateSecureCode(6);
    expect(code).toHaveLength(6);
  });
  it('generates unique codes', () => {
    const code1 = generateSecureCode();
    const code2 = generateSecureCode();
    expect(code1).not.toBe(code2);
  });
});
