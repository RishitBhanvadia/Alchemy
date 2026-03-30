## 2024-05-18 - Replace insecure Math.random() with crypto modules for generating security-sensitive codes
**Before:** `Math.random()` was used to generate classroom and meeting codes, which is predictable and cryptographically insecure.
**Issue:** Security-sensitive values like join codes should never be generated using `Math.random()`.
**Learning:** Replaced insecure implementations with centralized utilities using `crypto.randomInt` on the backend and `window.crypto.getRandomValues` on the frontend for secure, unpredictable code generation.
