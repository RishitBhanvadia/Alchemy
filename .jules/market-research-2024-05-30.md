# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Virtual Chemistry Education / EdTech
**Date:** 2024-05-30
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is characterized by a blend of immersive 3D simulations (Labster, PraxiLabs) and theoretical data visualizations (ChemCollective). The best products don't just simulate mixing chemicals; they contextualize the experience with guided onboarding, safety protocols (virtual PPE), and real-time data analysis (e.g., pH graphs during titration). Alchemistry has a strong technical foundation with React and Three.js, but it lacks these critical educational wrappers. By implementing lightweight safety checks, guided tours, and real-time graphing, Alchemistry can bridge the gap between a pure sandbox simulation and a structured educational tool.

## Competitor Analysis
- **Labster:** The market leader in high-fidelity 3D simulations. Differentiates with highly structured learning paths, guided onboarding, and strict adherence to virtual safety protocols (e.g., requiring users to "equip" virtual PPE before starting).
- **PraxiLabs:** Focuses on accessibility and step-by-step guided tutorials. They excel at breaking down complex experiments into manageable steps with constant feedback.
- **ChemCollective:** Less focused on high-end 3D graphics, more focused on deep theoretical accuracy. They provide real-time data viewers (concentration, pH, temperature) that help students connect visual observations with underlying chemical equations.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Safety Protocols:** Virtual labs must emphasize safety. Alchemistry currently lacks any safety checks or virtual PPE requirements.
- **Guided Onboarding:** Users are dropped directly into the lab environment without instructions on how to interact with the 3D space or the UI.
- **Real-time Data Vis:** In experiments like Titration, users expect to see real-time graphs plotting volume against pH, not just a visual color change.

### Differentiating Opportunities (Stand-out features)
- **Data Export:** Allowing students to export their experiment history (from `history.jsx`) to CSV for inclusion in real-world lab reports.
- **Theoretical Concentration Viewer:** A side-panel showing real-time calculations of molarity based on the volumes mixed in `lab.jsx`.

### UX Patterns (Design/interaction patterns common in top products)
- **Step-by-step Guides:** Highlighting UI elements sequentially to guide users through their first experiment.
- **Undo/Reset States:** Easy ways to "dump the beaker" without fully reloading the page if a mistake is made.

## Prioritised Recommendations

### 1. Virtual PPE (Personal Protective Equipment) Modal — Priority: HIGH | Effort: SMALL
**What:** A modal that appears when entering the lab, requiring users to acknowledge/equip virtual safety goggles, gloves, and lab coat before the "Initiate Reaction" button becomes active.
**Why:** Safety is a table-stakes requirement in educational virtual labs (seen in Labster/PraxiLabs).
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/titration.jsx`
**How:** Create a `PPEModal.jsx` component. Use a state variable (`hasPPE`) initialized to `false`. Conditionally render the modal and disable primary lab interactions until the user checks the required PPE boxes.

### 2. Real-time Titration Graph — Priority: HIGH | Effort: MEDIUM
**What:** A line graph that updates in real-time as the user adds acid during the titration experiment, plotting volume added vs. estimated pH.
**Why:** ChemCollective and others use real-time graphs to connect visual simulations with theoretical data, a critical learning outcome for titration.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Install a charting library like Recharts. Create a state array to hold `[{ volume: 0, pH: 14 }]`. As `count` increases in the `titration.jsx` timer effect, calculate the new pH and push it to the state array to update the graph dynamically.

### 3. Guided Lab Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** A guided tour that highlights key UI elements (Chemical Rack, Test Tube, Action Button) on the user's first visit.
**Why:** Current UX drops users into a complex interface. PraxiLabs excels by guiding users step-by-step.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Use a library like `react-joyride`. Define steps targeting the existing CSS classes (`.chemical-rack`, `.test_tube-wrapper`, `.action-button`). Track completion in `localStorage` so it only runs once per user.

### 4. Data Export (CSV) for History — Priority: MEDIUM | Effort: SMALL
**What:** A button to export the user's experiment history table to a CSV file.
**Why:** Students need to include experiment data in their written lab reports.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" button. When clicked, map over the `experiments` state array, format the data into a CSV string (using standard JS or PapaParse), create a Blob, and trigger a download.

### 5. Quick Reset Action in Lab — Priority: MEDIUM | Effort: SMALL
**What:** A "Dump Beaker / Reset" button in the main lab that clears current chemical selections without needing to process a reaction or reload the page.
**Why:** Common UX pattern in virtual labs to encourage experimentation without penalizing mistakes.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "Reset" button that calls a function to set `chemA`, `chemB`, `chemC`, and `chemD` states back to `0` and resets the `tcolor` state.

### 6. Contextual Tooltips for Chemicals — Priority: LOW | Effort: SMALL
**What:** Tooltips appearing when hovering over the chemical icons (HCl, NaCl, etc.) showing their full name and molar mass.
**Why:** Reinforces chemical nomenclature and properties.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add the native `title` attribute to the chemical images or wrap them in a custom tooltip component.

### 7. Theoretical Concentration Viewer — Priority: MEDIUM | Effort: MEDIUM
**What:** A small side panel that calculates and displays the theoretical molarity of the resulting mixture in the lab.
**Why:** Connects the visual act of mixing volumes with the mathematical calculation of concentration (like ChemCollective).
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a new div in the `.status-panel`. Use the `chemA`, `chemB`, etc., state values and the hardcoded 1M concentrations to dynamically calculate and display the new molarities as the sliders change.

### 8. Accessibility Improvements (Keyboard Navigation) — Priority: HIGH | Effort: SMALL
**What:** Ensure all interactive elements (sliders, buttons) are fully navigable via keyboard (Tab/Enter/Space).
**Why:** Educational tools must meet basic accessibility standards.
**Where in code:** `client/src/pages/lab.jsx`, `client/src/pages/titration.jsx`
**How:** Add `tabIndex="0"` to custom interactive elements. Ensure `<button>` and `<input type="range">` have clear `:focus` styles in the CSS.

### 9. Structured Learning Goals UI — Priority: MEDIUM | Effort: LARGE
**What:** A side panel displaying specific goals for the current module (e.g., "Mix 20% HCl with 30% NaOH").
**Why:** Provides structure to the sandbox environment, aligning with Labster's approach.
**Where in code:** Requires backend schema updates and a new component shared across `lab.jsx` and `titration.jsx`.
**How:** Add a `goals` table in Supabase. Fetch goals based on the module and display them with checkboxes that automatically tick when the state matches the goal conditions.

### 10. Post-Lab Quiz Assessment — Priority: MEDIUM | Effort: MEDIUM
**What:** A short 3-question multiple-choice quiz that appears after an experiment finishes, before showing the final score.
**Why:** Validates learning outcomes, moving the app from a pure simulation to an assessment tool.
**Where in code:** `client/src/pages/result.jsx` or a new `quiz.jsx` route.
**How:** Create a set of hardcoded questions. Render them sequentially before dispatching the final score save to Supabase.

## Quick Wins (< 1 day each)
1. **Quick Reset Action in Lab:** Simple state reset button in `lab.jsx`.
2. **Data Export (CSV) for History:** Basic JS Blob creation in `history.jsx`.
3. **Contextual Tooltips for Chemicals:** Adding `title` attributes or simple CSS tooltips in `lab.jsx`.
