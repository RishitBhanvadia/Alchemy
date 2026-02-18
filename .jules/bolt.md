## 2026-02-18 - Avoid Full Page Reloads
**Learning:** The `Titration` component used `window.location.reload()` to reset experiment state. This forces a full browser refresh, negating SPA benefits like instant transitions and state persistence.
**Action:** Always prefer resetting React state internally (e.g., via `useState` setters or `useReducer`) over forcing a browser reload. This is significantly faster and provides a better user experience.
