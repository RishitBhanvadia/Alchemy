## 2024-05-03 - Testing Zustand Stores with Side Effects
**Gap:** The `authStore.js` logic completely lacked testing, including initialization, event listeners, and dynamic imports.
**Learning:** Vitest handles dynamic imports differently in isolated environments, and mocking circular dependencies across stores requires explicit `vi.mock()` for each imported store module.
**Pattern:** When testing Zustand stores that interact with external services (like Supabase auth), mock the external dependencies completely, and for dynamic imports inside methods (like logout), use `vi.mock()` to define the default export with a mocked `getState().reset()` function before testing the method.
