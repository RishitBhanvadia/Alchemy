## 2025-04-22 - Fix CI build and lint failures

**Bug:** GitHub Actions CI suite consistently failed on pull requests because it was using a deprecated Node.js 18.x version which could not install native bindings for modern dependencies like `@tailwindcss/oxide`. Additionally, the frontend build was crashing due to a duplicate `useState` declaration in `CursorFollower.jsx`, and a severe React Rules of Hooks violation existed because hooks were conditionally executed.

**Root Cause:** The `.github/workflows/ci.yml` strictly requested `node-version: [18.x]`, which triggered `EBADENGINE` warnings on dependencies that require Node 20+. In the frontend, the `isTouchDevice` conditional return occurred before several React Hooks, violating the invariant order of Hook calls.

**Learning:** When modernizing dependencies or facing build crashes with `EBADENGINE`, always check the CI configuration `node-version` matrix and ensure it matches the local development environment (Node.js 20+). React Hooks violations (e.g. conditional early returns before `useState`/`useEffect`) often silently fail in development but will break the production `vite build` process due to strict linting/parsing rules.
