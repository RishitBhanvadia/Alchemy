## 2023-10-27 - [Invalid ARIA Roles in Custom Components]
**Bug:** React `jsx-a11y/aria-role` lint errors in `SignUpForm.jsx` caused by passing a custom prop named `role` to a custom component.
**Root Cause:** When a custom React component passes a prop named `role` down, React directly maps it to the HTML `role` attribute on rendered DOM nodes if not explicitly destructured. If the value is not a standard W3C ARIA role (e.g. "student"), it results in accessibility linting errors.
**Learning:** Avoid using HTML-reserved attributes like `role` as custom prop names in components. Use specific names like `userRole` to prevent implicit invalid DOM attribute mapping.
