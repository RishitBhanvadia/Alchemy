# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive and safe experiments.
**Market:** Virtual Chemistry Laboratory Education Software
**Date:** 2026-05-25
**Competitors Researched:** Labster, ChemCollective, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is transitioning from basic interactive simulations to deeply immersive, story-driven educational experiences. While Alchemistry has a solid foundation with its 3D environment and real-time physics (`Lab3D.jsx`), it currently functions more as a sandbox. Top competitors excel by wrapping simulations in gamified narratives (e.g., "Escape Rooms") and providing explicit, real-time feedback on chemical states (aqueous, solid, gas). For Alchemistry to compete, the biggest opportunity lies in guiding the student experience through structured tasks and improving the granular visualization of chemical reactions.

## Competitor Analysis
- **Labster:** The market leader. Differentiates heavily on gamification, offering "Escape Room" scenarios and story-driven missions. Features highly detailed 3D environments and strong alignment with standard syllabi.
- **ChemCollective:** Focuses on problem-solving and flexible simulations. Notable for its strong analytical tools, such as the "Solution Info" panel which lets students explicitly toggle and view aqueous, solid, and gaseous states during an experiment.
- **PhET Interactive Simulations:** Excels in accessible, intuitive visual design. Focuses heavily on making abstract concepts (like molecular interactions) visually tangible for students, though less realistic in its 3D rendering than Labster or Alchemistry.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Pre-lab Preparations:** Competitors often require students to review concepts or answer questions before entering the lab environment.
- **State Visualization:** Explicitly showing the state of matter (solid, liquid, gas, aqueous) for reactants and products.

### Differentiating Opportunities (Stand-out features)
- **Story-driven Scenarios:** Moving beyond a sandbox to objective-based "missions" or "escape rooms" to increase student engagement.
- **Granular Analytical Tools:** A dedicated UI panel to inspect the exact composition and states of the beaker's contents at any given moment.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Tooltips:** Walkthroughs that guide first-time users through the interface.
- **Clear "Reset" vs "Undo":** Better granular control over mistakes during an experiment.

## Prioritised Recommendations

### 1. State Visualization in Results — Priority: HIGH | Effort: SMALL
**What:** Display the state of matter (aqueous, solid, gas) for the resulting products.
**Why:** ChemCollective provides explicit state toggles, and it's a fundamental concept in chemistry education. Currently, Alchemistry just shows the formula.
**Where in code:** `client/src/components/ResultModal.jsx` and the backend `reactionHash.js` (to return state data).
**How:** Update `ResultModal.jsx` to parse and display state badges (e.g., `(aq)`, `(s)`, `(g)`) next to the `product_formula`.

### 2. Guided Pre-Lab Assessment Modal — Priority: HIGH | Effort: MEDIUM
**What:** A short, 1-2 question modal that students must pass before interacting with the 3D lab.
**Why:** Table stakes for educational tools to ensure students aren't just blindly mixing chemicals.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `PreLabModal` component that displays on initial load. The student must answer a conceptual question related to the available chemicals before the `isInitialLoading` state resolves to false.

### 3. "Mission" Objectives Panel — Priority: MEDIUM | Effort: MEDIUM
**What:** A UI panel that provides a specific goal (e.g., "Synthesize water") instead of just an open sandbox.
**Why:** Labster's gamification significantly increases engagement.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `MissionPanel.jsx` component.
**How:** Add a floating panel in `Lab3D.jsx` that pulls a random or assigned objective. Update the `initiateReaction` success handler to check if the `reactionResult` matches the objective and trigger a special celebration.

### 4. Interactive Contextual Walkthrough — Priority: MEDIUM | Effort: MEDIUM
**What:** A step-by-step tooltip guide for first-time users.
**Why:** Common UX pattern to reduce confusion in complex 3D environments.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a state flag (`hasSeenWalkthrough`) in `localStorage`. If false, overlay tooltips highlighting the sliders, the AI tutor, and the initiate button sequentially.

### 5. Detailed Beaker Inspector — Priority: LOW | Effort: LARGE
**What:** A panel showing the exact, real-time molarity and state of the contents in the beaker.
**Why:** Similar to ChemCollective's Solution Info panel, providing deeper analytical depth.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** This requires significant backend/frontend state synchronization. Create an `InspectorPanel` that reads from the `labStore` and calculates theoretical concentrations based on the slider inputs before the final reaction is initiated.

## Quick Wins (< 1 day each)
1. **State Visualization Badges:** Modifying `ResultModal.jsx` to append `(aq)`, `(s)`, etc. based on simple string matching or updated backend payload.
2. **First-time User Tooltips:** Adding a simple sequence of absolute-positioned tooltips in `Lab3D.jsx` managed by `localStorage`.
3. **Objective Banner:** Hardcoding a simple "Goal of the Day" banner at the top of `Lab3D.jsx` to provide immediate direction.