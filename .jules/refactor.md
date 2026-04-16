## 2024-04-16 - Prevent Predictability Vulnerabilities in Security-Sensitive Identifiers
**Before:** Math.random().toString(36).substring(2, 8).toUpperCase()
**Issue:** Using Math.random() to generate access codes like class codes is insecure and predictable.
**Learning:** For identifiers such as meeting or classroom codes in a Node.js backend (or frontend mimicking backend logic), a cryptographically secure random number generator should be used instead of Math.random().
