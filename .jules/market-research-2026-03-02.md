# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Educational Technology (EdTech) / Virtual Science Laboratory Simulations
**Date:** 2026-03-02
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations, ChemCollective

## Executive Summary
The virtual chemistry lab space is highly focused on safety, realism, and educational outcomes. Top competitors like Labster and PraxiLabs differentiate themselves through guided learning, immersive 3D environments, and strict safety protocols (PPE checks). While Alchemistry has a strong 3D foundation and a modern UI, it currently lacks table-stakes features for educational tools, such as data export for grading, real-time visual feedback (graphs), and basic safety enforcement. Addressing these gaps, starting with the easiest implementations like CSV export and virtual PPE, will significantly align the app with educator expectations.

## Competitor Analysis
* **Labster:** The market leader. Offers highly immersive 3D simulations with built-in quizzes, guided learning paths, and strict virtual safety protocols before experiments.
* **PraxiLabs:** Focuses on realistic 3D environments mimicking professional research facilities. Strong emphasis on guided learning and safety.
* **PhET Interactive Simulations:** Extremely popular, free 2D/3D simulations. Highly accessible, focuses on real-time visual feedback, and allows resetting states easily.
* **ChemCollective:** Provides scenario-based learning activities. Strong on data analysis and allowing students to customize their lab setup (choosing glassware, reagents freely).

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Virtual Safety Protocols (PPE):** Real labs require safety gear. Simulators enforce this to build good habits.
* **Data Export:** Educators need a way to collect and grade student results, typically via CSV export.

### Differentiating Opportunities (Stand-out features)
* **Real-time Data Visualization:** Graphing titration curves dynamically as base is added.
* **Guided Onboarding/Tours:** Dropping students into the dashboard without guidance can be overwhelming. Step-by-step interactive tours improve retention.

### UX Patterns (Design/interaction patterns common in top products)
* **Experiment Reset:** Easily restarting an experiment without reloading the page.
* **Contextual Tooltips:** Explaining equipment or chemicals on hover.

## Prioritised Recommendations

### 1. Virtual PPE (Personal Protective Equipment) Checklist — Priority: HIGH | Effort: SMALL
**What:** Require users to "equip" virtual safety goggles and gloves before enabling experiment controls.
**Why:** Competitors (Labster, PraxiLabs) heavily emphasize safety protocols. It's a table-stakes feature for educational chemistry tools to instill good habits.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/titration.jsx`
**How:** Add a `hasPPE` boolean state. Render a modal or toggle switch for "Put on Goggles & Gloves". Disable chemical range sliders/buttons until `hasPPE` is true.

### 2. CSV Data Export — Priority: HIGH | Effort: SMALL
**What:** Allow users to export their experiment logs to a CSV file.
**Why:** Educational tools (PhET, ChemCollective) allow students and educators to export data for analysis and grading.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" button. When clicked, map the `experiments` state array to a CSV string format and trigger a file download using a Blob and an anchor tag.

### 3. Experiment Reset Button — Priority: HIGH | Effort: SMALL
**What:** A dedicated button to quickly clear all chemical levels and reset the simulation state.
**Why:** PhET and other simulators make it easy to start over if a mistake is made. Currently, `lab.jsx` lacks a clear reset (users have to manually zero out sliders).
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "Reset Experiment" button that sets `chemA`, `chemB`, `chemC`, and `chemD` states back to 0.

### 4. Real-time Titration Graph — Priority: MEDIUM | Effort: MEDIUM
**What:** Display a dynamic pH vs. Volume graph during the titration process.
**Why:** Competitors use visual data representations to reinforce learning. Currently, Alchemistry only shows a final score.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Use a library like `recharts` or `chart.js`. Track the `count` state (volume) over time and plot it against an estimated pH value to draw a real-time curve next to the titration setup.

### 5. Guided Dashboard Onboarding — Priority: MEDIUM | Effort: MEDIUM
**What:** A step-by-step interactive tour explaining each module when a new user first logs in.
**Why:** Labster and PraxiLabs excel at guided learning. Currently, the dashboard simply presents options without context.
**Where in code:** `client/src/pages/Dashboard.jsx`
**How:** Implement a lightweight tour library (like `react-joyride`) or build a custom overlay. Check `localStorage` for a `hasSeenTour` flag to trigger it once.

### 6. Contextual Tooltips for Equipment/Chemicals — Priority: MEDIUM | Effort: SMALL
**What:** Tooltips that explain the properties of a chemical or the purpose of equipment when hovered.
**Why:** Enhances the learning experience by providing immediate contextual information, a common pattern in PhET and ChemCollective.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/titration.jsx`
**How:** Wrap the chemical icon images (`<img src={hcl} ... />`) with a simple CSS or React tooltip component displaying the chemical name, formula, and brief hazard warning.

### 7. Detailed Post-Experiment Feedback — Priority: MEDIUM | Effort: MEDIUM
**What:** Provide specific chemical explanations for the result instead of just a generic "Overshot" or raw score.
**Why:** Educational value relies on understanding *why* a reaction succeeded or failed.
**Where in code:** `server/controllers/resultController.js` and `client/src/pages/result.jsx`
**How:** Update the backend logic to return a `feedbackMessage` field based on the chemical combination, and display this field prominently on the result page.

### 8. Accessible High-Contrast Mode — Priority: MEDIUM | Effort: MEDIUM
**What:** A toggle to disable the "neon/glassmorphism" effects in favor of high-contrast, easy-to-read solid colors.
**Why:** Educational tools must be accessible to visually impaired students. PhET is highly accessible.
**Where in code:** `client/src/App.jsx` and `client/src/accessibility.css`
**How:** Add a theme toggle in the Navbar that adds a `high-contrast-theme` class to the body. Define override CSS variables in `accessibility.css`.

### 9. Post-Experiment Assessment (Quiz) — Priority: LOW | Effort: LARGE
**What:** A short 3-question quiz testing the student's knowledge after they complete an experiment.
**Why:** Labster uses quizzes to ensure concepts were grasped, moving beyond just following mechanical steps.
**Where in code:** `client/src/pages/result.jsx`
**How:** Create a new `Quiz` component. Fetch a few questions from Supabase based on the `experiment_type` and require passing the quiz to earn the final score.

### 10. Customizable Lab Setup — Priority: LOW | Effort: LARGE
**What:** Allow students to freely choose which glassware and reagents to place on the workbench, rather than providing fixed sliders.
**Why:** ChemCollective's strength is allowing open-ended experimentation.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Major refactor to use a drag-and-drop interface (e.g., `react-dnd`) to drag bottles from a shelf to a beaker, tracking inventory and mixed state.

## Quick Wins (< 1 day each)
1. **Virtual PPE Checklist** (Table-stakes safety protocol)
2. **CSV Data Export** (Essential for educators/grading)
3. **Experiment Reset Button** (Basic UX improvement for lab module)
