## 2024-05-01 - Initial Setup
**Learning:** Initial Sentinel setup.

## 2024-06-05 - Remove unsafe-eval from Content Security Policy
**Vulnerability:** The Content Security Policy in `server/server.js` contained the `'unsafe-eval'` directive in its `scriptSrc` array.
**Learning:** Permitting `'unsafe-eval'` significantly increases the risk of Cross-Site Scripting (XSS) attacks by allowing the execution of untrusted code via functions like `eval()` and `setTimeout()`.
**Prevention:** Always restrict `scriptSrc` to trusted sources (e.g., `'self'`) and avoid `'unsafe-eval'` and `'unsafe-inline'` where possible in Helmet CSP configurations.
