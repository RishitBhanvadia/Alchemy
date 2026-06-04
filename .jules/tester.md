## 2024-06-04 - Authentication Sign Up Flow Not Tested
**Gap:** The SignUpForm authentication flow was not tested. Test coverage was almost 0%.
**Learning:** The testing library could not resolve role selection since it's built with custom components. Need to use custom selectors.
**Pattern:** Using testing library selectors with custom tags like `screen.getByText('Student', { selector: 'h3' })` is necessary for custom RoleCard components to avoid testing library errors on finding multiple items.
