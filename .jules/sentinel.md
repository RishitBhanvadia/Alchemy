## 2025-04-26 - Predictable Randomness in Access Codes
**Vulnerability:** Meeting links and classroom codes were generated using `Math.random()`, which is a pseudo-random number generator (PRNG) that is predictable and not cryptographically secure. This could allow an attacker to predict access codes and join meetings or classrooms unauthorized.
**Learning:** For security-sensitive data generation (like access codes, tokens, or links), `crypto.randomInt` (Node.js) or `window.crypto.getRandomValues` (browser) should be used instead of `Math.random()`.
**Prevention:** Always use cryptographically secure random number generators (CSPRNG) when creating access tokens, meeting codes, or classroom codes.
