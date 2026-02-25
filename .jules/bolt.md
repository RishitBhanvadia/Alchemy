## 2026-02-25 - Cursor Re-render Bottleneck
**Learning:** The `CursorFollower` component triggered React re-renders on every `mousemove` event, impacting the entire app's performance since it's at the root level.
**Action:** When identifying cursor or mouse-following components, immediately check for state-based position updates and refactor to direct DOM manipulation via `useRef` and `transform`.
