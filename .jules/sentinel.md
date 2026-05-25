## 2025-05-25 - Predictable Code Generation Vulnerability
**Vulnerability:** Used `Math.random()` to generate classroom and meeting join codes. `Math.random()` is cryptographically insecure and predictable, making it susceptible to bruteforcing or prediction of future codes if the internal state of the PRNG is deduced.
**Learning:** In Node.js environments, even seemingly innocuous randomness requirements like a short access code should rely on secure PRNGs when the generated codes grant access to potentially sensitive functionality (like a meeting session).
**Prevention:** Always use `crypto.randomInt(0, chars.length)` from the built-in `crypto` module (or other cryptographically secure APIs) when selecting random characters from a charset for any security-adjacent identifiers.
