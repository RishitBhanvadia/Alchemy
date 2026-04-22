## 2025-04-22 - Fix remaining GitHub Actions workflows

**Bug:** Additional CI checks (`build-check.yml` and `deploy-check.yml`) failed due to Node.js 18.x depreciation warnings and `EBADENGINE` native binding failures for modern dependencies.

**Root Cause:** While the `ci.yml` matrix was updated previously, the other pipeline files (`build-check.yml` and `deploy-check.yml`) still explicitly requested `node-version: '18'`, causing identical build failures across the CI suite.

**Learning:** When addressing environment or toolchain requirements (such as Node version bumps), one must search the entire `.github/workflows/` directory to ensure all jobs that install or build dependencies are uniformly updated, preventing whack-a-mole CI breakages.
