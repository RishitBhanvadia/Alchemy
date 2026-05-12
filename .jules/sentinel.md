## 2024-05-11 - Use Cryptographically Secure Random Number Generation for Security Tokens
**Vulnerability:** Found `Math.random()` being used to generate random codes such as access codes or meeting IDs in `server/controllers/meetingController.js`, `server/controllers/classroomController.js`, and `client/src/store/classroomStore.js`.
**Learning:** `Math.random()` is not a cryptographically secure pseudo-random number generator (CSPRNG) and produces predictable outputs. This can lead to brute-force vulnerabilities or predictability of access tokens or classroom IDs.
**Prevention:** Always use `crypto.randomInt()`, `crypto.randomBytes()`, or the Web Crypto API (`window.crypto.getRandomValues()`) when generating random values for security purposes.
