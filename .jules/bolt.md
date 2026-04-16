## 2025-04-15 - Cursor Follower Re-render Optimization
**Learning:** Attaching React `useState` hooks directly to `mousemove` events causes severe performance degradation, as it triggers a full component re-render on every pixel moved.
**Action:** Always use `useRef` and direct DOM manipulation for highly frequent events like mouse tracking or scrolling to bypass the React render cycle entirely. Also ensure early returns for hooks (like checking for touch devices) occur *after* all hooks are declared to avoid "Rules of Hooks" violations.
