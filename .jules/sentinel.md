## 2025-04-11 - Use Cryptographically Secure RNG for Security-Sensitive Codes
**Vulnerability:** Found `Math.random()` being used to generate meeting and class codes. `Math.random()` is not cryptographically secure and predictable.
**Learning:** For identifiers and codes that act as secrets to enter a room, class, or access restricted content, weak random number generators should not be used as it can enable brute forcing.
**Prevention:** Always use Node.js's built in `crypto` module (e.g., `crypto.randomInt()`, `crypto.getRandomValues()`) or equivalent cryptographically secure generators for generating sensitive identifiers.
