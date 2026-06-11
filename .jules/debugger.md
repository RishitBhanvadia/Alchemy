## 2023-10-27 - Fix React Compiler Immutability Rules
**Bug:** Modifying the `gl.domElement.style.cursor` in @react-three/fiber hooks triggers `react-hooks/immutability` errors from the React Compiler.
**Root Cause:** The `gl` object is returned by a hook (`useThree`), and modifying its properties inside callbacks violates the compiler strict immutability rules.
**Learning:** When building WebGL interactions with `@react-three/fiber`, DOM mutations on the underlying canvas (`gl.domElement`) are often necessary. To avoid disabling the immutability rule globally, use targeted block-level ESLint disable comments (`/* eslint-disable react-hooks/immutability */`) around specific callbacks that perform safe mutations.
