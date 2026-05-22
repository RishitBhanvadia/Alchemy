
## 2024-05-22 - Predictable Code Generation

**Vulnerability:** Found `Math.random()` generating codes for `classrooms` and `meetings`.
**Learning:** `Math.random()` provides weak entropy for predictable strings and shouldn't be used for identifiers giving system access.
**Prevention:** Use `crypto.randomInt` (server) and mapped `window.crypto.getRandomValues` (client).

## 2024-05-22 - Code Generation Entropy Bias

**Vulnerability:** When replacing insecure `Math.random().toString(36)` logic with CSRNG (`window.crypto.getRandomValues`) on the frontend, mapping raw 32-bit values to a base36 string and using substring truncated values incorrectly.
**Learning:** `.toString(36).substring()` on random values causes length inconsistencies (generating strings shorter than 6 characters about 1.4% of the time).
**Prevention:** Always map random bytes to a predefined character array to avoid length inconsistencies.
