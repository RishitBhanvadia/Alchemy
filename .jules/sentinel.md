## 2026-03-15 - Insecure PRNG replaced with CSPRNG

**Vulnerability:** Weak random number generation (`Math.random()`) used for generating 6-character classroom access codes.
**Learning:** `Math.random()` does not provide cryptographically secure random numbers, potentially making class codes guessable. Additionally, when converting bytes to an alphanumeric string using `window.crypto.getRandomValues()`, naive conversions like `byte.toString(36)[0]` introduce severe bias. A proper mapping (e.g., modulo mapping against an array of alphanumeric characters) is required to maintain entropy.
**Prevention:** Use `window.crypto.getRandomValues()` for generating security-sensitive random values and apply appropriate mathematical mapping (e.g., `chars[byte % chars.length]`) to ensure uniform distribution of the characters.
