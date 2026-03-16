# CI Failures Analysis Report

**Context:** During the latest CI run (GitHub Actions `test` job, Node 18.x), the build failed due to numerous ESLint errors across the `client` application.

As a strictly read-only analysis agent (Scout), the following is a detailed report of the failures. I am not committing code fixes to preserve read-only constraints.

## High-Level Summary
The CI pipeline failed during the `npm run lint` step. ESLint identified **79 problems (51 errors, 28 warnings)**. The primary failure categories are:
1.  **React Hook Immutability / Purity (`react-hooks/immutability`, `react-hooks/purity`):** Impure function calls (`Math.random()`) during render and modification of hook return values (`gl.domElement.style.cursor`).
2.  **Unknown Properties (`react/no-unknown-property`):** Three.js specific attributes being flagged by React on DOM/Canvas elements.
3.  **Unused Variables (`no-unused-vars`):** Imports and variables defined but never used.
4.  **Missing Prop Validation (`react/prop-types`):** Component props lacking explicit validation.
5.  **Accessibility (`jsx-a11y/label-has-associated-control`):** Form labels missing associated inputs.
6.  **Unescaped Entities (`react/no-unescaped-entities`):** Raw apostrophes (`'`) in JSX text.
7.  **Console Statements (`no-console`):** Unexpected `console.log` or similar statements.

## Detailed Breakdown & Recommended Fixes

### 1. React Hook Errors (Critical Logic Issues)
**Impure Functions (`Math.random()`):**
*   **Files:** `client/src/components/3d-animations/ParticleSystem.jsx` (Lines 22-49), `client/src/components/3d-animations/PhysicsLab.jsx` (Lines 43-48).
*   **Root Cause:** `Math.random()` is called directly inside the component body (during render phase) to generate initial state arrays. This violates React's purity rules and causes unstable results across renders.
*   **Recommended Fix:** Replace direct initialization with `useState` and a lazy initializer function:
    ```javascript
    // Instead of: const bubbles = new Array(count).fill().map(() => ({ position: Math.random() }));
    // Do this:
    const [bubbles] = useState(() => new Array(count).fill().map(() => ({ position: Math.random() })));
    ```

**Immutability Violations (`gl.domElement.style.cursor`):**
*   **File:** `client/src/components/3d-animations/DraggableFlask.jsx` (Lines 45, 98)
*   **Root Cause:** Directly modifying `gl.domElement.style.cursor` mutates the `gl` context object returned by `useThree()`.
*   **Recommended Fix:** Use standard DOM manipulation instead:
    ```javascript
    // Instead of: gl.domElement.style.cursor = 'grab';
    // Do this: document.body.style.cursor = 'grab'; // Remember to reset to ''
    ```

### 2. Unknown Properties (Three.js Attributes)
*   **File:** `client/src/components/ParticleEmitter.jsx` (Lines 268-292), `client/src/components/3d-animations/DraggableFlask.jsx` (Lines 185, 205), `client/src/components/3d-animations/PhysicsLab.jsx` (Line 148).
*   **Root Cause:** React Three Fiber uses standard React JSX, but ESLint's core React plugin doesn't recognize Three.js attributes like `count`, `array`, `itemSize`, `vertexColors`, `blending`, `depthWrite`, `uColor`, `visible`.
*   **Recommended Fix:** Add these specific properties to the `ignore` list of the `react/no-unknown-property` rule in `client/.eslintrc.json`.

### 3. Unused Variables & Imports
*   **Files:**
    *   `client/src/components/Beaker.jsx` (Line 16): `THREE` defined but unused.
    *   `client/src/components/Flask.jsx` (Line 17): `THREE` defined but unused.
    *   `client/src/components/ClassroomManager.jsx` (Line 41): `data` unused.
    *   `client/src/hooks/useLabPhysics.js` (Lines 110, 123): `e` unused.
    *   `client/src/hooks/usePerformanceScaling.js` (Lines 12, 13): Setters unused.
    *   `client/src/pages/Lab3D.jsx` (Line 17): `navigate` unused.
    *   `client/src/pages/Profile.jsx` (Line 10): `experiments` unused.
    *   `client/src/pages/TeacherDashboard.jsx` (Lines 12): `useMemo`, `useCallback` unused.
*   **Recommended Fix:** Remove unused imports and variables, or prefix them with `_` if intentionally unused (e.g., `_e`).

### 4. Accessibility & JSX Formatting
*   **Files:** `client/src/pages/TeacherDashboard.jsx` (Lines 383, 392).
*   **Root Cause:** `<label>` tags must wrap their input or use the `htmlFor` attribute linking to an input `id`.
*   **Recommended Fix:** Update labels to properly associate with controls.
*   **Unescaped Entities:** `client/src/components/ErrorBoundary.jsx`, `client/src/components/AiTutorPanel.jsx`, `client/src/pages/Dashboard.jsx`.
*   **Recommended Fix:** Replace raw `'` with `&apos;` in JSX text content.

### 5. Prop Validation Warnings
*   Multiple components (`ResultModal`, `LoadingOverlay`, `AiTutorPanel`, `PhysicsLab`, `DraggableFlask`) are missing `propTypes` definitions for their props.
*   **Recommended Fix:** Import `PropTypes` and define `Component.propTypes = { ... }` for all passed properties.

### 6. Missing Dependencies in Hooks
*   **File:** `client/src/pages/Profile.jsx` (Line 56): Missing `calculateStats` in `useEffect` dependency array.
*   **File:** `client/src/components/3d-animations/DraggableFlask.jsx` (Line 64): Missing `label` and `locked` in `useCallback` dependency array.
*   **Recommended Fix:** Add the required dependencies to the respective arrays.
