# Sentinel's Journal

## 2025-02-18 - Hardcoded Service Role Key
**Vulnerability:** A `service_role` key (bypasses RLS) was hardcoded in `server/scripts/migrate.js`.
**Learning:** Utility scripts (migrations, seeds) are often overlooked during security reviews but can contain high-privilege credentials intended for "local use only".
**Prevention:** Enforce environment variable usage even for local scripts. Use `.env.example` to document required keys. Scan scripts directory during CI/CD.
