## 2024-05-24 - Overly Permissive CORS Configuration
**Vulnerability:** The Express server used `cors()` middleware without any options, resulting in an overly permissive configuration that allowed cross-origin requests from any origin (`*`).
**Learning:** Permissive CORS policies can allow malicious websites to interact with the backend API on behalf of authenticated users, violating the Same-Origin Policy.
**Prevention:** Always restrict the allowed CORS origins to trusted domains by using a dynamically generated list or configuring an `ALLOWED_ORIGINS` environment variable that the server validates against.
