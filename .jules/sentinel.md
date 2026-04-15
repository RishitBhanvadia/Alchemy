## 2024-04-14 - Replace Predictable Random Generators
**Vulnerability:** Predictable code generation for classrooms and meetings using `Math.random()`.
**Learning:** `Math.random()` in JavaScript is a PRNG and is not cryptographically secure. Relying on it for generating sensitive access codes can theoretically make those codes predictable.
**Prevention:** Use `crypto.randomInt(0, length)` from the built-in Node.js `crypto` module for generating sensitive codes and IDs instead.