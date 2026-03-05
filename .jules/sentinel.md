## 2024-03-05 - Remove Hardcoded Secrets
**Vulnerability:** A hardcoded Supabase Service Key was found in `server/scripts/migrate.js`.
**Learning:** Hardcoded secrets in scripts, even if intended for one-time use like migrations, present a significant risk of exposure through version control.
**Prevention:** Always use environment variables (`process.env.SUPABASE_SERVICE_KEY`) for sensitive credentials, even in local or temporary scripts, and manage them via `.env` files.
