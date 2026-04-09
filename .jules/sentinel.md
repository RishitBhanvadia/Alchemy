## 2024-05-24 - Fix Insecure Randomness in Code Generation
**Vulnerability:** Weak PRNG (`Math.random()`) used for generating security-sensitive values (classroom and meeting codes). `Math.random()` is not cryptographically secure, and the generated codes could be predictable.
**Learning:** `Math.random()` must not be used for cryptographic purposes or for generating unique identifiers where predictability is a security concern. The Node.js `crypto` module provides secure randomness generation tools.
**Prevention:** Always use `crypto.randomInt()` or `crypto.randomBytes()` for generating security-sensitive values, such as codes, tokens, or passwords, to ensure cryptographic security.
