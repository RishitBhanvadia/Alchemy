## 2024-05-24 - CWE-338 Predictable ID Generation Risk
**Vulnerability:** Weak PRNG `Math.random()` used to generate custom alphanumeric IDs (like meeting codes and class codes).
**Learning:** `Math.random()` is not cryptographically secure and the resulting random IDs can be predicted. In controllers dealing with joining secure meetings or classrooms, this could lead to predictability vulnerabilities (CWE-338).
**Prevention:** Always use `crypto.randomInt` from the built-in Node.js `crypto` module to generate random integers securely.
