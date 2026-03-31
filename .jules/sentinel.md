## 2024-05-18 - Prevent Predictable Secrets via Math.random()
**Vulnerability:** Predictable random string generation for classroom codes using `Math.random().toString(36)`.
**Learning:** `Math.random()` does not provide cryptographically secure random numbers. Using it to generate sensitive IDs like classroom codes allows attackers to potentially predict or brute-force access codes.
**Prevention:** Always use `window.crypto.getRandomValues()` with a typed array mapped via modulo to an explicit character set when generating client-side secure random strings.
