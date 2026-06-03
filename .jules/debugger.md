## 2024-06-03 - CSRF / Auth Bypass Vulnerability in Google OAuth
**Bug:** The googleAuthRedirect endpoint accepts teacherId via URL query parameters without authenticating the user, enabling an attacker to trick the server into associating their Google tokens with an arbitrary teacher.
**Root Cause:** The endpoint was designed as a browser redirect without requireAuth middleware, meaning the user identity could be trivially spoofed by modifying the teacherId param in the URL.
**Learning:** OAuth flows initiated on the server must securely bind the initial request to the authenticated user session (e.g., via req.user.id) rather than accepting user identifiers via untrusted query parameters.
