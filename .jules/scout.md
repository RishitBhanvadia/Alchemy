## 2026-06-11 - Accessibility through Sonification
**Market Insight:** Top interactive STEM tools like PhET have implemented extensive sonification (audio cues mapped to data) for visually impaired students.
**Codebase Match:** Alchemistry uses `@react-three/fiber` for visual simulation in `client/src/pages/Lab3D.jsx` but lacks audio feedback for temperature/reaction changes.
**Opportunity:** Add a basic Web Audio API oscillator hook (`useSonification`) triggered by `labStore.temperature` changes, enabling accessible data interpretation for a low effort (~40 lines).

## 2026-06-11 - LMS Alignment via Curriculum Tags
**Market Insight:** Competitors like Labster categorize simulations specifically by curriculum standards (e.g., NGSS, AP Chemistry), driving higher educator adoption.
**Codebase Match:** The `MODULE_CARDS` in `client/src/pages/StudentDashboard.jsx` lack curriculum mapping.
**Opportunity:** Add standardized tags to `MODULE_CARDS` in `client/src/pages/StudentDashboard.jsx` to map directly to standard curricula, making it an easier sell to schools.
