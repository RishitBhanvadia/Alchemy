## 2024-05-24 - Hardcoded Secret in Migration Script
**Vulnerability:** Found a hardcoded Supabase Service Role Key (`SERVICE_KEY`) and `SUPABASE_URL` in `server/scripts/migrate.js`.
**Learning:** Hardcoded credentials in source code can be easily exposed if the repository is made public or accessed by unauthorized individuals. Even in utility scripts, secrets should be managed via environment variables.
**Prevention:** Use `process.env` to access secrets and configuration values. Store the actual values in `.env` files that are ignored by version control (e.g., added to `.gitignore`).
