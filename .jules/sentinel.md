## 2026-04-28 - Insecure Randomness for Access Codes
**Vulnerability:** Used Math.random() to generate classroom and meeting codes, which is predictable and not cryptographically secure.
**Learning:** Always use CSPRNG (e.g. crypto.randomInt in Node.js, window.crypto.getRandomValues in browser) for security-sensitive tokens.
**Prevention:** Added crypto module in server and window.crypto in client.
