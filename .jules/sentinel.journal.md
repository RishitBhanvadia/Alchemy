## 2024-05-18 - Hardcoded Service Key in Scripts
**Vulnerability:** The migration script `server/scripts/migrate.js` contained a hardcoded Supabase service role key, which can bypass Row Level Security entirely and grants admin access to the database.
**Learning:** Utility scripts, even if only meant for internal use or migration, must never contain hardcoded credentials. They often get committed to version control and exposed.
**Prevention:** Always use environment variables (e.g., via `dotenv`) to load sensitive credentials like `SUPABASE_SERVICE_ROLE_KEY` in utility scripts.
