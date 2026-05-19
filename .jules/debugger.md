## 2024-05-19 - Variable Redeclaration in CursorFollower
**Bug:** The build failed with esbuild transform errors indicating that the symbols "clicking" and "hovering" were already declared along with their state setters.
**Root Cause:** A bad merge or copy-paste left duplicate `useState` declarations for both `clicking` and `hovering` in `client/src/components/CursorFollower.jsx` on lines 12 and 13.
**Learning:** Always double-check React hooks inside functional components to ensure no duplicate variables exist, as Vite's build step strictly enforces variable declarations and will fail hard on redeclarations. Use standard linting rules (`no-redeclare` or similar) locally before running builds.

## 2024-05-19 - Tailwind CSS Import Order Vite Build Error
**Bug:** The build failed during CSS generation with the warning/error: `@import rules must precede all rules aside from @charset and @layer statements`.
**Root Cause:** The `index.css` had an `@import "tailwindcss";` directive immediately followed by an `@import url(...)` for Google Fonts. Standard CSS parsers require remote `@import url()` statements to come before framework imports in some configurations, or esbuild rejects it depending on Vite configuration.
**Learning:** In Vite projects using newer Tailwind CSS builds (e.g. Tailwind v4 native CSS), native CSS `@import` statements (like Google Fonts) must strictly precede the `@import "tailwindcss";` directive to prevent build transformation errors.
