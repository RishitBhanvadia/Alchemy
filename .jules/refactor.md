## 2024-04-06 - Replace Math.random() with crypto.randomInt() for Code Generation
**Before:** `Math.random()` was used to generate meeting and class codes.
**Issue:** `Math.random()` is not cryptographically secure and can be predictable, which is not suitable for generating secure unique identifiers like class codes and meeting codes.
**Learning:** For secure random alphanumeric generation in Node.js, `crypto.randomInt(min, max)` from the built-in `crypto` module should be used to guarantee cryptographic security and avoid predictability (CWE-338).
