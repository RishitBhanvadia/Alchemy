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
