## 2024-05-24 - Fix Insecure Math.random() Usage
**Bug:** Use of `Math.random()` to generate security-sensitive values like classroom and meeting codes.
**Root Cause:** `Math.random()` is not cryptographically secure and can be predictable, which makes it unsuitable for generating unique and secure identifiers like access codes.
**Learning:** Always use cryptographically secure random number generators (like Node.js `crypto.randomInt()`) when generating sensitive values, authentication tokens, or access codes to prevent security vulnerabilities related to predictability.
