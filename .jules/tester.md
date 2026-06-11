## 2024-06-11 - Testing apiClient setup with axios and vitest
**Gap:** `apiClient.js` was exporting an instantiated instance of `axios.create()` which was executing interceptor setup on import, making it difficult to inject mocks dynamically without module side-effects.
**Learning:** Testing file-level instantiations (like `axios.create()`) requires mocking the dependencies *before* importing the module under test, using `vi.resetModules()` inside the test block, and using dynamic imports (`await import(...)`) to trigger the module instantiation within the test boundary.
**Pattern:**
```javascript
// Setup mocks FIRST
vi.mock('axios', () => ({ default: { create: vi.fn() } }));

// Inside test block:
vi.resetModules();
const apiClient = (await import('../apiClient')).default;
// Mocks apply properly to the newly imported module instance
```
