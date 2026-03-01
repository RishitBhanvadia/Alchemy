# Market Research Report
**App:** A web-based virtual chemistry laboratory allowing students to interactively mix chemicals (HCl, NaCl, CuSO4, FeSO4) in a 3D environment, view generated reactions, and track their experiment history.
**Market:** EdTech / Virtual Science Labs
**Date:** 2026-03-01
**Competitors Researched:** PraxiLabs, ChemCollective, Labster, PhET Interactive Simulations

## Executive Summary
The EdTech virtual science lab market is highly focused on safety, engagement, and realistic simulation. While Alchemistry offers a solid foundation with its 3D environment and basic chemical interactions, it lacks critical onboarding, safety protocols, and advanced data interaction features found in top competitors. By implementing virtual PPE checks, contextual guidance, and robust data export, Alchemistry can significantly elevate its educational value and user experience to match industry leaders like PraxiLabs and Labster.

## Competitor Analysis
*   **PraxiLabs:** Focuses on immersive 3D interaction, safety, and gamified experiences with an AI assistant ("Oxi"). Key differentiators include a custom quiz builder and detailed performance analytics.
*   **ChemCollective:** A more academic approach, focusing on linking chemical computations with authentic laboratory chemistry.
*   **Labster:** A major player offering highly gamified, story-driven simulations with extensive assessment tools and LMS integration.
*   **PhET Interactive Simulations:** Known for accessible, highly interactive, and visually intuitive simulations, often focusing on fundamental concepts rather than complex lab procedures.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Safety Protocols (Virtual PPE):** Competitors emphasize safety even in virtual environments. Alchemistry lacks a step to ensure students "equip" safety gear before starting.
*   **Guided Onboarding:** First-time users need a walkthrough of the lab interface and controls.

### Differentiating Opportunities (Stand-out features)
*   **AI Lab Assistant / Contextual Help:** A feature like PraxiLabs' "Oxi" to provide hints and guidance during experiments.
*   **Dynamic Data Visualization:** Real-time graphing of reaction progress or titration curves.
*   **Data Export:** The ability to download experiment history for assignments or analysis.

### UX Patterns (Design/interaction patterns common in top products)
*   **Gamified Feedback:** Immediate, visual feedback on actions (beyond just the final result).
*   **Clear Experiment Objectives:** A dedicated UI panel showing the goal of the current session.

## Prioritised Recommendations

### 1. Virtual PPE Verification — Priority: HIGH | Effort: SMALL
**What:** Require users to click to "wear" safety goggles and gloves before the `INITIATE REACTION` button becomes active.
**Why:** Safety is a core educational requirement in chemistry. PraxiLabs highlights this as a key feature ("0% Dangers").
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a boolean state `ppeEquipped` initialized to `false`. Add a toggle button UI for PPE. Update `isPlayDisabled` to include `!ppeEquipped`.

### 2. CSV Export for Experiment History — Priority: HIGH | Effort: SMALL
**What:** Add a button to export the user's experiment history as a CSV file.
**Why:** Table stakes for educational tools; students need to submit lab reports, and teachers need to review data.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that takes the `experiments` state array, formats it using Papa Parse (or basic CSV string building), and triggers a file download.

### 3. Contextual First-Time Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Implement a guided tour for the lab interface on the first visit.
**Why:** Reduces cognitive load for new students and aligns with the guided experiences of Labster and PraxiLabs.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/Dashboard.jsx`
**How:** Check `localStorage` for a `hasSeenTour` flag. If false, render a `Tooltip` component over key elements (Chemical Rack, Test Tube, Action Button) sequentially.

### 4. Dynamic Reaction Progress Indicator — Priority: MEDIUM | Effort: MEDIUM
**What:** Show a visual progress bar or changing state *during* the reaction delay, rather than just waiting for the result page.
**Why:** Enhances the gamified experience and provides immediate feedback during the 1.5s delay.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Update the `PROCESSING...` button state to include a visual progress fill, or animate the test tube liquid color transitioning towards the final state before navigation.

### 5. Experiment Objectives Panel — Priority: MEDIUM | Effort: SMALL
**What:** Add a small, collapsible panel detailing the goal of the current experiment (e.g., "Mix 1M HCl with 1M NaOH").
**Why:** Academic simulations (like ChemCollective) require clear goals to link computation with action.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add an `ObjectivePanel` component in the right status area, pulling predefined objectives from a new `data/objectives.js` file based on a selected module.

### 6. Interactive Chemistry Glossary — Priority: LOW | Effort: SMALL
**What:** Allow users to click on chemical names (e.g., "HCl", "CuSO4") to see a tooltip with basic properties.
**Why:** Supports varied learning styles and provides immediate contextual knowledge.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Wrap the chemical labels in a `GlossaryTerm` component that displays a hover tooltip with data fetched from a local dictionary object.

### 7. Temperature/Pressure Controls — Priority: LOW | Effort: MEDIUM
**What:** Reintroduce interactive temperature and pressure sliders that affect reaction outcomes.
**Why:** Real-world labs are affected by these variables; this adds depth to the simulation.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add sliders for Temp/Pressure in the right panel. Update the state and pass these values to the backend `/result` endpoint to influence the returned product data.

### 8. Shareable Reaction Results — Priority: LOW | Effort: SMALL
**What:** Add a "Share Result" button on the result page to generate a summarized image or text snippet.
**Why:** Encourages engagement and collaborative learning among students.
**Where in code:** `client/src/pages/result.jsx`
**How:** Add a button that uses the Web Share API (if available) or copies a formatted text summary of the reaction inputs and outputs to the clipboard.

### 9. Real-time Ph Indicator — Priority: LOW | Effort: MEDIUM
**What:** Add a visual Ph strip or meter that updates dynamically as chemicals are added.
**Why:** Provides immediate analytical feedback, crucial for titration and general chemistry understanding.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Calculate a rough Ph value based on the relative concentrations of acids/bases (e.g., HCl) in the current state and display it in the status panel.

### 10. "Undo" Chemical Addition — Priority: LOW | Effort: SMALL
**What:** Allow users to step back or clear the current mixture without refreshing.
**Why:** Improves usability; mistakes happen in labs, and resetting should be easy.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "Clear Tube" button that resets `chemA`, `chemB`, `chemC`, and `chemD` states to 0.

## Quick Wins (< 1 day each)
1. **Virtual PPE Verification** (Add toggle state to lab.jsx)
2. **CSV Export for Experiment History** (Add basic CSV download function to history.jsx)
3. **"Undo" Chemical Addition** (Add a clear button to reset state in lab.jsx)