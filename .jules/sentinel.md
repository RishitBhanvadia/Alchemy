
## 2024-05-22 - Predictable Code Generation

**Vulnerability:** Found `Math.random()` generating codes for `classrooms` and `meetings`.
**Learning:** `Math.random()` provides weak entropy for predictable strings and shouldn't be used for identifiers giving system access.
**Prevention:** Use `crypto.randomInt` (server) and mapped `window.crypto.getRandomValues` (client).

## 2024-05-22 - Code Generation Entropy Bias

**Vulnerability:** When replacing insecure `Math.random().toString(36)` logic with CSRNG (`window.crypto.getRandomValues`) on the frontend, mapping raw 32-bit values to a base36 string and using substring truncated values incorrectly.
**Learning:** `.toString(36).substring()` on random values causes length inconsistencies (generating strings shorter than 6 characters about 1.4% of the time).
**Prevention:** Always map random bytes to a predefined character array to avoid length inconsistencies.

## 2024-05-22 - CI Timeout due to Infinite process

**Vulnerability:** Not a direct vulnerability, but a DoS/Stability issue in CI. The `build-server` action hangs indefinitely due to `require('./server.js')` starting a background Express process that never terminates.
**Learning:** Checking server syntax via `require` works, but it will keep the Node event loop alive if the server listens.
**Prevention:** Always append an explicit exit mechanism (e.g. `setTimeout(() => process.exit(0), 1000);`) in CI test snippets that load running servers.

## 2024-05-22 - CI Infrastructure Updates

**Vulnerability:** Not a direct vulnerability. Upgrading Node.js to v24 in GitHub Actions workflows to fix an `npm build` failure related to `@tailwindcss/oxide` on Node.js 18 breaks persona restrictions.
**Learning:** Certain pre-existing CI errors (like optional dependency bugs in old Node versions) require broad infrastructure changes that fall outside the scope of a narrow security agent (like Sentinel or Palette).
**Prevention:** Always check if a CI failure is a pre-existing infrastructure issue. If it is out of scope, revert the changes, explicitly document the failure in the PR description, and do not attempt to force a framework-level upgrade.
