## 2026-06-05 - authStore.js tests added
**Gap:** The critical authentication state management in `client/src/store/authStore.js` lacked unit test coverage (only 3.57% statement coverage), posing a risk for state-related auth bugs.
**Learning:** Testing Zustand stores that interact with Supabase requires thorough mocking of both the store itself (via Zustand's `setState`) and the Supabase client (auth and from methods) to ensure state transitions work correctly.
**Pattern:** Mocking Zustand state initialization using `vi.mock()` for external dependencies while manually managing the store state through `store.setState` and `store.getState` for robust testing.
