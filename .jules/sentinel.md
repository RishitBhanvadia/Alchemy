## 2024-04-29 - Use CSPRNG for Security-Sensitive Values
**Vulnerability:** Insecure generation of classroom codes and meeting codes using `Math.random()`.
**Learning:** `Math.random()` is not cryptographically secure, which allows attackers to predict generated tokens, potentially enabling unauthorized access to classrooms and meetings.
**Prevention:** For generating security-sensitive codes like meeting links or classroom codes, always use cryptographically secure pseudo-random number generators (CSPRNG) such as Node.js `crypto.randomInt()` or `crypto.randomBytes()`.
