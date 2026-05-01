## 2024-10-24 - Cryptographically Secure Random Code Generation
**Vulnerability:** Meeting session codes and classroom codes were being generated using `Math.random()`, which is predictable and not cryptographically secure. This could theoretically allow an attacker to predict valid session or classroom codes.
**Learning:** `Math.random()` should never be used for security-sensitive identifiers or tokens. Node.js `crypto` module provides `randomInt` and `randomBytes` which use a CSPRNG.
**Prevention:** Always use `crypto.randomInt` (or `crypto.randomBytes`) to generate random alphanumeric strings used for access control or session identifiers.
