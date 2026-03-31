## 2025-02-18 - Resolve react/prop-types warnings with explicit PropTypes
**Before:** React components (e.g., EmptyState) triggered ESLint warnings due to missing prop validations, or bypassed them with comments.
**Issue:** Missing type definitions reduce maintainability and catchability of prop mismatch bugs, particularly in reusable UI components.
**Learning:** Explicitly importing PropTypes from prop-types and defining them avoids ESLint warnings correctly without suppressing them, improving the reusability and type safety of shared components.
