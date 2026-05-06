## 2026-05-06 - Predictable Math.random() in Access Codes
**Vulnerability:** The application used `Math.random()` to generate sensitive meeting codes and classroom join codes on both the frontend and backend.
**Learning:** `Math.random()` is not a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) and produces predictable sequences, allowing attackers to guess codes and gain unauthorized access to private rooms.
**Prevention:** Always use `crypto.randomInt()` in Node.js environments and `window.crypto.getRandomValues()` in browser environments when generating security-sensitive tokens, passwords, or access identifiers.
