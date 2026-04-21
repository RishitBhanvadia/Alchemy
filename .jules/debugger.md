## 2026-04-21 - Predictable Code Generation Vulnerability
**Bug:** Classroom and meeting codes were generated using `Math.random()`.
**Root Cause:** The `generateCode` and `generateClassCode` functions relied on the PRNG `Math.random()`, which is not cryptographically secure and produces predictable outputs.
**Learning:** Always use `crypto.randomInt()` or a similarly cryptographically secure pseudo-random number generator (CSPRNG) when creating access tokens, meeting links, or any security-sensitive codes to prevent unauthorized access via code guessing.
