## 2024-05-24 - Test coverage missing for auth flow
**Gap:** Authentication state management logic via `useAuthStore` was almost completely untested, leading to potential unseen regressions during login/logout and session persistence.
**Learning:** Adding comprehensive testing for the auth state management allows us to ensure core authentication functionality (session initialization, profile fetching, logout redirection, auto sign-in) is robust against changes. Auth flows are a critical application dependency.
**Pattern:** Creating unit tests to verify `useAuthStore` behavior covering init state, fetch success/failure, logout behavior, `onAuthStateChange` events, and fallback logic using mocked supabase functions and zustand states.
