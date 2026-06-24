## 2024-06-23 - CRITICAL CSRF / Unauthenticated OAuth Initiation
**Vulnerability:** The Google OAuth authentication endpoint (`/api/meetings/google/auth`) did not require authentication and did not use cryptographically secure state parameters. This allowed unauthenticated attackers to initiate OAuth flows with arbitrary state values, creating a CSRF vector.
**Learning:** OAuth flows must be protected just like any other API action. If the initiation endpoint is unauthenticated, an attacker can trick users into logging into an attacker-controlled account, or tamper with the state parameters (such as `teacherId`).
**Prevention:**
1. Always require authentication (`requireAuth`) and the correct role (`requireRole`) for endpoints that initiate OAuth flows.
2. Sign the `state` parameter using an HMAC mechanism (e.g., `crypto.createHmac`) using a robust secret (like the OAuth Client Secret) to prevent tampering and ensure the callback originated from a trusted initiation.
3. Instead of browser redirects for initiation, return the OAuth URL as an authenticated JSON response, allowing the authenticated client to redirect.
