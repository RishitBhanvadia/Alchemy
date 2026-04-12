## 2024-04-12 - Lazy loading heavy interactive panels with AnimatePresence
**Learning:** In React Three Fiber applications, heavy interactive panels or modal components (like `AiTutorPanel` and `ResultModal`) can cause initial bundle size bloat. Lazy-loading them with `React.lazy` and `Suspense` improves performance. However, to preserve Framer Motion `AnimatePresence` exit animations, these components must not be conditionally unmounted based on their active state (e.g., `isOpen`).
**Action:** Instead, track a local `hasOpened` state. Render the `Suspense` boundary permanently after the first interaction (when `hasOpened` becomes true), and pass down the `isOpen` prop to the inner component so `AnimatePresence` can handle the exit animation. The `hasOpened` state must be set inside a `useEffect` hook to prevent cascading render warnings.
## 2024-04-12 - Fixing ESLint issues causing CI Failures
**Learning:** CI checks can fail due to unresolved ESLint errors. Specifically:
- Using `<a>` tags as buttons with `href="#"` throws `jsx-a11y/anchor-is-valid`. These should be replaced with `<button type="button">`.
- Using custom props named `role` (e.g. `<RoleCard role="student" />`) can conflict with native ARIA roles and throw `jsx-a11y/aria-role`. These should be renamed to something like `roleType`.
- Hook execution order is strict; `useEffect` cannot be placed below a conditional return.
**Action:** Always run linting locally before submitting changes, and prioritize fixing actual errors over warnings if they block the CI.
