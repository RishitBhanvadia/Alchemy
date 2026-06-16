## 2024-06-16 - Auth Flow Coverage Improvements
**Gap:** The critical user authentication flows (login form, signup form, role selection, auth state management) were lacking test coverage, leaving the application vulnerable to auth-related regressions.
**Learning:** Auth state heavily depends on asynchronous Supabase calls and reactive state management (Zustand). Relying on mock chaining (e.g. `vi.fn(() => ({ single: mockSingle }))`) is crucial for simulating deeply nested DB client methods and Auth API responses properly.
**Pattern:** Deeply mocking `supabaseClient` and isolating component verification across success, failure, and validation edge cases provides robust coverage for authentication components without needing complex E2E setup for every scenario.
