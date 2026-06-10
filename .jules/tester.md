## 2025-06-10 - AuthStore tests missing
**Gap:** Authentication state management (useAuthStore) is entirely untested.
**Learning:** This is a critical gap. Without tests for auth flows, session management could fail silently, breaking the fundamental entry point to the application and all protected routes.
**Pattern:** Write a unit test for the auth store focusing on init, logout, and handling session events.
