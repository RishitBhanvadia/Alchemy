## 2024-05-17 - Test Lab3D API Integration
**Gap:** The critical user flow of starting a chemical reaction (`Lab3D.jsx`) which interfaces with an external API (`/api/results`) and updates global application state (`useLabStore`) was untested.
**Learning:** React Router `v7_startTransition` warnings can be safely ignored, but properly mocking Supabase chained methods (like `.from().update().eq()`) requires `mockReturnThis()` across the chain to prevent `TypeError: .eq is not a function` during component unmounting or interval-based presence updates.
**Pattern:** Combine `vi.mock` for external libraries (axios, react-hot-toast) and manually reset global state (Zustand `useLabStore.setState()`) in `beforeEach` to ensure clean, isolated testing of complex interactive components.
