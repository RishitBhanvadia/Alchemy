## 2026-03-25 - Fix Insecure Random Code Generation
**Vulnerability:** Found `Math.random()` used to generate 6-character meeting codes and 5-character classroom codes. This is cryptographically insecure and vulnerable to prediction.
**Learning:** For application functionality requiring randomness for authentication or session codes (such as classroom join codes and meeting IDs), a cryptographically secure pseudo-random number generator (CSPRNG) must be used.
**Prevention:** Always use Node.js's built-in `crypto` module (e.g., `crypto.randomBytes`) instead of `Math.random()` for generating sensitive codes or tokens.
