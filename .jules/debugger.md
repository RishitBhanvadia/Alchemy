## 2026-05-23 - Insecure Random Number Generation
**Bug:** The classroom code generation was using the insecure `Math.random().toString(36)` which is predictable and suffers from length inconsistencies and mathematical bias.
**Root Cause:** Developer used a quick but insecure way to generate a 6-character random code.
**Learning:** Always use a Cryptographically Secure Random Number Generator (CSRNG) such as `window.crypto.getRandomValues()` on the frontend. Explicitly map random bytes to a predefined character set array rather than calling `.toString(36).substring()` on random values.