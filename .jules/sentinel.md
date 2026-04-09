## 2024-11-20 - Replace Insecure Math.random() with crypto.randomInt()
**Vulnerability:** Insecure ID generation using `Math.random()`.
**Learning:** `Math.random()` is not cryptographically secure, which allows generating predictable IDs. It can be exploited in security-sensitive ID generations like class codes.
**Prevention:** Use `crypto.randomInt()` from the built-in Node.js `crypto` module instead for any unique string/ID generation.
