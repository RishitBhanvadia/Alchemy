# Command Journal

## 2026-06-10 — React hook rules in CursorFollower
**Finding:** The `CursorFollower.jsx` component had `useState` hooks declared after an early return (`if (isTouchDevice) return null;`), causing a build error alongside duplicate variable declarations.
**Learning:** Early returns must strictly occur after all React hooks have been declared to avoid violating the rules of hooks.
**Prevention:** Linter configurations should be strict about the `react-hooks/rules-of-hooks` rule, and agents must carefully read files to check for early returns before adding new hooks.

## 2026-06-10 — Tailwind CSS @import ordering
**Finding:** In Tailwind v4, standard CSS `@import url(...)` statements must be placed *before* the `@import "tailwindcss";` directive, otherwise the Vite build outputs warnings.
**Learning:** PostCSS/Tailwind expands the `@import "tailwindcss";` directive into multiple CSS rules. Standard CSS requires `@import` statements to be at the absolute top of the file, so any `@import url(...)` after Tailwind's directive becomes invalid.
**Prevention:** Always place external CSS imports at the very beginning of the `index.css` file.

## 2026-06-10 — CI build-server hang
**Finding:** The GitHub Actions CI `build-server` job hangs indefinitely during the "Check server syntax/startup" step.
**Learning:** The step uses `node -e "try { require('./server.js') } ..."` to test if the server starts. Because `server.js` starts an Express listener (`app.listen`) without exporting it or closing it, the Node.js process stays alive, causing the CI runner to wait until the 6-hour timeout.
**Prevention:** CI scripts that verify server startup by `require()`-ing the entry file must be able to gracefully exit. The server file should export its `server` instance (`module.exports = app.listen(...)`), and the test script must capture this instance and call `server.close()` after a brief timeout.
## 2026-06-10 — TailwindCSS native binding error on runner cache misses
**Finding:** If `npm ci` is used without `package-lock.json` sync or there is a transient issue with `@tailwindcss/oxide` where native bindings fail in CI build-client, `vite build` can break.
**Learning:** `pnpm` handles the native packages properly, but when the workflow uses `npm ci` on GitHub Actions and there are older lock files or cache misalignments, `@tailwindcss/oxide` native compilation fails. Removing the lock file locally triggered an update of node_modules, which was committed.
**Prevention:** If there are optional dependency failures related to Tailwind CSS native bindings (especially on node-18 to 20 transitions in Github actions), explicitly deleting and regenerating the `package-lock.json` via a clean `npm install` and using the updated deps resolves the error.
