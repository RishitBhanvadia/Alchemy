## 2025-04-17 - Dynamic Imports in Store Testing
**Gap:** Testing Zustand stores that dynamically import other stores for cleanup on logout.
**Learning:** If a tested store dynamically imports other stores (e.g., `labStore`, `historyStore` during logout in `authStore.js`), vitest fails with initialization errors or circular dependency crashes if those nested dependencies are not properly mocked.
**Pattern:** Explicitly mock dependent store modules at the top of the test file using `vi.mock` (e.g., `vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }))`) to safely bypass nested store instantiations during unit tests.
