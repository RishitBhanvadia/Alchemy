## 2024-03-26 - Centralize Logging with custom Logger
**Before:** Scattered `console.error` and `console.warn` statements throughout components, stores, and utilities.
**Issue:** Raw console statements violate the ESLint `no-console` rule, cause noise in production builds, and lack consistent formatting (timestamps, severity levels).
**Learning:** Using a centralized `log` utility (like `client/src/utils/logger.js`) ensures structured logging across environments (e.g., stripping logs in PROD) and resolves strict linting rules, resulting in a cleaner and more maintainable codebase.
