2025-02-14 - Fix Unapplied Security Mechanisms
**Vulnerability:** Defined security rate limiters (`authLimiter`, `aiLimiter`) were not actually applied to the routes they were intended to protect.
**Learning:** Security mechanisms that are instantiated but not wired into the application flow provide no protection. It is crucial to verify that middleware is actually mounted on the relevant express routes.
**Prevention:** Always verify security middleware application during testing by triggering the limits, instead of assuming the presence of the middleware definition implies protection.
