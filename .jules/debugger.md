## 2024-06-22 - Build Failure due to Duplicate Identifiers
**Bug:** Build fails with errors: "The symbol 'clicking' has already been declared" and "The symbol 'hovering' has already been declared" in `client/src/components/CursorFollower.jsx`.
**Root Cause:** The `useState` hooks for `clicking` and `hovering` were accidentally duplicated below the early return `if (isTouchDevice) return null;`.
**Learning:** React rules of hooks prohibit hooks after conditional returns. The correct fix is to remove the duplicated state definitions, and ensure early returns happen after all hooks.

## 2024-06-22 - ESLint Error: SetState Synchronously in Effect
**Bug:** ESLint error `Error: Calling setState synchronously within an effect can trigger cascading renders` in `client/src/components/SuccessCelebration.jsx`.
**Root Cause:** Calling `setParticles` synchronously inside `useEffect` can trigger an extra re-render on mount before the browser paints.
**Learning:** If state initialization is synchronous based on a prop, it can be calculated during render, or the ESLint rule can be disabled if the behavior is intentional for an animation trigger. In our case, the prompt instructions mention: "If setParticles (or another state setter) is called synchronously within a useEffect body to trigger animations on mount, it may trigger the react-hooks/set-state-in-effect ESLint error. You can safely suppress this locally using // eslint-disable-next-line react-hooks/set-state-in-effect if the behavior is intentional."

## 2024-06-22 - Vite Build Failure: CSS Import Order
**Bug:** Vite build fails with `Transform failed with 4 errors` (or similar) and a warning about `@import url(...)`.
**Root Cause:** CSS `@import` rules (such as Google Fonts imports) do not strictly precede all other CSS rules in `client/src/index.css`. The `@import "tailwindcss";` rule comes first, which expands into `@layer` rules, breaking the strict CSS specification that `@import` must precede all other rules (except `@charset`).
**Learning:** To prevent Vite build failures, `@import url(...)` statements must be placed at the absolute top of the CSS file, *before* Tailwind CSS directives or any other rules.
