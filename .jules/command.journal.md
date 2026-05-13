# Command Journal

## $(date -u +'%Y-%m-%d') — Build fail after CursorFollower rewrite
**Pattern:** Changes to components tracking cursors or doing early returns often hit React hooks errors and duplicate variable errors if previous lines are copy pasted.
**Detection:** Build fails with `vite:esbuild` Transform failed error and `has already been declared` or CSS warning that `@import` rules must precede all other rules.
**Prevention:** Always verify build with `npm run build` after making modifications to UI files. Verify `use` hooks are kept ordered correctly if component starts returning early.
