## 2026-05-29 - Insecure Random Number Generation for Access Codes
**Vulnerability:** Weak random number generation (`Math.random`) was used to generate classroom and meeting codes, making them predictable and susceptible to brute-force attacks.
**Learning:** Standard PRNGs are not cryptographically secure and should not be used for generating sensitive tokens or access codes, even short ones.
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG), such as Node.js's `crypto.randomBytes`, when generating access codes or tokens.
