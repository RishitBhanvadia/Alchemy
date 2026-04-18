## 2024-04-18 - Added Error Boundary Tests
**Gap:** The ErrorBoundary component lacked test coverage, which could fail to render fallbacks properly on runtime crashes.
**Learning:** Found that testing ErrorBoundary requires mocking out React's default console.error log spam to prevent confusing stacktraces in the test output.
**Pattern:** Mock `console.error` with `vi.spyOn(console, 'error').mockImplementation(() => {})` in a beforeEach hook and restore it in an afterEach hook when testing error boundary components.
