## 2024-05-21 - Authentication Flow Tests
**Gap:** The critical signup flow (`SignUpForm.jsx`) is untested, which includes validation logic, Supabase auth integration, and role selection.
**Learning:** Testing user authentication forms is vital for platform security and reliability, and ensuring role data flows properly at registration prevents permission issues later.
**Pattern:** Mocking the Supabase client along with user inputs through `@testing-library/react` and simulating form submission using `fireEvent` and `waitFor`.
