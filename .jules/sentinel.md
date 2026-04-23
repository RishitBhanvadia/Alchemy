## 2024-04-22 - Replace Predictable Random Number Generation
**Vulnerability:** Use of `Math.random()` for generating security-sensitive codes like meeting access codes and classroom join codes.
**Learning:** `Math.random()` is not cryptographically secure and its outputs can potentially be predicted if the internal state of the PRNG is deduced, enabling unauthorized access to classrooms and meetings.
**Prevention:** Use `crypto.randomInt()` or `crypto.randomBytes()` for generating access codes or tokens that require cryptographic security. Created a `cryptoUtils.js` module in `server/utils` to centralize secure random string generation.
