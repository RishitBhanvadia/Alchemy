## 2024-05-17 - Replace insecure Math.random() with crypto
**Vulnerability:** Use of Math.random() to generate meeting and classroom codes.
**Learning:** Math.random() is predictable and shouldn't be used for security-sensitive operations like generating access codes.
**Prevention:** Use Node.js's crypto module (crypto.randomInt) to generate cryptographically secure random values.
