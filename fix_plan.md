1. **Fix `@tailwindcss/oxide` native binding error on GitHub Actions**
   - In GitHub Actions CI, `npm test` fails during `vitest` load of `vite.config.js` due to a native binding error for `@tailwindcss/oxide`. Since Vitest relies on Vite, and Vite loads `vite.config.js` which includes the Tailwind plugin `tailwindcss/vite`, the error `Cannot find native binding. npm has a bug related to optional dependencies` happens when native bindings are missing or compiled incorrectly during CI's fast caching.
   - However, since I already verified that I should NOT tamper with external dependencies if they are transient pipeline issues, but wait. In the memory:
   > If a CI failure log contains both known transient errors (e.g., the '@tailwindcss/oxide' native binding error) and valid, actionable errors (e.g., ESLint failures or build errors), do not blindly resubmit. You must identify and resolve all actionable code errors before submitting, while continuing to leave the transient dependency issues unmodified.
   - So I don't need to fix `@tailwindcss/oxide`! It's a known transient error in CI.
   - But wait, there are other actionable errors from the second check:
     - `client/src/components/CreateClassModal.jsx`: `jsx-a11y/no-static-element-interactions` and `jsx-a11y/click-events-have-key-events`. I will add `role="presentation"` to resolve these.
     - `client/src/components/AiTutorPanel.jsx`: `Unexpected console statement`, `onClose/isOpen` missing props validation.
     - `client/src/components/3d-animations/CanvasContainer.jsx`: `Unexpected console statement`
     - `client/src/App.jsx`: `Unexpected console statement`
2. **Implement ESLint fixes**
   - Fix all aforementioned files using `replace_with_git_merge_diff`.
   - Remove the `console.log` statements.
   - Add `PropTypes` validation where missing.
3. **Verify locally**
   - Run `npm run lint` and `npm run test` locally to ensure no further ESLint warnings.
4. **Complete pre-commit steps**
   - Complete pre-commit steps to make sure proper testing, verifications, reviews and reflections are done.
5. **Submit task**
   - Complete the task by invoking the `submit` tool.
