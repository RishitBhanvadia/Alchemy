## 2026-05-05 - Predictable Random Code Generation
**Vulnerability:** Weak random number generation using `Math.random()` to create classroom and meeting codes.
**Learning:** `Math.random()` is not cryptographically secure and can generate predictable values, making it susceptible to brute force or prediction attacks when creating sensitive access codes.
**Prevention:** Always use Node.js `crypto.randomInt()` (CSPRNG) for the backend when generating security-sensitive identifiers.
