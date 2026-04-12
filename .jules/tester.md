## 2024-04-12 - Missing Signup tests
**Gap:** Signup flows (including switching tabs to 'signup' and registration via supabase.auth.signUp) are entirely untested.
**Learning:** Testing only the default login tab leaves a major authentication pathway unverified.
**Pattern:** We can write a specific test that simulates clicking the signup tab and testing the validation/submission of the SignUpForm.
