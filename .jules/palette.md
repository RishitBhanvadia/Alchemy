## 2025-04-23 - Context-Aware ARIA Labels for List Actions

**Learning:** When rendering repetitive list items (like the "Copy code" and "Chemical Lock" buttons in the Classroom Manager map function), standard ARIA labels like `aria-label="Copy"` become ambiguous to screen readers.
**Action:** Use string interpolation with unique identifiers (like `cls.class_name` or `chem`) to create context-aware `aria-label` and `title` attributes: `aria-label={\`Copy join code for ${cls.class_name}\`}`.
