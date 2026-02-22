## 2026-02-18 - [Fix DoS Vulnerability in body-parser]
**Vulnerability:** The `body-parser` middleware was configured with a `limit: "50mb"` for `urlencoded` data, which is excessively large and allows attackers to cause Denial of Service (DoS) by exhausting server memory or CPU.
**Learning:** This likely existed because developers copied a config snippet intended for file uploads (which should use `multipart/form-data`) without realizing `urlencoded` is inefficient for large payloads.
**Prevention:** Always set strict limits on request body sizes (e.g., `100kb` for JSON/UrlEncoded) and use specific middleware (like `multer`) for file uploads. Implement global error handling to catch `413 Payload Too Large` errors gracefully.

## 2026-02-22 - [Fix CI Failures in Client Tests]
**Vulnerability:** Not a vulnerability, but a CI stability issue. `vitest` was picking up Playwright tests (`tests/`) causing `test.describe` errors. `jsdom` (v28) interacting with Node 18 caused `ERR_REQUIRE_ESM` due to `html-encoding-sniffer` and `jsdom` ESM constraints.
**Learning:** Vitest by default includes all test-like files. Explicit exclusion in `vitest.config.js` is critical in monorepos or projects with mixed test types. JSDOM versions > 22 are often ESM-only or have ESM deps that break in some CJS environments.
**Prevention:** Configure test runners to explicitly include/exclude paths. Pin `jsdom` to `~22.1.0` if using CJS + Node 18. Use `vi.hoisted` for variables used in `vi.mock` factories to avoid ReferenceErrors.
