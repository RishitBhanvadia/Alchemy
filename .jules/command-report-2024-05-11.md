## 2024-05-11 - Node.js Version Update and CI Fixes

**Vulnerability:** CI checks failing due to Node.js 20 deprecation warning and multiple lint errors/warnings.
**Fixes:**
1. Upgraded `node-version: [18.x]` to `node-version: [20.x]` in `.github/workflows/ci.yml`.
2. Changed `node-version: '18'` to `node-version: '20'` in `.github/workflows/build-check.yml` and `.github/workflows/deploy-check.yml`.
3. Fixed multiple ESLint errors in client files.
