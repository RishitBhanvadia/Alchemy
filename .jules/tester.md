## YYYY-MM-DD - Sign Up Testing Added
**Gap:** The new refactored AuthPage and SignUpForm lacked test coverage for critical user registration behaviors, particularly validating input logic and successful form submission simulating calls to supabase.
**Learning:** Adding test coverage for authorization flows minimizes risks of sign-up regressions and ensures data formats (like emails and minimum password length) remain properly vetted before creating users.
**Pattern:** Mock `supabase.auth.signUp` directly using vitest and simulate form events by interacting with labels or placeholders.
