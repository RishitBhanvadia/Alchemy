## 2024-04-11 - Add complete test suite for authStore
**Gap:** The critical user authentication flow state management (\`authStore.js\`) was entirely untested.
**Learning:** Zustand stores interacting with Supabase auth require careful mocking of both synchronous API chains (like \`.from().select().eq().single()\`) and dynamic import error suppression for cross-store resets. Handling fallback behaviours (\`PGRST116\`) for automatic profile generation is critical for user initialisation reliability.
**Pattern:** Mock Supabase chain syntax directly via \`vi.fn().mockReturnThis()\` attached to base objects and conditionally intercept single terminal methods (\`.single()\`) based on the query pattern context.
