## 2026-04-20 - Fix React Rules of Hooks violation and CSS build error
**Bug:** The application failed to build due to duplicate `const` declarations for state variables (`clicking`, `hovering`) in `CursorFollower.jsx` and invalid CSS import ordering in `index.css`.
**Root Cause:** In `CursorFollower.jsx`, state hooks were declared twice (once before and once after an early return), violating React's Rules of Hooks. In `index.css`, a standard `@import url()` statement was placed after `@import "tailwindcss";`, violating standard CSS rules which require `@import` statements to precede other rules.
**Learning:** Always ensure state hooks are declared exactly once at the top level of a React component before any conditional returns. Additionally, when using Vite with Tailwind CSS, ensure standard CSS `@import` statements (e.g., for Google Fonts) are placed at the absolute top of the CSS file, before any framework-specific imports like `@import "tailwindcss";` to prevent CSS parsing errors or production build failures.

## 2026-04-20 - Fix CI failure due to deprecated Node.js version
**Bug:** The GitHub Actions CI workflows (`ci.yml`, `build-check.yml`, `deploy-check.yml`) failed because they were running on Node.js 18, causing native binding errors (e.g., `EBADENGINE`) during the Vite build, particularly related to modern Tailwind dependencies.
**Root Cause:** The project uses `@tailwindcss/oxide` which requires Node.js >= 20. The GitHub workflows were hardcoded to use Node.js 18, leading to an `EBADENGINE` error when npm ci ran and subsequent build failures.
**Learning:** Always ensure GitHub Actions CI workflows use a Node.js version (e.g., 20.x) that matches the project's dependency requirements, especially when using modern tooling like Vite and Tailwind CSS v4.

## 2026-04-20 - Fix CI pipeline failure due to deprecated codecov-action
**Bug:** The GitHub Actions CI workflow (`ci.yml`) failed to upload coverage reports because `codecov/codecov-action@v3` could not be found or downloaded.
**Root Cause:** The `codecov-action@v3` tag was likely deprecated, deleted, or otherwise made unavailable by the publisher, causing the CI pipeline to fail with a 404 or archive download error when attempting to fetch the action.
**Learning:** Always use supported and maintained versions of GitHub Actions (like `codecov-action@v4`) to prevent sudden CI breakages due to deprecation or removal of older action versions.
