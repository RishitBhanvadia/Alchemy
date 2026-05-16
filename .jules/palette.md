## 2024-05-15 - React Hook ordering
**Learning:** Placing an early return `if (isTouchDevice) return null;` before `useEffect` causes a "React Hook is called conditionally" error. It must be moved below the hook, or its logic moved inside.
**Action:** Moved `isTouchDevice` return below `useEffect` in `CursorFollower.jsx`.
## 2024-05-15 - CSS @import order
**Learning:** Native CSS `@import url(...)` statements (e.g. Google Fonts) must precede `@import "tailwindcss";` in Vite/Tailwind 4 projects, or the build fails with "@import rules must precede all rules".
**Action:** Moved Google Font import above Tailwind import in `index.css`.
## 2024-05-15 - Unused imports and variables
**Learning:** Extracted multiple unused variables (`Check`, `Loader2`, `useCallback`) causing lint warnings.
**Action:** Removed unused imports across `RoleCard.jsx`, `CTAButton.jsx`, and `Lab3D.jsx`.
## 2024-05-15 - Anchor tag accessibility
**Learning:** `a` tags without valid `href` attributes (like `#`) cause `jsx-a11y/anchor-is-valid` lint errors.
**Action:** Converted `<a>` tags to `<button type="button">` in `AuthPage.jsx` and `LoginForm.jsx`.
## 2024-05-15 - Duplicate declarations
**Learning:** Duplicated `useState` declarations cause build failures (`Identifier has already been declared`).
**Action:** Removed duplicate state declarations in `CursorFollower.jsx`.
## 2024-05-15 - Node version in GitHub Actions
**Learning:** Node.js 18 in GitHub Actions causes native binding errors with `@tailwindcss/oxide`. It must be updated to Node 20.
**Action:** Updated `build-check.yml` and `ci.yml` to use `node-version: 20`.
## 2024-05-15 - Express server startup timeout
**Learning:** When testing Express server startup in CI (e.g. `require("./server.js")`), the server stays alive, causing jobs to hang (6-hour timeout). A `setTimeout` must be used to forcefully exit.
**Action:** Added `setTimeout(() => process.exit(0), 1000);` to the `build-check.yml` node check.
