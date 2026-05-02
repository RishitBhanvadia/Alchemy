## 2025-05-02 - Fix ESLint react-hooks/immutability for useThree gl mutation
**Bug:** Client fails linting (`pnpm run lint`) because ESLint flags the mutation of `gl.domElement.style.cursor` returned from `@react-three/fiber`'s `useThree` hook.
**Root Cause:** Direct mutation of objects (`gl`) returned by hooks violates the `react-hooks/immutability` rule, preventing compilation in strict configurations.
**Learning:** For pointer cursor styling in R3F environments, use `document.body.style.cursor` instead of trying to directly mutate the WebGL canvas style through the `gl` instance.
