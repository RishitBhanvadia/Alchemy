## 2025-05-02 - Fix Logic Flaw in code generation
**Bug:** Use of `Math.random()` to generate meeting and classroom access codes is predictable and insecure.
**Root Cause:** `Math.random()` provides pseudo-random numbers that are not cryptographically secure, leading to predictable access codes.
**Learning:** Always use a cryptographically secure pseudo-random number generator (CSPRNG), such as Node's native `crypto.randomInt()`, when generating sensitive identifiers.
