## 2025-04-02 - Fixed ARIA role conflict in RoleCard
**Problem:** `RoleCard.jsx` was passing a custom prop named `role` which conflicted with the native HTML `role` attribute, causing ESLint `jsx-a11y/aria-role` checks to fail because "student" and "teacher" are abstract/invalid native ARIA roles.
**Context:** When a custom component accepts a generic prop like `role` and uses it for logic (like `if (role === 'student')`), linters can misinterpret this as setting the DOM ARIA role, causing CI build failures.
**Solution:** Renamed the custom `role` prop to `roleType` inside `RoleCard.jsx` and updated the parent component `SignUpForm.jsx` to pass `roleType="student"`. This completely circumvents the linter conflict while retaining correct component behavior.
