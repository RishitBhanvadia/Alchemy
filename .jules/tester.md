## 2024-05-02 - Add missing authStore tests
**Gap:** Authentication state management (authStore) was untested, leaving a critical gap in verifying session handling, initialisation, and logout flows.
**Learning:** Testing Zustand stores that interact heavily with external services like Supabase requires careful mocking of both the store implementation and the service module to ensure deterministic results.
**Pattern:** Mock the external dependency completely, set up initial store states before each test using `.setState()`, and then await store actions like `.init()` or `.logout()` before verifying the updated state.
