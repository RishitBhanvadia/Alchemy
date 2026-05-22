## 2024-05-22 - Extracted duplicated join classroom logic
**Before:** `Dashboard.jsx` had a duplicated 30-line `handleJoinClassroom` function that directly queried Supabase logic and state (already implemented in `classroomStore.js`).
**Issue:** Violates the DRY principle and scatters data access logic, making it harder to test or change in one place.
**Learning:** Refactoring scattered, direct Supabase calls into existing Zustand store methods (`joinClassroom`) drastically simplifies React components and keeps data manipulation unified.
## 2024-05-22 - GitHub CI Node.js version update
**Before:** CI workflows (`build-check.yml` and `ci.yml`) were hardcoded to use Node.js 18.x, which caused build failures due to `@tailwindcss/oxide` incompatibility.
**Issue:** Hardcoded, deprecated Node versions caused unresolvable pipeline failures.
**Learning:** Always keep GitHub Actions runner Node versions updated to >=20.x for Vite/Tailwind v4+ projects to avoid native binding errors.
