## 2025-02-28 - Secure Meeting Code Generation
**Vulnerability:** Use of Math.random() to generate meeting codes is insecure as it relies on a predictable Pseudo-Random Number Generator (PRNG). This predictability could allow an attacker to guess meeting codes and join meetings unauthorized.
**Learning:** Security-sensitive random values such as tokens, identifiers, and codes must always be generated using a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG).
**Prevention:** Replaced Math.random() with crypto.randomInt(0, CHARS.length) from Node's built-in crypto module, which uses a CSPRNG.
