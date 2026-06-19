## 2024-06-19 - Missing Sign Up Flow Coverage
**Gap:** The signup form is complex (includes nested components like `InputField` and `RoleCard`) but is almost completely uncovered (~2% coverage).
**Learning:** High-risk auth flow was ignored.
**Pattern:** Mock supabase auth signup to test this successfully.
