# Market Research Report
**App:** A virtual chemistry laboratory for students with 3D simulations, real-time feedback, teacher dashboards, and an AI tutor.
**Market:** EdTech Virtual STEM/Chemistry Lab Software
**Date:** 2024-06-14
**Competitors Researched:** Labster, PraxiLabs, ChemReaX, Beyond Labz

## Executive Summary
The virtual chemistry lab market is highly competitive, dominated by platforms that emphasize highly realistic interactive environments (Labster, PraxiLabs) and deep scientific modeling (ChemReaX). Alchemistry already has a strong foundation with its 3D environment (React Three Fiber) and AI Tutor integration. The top opportunities for Alchemistry lie in increasing educational rigor with "Pre-Lab" and "In-Lab" knowledge checks, improving UI affordances for interactive chemistry equipment (like pipettes and scales), adding robust lab manual/SOP features inside the 3D lab view, and enabling structured data export for teachers.

## Competitor Analysis
* **Labster:** Market leader in highly gamified, 3D immersive labs. Key differentiator is its built-in quizzes that gate progress, preventing students from just clicking through.
* **PraxiLabs:** Focuses on realistic interactions and practice-centric simulations. Strong bilingual support and step-by-step guidance.
* **ChemReaX:** Lighter on graphics, heavy on deep thermodynamic and kinetic calculations. Excellent at letting users construct a massive variety of open-ended reactions.
* **Beyond Labz:** Focuses on open-ended sandbox environments with very detailed, realistic-looking lab benches and equipment.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* Built-in interactive lab manuals / theory guides inside the simulation view.
* Knowledge checks / Quizzes before or during the simulation.
* Granular interaction with lab equipment (e.g., pouring, weighing, measuring).

### Differentiating Opportunities (Stand-out features)
* Seamlessly hooking the existing AI Tutor to current simulation state to explain *why* a reaction failed.
* "Pre-Lab Check" assignments before allowing simulation access.

### UX Patterns (Design/interaction patterns common in top products)
* Side-panel theory/manual viewers that do not obstruct the 3D canvas.
* Explicit "Drag and Drop" hints for equipment.
* Clear, persistent "Current Objective" trackers.

## Prioritised Recommendations

### 1. In-Lab Theory & Manual Side Panel — Priority: HIGH | Effort: MEDIUM
**What:** A collapsible side panel in the 3D lab that displays the standard operating procedure (SOP) and theory for the current experiment.
**Why:** Competitors like PraxiLabs provide step-by-step guidance. Currently, Alchemistry has hints, but no structured lab manual view in the 3D space.
**Where in code:** Add to `client/src/pages/Lab3D.jsx` alongside `AiTutorPanel`.
**How:** Create a `LabManualPanel.jsx` component that reads from experiment data, rendering markdown/text.

### 2. Pre-Lab Knowledge Check — Priority: HIGH | Effort: MEDIUM
**What:** A short 3-question quiz modal that appears before allowing the student to start the 3D lab.
**Why:** Labster uses this to ensure students understand the theory before playing.
**Where in code:** `client/src/pages/Lab3D.jsx` (initialization logic).
**How:** Add a modal component that blocks the `Canvas` until completed.

### 3. "Current Objective" Tracker — Priority: HIGH | Effort: SMALL
**What:** A persistent, unobtrusive UI element in the top corner of the lab showing the current step (e.g., "Add 5ml of HCl").
**Why:** Essential for keeping students on track in open environments.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore`.
**How:** Add `currentObjective` to `labStore`, update it via new actions, and render a simple floating `div` in `Lab3D.jsx`.

### 4. Context-Aware AI Tutor Prompts — Priority: MEDIUM | Effort: SMALL
**What:** Auto-suggest questions to the AI Tutor based on the current chemicals in the lab or the recent reaction result.
**Why:** Reduces friction for students to engage with the AI.
**Where in code:** `client/src/components/AiTutorPanel.jsx`.
**How:** Add "Suggested Questions" chips above the chat input based on `chemA` and `chemB` states from `labStore`.

### 5. Detailed Result Data Export (CSV) — Priority: MEDIUM | Effort: SMALL
**What:** Allow teachers and students to export experiment history to CSV.
**Why:** Standard feature in all edtech platforms for grading and reporting.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Add a "Download CSV" button that uses a simple utility function to map history data to CSV format and trigger a file download.

### 6. Realistic Equipment Interaction Affordances — Priority: MEDIUM | Effort: LARGE
**What:** Visual cues (like glowing outlines) when 3D lab equipment can be interacted with.
**Why:** Improves discoverability, a common pattern in Beyond Labz.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Use `@react-three/drei`'s `Outlines` or hover state events to change mesh materials when the pointer enters.

### 7. Explicit Measurement Controls (Pipettes/Scales) — Priority: LOW | Effort: LARGE
**What:** Instead of simple selection, require users to measure exact amounts of chemicals.
**Why:** Deepens the educational value, matching ChemReaX and Labster rigor.
**Where in code:** `client/src/store/labStore` and `client/src/pages/Lab3D.jsx`.
**How:** Introduce `volume` or `mass` states for selected chemicals and UI sliders/inputs to set them before reacting.

### 8. Badges for "Safety" & "Accuracy" — Priority: LOW | Effort: SMALL
**What:** Expand the existing application to reward specific lab behaviors.
**Why:** Enhances engagement.
**Where in code:** `client/src/store/authStore`.
**How:** Add new logic when completing reactions without errors or using the exact correct sequence.

### 9. Shareable Experiment Results — Priority: LOW | Effort: SMALL
**What:** A button to copy a link or generate an image of a successful reaction result.
**Why:** Encourages student engagement and peer sharing.
**Where in code:** `client/src/components/ResultModal`.
**How:** Use the `navigator.clipboard` API to copy formatted text of the result.

### 10. Teacher Analytics: "Common Mistakes" Widget — Priority: LOW | Effort: MEDIUM
**What:** A widget on the teacher dashboard showing which reactions fail most often across the class.
**Why:** Highly requested feature in EdTech to guide teaching focus.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Query Supabase for failed reaction logs and display in a new list component.

## Quick Wins (< 1 day each)
1. "Current Objective" Tracker
2. Context-Aware AI Tutor Prompts
3. Detailed Result Data Export (CSV)
