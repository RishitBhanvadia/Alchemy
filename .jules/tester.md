## 2024-05-22 - Tested authStore login initialization and logout flows
**Gap:** The critical user authentication flow in `authStore.js` lacked unit tests, meaning regressions in session persistence, initialization, or logout behavior could go undetected.
**Learning:** Testing a Zustand store that tightly integrates with an external, chainable API like Supabase requires deeply mocking the client methods (e.g., `.from().select().eq().single()`) to ensure the store's state management logic can be verified in isolation without triggering real network requests.
**Pattern:** Mock the Supabase client heavily and use `zustand`'s `.getState()` to directly call async initialization and logout methods. Reset the mock history and store state in `beforeEach` to prevent test pollution and verify correct state transitions based on mock API responses.

## 2024-05-22 - Fixed CI failures caused by Node 18 incompatibilities and lint errors
**Gap:** The GitHub Actions CI pipeline was failing due to `@tailwindcss/oxide` requiring Node >= 20 and multiple `jsx-a11y` accessibility linting errors.
**Learning:** Outdated runner node versions cause modern CSS/UI builds to crash, and dummy links (`<a href="#">`) trigger strict accessibility failures.
**Pattern:** Update `.github/workflows` to run Node.js 20, and systematically replace dummy anchor tags with `<button type="button">` with utility classes to maintain styling and satisfy accessibility rules.

## 2024-05-22 - Fixed server startup hanging CI builds
**Gap:** The `.github/workflows/build-check.yml` pipeline had a `build-server` job that validated the server startup using a `node -e` script. While the script caught start failures, it did not explicitly exit on success, causing the workflow job to hang indefinitely until hitting the GitHub action timeout limit (6 hours).
**Learning:** When writing simple Node.js evaluation scripts to test server startups in CI pipelines, starting the Express server leaves event loops running. You must explicitly terminate the process if it's considered successful.
**Pattern:** Inject a `setTimeout(() => process.exit(0), 1000);` into the inline Node script to forcibly pass and exit the script after allowing enough time for initialization exceptions to throw.
