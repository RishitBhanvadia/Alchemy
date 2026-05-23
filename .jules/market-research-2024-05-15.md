# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments (like titration and 3D simulations) in a 3D environment with teacher and student dashboards.
**Market:** EdTech / Virtual STEM Simulations / Online Chemistry Education
**Date:** 2024-05-15
**Competitors Researched:** Labster, PhET Interactive Simulations, ChemCollective

## Executive Summary
The virtual chemistry lab market has evolved from simple standalone simulations to comprehensive, scaffolded learning environments. Top platforms prioritize not only accurate scientific interactions but also guided pedagogical features. Alchemistry has a strong technical foundation with its 3D environment, AI tutor, and role-based dashboards. The primary opportunities lie in bridging the gap between open-ended exploration and structured learning by adding guided experiment flows, real-time data visualization, and accessibility enhancements.

## Competitor Analysis
* **Labster:** Focuses on highly immersive, gamified, and story-driven virtual labs with embedded quizzes and step-by-step guidance.
* **PhET Interactive Simulations:** Provides open-ended, highly interactive simulations with a strong emphasis on real-time visual feedback, graphing tools, and accessibility features (like keyboard navigation and screen reader support).
* **ChemCollective:** Offers practical, scenario-based virtual labs and autograded problems, emphasizing virtual workspace organization and standard lab equipment handling.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Real-time Graphing:** Competitors allow students to plot data (e.g., Temperature vs. Time) dynamically as the reaction occurs.
* **Guided Step-by-Step Instructions:** Most platforms offer scaffolded tutorials inside the lab to ensure students don't get stuck.
* **In-Lab Tooltips:** Contextual help for lab equipment and chemicals.

### Differentiating Opportunities (Stand-out features)
* **Scenario-Based Learning:** Embedding the lab in a real-world problem (e.g., testing water quality) rather than just mixing chemicals.
* **Accessibility Enhancements:** PhET leads with robust accessibility for visual/motor impairments. Alchemistry has an `accessibility.css` file but could improve interactive 3D elements.
* **Exportable Data Logs:** Allowing students to export their lab results and sensor data as CSV for lab reports.

### UX Patterns (Design/interaction patterns common in top products)
* **Persistent Sidebar/HUD:** Showing current variable states (temperature, pH) constantly on screen.
* **Drag-and-Drop Snap:** Smooth snapping mechanics for pouring and combining equipment.
* **Interactive Tooltips:** Hovering over equipment shows its name and current state.

## Prioritised Recommendations

### 1. Guided Experiment Mode (Scaffolding) — Priority: HIGH | Effort: MEDIUM
**What:** Add a step-by-step guided mode overlay inside `Lab3D.jsx`.
**Why:** Competitors like Labster use guided flows to prevent student frustration and ensure learning objectives are met.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `useGuidedLabStore` in `client/src/store/labStore.js`.
**How:** Create a `GuidedStepsPanel` component that tracks the current step (e.g., "Add 5ml of HCl") and validates completion using existing state in `labStore`.

### 2. Real-Time Data Graphing — Priority: HIGH | Effort: MEDIUM
**What:** Implement a real-time line chart showing temperature/pH over time during a reaction.
**Why:** Visualizing data is a table-stakes feature in PhET and ChemCollective, helping students connect reactions to graphs.
**Where in code:** `client/src/components/LabGraph.jsx` (new) injected into `client/src/pages/Lab3D.jsx`.
**How:** Utilize the existing `recharts` dependency (loaded lazily with Suspense) to plot the `temperature` variable from `labStore.js` over time using a simple `useEffect` interval when a reaction is active.

### 3. Lab Data CSV Export — Priority: MEDIUM | Effort: SMALL
**What:** Add a button to export experiment results and history as a CSV file.
**Why:** Essential for students writing lab reports, widely supported in educational tools.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`.
**How:** Add an `ExportButton` component that maps the `reactionResult` or `useHistoryStore` data to a CSV format and triggers a download using a Blob.

### 4. Interactive Equipment Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Add context-aware hover tooltips for 3D lab equipment showing chemical name and volume.
**Why:** Reduces cognitive load; users in ChemCollective rely heavily on tooltips to identify ambiguous glassware.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (or similar 3D components).
**How:** Use Drei's `Html` component to render small DOM tooltips attached to the Three.js meshes on `onPointerOver`.

### 5. Persistent Lab HUD — Priority: MEDIUM | Effort: SMALL
**What:** Display constant readouts of key variables (Temperature: 25°C, Thermal State: Neutral) instead of hiding them.
**Why:** Common UX pattern across all top competitors to keep students informed of state changes.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Create a fixed overlay component `LabHUD.jsx` that subscribes to `labStore` values (`temperature`, `deltaH`) and displays them clearly.

### 6. In-Lab Micro-Quizzes — Priority: LOW | Effort: LARGE
**What:** Pause the simulation to ask a conceptual question before a critical reaction step.
**Why:** Labster uses this to check for understanding mid-experiment.
**Where in code:** `client/src/pages/Lab3D.jsx` and `AiTutorPanel.jsx`.
**How:** Integrate a `QuizModal` triggered by specific state changes in the `reactionState`.

### 7. Enhanced Accessibility for Interactive Elements — Priority: LOW | Effort: MEDIUM
**What:** Improve screen-reader compatibility and keyboard navigation for lab interactions.
**Why:** PhET sets the standard here; crucial for educational compliance.
**Where in code:** `client/src/components/3d-animations/` and UI overlays.
**How:** Ensure all interactive UI overlays have proper ARIA labels. For 3D elements, provide hidden DOM fallback buttons for actions like "Pour Chemical A".

### 8. Custom Scenario Builder for Teachers — Priority: LOW | Effort: LARGE
**What:** Allow teachers to create custom "Assignments" with specific initial conditions.
**Why:** Empowers educators to tailor the app to their curriculum, a major selling point for ChemCollective.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/store/assignmentStore.js`.
**How:** Build a form in the teacher dashboard to set target `deltaH` or required chemicals, saving to Supabase and loading via `assignmentStore`.

### 9. Scenario-Based Lab Framing — Priority: LOW | Effort: SMALL
**What:** Add an intro modal to each lab setting up a "real-world" problem to solve.
**Why:** Increases student engagement through storytelling.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add an `IntroModal` component that fetches a brief narrative from `assignmentStore` before allowing interaction.

### 10. Auto-Grading Integration — Priority: LOW | Effort: MEDIUM
**What:** Automatically evaluate the student's final lab state against an expected outcome and send to the teacher dashboard.
**Why:** Saves teachers time and provides immediate feedback.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/TeacherDashboard.jsx`.
**How:** When a lab is completed, compare `reactionResult` to expected values, calculate a score, and update the Supabase `student_progress` table.

## Quick Wins (< 1 day each)
1. **Interactive Equipment Tooltips:** Easily implemented using Drei's `Html` component on existing 3D meshes.
2. **Persistent Lab HUD:** A simple UI overlay reading directly from the existing `labStore.js`.
3. **Lab Data CSV Export:** A lightweight JavaScript function to convert existing store data to CSV blobs.
