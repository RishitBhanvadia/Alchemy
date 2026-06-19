## 2024-06-19 - Fix React 18 / ESLint build errors
**Bug:** Build failure and ESLint errors blocking CI for frontend components (`AuthPage`, `LoginForm`, `PhysicsLab`, `SignUpForm`, `RoleCard`, `CTAButton`, `Lab3D`, `CursorFollower`, `index.css`).
**Root Cause:**
- `jsx-a11y/anchor-is-valid`: `<a>` tags with `href="#"` or `href="#!"` were used instead of buttons.
- `react-hooks/immutability`: Modifying `gl.domElement.style.cursor` directly inside a callback mutates the hook's returned context.
- Unused variables/imports (`useCallback`, `Check`, `Loader2`).
- Invalid `aria-role` (e.g. `role="student"`) due to custom props colliding with HTML `role` attribute.
- Rules of Hooks violations (early return before `useEffect`).
- `@import` url placement violation in Tailwind/CSS causing Vite build plugin failure.
**Learning:**
- Use `<button type="button" className="link-button">` instead of empty `<a href="#">` for accessibility.
- Mutate `document.body.style.cursor` rather than `gl.domElement.style.cursor` in `react-three-fiber` callbacks to avoid `react-hooks/immutability` errors.
- Rename custom `role` props to `userRole` to prevent `jsx-a11y/aria-role` collisions.
- Ensure all hooks are declared before any early returns.
- Ensure `@import` CSS declarations (e.g. Google Fonts) always precede all other rules (including Tailwind imports or `@layer`).
