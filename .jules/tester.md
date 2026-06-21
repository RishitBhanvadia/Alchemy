## 2024-06-21 - Test SignUp Form Validation & Authentication Flow
**Gap:** SignUpForm.jsx has almost no test coverage (2.04% Stmts). The authentication flow for sign-up, including validation, tab switching and actual signup logic, is critical business logic.
**Learning:** Testing validation logic before auth submission prevents bad data and captures error states effectively. The signup form relies on multiple states and roles, which is easily forgotten if not fully tested.
**Pattern:** Mock supabase auth functions and user inputs explicitly. Use `fireEvent` and `waitFor` to simulate user interaction and async side-effects properly, while mocking external utilities like `toast`.
