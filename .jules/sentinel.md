## 2024-05-18 - [Fix Insecure Randomness]
**Vulnerability:** Weak random number generation (`Math.random()`) was used for sensitive tokens like class codes and meeting codes.
**Learning:** `Math.random()` is not cryptographically secure and can be predictable.
**Prevention:** Always use `crypto.randomInt()` or `crypto.randomBytes()` for security-critical random value generation.
