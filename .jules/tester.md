## 2026-02-18 - [Testing Time-Dependent Experiment Logic]
**Gap:** The Titration page experiment logic relied on `setInterval` and `window.location.reload`, making it untestable and unreliable in CI environments without mocks.
**Learning:** Hard-coded time intervals and direct DOM manipulation (reloads) create brittle tests. Mocking `window.location` and using `vi.useFakeTimers()` is essential for testing user flows that involve waiting or resetting state.
**Pattern:** Isolate time-dependent logic by wrapping `setInterval` in `useEffect` and controlling it with `vi.advanceTimersByTime()` in tests. Mock `window.location` using `delete window.location; window.location = { ... }` to prevent test runner crashes.
