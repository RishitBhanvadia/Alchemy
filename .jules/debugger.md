## 2026-05-31 - Fix authentication bypass/IDOR in Google OAuth redirect
**Bug:** Any user could initiate Google OAuth on behalf of any teacher by passing an unauthenticated `teacherId` query parameter to `/api/meetings/google/auth`.
**Root Cause:** The `GET /api/meetings/google/auth` route lacked authentication and authorisation middleware and mapped tokens directly to the provided `teacherId` query parameter.
**Learning:** Always validate user identity and authorization context on the server side using session/tokens rather than relying on unauthenticated client-provided IDs. Avoid state-changing operations via unauthenticated GET redirects when associating credentials.
