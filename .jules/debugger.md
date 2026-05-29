## 2024-05-29 - Insecure Random Number Generation
**Bug:** Usage of `Math.random()` for generating secure access codes (meeting codes and class codes).
**Root Cause:** The `Math.random()` function is not cryptographically secure, and the modulus operation introduces modulo bias.
**Learning:** Use `crypto.randomInt(0, chars.length)` from the built-in `crypto` module mapped to a predefined character array to generate secure alphanumeric access codes, avoiding predictability and modulo bias.
