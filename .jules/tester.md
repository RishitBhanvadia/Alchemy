## 2024-04-21 - Added complete test suite for authStore
**Gap:** Authentication state management (authStore) had no test coverage (0%), leaving critical login/logout and session management flows vulnerable.
**Learning:** Zustand stores interacting with Supabase auth require complex mocking (like chaining `.from().select().eq().single()`) to properly test state updates, error handling, and fallback logic (like creating missing profiles).
**Pattern:** Mock Supabase using chained `vi.fn()` returns that maintain the exact structure expected by the client, allowing testing of edge cases like PGRST116 (Not Found) errors that trigger profile creation.
