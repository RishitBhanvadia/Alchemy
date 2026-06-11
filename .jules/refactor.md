## 2024-05-18 - Use crypto.randomInt for Secure Code Generation
**Before:** `Math.random()` was used to generate meeting and classroom codes.
**Issue:** `Math.random()` is not cryptographically secure and can lead to predictable patterns and potential collisions, especially when scaling.
**Learning:** Always use Node.js's built-in `crypto` module (`crypto.randomInt()`) for generating secure, unpredictable random numbers for codes, tokens, or IDs in backend services to enhance security and prevent predictable code guessing.
