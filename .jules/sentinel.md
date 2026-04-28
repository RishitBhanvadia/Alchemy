## YYYY-MM-DD - [Title]
**Vulnerability:** Weak random number generation in security-sensitive features.
**Learning:** `Math.random()` was used to generate classroom codes and meeting codes. This can be predictable and vulnerable to attacks. Using `crypto.randomInt` (Node.js) or `window.crypto.getRandomValues()` (browser) is the proper way to generate secure codes.
**Prevention:** Always use CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) for security-sensitive data like tokens and access codes.
