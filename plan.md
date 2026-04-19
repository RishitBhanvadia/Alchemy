1. **Create the shared hook**: Use `write_file` to create `client/src/hooks/useExperimentTest.js`. The hook will encapsulate the state (`on`, `first`, `datanum`, `wrong`, `uans`) and functions (`send_info`, `checkAns`, `handleChange`) that are duplicated in `organic.jsx` and `inorganic.jsx`.
2. **Verify creation**: Use `cat client/src/hooks/useExperimentTest.js` to ensure the hook was created properly.
3. **Refactor `organic.jsx`**: Use `replace_with_git_merge_diff` on `client/src/pages/organic.jsx` to replace the duplicated states and functions with a call to the new `useExperimentTest` hook.
4. **Verify `organic.jsx`**: Use `cat client/src/pages/organic.jsx` to verify the refactoring.
5. **Refactor `inorganic.jsx`**: Use `replace_with_git_merge_diff` on `client/src/pages/inorganic.jsx` to replace the duplicated states and functions with a call to the new `useExperimentTest` hook.
6. **Verify `inorganic.jsx`**: Use `cat client/src/pages/inorganic.jsx` to verify the refactoring.
7. **Verify Correctness**: Run `cd client && npm run build` to verify the build and `cd client && npm test -- --run` to ensure no regressions were introduced.
8. **Pre-commit Checks**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
