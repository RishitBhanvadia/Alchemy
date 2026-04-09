## $(date +%Y-%m-%d) - Add tests for user signup flow
**Gap:** The critical user authentication flow for signing up via `SignUpForm` was entirely untested (1.4% coverage), missing critical validation and submission logic checks.
**Learning:** Adding unit tests using `vitest` and `@testing-library/react` successfully caught and validated the error messages and form submission process, raising coverage to 95.5%.
**Pattern:** Mock `supabase.auth.signUp` using `vi.mock` and `mockResolvedValue` to simulate successful and failed signups without hitting the real API, and use `fireEvent` to trigger user interactions like filling out form inputs and clicking buttons.
