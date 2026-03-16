## 2024-05-18 - [React Mouse Event State Updates]
**Learning:** Using React state (`useState`) to track and update cursor positions on high-frequency events like `mousemove` causes excessive and costly re-renders.
**Action:** Use `useRef` and direct DOM manipulation for high-frequency style updates to avoid triggering component re-renders.
