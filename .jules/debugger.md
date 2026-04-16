## 2024-04-16 - Use crypto.randomInt for generating secure access codes
**Bug:** Using `Math.random()` to generate classroom and meeting codes.
**Root Cause:** `Math.random()` is not a cryptographically secure pseudo-random number generator (CSPRNG), making codes potentially predictable, posing a security risk.
**Learning:** For access codes, tokens, or any security-sensitive identifiers in a Node.js backend, always use a cryptographically secure generator like `crypto.randomInt` from the native `crypto` module.
