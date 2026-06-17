## 2025-02-20 - AuthStore missing tests
**Gap:** The critical `authStore.js` (responsible for session initialization, user/profile state management, authentication event handling, and logout functionality) is completely untested (3.57% statement coverage).
**Learning:** `authStore.js` is central to application security and data integrity. Without tests, regressions in authentication state could break app-wide authorization. Mocking `supabaseClient` and its deeply nested responses (like `.from().select().eq().single()`) is essential for testing.
**Pattern:** Create a dedicated test file using Vitest, utilizing `vi.mock` to stub the Supabase client methods and simulate various auth states (logged in, logged out, profile fetch failure/fallback).
