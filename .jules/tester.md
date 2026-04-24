## 2024-04-24 - Add Tests for Authentication Sign-Up Flow
**Gap:** The sign-up form (`client/src/components/auth/SignUpForm.jsx`) was entirely untested, leaving a critical user flow vulnerable to regressions.
**Learning:** This is a crucial area because it handles the initial user onboarding, validation of passwords, and role selection. Without tests, any changes to validation rules or role handling could break sign-ups silently.
**Pattern:** We added standard React Testing Library tests to verify form rendering, field validation errors (empty fields, mismatched passwords, short passwords), and a successful form submission using a mocked Supabase client.
