## 2024-05-24 - Insecure Code Generation
**Vulnerability:** Weak random number generation using `Math.random()` for class and meeting codes.
**Learning:** `Math.random()` is not cryptographically secure and can be predicted.
**Prevention:** Use `window.crypto.getRandomValues()` in the browser and `crypto.randomInt()` in Node.js for generating secure random values.
