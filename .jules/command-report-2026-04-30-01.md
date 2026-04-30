## 2026-04-30 - GitHub Actions CI Checks Fixes
**Status:** Recovering from CI failures caused by deprecated Node.js actions and ESLint linting issues.
**Quick Stats:** Node.js actions bumped to use v20 (and FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true). Fixed ESLint configuration and missing dependencies blocking `build-server` jobs. Addressed missing `react/prop-types`, `jsx-a11y`, and `react-hooks/rules-of-hooks` errors manually in the frontend code where required to pass the linter.
**Fix Prompts:** N/A (applied manually as part of PR recovery for math.random fix)
