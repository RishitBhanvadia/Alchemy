## 2026-05-26 - Fix Insecure Math.random Code Generation
**Vulnerability:** Insecure randomness in alphanumeric access code generation.
**Learning:** Using `Math.random()` for generation of sensitive codes causes modulo bias and predictability.
**Prevention:** Use `crypto.randomInt(0, chars.length)` to guarantee a non-predictable distribution.
