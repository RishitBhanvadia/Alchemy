## 2024-05-22 - [Testing Async Loading States]
**Gap:** The login loading state was untested and visually unverified, leading to potential user confusion during slow network conditions.
**Learning:** Verified that `asyncio.CancelledError` in Playwright Python scripts often occurs when the browser context is closed while a route interception is still pending. Ensure pending routes are resolved or the script waits for them before closing.
**Pattern:** For unit testing React loading states:
1. Use `vi.hoisted` to create a controllable mock for the async function (e.g., `signInWithPassword`).
2. In the test, mock the function to return a Promise that doesn't resolve immediately (or use a controllable let variable).
3. Trigger the action (click).
4. Assert the loading state (disabled button, text change).
5. Resolve the promise.
6. Assert the final state (navigation or success message).
