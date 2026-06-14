## 2025-02-14 - [High] Fix insecure random number generation
**Vulnerability:** Usage of Math.random() for sensitive code generation.
**Learning:** Math.random() is predictable and shouldn't be used where unpredictable output is required for security or functional reasons like meeting codes.
**Prevention:** Use crypto.randomInt() or similar cryptographically secure functions.
