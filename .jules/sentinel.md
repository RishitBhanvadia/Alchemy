## 2026-03-01 - Fix Sensitive Data Exposure in Request Logging
**Vulnerability:** The Express request logger in `server/server.js` was directly logging `req.url`, which includes all query parameters. This could expose sensitive data (like API keys, session tokens, or PII) passed via GET requests to the server logs.
**Learning:** Default request logging configurations often leak sensitive information because they capture the full raw URL without sanitisation.
**Prevention:** Always sanitise URLs before logging by stripping query parameters (e.g., using `req.url.split("?")[0]` or `req.path`), and ensure sensitive data is passed via headers or the request body instead of the URL where possible.
