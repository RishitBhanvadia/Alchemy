## 2024-05-24 - Remove Hardcoded Supabase Credentials
**Vulnerability:** Hardcoded Supabase URL and Service Key in `server/scripts/migrate.js`.
**Learning:** These credentials provide administrative access to the database and can be publicly exposed if committed to version control, posing a severe security risk.
**Prevention:** Always use environment variables (`dotenv` or native environment configurations) to handle sensitive credentials and keys, and ensure they are loaded dynamically during execution rather than hardcoded in the source code.
