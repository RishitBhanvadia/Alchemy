# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive student experiments.
**Market:** Educational Technology / Virtual STEM Simulations
**Date:** 2025-05-19
**Competitors Researched:** Labster, ChemCollective, PhET Interactive Simulations, MyChemLab

## Executive Summary
The virtual chemistry lab market focuses heavily on providing safe, accessible, and pedagogically sound environments for students to experiment and visualize complex reactions. While Alchemistry has a solid foundation with its 3D interactive lab and real-time reaction results, it lacks several core workflow features standard in the space. The biggest opportunity is bridging the gap between running experiments and post-experiment analysis.

## Competitor Analysis
*   **Labster:** The market leader. Differentiates with highly gamified storylines, comprehensive assessments, and robust LMS integrations.
*   **ChemCollective:** Focuses on realistic scenario-based learning. Allows students to design their own experimental setups and tackle open-ended problems. Strong emphasis on calculations and quantitative results.
*   **PhET Interactive Simulations:** Extremely accessible and intuitive. Focuses on underlying physical and chemical principles through visual intuition rather than complex storylines.
*   **MyChemLab:** Emphasizes AI integration and personalized learning paths, highlighting cost-effectiveness compared to physical labs.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export:** Competitors allow students to export their experimental data (CSV/PDF) for lab reports or teacher grading.
*   **Quantitative Tooling:** Built-in calculators, graphing tools, or detailed numerical readouts during experiments.
*   **Guided Tutorials/Onboarding:** Step-by-step walkthroughs for first-time users to understand the interface and mechanics.

### Differentiating Opportunities (Stand-out features)
*   **Scenario-Based Challenges:** Pre-configured "missions" (e.g., "Identify the unknown substance") rather than purely sandbox environments.
*   **Real-time Collaboration:** Multiplayer features allowing students to work on the same virtual lab bench simultaneously.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips:** Explaining the function of each chemical or tool when hovered over.
*   **Split-Screen View:** Viewing the 3D lab alongside an interactive notebook or lab manual.
*   **Visual Indicators:** Clear visual cues (glows, highlights) for interactive elements in the 3D space.

## Prioritised Recommendations

### 1. CSV Data Export for Experiment History — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the History page to export experiment logs.
**Why:** Data export is table stakes for educational tools. Students need their data for lab reports, and teachers need it for grading.
**Where in code:** `client/src/pages/history.jsx`
**How:** Create a helper function `exportToCSV(logs)` that converts the `logs` array from `useHistoryStore` into CSV format and triggers a browser download via a `Blob` and temporary `<a>` tag. Add a button next to the "EXPERIMENT LOGS" title.

### 2. Contextual Tooltips for Chemicals — Priority: HIGH | Effort: SMALL
**What:** Display informative tooltips when hovering over chemical sliders or 3D objects.
**Why:** Common pattern in PhET and Labster to reinforce learning without cluttering the UI.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a simple `Tooltip` component or use standard `title` attributes on the `.slider-card` elements to provide brief descriptions (e.g., "Hydrochloric Acid (HCl): A strong acid used to lower pH").

### 3. Guided First-Run Tutorial — Priority: MEDIUM | Effort: MEDIUM
**What:** A step-by-step onboarding overlay introducing the core lab mechanics (selecting chemicals, initiating reaction).
**Why:** The current interface drops users directly into the sandbox. Competitors use tutorials to ensure users understand the mechanics.
**Where in code:** `client/src/pages/Lab3D.jsx` and new `TutorialOverlay` component.
**How:** Implement a state `hasSeenTutorial` in `localStorage`. If false, render a semi-transparent overlay that highlights specific UI elements (e.g., the HCl slider, then the "Initiate Reaction" button) with brief instructions.

### 4. Interactive Lab Notebook Panel — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out panel allowing students to take notes during an experiment.
**Why:** Essential for bridging the gap between simulation and traditional lab practices.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a collapsible side panel containing a `<textarea>` bound to local state. These notes could eventually be saved alongside the experiment log in Supabase.

### 5. Configurable "Missions" or Scenarios — Priority: LOW | Effort: LARGE
**What:** Pre-set challenges (e.g., "Neutralize the solution to pH 7") with specific victory conditions.
**Why:** Differentiates the app from a pure sandbox, aligning with Labster's gamified approach.
**Where in code:** `client/src/store/historyStore.js`, `Lab3D.jsx`, and a new `Missions` page.
**How:** Requires defining a schema for "Missions" (initial state, target outcome), a UI to select them, and logic in `Lab3D.jsx` to evaluate success against the mission parameters rather than just rendering the result.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** Highly requested table stakes feature, easily implementable using existing store data.
2. **Contextual Tooltips:** Low effort addition that improves educational value and usability.
3. **Empty State Actionability:** Ensure the empty state on the History page has a clear CTA to start an experiment (already implemented in `history.jsx`, but good to verify).
