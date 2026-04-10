## 2026-04-10 - Refactored Lab Component State Management
**Before:** Deeply nested imperative logic to handle tip color changes (5 levels of if/else) and repetitive change handlers for each individual chemical state update.
**Issue:** Too much duplicate code and imperative DOM-like state synchronization which hurts maintainability in a React codebase.
**Learning:** React `useEffect` hooks are highly effective at decoupling state synchronization logic from event handlers, drastically reducing complexity. Also, array methods like `.filter()` are much more concise than imperative `for` or `if` loops for counting active items.
