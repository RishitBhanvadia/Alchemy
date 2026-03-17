## 2024-03-17 - Hoisting Vitest Mocks for Zustand Stores
**Gap:** The authentication state management logic (`authStore.js`) lacked unit tests, specifically for initialization and session handling.
**Learning:** When testing Zustand stores that import initialized Supabase clients, mocking Supabase methods like `.from().select().eq().single()` requires complex object returning chains. Furthermore, if you use a `vi.mock` factory, variables referenced inside the factory but defined outside must be hoisted using `vi.hoisted()` to prevent `ReferenceError: Cannot access '...' before initialization` errors because Vitest hoists `vi.mock` calls to the top of the file before variable declarations.
**Pattern:**
```javascript
import { vi } from 'vitest';

const { mockFn } = vi.hoisted(() => ({ mockFn: vi.fn() }));

vi.mock('../../supabaseClient', () => ({
  supabase: { method: mockFn }
}));
```
