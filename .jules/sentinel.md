## 2024-06-07 - Insecure Random Code Generation
**Vulnerability:** Insecure use of `Math.random()` to generate classroom and meeting codes.
**Learning:** Avoid using `Math.random()` for generating codes or tokens as it is not cryptographically secure and can be predictable.
**Prevention:** Always use the native Node.js `crypto` module (e.g., `crypto.randomInt()`) to ensure cryptographically secure pseudo-randomness for tokens and codes.
