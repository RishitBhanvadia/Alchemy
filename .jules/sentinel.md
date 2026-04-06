## 2024-04-06 - Insecure Randomness (CWE-338) in code generation
**Vulnerability:** Weak random number generation using `Math.random()` to generate classroom and meeting codes.
**Learning:** `Math.random()` is not cryptographically secure and predictable, leading to potential ID predictability and collisions. Node.js built-in `crypto` module should be used instead.
**Prevention:** Avoid `Math.random()` for any security-sensitive, identification, or ID-generating logic. Instead, use `crypto.randomInt()` for generating codes.
