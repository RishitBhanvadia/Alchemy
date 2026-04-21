## 2026-04-21 - Predictable Code Generation Vulnerability
**Bug:** Classroom and meeting codes were generated using `Math.random()`.
**Root Cause:** The `generateCode` and `generateClassCode` functions relied on the PRNG `Math.random()`, which is not cryptographically secure and produces predictable outputs.
**Learning:** Always use `crypto.randomInt()` or a similarly cryptographically secure pseudo-random number generator (CSPRNG) when creating access tokens, meeting links, or any security-sensitive codes to prevent unauthorized access via code guessing.

## 2026-04-21 - ESLint jsx-a11y Anchor and React Hooks Violations
**Bug:** The CI pipeline failed due to `jsx-a11y/anchor-is-valid` errors on `<a>` tags with `href="#"`, `aria-role` errors on custom custom components with a `role` prop, `react-hooks/rules-of-hooks` errors due to early returns before `useEffect`, and CSS parsing errors.
**Root Cause:** The project strictly enforces accessibility rules (treating warnings as errors) where dummy `<a>` tags and abstract roles are forbidden, React rules prohibit early returns before hooks are declared, and Vite/Tailwind requires standard `@import` statements to precede Tailwind's injections.
**Learning:** Always use `<button type="button">` styled as links instead of dummy anchor tags, rename props named `role` to something else (e.g., `roleType`) on custom components to avoid ARIA conflicts, declare all hooks unconditionally at the top of components, and always place standard CSS `@import` statements at the absolute top of the CSS entry file.

## 2026-04-21 - Hanging Server Startup Checks in CI
**Bug:** The `build-server` job in GitHub Actions consistently timed out and reached the 6-hour execution limit.
**Root Cause:** The workflow executed a test script `node -e "try { require('./server.js') } ..."` which successfully required the server file. However, because `server.js` initiated an active network listener (`app.listen()`), the Node process never exited on its own, causing the workflow step to hang indefinitely.
**Learning:** When using `require` or similar inline scripts to verify a server starts up in a CI/CD environment without a dedicated testing framework (like Jest or Supertest), always include a timeout mechanism (e.g., `setTimeout(() => process.exit(0), 2000);`) to gracefully exit the active process loop after confirming successful initialization.
