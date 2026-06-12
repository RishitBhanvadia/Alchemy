## 2024-06-12 - Insecure Random Number Generation for Access Codes
**Vulnerability:** The codebase was using `Math.random()` to generate alphanumeric meeting and classroom join codes. `Math.random()` is not a cryptographically secure pseudorandom number generator (CSPRNG), making the generated codes predictable and potentially allowing an attacker to guess future codes to gain unauthorized access to meetings or classrooms.
**Learning:** `Math.random()` should never be used for security-sensitive operations like generating passwords, access tokens, or join codes.
**Prevention:** Always use Node.js's built-in `crypto` module (specifically `crypto.randomInt` or `crypto.randomBytes`) when generating any sort of secret code or token.
