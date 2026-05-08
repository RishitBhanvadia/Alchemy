## 2024-05-24 - Fix Overly Permissive CORS and Weak RNG

**Vulnerability:**
1. The CORS configuration in `server/server.js` was overly permissive, allowing any application deployed on Vercel (`.vercel.app`) to make authenticated cross-origin requests to the API. This is a severe Cross-Origin Resource Sharing vulnerability.
2. `Math.random()` was being used in `server/controllers/classroomController.js` and `server/controllers/meetingController.js` to generate sensitive class and meeting joining codes. `Math.random()` is not cryptographically secure and the resulting codes could be predictable.

**Learning:**
1. The wildcard sub-domain allowance (`*.vercel.app`) was likely added for convenience during development/staging, but in production, this breaks CORS isolation boundaries.
2. Generating authentication tokens, joining codes, and other secrets using non-cryptographically secure random number generators poses a security risk because attackers can potentially predict the values and gain unauthorized access to classrooms or meetings.

**Prevention:**
1. Avoid wildcard subdomain checks like `origin.endsWith()` in CORS configurations. Explicitly list allowed frontend origins using environment variables (e.g. `FRONTEND_URL`), which is already implemented for other allowed origins.
2. Always use a cryptographically secure pseudo-random number generator (CSPRNG), such as Node.js's native `crypto.randomInt()`, when generating sensitive codes, tokens, or identifiers.
