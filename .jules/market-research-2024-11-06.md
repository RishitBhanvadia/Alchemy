# Market Research Report
**App:** Alchemistry is a 3D web-based virtual chemistry laboratory enabling students to conduct safe, interactive experiments with real-time feedback and history tracking.
**Market:** Virtual Science Simulations / STEM EdTech
**Date:** 2024-11-06
**Competitors Researched:** PraxiLabs, Labster, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is mature, with leaders like PraxiLabs and Labster focusing heavily on immersive real-world alignment, safety training, and curriculum integration. While Alchemistry has a strong technical foundation with its React/Three.js stack and core modules (Organic, Inorganic, Titration), it lacks table-stakes educational scaffolding (such as onboarding and safety checks) and data utility features (like data export). By implementing targeted, code-aware improvements—such as dynamic graph generation, CSV export for experiment history, and guided onboarding—Alchemistry can significantly close the gap with established competitors and deliver a more robust learning experience.

## Competitor Analysis
*   **PraxiLabs:** Focuses on immersive 3D experiences with high real-world fidelity. Key differentiators include instant guidance/feedback, rigorous safety protocol simulations, and bilingual support.
*   **Labster:** Targets institutional curriculum alignment with narrative-driven "pre-lab" experiences. Excels in teaching fundamental math/chemistry skills alongside the simulations and providing educator dashboards.
*   **PhET Interactive Simulations:** The gold standard for open-source, inquiry-based learning. Excels at "making the invisible visible" through dynamic visual mental models and robust accessibility features.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export:** Users need to analyze experiment results outside the app (e.g., in Excel).
*   **Safety Protocols:** Real labs require PPE (Personal Protective Equipment); virtual labs typically simulate this to build good habits.
*   **Guided Onboarding:** First-time users need a tour of the lab interfaces.

### Differentiating Opportunities (Stand-out features)
*   **Real-time Data Visualization:** Dynamic graphing of reactions (like titration curves) instead of pre-calculated static results.
*   **Pre-lab Hypothesis Checking:** Asking students to predict an outcome before initiating the reaction.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips:** Explaining complex apparatus or chemical properties on hover.
*   **Progress Indicators:** Showing steps remaining in a complex experiment (like titration).

## Prioritised Recommendations

### 1. Data Export for Experiment Logs — Priority: HIGH | Effort: SMALL
**What:** Allow users to export their experiment history to a CSV file.
**Why:** Competitors treat virtual labs as a data-gathering step for real lab reports. Currently, users can view history but not use the data.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" `<button>` that iterates over the `experiments` state array, converts the JSON data to CSV format, and triggers a download using a Blob URL.

### 2. Virtual PPE (Safety) Check — Priority: HIGH | Effort: SMALL
**What:** Require users to click to "equip" goggles and gloves before starting an experiment.
**Why:** PraxiLabs and Labster heavily emphasize lab safety. It's a critical educational requirement.
**Where in code:** `client/src/pages/lab.jsx` (and other lab modules)
**How:** Add a `hasPPE` boolean state. If false, display a modal over the `CanvasContainer` requiring the user to click "Put on Safety Goggles & Gloves" before the chemical selection UI unlocks.

### 3. Dynamic Titration Graphing — Priority: HIGH | Effort: MEDIUM
**What:** Replace hardcoded titration data arrays with dynamic calculation and rendering.
**Why:** PhET and Labster excel at real-time "invisible" modeling. Hardcoded memory points limit the exploratory value of the simulation.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Implement a calculation hook that uses the volume added and concentration to dynamically generate the pH curve points, passing these to the rendering component instead of `all_data`.

### 4. Guided Onboarding Tour — Priority: MEDIUM | Effort: MEDIUM
**What:** A step-by-step tooltip tour for first-time users.
**Why:** Competitor apps hold the user's hand during the first interaction to reduce cognitive load.
**Where in code:** `client/src/pages/Dashboard.jsx` and `client/src/App.jsx`
**How:** Add a `hasSeenTour` flag to `localStorage`. If false, render a `TooltipTour` component that highlights the `.module-card` elements in sequence using absolute positioning and z-index.

### 5. Contextual Chemical Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show chemical properties (molar mass, hazards) when hovering over chemicals.
**Why:** Helps bridge the gap between abstract 3D models and chemical theory.
**Where in code:** `client/src/components/testtube.jsx` or `client/src/pages/lab.jsx`
**How:** Add `onMouseEnter`/`onMouseLeave` event handlers to the chemical selection images (`hcl.png`, `nacl.png`, etc.) to display a localized absolute-positioned `div` with basic info.

### 6. "Clear/Undo" Reaction Setup — Priority: MEDIUM | Effort: SMALL
**What:** A button to clear selected chemicals before initiating the reaction.
**Why:** Users currently get stuck if they misclick a chemical. Forgiving UX is a hallmark of good EdTech.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "Reset Flask" button that calls `setChemA(0)`, `setChemB(0)`, etc., and clears the `tcolor` state.

### 7. Pre-Experiment Hypothesis Prompt — Priority: LOW | Effort: MEDIUM
**What:** A simple text input asking "What do you think will happen?" before running the reaction.
**Why:** Drives engagement and inquiry-based learning (a core PhET principle).
**Where in code:** `client/src/pages/lab.jsx` (Initiate Reaction flow)
**How:** Instead of immediately transitioning on "Initiate Reaction", show a modal with a `<textarea>`. Save the input to the `experiment_results` payload sent to Supabase.

### 8. Keyboard Navigation for 3D Elements — Priority: LOW | Effort: MEDIUM
**What:** Allow selecting chemicals and initiating reactions via keyboard.
**Why:** PhET sets the standard for accessibility. `accessibility.css` exists but interactive 3D/canvas elements often trap focus.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/components/3d-animations/CanvasContainer.jsx`
**How:** Ensure all interactive UI overlays have `tabIndex={0}` and `onKeyDown` handlers for the 'Enter' key that trigger the same functions as `onClick`.

### 9. Comparative History View — Priority: LOW | Effort: LARGE
**What:** Allow users to select two past experiments to compare side-by-side.
**Why:** Facilitates deeper analysis of how changing a variable affects the outcome.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add checkboxes to the history list. When two are selected, show a "Compare" button that opens a new modal rendering both result sets side-by-side.

### 10. Dashboard Module Progress Indicators — Priority: LOW | Effort: MEDIUM
**What:** Show how many experiments a user has completed in each module on the dashboard.
**Why:** Gamification and progress tracking keep students engaged (similar to Labster).
**Where in code:** `client/src/pages/Dashboard.jsx`
**How:** Fetch the user's `experiment_results` on mount, aggregate counts by module type, and display a small badge or progress bar on each `.module-card`.

## Quick Wins (< 1 day each)
1. **Data Export:** Adding CSV export to `history.jsx` is a standalone feature requiring minimal UI changes.
2. **"Clear/Undo" Setup:** Adding a reset button in `lab.jsx` is a trivial state-clearing function.
3. **Virtual PPE Check:** A simple modal overlay in `lab.jsx` governed by a boolean state.