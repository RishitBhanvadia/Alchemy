## 2024-04-15 - Insecure Random Number Generation for Access Codes
**Vulnerability:** The application was using `Math.random()` to generate meeting codes and classroom join codes.
**Learning:** `Math.random()` is not cryptographically secure and produces predictable sequences, which could allow attackers to guess access codes and bypass authorization mechanisms to join meetings or classrooms.
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG) like Node.js's `crypto.randomInt()` or `crypto.randomBytes()` when generating tokens, codes, passwords, or any value used for security or access control.
