## 2024-XX-XX - Signup Authentication Flow Testing
**Gap:** The signup authentication flow (`SignUpForm.jsx`), including validation, input handling, and submission to Supabase, is almost completely untested (2.04% statements, 0% branches).
**Learning:** Form validation logic and API integration logic are critical parts of user onboarding, and they break easily if not protected. We also saw that testing the selected `RoleCard` custom component interaction by mocking clicks on generic element roles is crucial for accurate test execution.
**Pattern:** Provide mocked implementations of Supabase auth and react-hot-toast, use specific queries for custom UI components (like closest element lookups), and test both success paths, failure paths, and field validations correctly.
