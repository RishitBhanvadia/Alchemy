## 2024-05-24 - Cryptographically Secure Random Number Generation for Class Codes
**Vulnerability:** Weak, predictable random number generation (`Math.random()`) was being used for creating class codes, making them potentially guessable.
**Learning:** `Math.random()` does not provide cryptographically secure random numbers and should not be used for anything security-related, such as authentication tokens, passwords, or class codes. Also, naive character mapping like `Math.random().toString(36)` introduces probability bias.
**Prevention:** Use `crypto.randomBytes` (Node.js) or `window.crypto.getRandomValues` (Browser) to generate cryptographically secure random bytes, and safely map them to an alphanumeric array using modulo arithmetic to avoid probability bias.
