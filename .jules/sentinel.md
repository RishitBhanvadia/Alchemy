## 2025-02-18 - Fix Insecure Random Code Generation
**Vulnerability:** Use of insecure Math.random() for generating sensitive access codes in backend routes.
**Learning:** Math.random() generates predictable output which could allow brute forcing of joining classes or meetings.
**Prevention:** Always use the cryptographically secure Node crypto library (e.g. crypto.randomInt) to generate codes.
