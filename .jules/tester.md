## 2024-06-15 - AuthStore Test Gap
**Gap:** Authentication flow in `authStore.js` is virtually untested (3.57% statement coverage).
**Learning:** Auth flow is critical for the app. The Supabase mocks needed to be heavily mocked, including method chaining.
**Pattern:** Deeply mock Supabase client methods and corresponding chain data structures (`from().select().eq().single()`) to accurately test the auth store's session and profile fetching behavior.
