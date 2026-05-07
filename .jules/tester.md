
## 2024-05-07 - Mocking Supabase Client chaining in Zustand stores
**Gap:** Authentication state management logic in `authStore.js` (like `init`, `refreshProfile`, and `logout`) lacked test coverage.
**Learning:** Testing functions that chain multiple Supabase methods (e.g. `supabase.from('profiles').select('*').eq('id', user.id).single()`) requires mocking the return value of `.from()` rather than the individual methods in order to support method chaining. Attempting to mock `.from().single()` directly will fail as it breaks the chain and `.from()` will return undefined for `single()`.
**Pattern:** When mocking Supabase queries in Jest/Vitest, mock `supabase.from.mockReturnValue` to return an object where each chained method (like `select`, `eq`) is a `vi.fn().mockReturnThis()`, and the final resolving method (like `single` or `then`) is a `vi.fn().mockResolvedValue({ data: ..., error: null })`.
