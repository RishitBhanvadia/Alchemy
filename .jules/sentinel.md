## 2025-02-27 - Replace insecure random generator with node crypto

**Vulnerability:**
Math.random() was being used to generate random codes in `generateClassCode` which does not provide cryptographically secure random numbers, potentially making class codes predictable or guessable.

**Learning:**
Always use cryptographically secure PRNG like Node's built in `crypto.randomInt` when generating tokens, passwords or codes.

**Prevention:**
Enforce usage of `crypto` module methods or robust alternatives like `uuid` or `nanoid` in environments requiring secure randomness.
