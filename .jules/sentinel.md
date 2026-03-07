## 2025-02-12 - Fix Hardcoded Supabase Service Key in Migration Script
**Vulnerability:** A hardcoded Supabase URL and Supabase Service Key (JWT) were found in the `server/scripts/migrate.js` script.
**Learning:** Migration scripts or other utility scripts may sometimes have hardcoded credentials temporarily placed for convenience, but they should be properly integrated into the environment variable configuration.
**Prevention:** Always use environment variables (e.g., `process.env`) loaded via `dotenv` for API keys, service accounts, and other sensitive credentials, even in standalone scripts.
