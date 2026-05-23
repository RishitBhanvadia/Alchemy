## 2024-05-23 - Predictable join codes via Math.random()
**Vulnerability:** The application was using the predictable `Math.random()` function to generate 6-character alphanumeric codes for joining classrooms and Zoom/Google Meet sessions, which is vulnerable to guessing attacks.
**Learning:** `Math.random()` generates pseudorandom numbers that can be predicted if the internal state is known. Join codes are a form of authorization token and must be generated securely.
**Prevention:** Always use Cryptographically Secure Random Number Generators (CSRNG). In Node.js, use `crypto.randomInt()`, and in the browser, use `window.crypto.getRandomValues()` mapped carefully to a character set array to avoid modulo bias.
