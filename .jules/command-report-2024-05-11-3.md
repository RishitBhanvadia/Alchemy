## 2024-05-11 - Third CI Fix Attempt: Workflows & Esbuild

**Vulnerability:** CI checks are still failing due to Node 20 runner deprecations in GitHub Actions, missing React prop validation, remaining `jsx-a11y` issues (like interactive roles without keyboard handlers), and the same duplicate identifier issue during `vite build` in `CursorFollower.jsx`. This failure occurred because the second patch was accidentally wiped out in this environment state.
**Fixes:**
1. Re-apply the Node.js 18 -> 20 version bumps in all workflows (`ci.yml`, `build-check.yml`, `deploy-check.yml`).
2. Re-apply the `CursorFollower.jsx` duplicate identifier and React Hooks early return fix.
3. Fix the newly identified `CreateClassModal.jsx` accessibility issues and `AiTutorPanel.jsx` / `Lab3D.jsx` missing props or console logs.
