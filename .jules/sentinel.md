## 2024-05-20 - Hardcoded API Key in Migration Script
**Vulnerability:** A hardcoded Supabase service role key (JWT) and URL were found in `server/run_migration.js`.
**Learning:** Developers may leave sensitive keys in one-off scripts (like database migrations) for convenience during local development, forgetting to remove them before committing.
**Prevention:** Use environment variables for all sensitive configuration in scripts, providing safe placeholders as fallbacks for CI/testing environments if necessary. Use pre-commit hooks to scan for secrets.
