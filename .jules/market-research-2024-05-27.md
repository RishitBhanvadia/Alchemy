# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-05-27
**Competitors Researched:** Labster, ChemCollective Virtual Lab, PhET Interactive Simulations, Beyond Labz

## Executive Summary
The virtual chemistry lab market is highly focused on combining realistic simulation with structured pedagogy. Top competitors like Labster and PhET excel by guiding students through experiments and providing immediate, contextual feedback. Alchemistry has a strong technical foundation with its 3D environment and AI tutor, but lacks the structured scaffolding and data export features expected in modern educational tools. The most actionable opportunities for this codebase involve adding guided experiment workflows, contextual tooltips, and data export capabilities.

## Competitor Analysis
* **Labster:** The market leader in immersive, 3D virtual labs. Differentiates heavily on gamified, narrative-driven simulations and highly structured step-by-step guidance.
* **ChemCollective Virtual Lab:** A classic, widely used 2D simulation environment. Focuses strongly on quantitative chemistry and stoichiometry. Key strength is autograded virtual labs and open-ended experimentation.
* **PhET Interactive Simulations:** Extremely popular, lightweight interactive simulations. Differentiates on intuitive variable manipulation, real-time visual feedback, and accessibility.
* **Beyond Labz:** Focuses specifically on chemistry and physics. Strong emphasis on data collection, analysis tools, and alignment with course curricula.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Experiment Export:** Users expect to be able to download their experiment results (e.g., as CSV or PDF) for lab reports. Alchemistry's `history.jsx` currently lacks an export option.
* **Structured Guidance/Onboarding:** While Alchemistry has an open-ended 3D lab, competitors provide structured, step-by-step experiment instructions or onboarding overlays to guide new users.
* **Accessibility and Keyboarding:** Top tools ensure their interfaces are fully keyboard navigable for accessibility compliance.

### Differentiating Opportunities (Stand-out features)
* **Contextual AI Prompts:** Alchemistry already has an `AiTutorPanel`. Enhancing this with contextual, proactive prompts based on the user's current actions in the 3D space would be a major differentiator.
* **Real-time Variable Manipulation:** Showing the direct impact of changing temperature or concentration in real-time.

### UX Patterns (Design/interaction patterns common in top products)
* **Floating Tooltips:** For identifying glassware and chemicals in the 3D space.
* **Integrated Data Tables:** Showing results in tabular format alongside the visual simulation.

## Prioritised Recommendations

### 1. CSV Data Export from History — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the Experiment History page.
**Why:** Standard table-stakes feature for students needing to submit lab reports. Easy to implement given the existing data structure.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an export button that maps the `logs` array from `useHistoryStore` to a CSV format and triggers a download using a Blob and temporary anchor link.

### 2. Contextual Tooltips in 3D Lab — Priority: HIGH | Effort: MEDIUM
**What:** Add floating tooltips identifying chemicals and glassware when hovered or selected in the 3D environment.
**Why:** Common UX pattern in top virtual labs (like Labster) to help students identify materials quickly.
**Where in code:** `client/src/pages/Lab3D.jsx` and potentially `client/src/components/3d-animations/` components.
**How:** Use a state variable (e.g., `hoveredItem`) updated by raycaster intersections in the Three.js canvas to render an HTML overlay component positioned near the cursor or the 3D object.

### 3. Step-by-Step Guided Mode — Priority: MEDIUM | Effort: LARGE
**What:** Introduce a "Guided Experiment" mode alongside the open sandbox.
**Why:** Competitors like ChemCollective and Labster provide structured workflows. This is crucial for beginners who don't know what to mix.
**Where in code:** `client/src/pages/Lab3D.jsx`, `client/src/store/labStore.js`
**How:** Create an `experimentStore` to track a sequence of required steps (e.g., `[{ action: "mix", expected: ["H2O", "NaCl"] }]`). Update the UI to show the current objective and provide feedback upon completion.

### 4. Direct AI Tutor Integration in Results — Priority: MEDIUM | Effort: SMALL
**What:** Add a button in the `ResultModal` to directly ask the AI Tutor to explain the reaction.
**Why:** Connects the outcome to the learning tool, differentiating from simpler simulators.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/components/AiTutorPanel.jsx`
**How:** Add a function to pass the current result context to the AI tutor state and open the panel automatically.

### 5. Chemical Properties Info Panel — Priority: LOW | Effort: MEDIUM
**What:** Clicking a chemical in the inventory shows its molecular weight, safety hazards, and physical state.
**Why:** Expected feature for comprehensive chemistry education (seen in Beyond Labz).
**Where in code:** `client/src/store/labStore.js` (update chemical data) and a new component in `client/src/pages/Lab3D.jsx`.
**How:** Expand the chemical objects in the store to include properties. Render an info panel when a chemical is selected but before it is added to a beaker.

## Quick Wins (< 1 day each)
1. **CSV Export in History:** Readily available data, simple UI addition.
2. **AI Tutor Result Integration:** Simple state passing between existing components.
3. **Empty State Enhancements:** Improve the empty state in the history page with a prompt or quick link to start a new experiment.
