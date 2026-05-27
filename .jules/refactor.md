## 2025-05-27 - Replace Math.random with crypto.randomInt for code generation
**Before:** Math.floor(Math.random() * chars.length)
**Issue:** Math.random() is predictable and has modulo bias, which is not suitable for generating unique alphanumeric access codes in a backend environment.
**Learning:** For secure random number generation in Node.js, use crypto.randomInt(0, max) to avoid modulo bias and predictability.
