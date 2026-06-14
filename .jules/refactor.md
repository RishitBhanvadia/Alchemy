## 2024-06-14 - Replace Math.random with crypto.randomInt for sensitive codes
**Before:** Controllers (`meetingController.js`, `classroomController.js`) used `Math.floor(Math.random() * length)` to generate alphanumeric codes for meetings and classrooms.
**Issue:** `Math.random()` is not cryptographically secure and is predictable, which poses a security risk when generating access codes for sensitive resources.
**Learning:** For codebase-specific patterns involving token or code generation, always utilize the native Node.js `crypto` module (`crypto.randomInt(min, max)`) to ensure cryptographically secure pseudo-randomness, rather than relying on standard `Math.random()` math operations.
