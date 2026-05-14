## 2026-05-14 - Replace Math.random with cryptographically secure random number generator
**Vulnerability:** Uses insecure Math.random() for access codes.
**Learning:** Math.random() produces predictable outputs, which could allow attackers to guess access codes for classrooms or meetings.
**Prevention:** Use crypto modules like window.crypto.getRandomValues for frontend and crypto.randomInt or crypto.randomBytes for backend instead of Math.random().
