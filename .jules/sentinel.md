## 2024-06-27 - Remove localhost CORS origins in production
**Vulnerability:** Hardcoded CORS allowed origins included localhost domains in production without environment checking. This could potentially allow Cross-Origin Resource Sharing bypass if an attacker could run malicious code on localhost or spoof localhost requests.
**Learning:** Always use environment conditional checks (`process.env.NODE_ENV !== 'production'`) or configuration values from secure environments (like `process.env.FRONTEND_URL`) when defining CORS allowed origins to prevent unauthorized domains, especially localhost, from accessing production APIs.
**Prevention:** Conditionally populate the `allowedOrigins` array so that localhost and 127.0.0.1 addresses are only allowed when `NODE_ENV` is not 'production'.
