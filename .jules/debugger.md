## 2026-05-22 - Fix Node.js deprecation in CI workflows
**Bug:** The GitHub Actions CI check suite failed with Node.js 20 deprecation warnings and process exits.
**Root Cause:** The GitHub workflows were explicitly setting the Node.js version to `18` or `18.x`, which relies on deprecated `setup-node` versions and triggers underlying build failures with packages that require `node >= 20`, causing the check suite to exit with code 1.
**Learning:** Always specify supported Node.js LTS versions in CI workflows (e.g., `24.x`) to prevent deprecation failures and ensure compatibility with newer dependencies.
