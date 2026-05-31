## 2024-05-24 - Component Testing with Complex Selectors
**Gap:** SignUpForm component was mostly uncovered, specifically critical registration logic with Supabase.
**Learning:** Testing component behaviour when child elements are custom components (like RoleCard) requires precise interaction targets, especially when components emit both visual text and role attributes.
**Pattern:** Instead of assuming element text is unique, use specific testing-library selectors like `getByText('Student', { selector: 'h3' })` to safely interact with complex nested UI elements during form interaction tests.
