## 2024-05-04 - Test Sign Up Form coverage
**Gap:** SignUpForm had 0% coverage and wasn't tested during the auth flows testing.
**Learning:** Testing auth forms helps catch client-side validation logic bugs before hitting the database.
**Pattern:** Mock `react-hot-toast` and `supabase.auth.signUp` to test valid/invalid paths and ensure correct tab switching behavior after success.
