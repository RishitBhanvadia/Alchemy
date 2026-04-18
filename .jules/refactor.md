## 2025-05-18 - Fix React hook conditional rules and linting
**Before:** `CursorFollower` declared hooks after an early return which violates rules of hooks, and caused esbuild issues. `RoleCard` used `role` prop causing aria-role conflicts. `LoginForm` and `AuthPage` used placeholder `a href="#"` which violates `jsx-a11y/anchor-is-valid`.
**Issue:** Build failure due to multiple declarations of `useState` in `CursorFollower`. Lint failures regarding standard aria role conflicts.
**Learning:** React hooks must strictly be called at the top level and before any early returns. Standard HTML aria attributes like `role` should not be used as prop names for custom components. Using `button type="button"` satisfies the `anchor-is-valid` rule for placeholder links without href.
