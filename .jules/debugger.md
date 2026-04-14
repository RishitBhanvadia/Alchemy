## 2025-02-18 - Fix Duplicate Declarations and CSS Import Order

**Bug:**
1. React Hook rule violations and SyntaxError due to duplicate variable declarations in `CursorFollower.jsx`.
2. The Vite build failed to optimize CSS because of an incorrect `@import` order in `index.css`.

**Root Cause:**
1. The developer accidentally duplicated `const [clicking, setClicking] = useState(false);` and `const [hovering, setHovering] = useState(false);` and placed an early return `if (isTouchDevice) return null;` before the main `useEffect` hook.
2. The `@import "tailwindcss";` directive was placed before `@import url('https://fonts.googleapis.com/css2?family=Inter...');`, which violates standard CSS spec rules where all import statements must precede other styles.

**Learning:**
Ensure all React hooks are executed consistently at the top level of the component before any early returns. Always place raw CSS `@import` statements at the very top of stylesheets, especially when mixing standard CSS with preprocessors or Tailwind CSS frameworks, to prevent Vite esbuild optimization failures.
