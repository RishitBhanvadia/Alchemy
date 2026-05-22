## 2024-05-22 - Extracted duplicated join classroom logic
**Before:** `Dashboard.jsx` had a duplicated 30-line `handleJoinClassroom` function that directly queried Supabase logic and state (already implemented in `classroomStore.js`).
**Issue:** Violates the DRY principle and scatters data access logic, making it harder to test or change in one place.
**Learning:** Refactoring scattered, direct Supabase calls into existing Zustand store methods (`joinClassroom`) drastically simplifies React components and keeps data manipulation unified.
## 2024-05-22 - GitHub CI Node.js version update
**Before:** CI workflows (`build-check.yml` and `ci.yml`) were hardcoded to use Node.js 18.x, which caused build failures due to `@tailwindcss/oxide` incompatibility.
**Issue:** Hardcoded, deprecated Node versions caused unresolvable pipeline failures.
**Learning:** Always keep GitHub Actions runner Node versions updated to >=20.x for Vite/Tailwind v4+ projects to avoid native binding errors.

## 2024-05-22 - CI Configuration Refactoring
**Before:** Workflow files (`ci.yml`, `build-check.yml`, `deploy-check.yml`) used hardcoded Node versions and long-running server scripts that caused jobs to hang indefinitely.
**Issue:** Hardcoded Node versions caused native dependencies like `@tailwindcss/oxide` to fail on Node 18, and `server.js` startup scripts in CI hung because they didn't exit after a successful load.
**Learning:** For continuous integration health, ensure all workflows use updated Node versions matching local environments, and specifically add explicit exit commands (`setTimeout(() => process.exit(0), 1000)`) when testing long-running server startups in CI scripts.
