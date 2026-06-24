## 2025-02-19 - Replace weak Math.random() with crypto.randomInt()
**Vulnerability:** Found usage of Math.random() to generate meeting and classroom codes, which is cryptographically weak and predictable.
**Learning:** Using predictable random values for security tokens/codes can lead to predictability attacks. Node's crypto library is a better alternative.
**Prevention:** Always use cryptographically secure random number generators (e.g. crypto.randomInt() or crypto.randomBytes()) for generating sensitive codes or tokens.
