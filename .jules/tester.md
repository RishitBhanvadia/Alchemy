# Tester Learnings
## 2026-03-07 - Vitest Mocking of External Functions
**Gap:** The tests for `Login` component were failing due to a ReferenceError caused by Vitest's `vi.mock` hoisting.
**Learning:** When mocking modules in Vitest that reference externally defined mock functions, direct references are hoisted and evaluate to undefined before initialization.
**Pattern:** Wrap the mock function call in an inline arrow function (e.g., `(...args) => mockFunction(...args)`) to avoid ReferenceErrors caused by Vitest's `vi.mock` hoisting.
