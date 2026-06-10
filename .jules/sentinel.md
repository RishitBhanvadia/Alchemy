## 2025-02-18 - Insecure Randomness in Code Generation
**Vulnerability:** Weak randomness using Math.random() for generating sensitive codes (class codes, meeting codes).
**Learning:** Found multiple instances where Math.random() was used for generating short alphanumeric access codes, making them potentially predictable.
**Prevention:** Use Node's native crypto module (crypto.randomInt()) for generating cryptographically secure pseudo-random values.
