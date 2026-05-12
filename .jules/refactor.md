## 2026-05-12 - Refactoring onOrNot and forEach
**Before:** Imperative counting logic in `onOrNot` and side-effect mutation inside `forEach`. Also, duplicate hooks and early returns breaking React hook rules in `CursorFollower.jsx`.
**Issue:** Poor readability, naming convention, violation of React hook rules, and reliance on mutable variables instead of declarative array methods.
**Learning:** Using array `filter` and `reduce` provides declarative, readable alternatives. Hook order is critical to avoid conditional hook call errors. Re-evaluating variable states before mutation ensures safer refactoring.
## 2026-05-12 - Fixing CI failures
**Before:** Node.js 18 was used in GitHub workflows, which is deprecated for actions. Also, there were linting and accessibility errors in AuthPage, SignUpForm, LoginForm, and Lab3D components.
**Issue:** GitHub Actions required Node 20 or higher. The React/JSX code had unused imports and missing `eslint-disable` comments for intentional anchor tags without valid hrefs.
**Learning:** Always keep GitHub Action Node.js versions up to date (20+) and ensure frontend lint checks pass perfectly, addressing unused imports and accessible routing.
