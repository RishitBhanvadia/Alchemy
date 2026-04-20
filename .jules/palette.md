## 2024-04-20 - NavLink Nesting Rules and Isolated Component Testing

**Learning:** In React Router, nesting a `<button>` inside a `<NavLink>` generates invalid HTML because interactive elements cannot be nested. This also causes accessibility tree issues. Furthermore, when complex routing and auth barriers prevent end-to-end verification of small UI components using Playwright, mounting the component in an isolated, temporary HTML file via the development server provides a reliable workaround for visual testing.

**Action:** When creating styled navigation links, replace internal `<button>` tags with `<span>` or `<div>` tags. For visual verification of isolated UI components, construct a temporary Vite HTML mount point rather than attempting to navigate through full authentication flows.
