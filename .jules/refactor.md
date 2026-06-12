## 2024-05-18 - Math.random() in secure code generation
**Before:**
```javascript
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let code = '';
for (let i = 0; i < 6; i++) {
  code += chars.charAt(Math.floor(Math.random() * chars.length));
}
```
**Issue:** `Math.random()` is not cryptographically secure, and this logic was duplicated in multiple controllers (`classroomController` and `meetingController`).
**Learning:** For codes used as join links or classroom IDs, always use Node's native `crypto` module (e.g., `crypto.randomInt()`). I extracted this into a reusable utility `server/utils/random.js` to adhere to DRY principles and improve security simultaneously.

## 2024-05-18 - Muting React Compiler rules vs Fixing them
**Before:** Trying to rewrite `useMemo` blocks using `useRef` to avoid React Compiler `immutability` warnings in Three.js/R3F components.
**Issue:** Converting a `useMemo` that generates TypedArrays for a Three.js buffer geometry into a `useRef` introduced `react-hooks/refs` errors during the render phase because we were accessing `.current` directly in the JSX `<bufferAttribute array={ref.current.positions}>` (which is standard for R3F but strictly disallowed by React 19+ compiler rules).
**Learning:** In highly mutated environments like WebGL animation loops (using `@react-three/fiber`), standard React hooks rules regarding immutability are fundamentally at odds with the imperative nature of the canvas/Three.js state. The best practice for this codebase is to retain `useMemo` for memory allocation (since the arrays shouldn't change across rerenders, only their contents) and selectively wrap them with `/* eslint-disable react-hooks/immutability */` to satisfy the linter without breaking React's ref access rules or the application build.
