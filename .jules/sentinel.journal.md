## 2025-03-02 - Overly Permissive CORS Configuration
**Vulnerability:** The server application uses `cors()` with default settings, which allows requests from all origins (`*`).
**Learning:** Default configurations for security middlewares like CORS often fail open and can lead to overly permissive policies, allowing any site to make cross-origin requests to the API.
**Prevention:** Always explicitly configure the `origin` array in `cors()` to restrict access to known, trusted front-end domains (e.g., localhost for dev, specific domains for production) rather than relying on the default wildcard.
