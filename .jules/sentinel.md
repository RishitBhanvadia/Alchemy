## 2024-05-24 - [Hardcoded Credentials in Utility Script]
**Vulnerability:** Hardcoded Supabase URL and Service Role Key in `server/scripts/migrate.js`.
**Learning:** Utility scripts (like migrations) are often written quickly with hardcoded secrets, bypassing the security measures implemented in the main application flow. Even if meant for "one-off" local use, they become critical vulnerabilities once committed to source control.
**Prevention:** Always use environment variables (`process.env`) and `dotenv` for credentials in scripts, just as in production code. Never hardcode secrets in source files, regardless of the file's intended environment or lifecycle.
