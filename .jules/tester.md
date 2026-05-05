
## 2024-05-05 - Missing Auth State Tests
**Gap:** The critical user authentication state management in `authStore.js` and the `SignUpForm` component had incomplete/missing test coverage.
**Learning:** These are critical business logic flows determining access and role assignments (Student vs Teacher). Errors in signup state validation or Supabase session handling can lead to broken access. Testing these properly with Zustand and Vitest guarantees reliability.
**Pattern:** Mocked `supabase` dependencies deeply in Zustand initialization and form component rendering, using Vitest's `vi.mock()` for robust simulation of both success and failure cases without hitting a real database.
