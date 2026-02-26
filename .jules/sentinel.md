## 2026-02-26 - [Server Error Handling]
**Vulnerability:** Default Express error handler exposed stack traces and technology details via HTML responses.
**Learning:** The server lacked a global error handler, relying on Express defaults which are insecure for production API responses.
**Prevention:** Always implement a global error handler middleware that sanitizes error messages and returns JSON, checking `NODE_ENV`.
