## 2025-02-21 - Custom Input Accessibility Testing
**Gap:** Testing components with custom wrapped inputs using `getByLabelText` fails if `htmlFor` is not explicitly passed to the label.
**Learning:** React Testing Library strictness helps enforce accessibility. Missing `htmlFor` severs the connection between the label and the input, making form inputs unreachable by standard testing queries.
**Pattern:** Always pass the `name` (or `id`) as `htmlFor` to labels in custom input wrappers to ensure `getByLabelText` functions correctly and accessibility is maintained.
