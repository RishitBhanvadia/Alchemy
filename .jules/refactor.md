## 2026-05-11 - Secure Token Generation using CSPRNG

**Before:** Multiple controllers (`meetingController`, `classroomController`) independently implemented token generation using `Math.random()` to generate alphanumeric codes (e.g. `Math.floor(Math.random() * CHARS.length)`).

**Issue:** `Math.random()` is not cryptographically secure and produces predictable outputs. Using it for sensitive tokens like access codes introduces vulnerabilities (e.g., brute-force guessing or collision attacks). Additionally, having duplicated code for token generation violates the DRY principle and increases maintenance overhead.

**Learning:** Replaced insecure `Math.random()` usage by extracting a centralized `generateAlphanumericCode` utility leveraging the Node.js `crypto` module (`crypto.randomInt()`). This ensures tokens are generated via a CSPRNG, mitigating security risks while promoting code reusability across controllers.
