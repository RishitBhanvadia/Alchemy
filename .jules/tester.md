## 2024-05-28 - Missing Auth Middleware Tests
**Gap:** Authentication middleware (requireAuth, requireRole) is currently untested.
**Learning:** This is critical because routes depend on these middlewares for security, and changes to auth implementation without tests could expose secure endpoints.
**Pattern:** Create a simple test suite using express/supertest with mock routes that apply the middlewares, testing success and failure cases with various mock JWT payloads.
