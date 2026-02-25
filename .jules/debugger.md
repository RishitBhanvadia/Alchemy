## 2025-02-18 - Vitest Mock Path Resolution
**Bug:** Tests were running against real components instead of mocks because of incorrect relative paths in `vi.mock`.
**Root Cause:** The test file was nested in `__tests__` (`client/src/pages/__tests__/Result.test.jsx`), so relative imports like `../components/...` resolved to `client/src/pages/components/...` which does not exist (or is wrong), whereas the source file (`client/src/pages/result.jsx`) uses `../components/...` correctly.
**Learning:** When mocking modules that are imported by the source file using relative paths, the mock path in the test file must be relative to the **test file's location**, not the source file's location. Always double-check relative paths when moving tests into `__tests__` subdirectories.
