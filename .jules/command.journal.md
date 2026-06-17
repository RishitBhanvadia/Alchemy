# Command Journal

## 2025-02-27 - esbuild failure on duplicated React hooks
**Finding:** The build failed with `The symbol "setHovering" has already been declared` because esbuild caught a duplicated variable declaration in `CursorFollower.jsx`
**Learning:** Even if `eslint` or `tsc` does not crash out early or misses something, the Vite builder via `esbuild` acts as an absolute check for variable name overlaps. There was also a React rules of hooks violation right above it.
**Prevention:** Always run the `build` check fully. Ensure early returns stay *after* hooks declarations.
