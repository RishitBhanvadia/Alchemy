## 2024-05-03 - Cryptographically Secure Random Identifiers
**Vulnerability:** Weak random number generation using Math.random() for meeting and classroom codes.
**Learning:** Math.random() is predictable, which could allow attackers to guess access codes if enough samples are collected.
**Prevention:** Always use Node.js crypto module (e.g., crypto.randomInt()) for cryptographically secure pseudo-random number generation (CSPRNG) when creating sensitive identifiers.
