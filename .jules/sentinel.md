## 2024-03-08 - Restrict CORS Configuration
**Vulnerability:** Permissive CORS configuration using `app.use(cors())` which allows requests from any origin, posing a security risk.
**Learning:** The application was intended to use the `ALLOWED_ORIGINS` environment variable to restrict access, but it was missing from the configuration. This exposes the API to unauthorized domains.
**Prevention:** Always configure `cors()` with an explicit `origin` function or array using allowed domains defined in environment variables (e.g., `ALLOWED_ORIGINS`), and ensure proper validation logic is present.
