## 2025-04-16 - Auth Store Testing Mock Pattern
**Gap:** Authentication state management (Zustand store) lacked unit coverage due to complex cross-store dependencies on logout.
**Learning:** Zustand stores that dynamically import other stores (e.g., `authStore` importing `labStore` for resets) cause circular dependency crashes in Vitest if not properly mocked.
**Pattern:** Mock the dynamic store dependencies explicitly at the top of the test file using `vi.mock('../storeName', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }))` to ensure clean, isolated store testing.
