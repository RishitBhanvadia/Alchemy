# Palette's Journal
## 2024-05-30 - ARIA Labels for Icon-Only Buttons
**Learning:** Icon-only buttons relying solely on emojis (like 📋 for copy, 🚀 for launch, 🗑️ for delete) lack accessible names, making them unreadable or confusing for screen reader users.
**Action:** Always add descriptive `aria-label` attributes to icon-only interactive elements (`button`, `a`) to ensure their purpose is communicated clearly to assistive technologies.

## 2024-05-30 - Click Events on Non-Interactive Elements
**Learning:** Adding `onClick` handlers to non-interactive elements like `div` or `span` (e.g., for modal overlays) triggers `jsx-a11y/no-static-element-interactions` and `jsx-a11y/click-events-have-key-events` lint errors because these elements are not inherently keyboard accessible.
**Action:** For elements serving purely structural or visual roles (like background overlays that close a modal on click), add `role="presentation"` to explicitly indicate they lack semantic meaning and suppress these accessibility warnings.
