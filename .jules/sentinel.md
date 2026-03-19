## 2026-03-19 - Weak Randomness in Join Codes
**Vulnerability:** Weak PRNG (`Math.random().toString(36)`) used to generate class join codes.
**Learning:** Naive Math.random() is predictable and string mapping like `toString(36)` introduces heavy bias, reducing entropy further. This can allow attackers to predict join codes or guess them easily.
**Prevention:** Use cryptographically secure pseudorandom number generators (CSPRNG) like `window.crypto.getRandomValues()` along with modulo arithmetic against a defined character array to securely generate alphanumeric codes.
