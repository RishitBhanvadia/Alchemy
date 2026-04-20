## 2024-04-19 - Insecure Randomness in Access Code Generation
**Vulnerability:** Predictable access codes via `Math.random()`.
**Learning:** `Math.random()` provides weak pseudo-randomness. When generating secure random tokens or access codes (e.g., for meetings or classrooms) in Node.js backends, avoid `Math.random()`. Use the built-in `crypto` module (e.g., `crypto.randomInt()`) to ensure strong cryptographic security and prevent predictable code generation.
**Prevention:** Always use `crypto.randomInt` or `crypto.randomBytes` for secure code generation instead of `Math.random()`.