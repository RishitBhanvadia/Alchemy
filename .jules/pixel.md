## 2025-04-30 - Fix CursorFollower Double Declaration
**Problem:** Vite production build failed due to a duplicate state declaration in CursorFollower.jsx.
**Context:** This was preventing the application from building and deploying successfully, directly impacting the entire project. The `@import` rule for fonts in `index.css` was also in the wrong order which causes issues during Vite CSS optimization.
**Solution:** Removed the duplicate `clicking` and `hovering` state declarations in `CursorFollower.jsx`. Reordered the `@import` statements in `index.css` to comply with standard CSS rules.

## 2025-04-30 - Improve accessibility in Auth components
**Problem:** The authentication forms and pages use invalid anchor tags (`<a href="#">`) for actions and incorrect ARIA roles, leading to linting errors that break the CI pipeline and cause poor accessibility for screen reader users. Unused imports also clutter the codebase.
**Context:** This was preventing the application from building and deploying successfully, directly impacting the entire project. It also hindered accessibility, making it difficult for keyboard and screen reader users to navigate the authentication flows.
**Solution:** Addressed 8 breaking linting errors by removing unused imports in `Lab3D.jsx` and `RoleCard.jsx`. Fixed invalid ARIA roles in `SignUpForm.jsx` by passing `userRole`. Converted purely visual `<a href="#">` elements to semantically correct `<button type="button">` wrappers in `AuthPage.jsx` and `LoginForm.jsx`. Replaced emoji icons with `lucide-react` icons in `Lab3D.jsx`.
