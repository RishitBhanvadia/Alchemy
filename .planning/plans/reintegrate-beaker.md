---
title: Re-integrate ReactiveBeaker into Lab
gap_closure: true
target_files:
  - Alchemistry-master/client/src/pages/lab.jsx
---

# Plan: Re-integrate ReactiveBeaker

## Problem
`ReactiveBeaker` was removed from `Lab.jsx` for UI cleanup but is a core component.

## Strategy
1. Import `ReactiveBeaker` in `lab.jsx`.
2. Re-insert it into the `CanvasContainer` in the JSX.
3. Restore `experimentStatus` logic to drive the beaker's animation.

## Steps
1. Modify `Alchemistry-master/client/src/pages/lab.jsx`.
2. Import `ReactiveBeaker` from `../components/3d-animations/ReactiveBeaker`.
3. Update state to include `experimentStatus`.
4. Render `<ReactiveBeaker status={experimentStatus} />` inside `<CanvasContainer>`.
