## 2024-03-30 - Test Authentication Store (authStore.js)
**Gap:** The critical `authStore.js` logic was significantly lacking unit tests (initial coverage: 15% Statements, 0% Branches). Authentication flows and session handling were completely untested.
**Learning:** Auth states are fundamental to security and UX. Missing coverage in these stores leaves session management, user role assignments, and edge cases like auto-profile generation unverified, potentially locking out valid users or keeping ghost sessions.
**Pattern:** Mock Supabase client deeply (e.g., `getSession`, `onAuthStateChange`, `from().select().eq().single()`), and use Zustand's `getState()` method to interact with actions and evaluate the state after asynchronous updates.
