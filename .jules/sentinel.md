## 2026-05-13 - Replace insecure Math.random() with CSPRNG for access codes
**Vulnerability:** The application used `Math.random()` to generate access codes for meetings and classrooms. `Math.random()` is not cryptographically secure and can lead to predictable codes, increasing the risk of unauthorized access or brute-force attacks.
**Learning:** Security-sensitive tokens and access codes should never be generated using weak pseudorandom number generators like `Math.random()`.
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG) such as `crypto.randomInt()` from the Node.js `crypto` module (for the backend) or `window.crypto.getRandomValues()` (for the frontend).
