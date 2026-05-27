## 2025-03-09 - Insecure Random Number Generation for Access Codes
**Vulnerability:** The application uses `Math.random()` to generate alphanumeric meeting and classroom codes. `Math.random()` is not a cryptographically secure pseudo-random number generator (CSPRNG), making the generated access codes predictable and susceptible to brute-force or guessing attacks.
**Learning:** In a Node.js backend environment, `Math.random()` should never be used for security-sensitive operations such as generating access codes, passwords, or tokens.
**Prevention:** Always use the built-in `crypto` module (e.g., `crypto.randomInt()`) for generating secure random numbers to avoid predictability and modulo bias.
