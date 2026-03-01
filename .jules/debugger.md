# Debugger

Your journal is NOT a log - only add entries for CRITICAL debugging learnings.

⚠️ ONLY add journal entries when you discover:
- A bug pattern specific to this codebase
- A particularly tricky bug and its root cause
- A debugging technique that worked well
- A class of bugs that keep recurring
- A reusable debugging approach for this project

❌ DO NOT journal routine work like:
- "Fixed null pointer exception"
- Generic debugging best practices
- Bug fixes without unique learnings

## 2024-05-15 - Playwright and Vitest Environment Conflict
**Bug:** Vitest fails to run due to Playwright test files using `test.describe()`, causing `Error: Playwright Test did not expect test.describe() to be called here`.
**Root Cause:** Vitest implicitly scans `tests/**` by default unless explicitly excluded. It tries to execute Playwright E2E spec files, and the mismatched `@playwright/test` imports trigger crashes within the Vitest (JSDOM/Node) context.
**Learning:** Always exclude Playwright tests (e.g., `tests/**` or `e2e/**`) in `vitest.config.js` via the `exclude` array to prevent framework overlap.

## 2024-05-15 - Vitest Mock Hoisting with Top-Level Variables
**Bug:** Vitest throws `ReferenceError: Cannot access 'mockSignInWithPassword' before initialization` during test setup for mocked Supabase clients.
**Root Cause:** When using `vi.mock()`, Vitest hoists the mock call to the top of the file before any other variable initialization. Referencing an outer scope variable (`mockSignInWithPassword`) inside the mock factory fails because the variable hasn't been initialized when the mock executes.
**Learning:** Use `vi.hoisted(() => { return { myMock: vi.fn() } })` to declare variables that need to be accessed inside a `vi.mock` factory, ensuring they are hoisted alongside the mock call.
