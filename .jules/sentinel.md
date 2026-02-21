## 2025-02-17 - Hardcoded Supabase Service Key
**Vulnerability:** A hardcoded `SERVICE_KEY` was found in `server/scripts/migrate.js`, granting full administrative access to the Supabase database.
**Learning:** Development scripts often contain sensitive secrets for convenience, but these can easily be committed to version control, exposing critical infrastructure.
**Prevention:** Use environment variables for all secrets, even in local scripts. Implement pre-commit hooks (e.g., `git-secrets`) to scan for high-entropy strings or known key patterns before committing.
