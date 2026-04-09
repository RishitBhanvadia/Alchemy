## 2024-03-29 - Insecure Randomness in Code Generation
**Vulnerability:** Used `Math.random()` to generate classroom and meeting codes, making them predictable and vulnerable to guessing attacks.
**Learning:** Always use cryptographically secure random number generators (`crypto.randomInt` in Node.js, `window.crypto.getRandomValues` in the browser) for sensitive values like access codes.
**Prevention:** Ensure code reviews check for `Math.random()` usage and recommend secure alternatives for security-sensitive tokens.
