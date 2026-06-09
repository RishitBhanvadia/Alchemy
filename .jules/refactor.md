## 2025-06-09 - Ensure cryptographically secure PRNG for codes
**Before:** Functions `generateCode` and `generateClassCode` and inline logic used `Math.random()` to generate classroom and meeting codes.
**Issue:** `Math.random()` is not cryptographically secure and can lead to predictable patterns when generating tokens/codes, which goes against the rule "Always use the native Node.js crypto module (e.g., crypto.randomInt()) to ensure cryptographically secure pseudo-randomness."
**Learning:** Refactored multiple occurrences of code generation to use Node's built-in `crypto` module, specifically `crypto.randomInt()`. This aligns with the codebase-specific memory guidelines for backend services.
