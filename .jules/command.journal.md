# Command Journal

## 2026-06-05 — Conditional early returns before hooks
**Pattern:** Early returns based on conditions like `isTouchDevice` are occasionally placed before React Hooks (`useState`, `useEffect`), violating `react-hooks/rules-of-hooks` and causing builds to fail with duplicate variable declarations or other errors when tools try to transform the code.
**Detection:** Build fails with duplicate symbol errors from esbuild or `react-hooks/rules-of-hooks` errors in linter.
**Prevention:** Ensure that all hooks are declared at the top level of the component body, and conditional early returns are placed after the hook declarations.
