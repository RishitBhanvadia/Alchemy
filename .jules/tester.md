## 2025-04-13 - Auth Store Tests
**Gap:** `authStore.js` had almost no test coverage for critical initialization and authentication state logic (login/logout/refreshProfile), preventing us from ensuring safe authorization flows.
**Learning:** Testing auth state logic with dynamically imported state (reset functions for other stores) requires mocking imports independently during the `vitest` setup.
**Pattern:** Mock dynamic store imports globally in tests while verifying primary auth flow using `vi.mock('../[Store]', ...)` pattern to ensure safe store cross-communication resets during logout.