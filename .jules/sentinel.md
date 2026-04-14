## 2024-05-18 - Use secure random generation for codes
**Vulnerability:** Weak random number generation using `Math.random` for security-sensitive meeting and classroom codes.
**Learning:** `Math.random` is predictable and should not be used for creating identifiers or codes that control access or uniqueness securely.
**Prevention:** Always use cryptographically secure methods like `crypto.randomInt` from Node.js's built-in `crypto` module for generating any sensitive identifiers.