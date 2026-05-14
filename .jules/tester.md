## 2024-05-14 - Critical gap: `authStore` completely untested
**Gap:** The critical user authentication flow state manager (`authStore.js`) which controls application access and session management was completely untested (1.85% line coverage).
**Learning:** Testing dynamic store resets using `await import` on logout required complex mocking to bypass circular dependencies gracefully and ensure proper teardown.
**Pattern:** To effectively mock dynamically imported default exports in Vitest, use `vi.mock('path', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }))` and provide a robust mock for `supabase.auth.onAuthStateChange` to intercept and test subscription callbacks directly.
