## 2024-05-23 - Form Accessibility and Feedback Patterns
**Learning:** The application's forms (specifically Login) lacked basic accessibility linkage (htmlFor/id) and visual feedback for async states (loading/error). This creates a "dead" UI feeling during network requests.
**Action:** Standardize form inputs with proper label associations. Implement a reusable pattern for loading buttons (disabled state + text change) and inline error messages (role="alert") instead of alert() popups.
