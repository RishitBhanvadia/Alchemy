---
title: Phase 2 - Technical Debt & Cleanup
gap_closure: false
target_files:
  - Alchemistry-master/client/src/utils/api.js
  - Alchemistry-master/client/src/pages/result.jsx
  - Alchemistry-master/client/src/pages/lab.jsx
---

# Plan: Technical Debt & Cleanup

## Problem
API calls are scattered across components using raw `fetch`. `VITE_API_URL` handling is repetitive.

## Strategy
1. **Centralized API**: Create `client/src/utils/api.js` with a configured Axios or Fetch wrapper.
2. **Refactor**: Replace direct `fetch` calls in `result.jsx`, `titration.jsx`, etc., with the new utility.
3. **Error Boundaries**: Add a React Error Boundary component to wrap the main App or specific modules to catch crashes gracefully.

## Steps
1. Create `client/src/utils/api.js`.
2. Refactor `result.jsx` to use it.
3. Refactor `lab.jsx` (if applicable) and other modules.
