## 2025-04-18 - Math.random() is cryptographically insecure
**Vulnerability:** Weak random number generation using `Math.random()` to generate classroom and meeting codes.
**Learning:** `Math.random()` provides low entropy and its output can be predicted, allowing an attacker to guess codes for unauthorized access.
**Prevention:** Always use `crypto.randomInt()` or `crypto.randomBytes()` from the `crypto` module to generate secure random tokens and identifiers.