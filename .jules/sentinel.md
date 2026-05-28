## 2024-05-28 - Insecure Random Number Generation
**Vulnerability:** Found `Math.random()` being used to generate access codes in `meetingController.js` and `classroomController.js`. `Math.random()` is not cryptographically secure, which means an attacker might be able to predict the random values and generate valid access codes.
**Learning:** For any code or string meant for security or access control purposes, generating predictable strings is a vulnerability. In Node.js, `Math.random()` shouldn't be used for generating sensitive alphanumeric keys.
**Prevention:** Always use the built-in `crypto` module, specifically `crypto.randomInt(min, max)` to ensure values generated from predefined character sets are cryptographically secure and prevent predictability and modulo bias.
