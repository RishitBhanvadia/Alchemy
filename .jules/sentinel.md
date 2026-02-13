## 2024-05-23 - Top-Level Validation Side Effects
**Vulnerability:** Hardcoded secrets in `supabaseClient.js` were replaced with `process.env` and a top-level validation check.
**Learning:** Top-level validation (throwing errors at module scope) causes unit tests to fail immediately upon importing the module if environment variables are missing.
**Prevention:** Ensure a `client/.env.test` file exists with dummy values to satisfy validation checks during testing, avoiding the need for complex mocking of `process.env`.
