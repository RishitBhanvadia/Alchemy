## 2025-02-18 - Fix Duplicate Declarations and CSS Import Order

**Bug:**
1. React Hook rule violations and SyntaxError due to duplicate variable declarations in `CursorFollower.jsx`.
2. The Vite build failed to optimize CSS because of an incorrect `@import` order in `index.css`.

**Root Cause:**
1. The developer accidentally duplicated `const [clicking, setClicking] = useState(false);` and `const [hovering, setHovering] = useState(false);` and placed an early return `if (isTouchDevice) return null;` before the main `useEffect` hook.
2. The `@import "tailwindcss";` directive was placed before `@import url('https://fonts.googleapis.com/css2?family=Inter...');`, which violates standard CSS spec rules where all import statements must precede other styles.

**Learning:**
Ensure all React hooks are executed consistently at the top level of the component before any early returns. Always place raw CSS `@import` statements at the very top of stylesheets, especially when mixing standard CSS with preprocessors or Tailwind CSS frameworks, to prevent Vite esbuild optimization failures.

## 2025-02-18 - Fallback to npm install for CI bindings

**Bug:**
The GitHub Actions workflow failed abruptly during `npm ci` due to an optional dependency (`@tailwindcss/oxide`) failing to find its native binding.

**Root Cause:**
The `npm` version running in the CI runner has a known issue with strictly resolving optional dependencies for native bindings when using `npm ci`. This throws a fatal 'Cannot find native binding' error.

**Learning:**
In GitHub Actions workflows, replacing `npm ci` with `npm install` outright is a major anti-pattern. However, if `npm ci` fails with 'Cannot find native binding' for optional dependencies, apply a targeted fallback in the workflow step using `npm ci || npm install` to let the runner fetch missing architecture-specific bindings without polluting the lockfile.

## 2025-02-18 - Fix ESLint jsx-a11y and no-unused-vars CI build failures

**Bug:**
The GitHub Actions CI pipeline failed during the `npm run lint` step due to multiple ESLint errors, including `jsx-a11y/anchor-is-valid`, `jsx-a11y/aria-role`, and `no-unused-vars`.

**Root Cause:**
1. `anchor-is-valid`: Using generic `<a href="#">` tags for interactive javascript actions instead of valid navigational URLs.
2. `aria-role`: Using the reserved HTML attribute `role` as a custom React prop name in `<RoleCard role="student">`.
3. `no-unused-vars`: Lingering unused React imports (`useCallback`, `Check`, `Loader2`).

**Learning:**
Always run linters locally before pushing code. When resolving ESLint `jsx-a11y/anchor-is-valid` errors for generic `href="#"` links, replace the `<a>` tag with a semantic `<button type="button">` and apply appropriate CSS resets (e.g., `bg-transparent border-none p-0 cursor-pointer`). Avoid naming custom component props `role` to prevent conflicts with native HTML ARIA attributes; use alternatives like `roleType`.
