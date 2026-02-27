## 2024-05-24 - Accessibility Patterns in Virtual Labs
**Learning:** Virtual lab interfaces often rely heavily on visual metaphors (like liquid levels in test tubes) which are inaccessible to screen readers without explicit text alternatives.
**Action:** When creating visual interactive elements, always pair them with `aria-live` regions or descriptive labels that update dynamically to reflect the state changes (e.g., "Reaction initiated", "Chemical added").
