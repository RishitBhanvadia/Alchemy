## Command Report

The GitHub CI Check Suite Failed during the `build` and `test` jobs.

The failures were tracked to two root causes:
1. GitHub Actions runner node version deprecation warning (`Node.js 20 actions are deprecated...`).
2. A Vite build failure caused by a bug in npm's handling of optional dependencies for `@tailwindcss/oxide` native bindings when using older versions of Node (like Node 18).

The solution implemented updates the GitHub action workflows in `.github/workflows/build-check.yml`, `.github/workflows/ci.yml`, and `.github/workflows/deploy-check.yml` to use Node version `20` (and `20.x` in matrix) instead of `18`, resolving both the native binding build error and setting up support against older deprecated runners.

No code within `client` or `server` itself needed to be changed. Tests and lint runs locally pass.
