## 2025-05-13 - Fix duplicate variables causing build failures
**Bug:** The `CursorFollower` component had duplicate `useState` definitions for `clicking` and `hovering`.
**Root Cause:** A bad merge or copy-paste error caused the hooks to be defined twice, before and after an early return. While development builds may have tolerated this depending on caching, production minification via esbuild throws an "identifier already declared" error.
**Learning:** Always verify `npm run build` passes before submitting even small visual changes. Duplicated variables can be surprisingly destructive during the minification and bundling phase in Vite.

## 2025-05-13 - Fix ESLint warnings preventing CI builds
**Bug:** Multiple unused variable and prop validation warnings/errors were causing the CI `npm run lint` step to fail on Node 20. Specifically, `useCallback` in `Lab3D.jsx`, missing link tags in `AuthPage.jsx`/`LoginForm.jsx`, unused imports in `CTAButton.jsx`/`RoleCard.jsx`, and ARIA role issues in `SignUpForm.jsx`.
**Root Cause:** Stricter ESLint rules in the updated Node environments treating certain warnings (or specific rules like `jsx-a11y/anchor-is-valid`) as errors, which fails the GitHub Actions step. `RoleCard` had an abstract role error because a prop was named `role`, conflicting with HTML aria-role.
**Learning:** Always run ESLint locally with `npm run lint` when debugging CI failures, as it will highlight the exact lines failing the build. Use inline disables for intentional stub links, and rename component props that clash with HTML standard attributes (like `role` -> `userRole`).
