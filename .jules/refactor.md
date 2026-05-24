## 2024-05-24 - Replace insecure Math.random() with crypto.randomInt
**Before:** Random string generation in backend controllers used `Math.random()` scaled by string length.
**Issue:** `Math.random()` is not cryptographically secure and can lead to predictable patterns, making authorization codes predictable. It is also prone to modulo bias.
**Learning:** Replaced `Math.random()` with `crypto.randomInt(0, max)` using the native `crypto` library. Next time consider extracting this to a utility function instead of leaving it duplicated in two separate controllers, which would have fully satisfied the DRY principle.
