## 2025-02-23 - Fix CORS Allows Undefined Origins
**Vulnerability:** The CORS configuration allowed requests without an origin (`!origin`) to bypass the allowed origins check.
**Learning:** Returning `true` for `!origin` allows any API client or tool that omits the origin header (like `curl` or mobile apps) to completely bypass CORS protections, which opens up unauthenticated endpoints to abuse.
**Prevention:** Always ensure that `origin` is defined and explicitly checks against a strict whitelist of allowed origins or patterns before granting access.
