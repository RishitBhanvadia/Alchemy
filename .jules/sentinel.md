## 2025-03-02 - Replace Math.random with crypto.randomInt for secure code generation
**Vulnerability:** Predictable code generation using Math.random() for sensitive links like meeting codes and class codes.
**Learning:** Math.random() is not cryptographically secure, allowing attackers to potentially predict upcoming meeting/class codes and gain unauthorized access.
**Prevention:** Always use the built-in `crypto` module (e.g., `crypto.randomInt` or `crypto.randomBytes`) for generating access tokens, session IDs, and other sensitive randomly generated values.
