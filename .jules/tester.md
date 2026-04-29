## 2024-05-18 - Auth Component Coverage Gap

**Gap:** The critical user registration component (`SignUpForm.jsx`) had near-zero test coverage, leaving a major authentication flow unprotected against regressions.

**Learning:** Authentication is the primary gateway to the application. Given the custom validations (password matching, required role selection, etc.), an untested sign-up form poses a high risk of silently failing validation logic, which could prevent users from joining the application.

**Pattern:** We use `vitest` and `@testing-library/react` to simulate user interaction, mocking internal APIs (like `react-hot-toast` and `supabaseClient`) to observe the outcomes of actions. The key pattern is to test the validation states independently (empty, incorrect formats) and then the success path. We also explicitly target interactive elements by label and text.
