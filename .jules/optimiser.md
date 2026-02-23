## 2024-10-24 - CI/CD Troubleshooting (Fixed)
**Bottleneck:** CI pipeline failing with `[vitest-pool]: Failed to start forks worker` and `ERR_REQUIRE_ESM`.
**Impact:** Prevents merging code.
**Learning:** `jsdom` v28+ (and `html-encoding-sniffer`) has issues with `require()` of ES modules in certain Node environments, particularly when used with Vitest on Node 18. Downgrading to a known stable version (v25.0.1) or pinning dependencies is necessary for stability in this legacy-ish environment.
**Fixes:**
- Downgraded `jsdom` to `25.0.1`.
- Excluded Playwright tests (`tests/**`) in `client/vitest.config.js`.
- Fixed `Dashboard.test.jsx` to match correct UI text ("WELCOME, ADMIN").
- Fixed `Login.test.jsx` to use `vi.hoisted` for mocks to prevent ReferenceError.
