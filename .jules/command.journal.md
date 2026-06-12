# Command Journal

## 2026-06-12 — Unintended duplicate variables block build
**Finding:** A commit that likely intended to resolve accessibility issues accidentally introduced duplicate state variable declarations in `client/src/components/CursorFollower.jsx`.
**Learning:** Duplicate variable declarations are flagged as esbuild Transform errors during `vite build`, causing the production build to break. Additionally, having conditional returns before hooks might have contributed if ESLint `react-hooks/rules-of-hooks` was not blocking the commit.
**Prevention:** Command should enforce that `npm run build` must pass before any branch is considered healthy. If a component like `CursorFollower.jsx` fails build due to duplicate symbols, we must explicitly ensure the fix prompt removes the duplicates and complies with hook rules.
