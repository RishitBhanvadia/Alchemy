## 2024-05-04 - Predictable Meeting and Class Codes
**Vulnerability:** Weak random number generation (`Math.random()`) used for generating meeting codes and class codes, making them predictable.
**Learning:** Always use cryptographically secure random number generators (CSPRNG) like `crypto.randomInt` or `crypto.randomBytes` for security-sensitive identifiers to avoid predictability.
**Prevention:** Use `crypto` module in Node.js instead of `Math.random()`.
