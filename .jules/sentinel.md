## 2024-03-24 - Hardcoded Secrets in Migration Scripts
**Vulnerability:** A hardcoded Supabase service role key (full administrative access) was found in `server/scripts/migrate.js`.
**Learning:** Migration scripts are often treated as "one-off" or "local only" tools and are prone to containing hardcoded secrets because they are not part of the main application flow.
**Prevention:** Always use environment variables for sensitive credentials in all scripts, even "one-off" ones. Review all scripts before committing them.
