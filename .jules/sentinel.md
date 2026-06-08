## 2026-06-08 - Replace Math.random with secure crypto.randomInt
**Vulnerability:** Weak random number generation for security purposes (Math.random() used to generate tokens/codes in classroomController.js and meetingController.js).
**Learning:** The built-in `Math.random()` function is not cryptographically secure, and shouldn't be used to generate tokens, codes, passwords, or encryption keys.
**Prevention:** Always use the native Node.js `crypto` module (e.g., `crypto.randomInt()`) to ensure cryptographically secure pseudo-randomness for sensitive values.
