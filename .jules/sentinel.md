## 2024-05-18 - Math.random Security Implication for Class and Meeting Codes
**Vulnerability:** The application was using the `Math.random()` function to generate random alphanumeric codes for joining meetings (`server/controllers/meetingController.js`) and classrooms (`server/controllers/classroomController.js`).
**Learning:** `Math.random()` is not a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). The generated sequences can be theoretically predicted by observing sufficient outputs, potentially allowing an attacker to guess future meeting or classroom codes and gain unauthorized access to live sessions or private class groups.
**Prevention:** For any security-sensitive random value generation (like tokens, passwords, IDs, or join codes), always use a CSPRNG such as the native Node.js `crypto.randomInt` or `crypto.randomBytes` instead of `Math.random`.
## 2024-05-18 - Always Add Security Comments
**Vulnerability:** A security fix was deployed to replace `Math.random` with `crypto.randomInt`, but the fix was missing explicit inline comments explaining the rationale.
**Learning:** Even if the fix itself is correct and technically sound, security best practices mandate leaving a trace/breadcrumb for future developers. This prevents someone from inadvertently reverting the fix because they don't understand the security context.
**Prevention:** Always add a brief, explicit comment (e.g., `// Security: ...`) alongside any security-oriented code changes explaining *why* the implementation must be done a certain way.
