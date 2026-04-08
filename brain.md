# Alchemistry — Codebase Brain

## Documentation Log

### Mobile & Tablet Compatibility Layer (Added April 2026)
To keep the UI cleanly compatible on Mobile devices and tablets, adhere to the following mobile-first architectural layer rules when adding new components:

1. **Height Tracking:** Do not use plain `100vh`. Use `.full-height` utility OR explicitly define `height: 100dvh` alongside `100vh`.
2. **Keyboard Safety:** If creating fullscreen dynamic elements or evaluating innerWidth manually inside JS, ALWAYS parse against `window.visualViewport` to prevent breaking calculations when the virtual tablet/phone keyboard slides open.
3. **No fixed positioning arrays:** Avoid `position: fixed` where possible on modal structures as layout shifts harshly on iOS. Avoid using raw `width: 900px` without an accompanying `max-width`.
4. **Scrolling Lists:** Ensure all localized scrolling boxes use `-webkit-overflow-scrolling: touch` and `overscroll-behavior-y: contain` to prevent chaining root body refreshes.
5. **DOM Performance:** Assume hovering doesn't exist by conditionally restricting `mousemove` trackers behind `window.matchMedia('(hover: hover)')` evaluations. Use standard `onPointer` R3F events for drag-and-drop instead of `onDrag` / `onDrop`.
