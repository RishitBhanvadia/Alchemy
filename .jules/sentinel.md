2024-06-01 - Fix Permissive CORS Regex
**Vulnerability:** The application allowed any origin ending with `.vercel.app` to make requests via CORS, enabling potential attacks from malicious actors spinning up their own Vercel apps.
**Learning:** Never use broad wildcard matching like `.endsWith()` for CORS origins, especially on platforms where subdomains are easily attainable.
**Prevention:** Always strictly define allowed CORS origins dynamically via environment variables (`FRONTEND_URL`), requiring exact matching.
