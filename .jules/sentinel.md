## 2024-05-24 - Overly Permissive CORS Configuration
**Vulnerability:** The backend server implemented an overly permissive CORS configuration (`app.use(cors())`) allowing cross-origin requests from any domain, making it vulnerable to malicious sites fetching sensitive user data.
**Learning:** Default instantiations of `cors()` allow wildcard `*` origins, which violates the principle of least privilege, especially if API endpoints return sensitive data.
**Prevention:** Always restrict CORS policies by parsing an `ALLOWED_ORIGINS` environment variable and explicitly falling back to safe local development origins (e.g., `http://localhost:3000`, `http://localhost:5173`) if omitted.
