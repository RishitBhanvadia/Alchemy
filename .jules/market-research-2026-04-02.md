# Market Research Report
**App:** Alchemistry is a 3D virtual chemistry laboratory for students and teachers to safely simulate reactions, track progress, and learn via AI assistance.
**Market:** EdTech / Virtual Science Lab Simulators
**Date:** 2025-02-27
**Competitors Researched:** Labster, ChemCollective, PhET Interactive Simulations, PraxiLabs

## Executive Summary
The virtual chemistry lab market is highly focused on combining safe, gamified 3D simulations with rigorous academic tracking. Top competitors excel by wrapping experiments in structured, step-by-step guidance and promoting realistic procedural habits (like putting on safety gear and adjusting temperature). Alchemistry has a strong foundation with its responsive 3D environment and AI tutor, but lacks procedural realism (temperature controls, safety protocols) and academic export capabilities which are table stakes in the EdTech space.

## Competitor Analysis
- **Labster:** Market leader in high-fidelity 3D labs. Differentiates with strong narrative storytelling, gamified pre-lab safety checks, and step-by-step experiment checklists.
- **ChemCollective:** Focused heavily on problem-solving scenarios and realistic benchtop interaction (dragging flasks, pouring), emphasizing procedural accuracy over visual fidelity.
- **PhET Interactive Simulations:** Excels in accessible, intuitive parameter manipulation (like temperature sliders and particle views) helping students visualize the invisible properties of chemistry.
- **PraxiLabs:** Strong focus on realistic equipment handling and comprehensive post-lab report generation for grading.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Pre-lab Safety Protocols
- Temperature Control variables
- Lab Report Exports

### Differentiating Opportunities (Stand-out features)
- Granular Time Controls (fast-forward slow reactions)
- Interactive Procedural Checklists (in-lab)
- Detailed Hazard/Property tooltips on chemicals

### UX Patterns (Design/interaction patterns common in top products)
- Quick-access Reference Tools (Periodic Table)
- Gamified Error States (visualizing what happens when heating a closed vessel)

## Prioritised Recommendations

### 1. Temperature Control Variable — Priority: HIGH | Effort: MEDIUM
**What:** Add a temperature slider that affects reaction rate or outcome.
**Why:** Most real-world chemical reactions are heavily dependent on temperature (endothermic/exothermic), a table-stakes feature in PhET and Labster.
**Where in code:** `client/src/pages/Lab3D.jsx` and `PhysicsLab` component.
**How:** Add a new `<input type="range">` in the `slider-grid` for Temperature, pass the state to `PhysicsLab`, and adjust the reaction logic.

### 2. Pre-Lab Safety Gear Check — Priority: HIGH | Effort: SMALL
**What:** A modal requiring students to "equip" goggles and gloves before the lab un-blurs.
**Why:** Competitors like Labster heavily emphasize safety habits. Without it, the simulation lacks educational realism.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Wrap the main `lab3d-canvas-wrapper` in a blurred state and show a `SafetyCheckModal` on initial load. Save state in local component state.

### 3. Lab Report Export (CSV/PDF) — Priority: HIGH | Effort: SMALL
**What:** Ability to export experiment history.
**Why:** Teachers need documented proof of work, and students need to submit reports. This is standard in ChemCollective and PraxiLabs.
**Where in code:** `client/src/pages/history.jsx` (or `StudentDashboard.jsx` recent experiments).
**How:** Add an "Export CSV" button using standard browser Blob/URL APIs to download the `historyStore.logs` data.

### 4. Step-by-Step Experiment Checklist — Priority: MEDIUM | Effort: MEDIUM
**What:** An overlay UI showing current assignment steps in the lab.
**Why:** Students get lost easily. Labster uses guided checklists to keep users on track.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Fetch active assignment from `assignmentStore`, display steps in a collapsing sidebar, and cross them off when reaction conditions match.

### 5. Hazard & Property Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Hover tooltips on the chemical sliders showing molar mass, hazards, and descriptions.
**Why:** Educates students on the chemicals before they mix them.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add `title` or a custom tooltip component over the `.label-group` in the `slider-card` elements.

### 6. Interactive Quick-Reference Periodic Table — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out panel containing a periodic table.
**Why:** Standard reference tool needed during chemistry tasks.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `PeriodicTablePanel` component toggled by a new icon button next to the AI Tutor button.

### 7. Time Scale Controls — Priority: LOW | Effort: MEDIUM
**What:** A fast-forward button for reactions.
**Why:** Allows teaching slow reactions without making students wait 10 minutes.
**Where in code:** `client/src/pages/Lab3D.jsx` and `PhysicsLab`.
**How:** Pass a `timeScale` prop to the Three.js physics loop to speed up animations.

### 8. Gamified Procedural Errors — Priority: LOW | Effort: LARGE
**What:** Visual consequences for bad combinations (e.g., mixing acid and water incorrectly).
**Why:** ChemCollective teaches through failure.
**Where in code:** `client/src/pages/Lab3D.jsx` (Result handling).
**How:** Expand `reactionResult` to handle "Procedural Error" states, triggering specific error animations in the 3D canvas instead of just "No Reaction".

### 9. Pre-Lab Background Theory Tab — Priority: LOW | Effort: SMALL
**What:** A reading material modal accessible before or during the experiment.
**Why:** Contextualizes the experiment, common in Labster.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add an "Info" button that opens a modal with text describing the module's theory.

### 10. Drag-and-Drop Equipment (Future Architecture) — Priority: LOW | Effort: LARGE
**What:** Moving away from sliders to actual drag-and-drop pouring of beakers.
**Why:** Highest fidelity realism, mimicking ChemCollective's interactive benches.
**Where in code:** `client/src/pages/Lab3D.jsx` / `PhysicsLab`.
**How:** Implement Raycaster and drag controls in react-three-fiber to manage pour events.

## Quick Wins (< 1 day each)
1. **Pre-Lab Safety Gear Check**: Adds immediate educational value with a simple React modal.
2. **Lab Report Export (CSV)**: Instantly solves a major teacher pain-point using existing store data.
3. **Hazard & Property Tooltips**: Simple UI addition with high educational return.
