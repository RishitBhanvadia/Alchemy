## 2025-02-12 - Critical Dependency Compatibility in CI
**Before:** `jsdom` version 28.1.0 was installed by default with `vitest` 4.0.18.
**Issue:** CI Environment runs Node 18 (18.20.8). `jsdom` 26+ requires Node 20+. This caused `html-encoding-sniffer` (a `jsdom` dependency) to fail with `require() of ES Module ... not supported` because newer `jsdom` versions use ESM-only sub-dependencies not fully compatible with Vitest's CJS loading in Node 18.
**Learning:** When working with Node 18 CI environments, explicitly downgrade `jsdom` to v25.0.1. This version maintains compatibility with Node 18 and avoids the ESM require errors in Vitest. Also, ensure both `pnpm-lock.yaml` and `package-lock.json` are updated since the CI might use `npm ci`.

## 2025-02-18 - Fixing Broken Tests and Vitest Config
**Before:** `Login.test.jsx` failed due to hoisting issues with `vi.mock` and incorrect selectors (accessibility changes). `Dashboard.test.jsx` failed due to mismatched text assertions. Vitest also attempted to run Playwright tests (`*.spec.js`) causing syntax errors.
**Issue:**
1. `vi.mock` calls are hoisted, but variables defined outside (like `mockSignInWithPassword`) were not available, causing ReferenceErrors.
2. The UI used `aria-label` or implicit labels, so `getByPlaceholderText` failed.
3. Dashboard title was uppercase WELCOME, ADMIN, test expected Dashboard.
4. Vitest config didn't exclude Playwright tests.
**Learning:**
1. Use `vi.hoisted(() => { ... })` to define variables that need to be accessed inside `vi.mock`.
2. Update selectors to match current accessibility practices (e.g., `getByLabelText`).
3. Explicitly exclude end-to-end test directories (e.g., `**/tests/**`) in `vitest.config.js`.
