# Market Research Report
**App:** Alchemistry is an interactive, web-based 3D virtual chemistry laboratory for students to conduct safe experiments and teachers to monitor progress.
**Market:** EdTech / Virtual Science Labs
**Date:** 2026-04-19
**Competitors Researched:** PhET Interactive Simulations, Beyond Labz, Labster, ChemCollective

## Executive Summary
The virtual chemistry lab market is split between gamified narrative-driven tools (Labster), data-heavy realistic simulations (Beyond Labz), and accessible web-based interactives (PhET, ChemCollective). Alchemistry sits comfortably in the accessible web-based segment but differentiates itself with its modern UI, 3D Canvas integration, and AI Tutor. To compete with the leaders, Alchemistry needs to bridge the gap between "sandbox exploration" and "structured learning" by introducing better data visualization, realistic constraints (like temperature/pressure), and robust assignment/grading flows for educators.

## Competitor Analysis
* **PhET Interactive Simulations:** Free, highly accessible 2D simulations. Excels at visualising invisible concepts (atoms, bonds) but lacks realistic lab workflows or assessment tools.
* **Beyond Labz:** Highly realistic, complex simulations mirroring real lab bench setups. Strong analytical tools (NMR, FTIR) and procedural workflows, but UI feels dated and less accessible.
* **Labster:** Premium, gamified 3D labs with strong storylines and built-in assessments. Excellent student engagement and LMS integration, but expensive and resource-heavy.
* **ChemCollective:** Scenario-based activities and autograded virtual labs. Great for linking computation to chemistry, but visually basic.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Thermochemistry / Environmental Controls:** Competitors allow manipulating temperature and pressure, while Alchemistry currently only manipulates concentrations.
* **Analytical Tools:** Missing basic measurement readouts like pH meters, thermometers, or spectroscopy tools.
* **Procedural Constraints:** Alchemistry acts as an open sandbox without safety protocols or sequence-dependent steps (e.g., must wear goggles, must add acid to water).

### Differentiating Opportunities (Stand-out features)
* **Real-time Data Graphing:** Automatically plotting reaction rates or pH changes over time during an experiment.
* **Exportable Lab Reports:** Allowing students to export their experiment history and AI chat logs as a formatted PDF for submission.

### UX Patterns (Design/interaction patterns common in top products)
* **Guided Scenarios / Storylines:** Wrapping experiments in a real-world problem context (e.g., "Test this water sample for toxicity").
* **Visual "Workbench" Organization:** Drag-and-drop equipment setup rather than fixed slider controls.

## Prioritised Recommendations

### 1. Interactive pH and Temperature Readouts — Priority: HIGH | Effort: MEDIUM
**What:** Add a live "digital display" component to the 3D scene or UI overlay showing current pH and temperature based on chemical mixtures.
**Why:** Standard in all competitors. Moves the app from a simple visual mixer to a quantitative scientific tool.
**Where in code:** `client/src/pages/Lab3D.jsx` (UI overlay) and `client/src/components/PhysicsLab.jsx` (calculation logic).
**How:** Create a `DigitalReadout` component. Pass `chemA` (acid) and `chemB` (base) values to a utility function that estimates pH and temperature change (exothermic), updating state continuously.

### 2. Exportable Lab Report (PDF/CSV) — Priority: HIGH | Effort: SMALL
**What:** A button on the History page to export the experiment log and results as a CSV or PDF.
**Why:** Teachers require tangible proof of work for grading; students need to submit reports.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export Log" button. Use a library like `papaparse` for CSV or `jspdf` for PDF generation, mapping the `historyLogs` state to document columns.

### 3. Scenario-Based Assignments — Priority: MEDIUM | Effort: LARGE
**What:** Introduce "Missions" or "Guided Labs" where users must achieve a specific target (e.g., neutralize a solution to exactly pH 7) to pass.
**Why:** Labster and ChemCollective show that gamified goals significantly improve engagement over pure sandbox play.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (Mission selection), `client/src/pages/Lab3D.jsx` (Mission validation logic).
**How:** Expand the `useAssignmentStore` to include target parameters. Modify the `reactionResult` check in `Lab3D.jsx` to validate if the result meets the specific assignment criteria.

### 4. Safety Protocol Checklist (Pre-lab) — Priority: MEDIUM | Effort: SMALL
**What:** A quick modal before entering the 3D lab requiring the student to "equip" goggles and gloves.
**Why:** Reinforces real-world lab safety habits, a key feature in Beyond Labz.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `SafetyModal` component that blocks interaction until the user clicks checkboxes for PPE, storing the state locally.

### 5. AI Tutor Context-Awareness — Priority: HIGH | Effort: MEDIUM
**What:** Pass the current slider values (chemical concentrations) directly into the AI Tutor's prompt context.
**Why:** Makes the AI truly helpful ("I see you've added too much Acid...") rather than generic.
**Where in code:** `client/src/components/AiTutorPanel.jsx`
**How:** Access `useLabStore` or pass props from `Lab3D.jsx` to inject `chemA`, `chemB`, etc., into the hidden system prompt when a user asks a question.

### 6. Environmental Controls (Heat/Ice Bath) — Priority: MEDIUM | Effort: MEDIUM
**What:** Add UI toggles for "Heat Plate" and "Ice Bath" that affect the reaction outcome.
**Why:** Introduces thermochemistry concepts, matching PhET's capabilities.
**Where in code:** `client/src/pages/Lab3D.jsx` and backend reaction logic.
**How:** Add a new state `temperatureModifier`. Pass this to the `initiateReaction` API call to influence reaction rate or success criteria.

### 7. Teacher Dashboard: Class Analytics — Priority: HIGH | Effort: MEDIUM
**What:** Aggregate class data showing common mistakes or average scores on assignments.
**Why:** Teachers need to identify struggling students quickly.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Create an `AnalyticsPanel` that fetches grouped history data, displaying a simple bar chart of pass/fail rates for recent assignments.

### 8. Drag-and-Drop Equipment Assembly — Priority: LOW | Effort: LARGE
**What:** Allow users to construct their own apparatus (beaker + bunsen burner + condenser) instead of a fixed setup.
**Why:** Matches the procedural learning value of Beyond Labz.
**Where in code:** `client/src/components/PhysicsLab.jsx` (Three.js scene)
**How:** Implement drag controls in React Three Fiber, allowing users to snap 3D models together.

### 9. Time-Series Data Graphing — Priority: LOW | Effort: MEDIUM
**What:** A live line graph plotting simulated reaction rate or pH over time.
**Why:** Teaches data interpretation skills.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `Recharts` component in a side panel that plots simulated data points generated during the `loading` reaction state.

### 10. Multi-Step Synthesis Reactions — Priority: LOW | Effort: LARGE
**What:** Allow the product of one reaction to be used as the reactant in the next.
**Why:** Necessary for teaching organic chemistry (like Beyond Labz).
**Where in code:** `client/src/store/labStore.js` and backend.
**How:** Save successful products to a "Flask Inventory" state that can be selected in place of standard starting chemicals.

## Quick Wins (< 1 day each)
1. **Exportable Lab Report (CSV):** Quick to add in `history.jsx` using vanilla JS or a small library.
2. **AI Tutor Context-Awareness:** Just modifying the system prompt string in `AiTutorPanel.jsx` to include current state variables.
3. **Safety Protocol Checklist:** A simple React modal before the Canvas renders.
