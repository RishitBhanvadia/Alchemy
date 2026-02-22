## 2026-02-18 - [Fix DoS Vulnerability in body-parser]
**Vulnerability:** The `body-parser` middleware was configured with a `limit: "50mb"` for `urlencoded` data, which is excessively large and allows attackers to cause Denial of Service (DoS) by exhausting server memory or CPU.
**Learning:** This likely existed because developers copied a config snippet intended for file uploads (which should use `multipart/form-data`) without realizing `urlencoded` is inefficient for large payloads.
**Prevention:** Always set strict limits on request body sizes (e.g., `100kb` for JSON/UrlEncoded) and use specific middleware (like `multer`) for file uploads. Implement global error handling to catch `413 Payload Too Large` errors gracefully.
