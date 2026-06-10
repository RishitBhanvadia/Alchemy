## 2024-10-24 - Fix Insecure Random Generation
**Vulnerability:** Weak pseudo-random number generation (PRNG) using `Math.random()` to generate classroom and meeting codes. This can be predictable and insecure.
**Learning:** The application was using `Math.random()` to generate security-sensitive identifiers (codes).
**Prevention:** Always use the native Node.js `crypto` module (`crypto.randomInt()`) to generate cryptographically secure pseudo-randomness for codes, tokens, or other security-sensitive data.
