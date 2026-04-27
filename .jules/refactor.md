## 2025-02-15 - Replace Math.random() with cryptographically secure PRNG
**Before:** Controllers were generating classroom codes and meeting session codes using `Math.random()`, which is a predictable PRNG and not suitable for security-sensitive access tokens.
**Issue:** While not high-entropy passwords, predictable IDs can be vulnerable to automated brute-forcing or code guessing, enabling unauthorized entry to classes or sessions.
**Learning:** Found and extracted code generation using `Math.random()` to a dedicated utility file `server/utils/secureCode.js` utilizing Node's built-in `crypto.randomInt()`. This centralizes the behavior while adhering to the security guidelines for critical code paths without disrupting the 5 or 6 character length requirements of different endpoints.
