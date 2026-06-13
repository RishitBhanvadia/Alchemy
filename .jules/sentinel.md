## 2025-06-13 - Insecure Random Number Generation for Tokens
**Vulnerability:** `Math.random()` was used to generate sensitive tokens (meeting and classroom codes).
**Learning:** `Math.random()` generates cryptographically insecure pseudorandom numbers, which makes generated codes potentially predictable.
**Prevention:** Always use the Node.js `crypto` module, specifically `crypto.randomInt()`, or other cryptographically secure methods for generating sensitive tokens or codes.
