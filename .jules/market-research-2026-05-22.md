# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory allowing students to conduct experiments safely.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-05-22
**Competitors Researched:** Labster, PhET Interactive Simulations, ChemCollective, Gizmos

## Executive Summary
The virtual chemistry lab market is transitioning from basic 2D simulations to immersive 3D, gamified experiences with strong educational scaffolding. Alchemistry currently has a solid 3D foundation and basic modules (Organic, Titration, Inorganic). However, it lacks the structured learning paths, safety enforcement, and collaborative tools that top competitors use to drive engagement and learning outcomes. Adding these features will bridge the gap between a "sandbox" and a "learning platform".

## Competitor Analysis
- **Labster:** Market leader. Heavy focus on gamified storylines (e.g., "Escape the Lab"), built-in quizzes, and strict safety procedure enforcement.
- **PhET Interactive Simulations:** Focuses on accessibility, intuitive visual models, and broad curriculum alignment, though less immersive graphically.
- **ChemCollective:** Emphasizes scenario-based learning and real-world problem-solving (e.g., forensic analysis) rather than pure exploration.
- **Gizmos:** Focuses strongly on data visualization, variable manipulation, and inquiry-based learning investigations.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Mandatory safety protocol checks before starting experiments.
- Step-by-step guided tutorials for first-time users.
- Built-in formative assessment (quizzes) during experiments.

### Differentiating Opportunities (Stand-out features)
- Gamified storylines or "missions" (e.g., solving a mystery using chemistry).
- Collaborative lab sessions (multiplayer).
- Exportable lab reports with auto-generated data visualizations.

### UX Patterns (Design/interaction patterns common in top products)
- Contextual tooltips explaining equipment functions.
- A "Lab Notebook" overlay that automatically logs observations.
- Visual warnings/feedback for dangerous combinations before they explode.

## Prioritised Recommendations

### 1. Safety Gear Check Onboarding — Priority: HIGH | Effort: SMALL
**What:** A mandatory checklist popup (goggles, gloves, coat) before entering the 3D lab.
**Why:** Standard in Labster; reinforces real-world safety habits.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a `SafetyCheckModal` component before rendering the canvas).
**How:** Create a React modal state `[isSafe, setIsSafe]` that requires users to click three toggle buttons before the `PhysicsLab` component loads.

### 2. Contextual Equipment Tooltips — Priority: HIGH | Effort: SMALL
**What:** Hover tooltips over 3D lab equipment explaining their use.
**Why:** Reduces cognitive load for beginners, common in PhET.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (or related 3D models).
**How:** Use `@react-three/drei`'s `Html` component to overlay text when `onPointerOver` is triggered on specific meshes.

### 3. Guided Experiment "Missions" — Priority: MEDIUM | Effort: MEDIUM
**What:** Scenario-based tasks (e.g., "Synthesize Aspirin") instead of open sandbox play.
**Why:** Drives engagement; core differentiator for ChemCollective and Labster.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Add a `currentMission` state in `labStore`. Create a `MissionPanel` UI component that checks `reactionResult` against mission objectives.

### 4. Interactive Lab Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** A persistent, slide-out panel where students can type notes alongside auto-logged reactions.
**Why:** Essential for science education; improves upon the current static history view.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/HistoryPanel.jsx` (new).
**How:** Expand the existing `useHistoryStore` to include user-editable notes per log entry. Add a floating toggle button to slide out the panel.

### 5. Exportable Lab Reports (PDF/CSV) — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to download their experiment history as a formatted report.
**Why:** Crucial for teacher grading; standard in all competitors.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add an "Export" button. Use a library like `jspdf` or `papaparse` to convert the `logs` array from `useHistoryStore` into a downloadable file.

### 6. Visual Hazard Warnings — Priority: LOW | Effort: MEDIUM
**What:** Screen effects (e.g., red vignette) or UI warnings when mixing potentially dangerous chemicals.
**Why:** Increases immersion and safety awareness before a simulated explosion occurs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`.
**How:** Add a `hazardLevel` calculation in the store based on selected chemicals. Pass this to a full-screen CSS overlay with varying opacity.

### 7. Formative Assessment Quizzes — Priority: LOW | Effort: LARGE
**What:** Pop-up multiple-choice questions triggered after specific reactions.
**Why:** Validates learning; highly requested by educators (seen in Labster).
**Where in code:** `client/src/components/AiTutorPanel.jsx` (or a new `QuizModal.jsx`).
**How:** Intercept the reaction logic. If a target reaction occurs, pause the simulation and render a modal fetching questions from a new database table.

### 8. Teacher Analytics Dashboard Enhancement — Priority: MEDIUM | Effort: MEDIUM
**What:** Visual charts showing class progress on specific experiments.
**Why:** Teachers need actionable data, not just raw logs.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Integrate `recharts` or `chart.js` to visualize the aggregated student history data already available to teachers.

### 9. Multi-Language Support — Priority: LOW | Effort: LARGE
**What:** Localization of UI and chemical names.
**Why:** Expands market reach; standard in PhET.
**Where in code:** Across all UI components.
**How:** Implement `react-i18next`. Wrap text strings and create JSON translation files.

### 10. Real-time Multiplayer Lab — Priority: LOW | Effort: VERY LARGE
**What:** Two students interacting in the same 3D lab environment.
**Why:** Ultimate differentiator; highly engaging but complex.
**Where in code:** Backend (`server/server.js`) and Frontend (`Lab3D.jsx`).
**How:** Replace simple API calls with WebSockets (Socket.io) to sync 3D positions and lab state between connected clients.

## Quick Wins (< 1 day each)
1. Safety Gear Check Onboarding
2. Exportable Lab Reports (CSV)
3. Contextual Equipment Tooltips