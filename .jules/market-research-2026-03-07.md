# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive, safe, and modern chemistry experiments.
**Market:** Virtual Science Education / EdTech
**Date:** 2026-03-07
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is rapidly moving toward fully immersive, guided, and context-rich educational experiences. While Alchemistry provides a solid sandbox foundation with real-time 3D rendering and basic history tracking, it lacks the structured educational scaffolding expected in top-tier products like Labster and PraxiLabs. The biggest opportunities for this codebase lie in introducing guided experiment steps, pre-lab safety protocols, and post-experiment data extraction, transforming it from a mere simulation into a comprehensive learning tool.

## Competitor Analysis
- **Labster:** Emphasizes photorealistic VR/3D environments, gamified storylines, and rigorous assessment integrations. Key differentiator: Deep narrative and guided learning paths.
- **PraxiLabs:** Focuses on accessibility, LMS integration, and automated guidance (AI Lab Assistant "Oxi"). Key differentiator: Built-in quiz builder and detailed performance analytics.
- **ChemCollective:** Provides robust, scenario-based virtual experiments and tutorials, highly valued for its realism in stoichiometry and titration. Key differentiator: Strong emphasis on calculation and "paper-like" lab notebook workflows.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Guided Tutorials:** First-time user onboarding and step-by-step experiment instructions.
- **Data Export:** The ability for students to download their experiment logs for grading or reporting.
- **Safety Simulation:** A mandatory step to "equip safety gear" before starting hazardous experiments.

### Differentiating Opportunities (Stand-out features)
- **Contextual Knowledge Base:** Tooltips or pop-overs explaining *why* a reaction occurred, not just the chemical equation result.
- **In-App Quizzes:** Quick knowledge checks triggered after a successful reaction to reinforce learning.
- **Clean-up/Reset Mechanism:** A fast way to empty the virtual beaker without reloading the page or starting a new session.

### UX Patterns (Design/interaction patterns common in top products)
- **Persistent Lab Notebook:** A side-panel or floating widget that automatically logs actions (e.g., "Added 10ml HCl") during the experiment.
- **Audio Feedback:** Realistic sound effects for pouring, fizzing, or error states.
- **Visual Warnings:** Prominent alerts for mixing incompatible or highly dangerous chemicals.

## Prioritised Recommendations

### 1. Guided Experiment Overlay — Priority: HIGH | Effort: MEDIUM
**What:** Introduce a step-by-step instruction panel overlay during experiments.
**Why:** Competitors (PraxiLabs, Labster) rely heavily on guided modes to prevent students from feeling lost in a sandbox.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a `currentStep` state and a new `<GuidedOverlay>` component that displays the next required action (e.g., "Step 1: Add 20% HCl").

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the History page.
**Why:** Standard feature in all educational tools for students to submit work and teachers to grade.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that uses Papa Parse or a simple Blob conversion on the existing `experiments` state array.

### 3. Pre-Experiment Safety Check — Priority: MEDIUM | Effort: SMALL
**What:** A mandatory modal requiring users to "Put on Safety Goggles and Gloves" before interacting with chemicals.
**Why:** Safety is a core selling point of virtual labs (noted in PraxiLabs and Labster marketing).
**Where in code:** `client/src/pages/lab.jsx`
**How:** Implement a boolean state `isSafe` initialized to `false`. Show a modal overlay until the user clicks "Acknowledge Safety Protocol."

### 4. Interactive "Lab Notebook" Sidebar — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out panel that logs user actions in real-time during the lab session.
**Why:** ChemCollective and Labster use virtual notebooks to mimic real lab practices.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Create a `logs` array state and a `<LabNotebook>` component that appends a string whenever `handleChemAChange` (etc.) is fired.

### 5. Contextual Reaction Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Information icons next to the product data that explain the underlying chemistry principle.
**Why:** Enhances the educational value beyond just seeing the visual result.
**Where in code:** `client/src/pages/result.jsx`
**How:** Expand the `Product Data` section to include a tooltip (using a simple CSS hover state or a library like `react-tooltip`) that pulls extra context from the backend or a static JSON.

### 6. Quick "Clean Beaker" Reset Button — Priority: LOW | Effort: SMALL
**What:** A button to reset chemical concentrations to 0 without leaving the page.
**Why:** Improves iteration speed for users testing multiple combinations.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "RESET" button that sets `chemA`, `chemB`, `chemC`, and `chemD` states back to 0.

### 7. Audio Feedback for Interactions — Priority: LOW | Effort: SMALL
**What:** Sound effects for adding chemicals and successful reactions.
**Why:** Increases immersion, a key feature of high-end VR labs like Labster.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/result.jsx`
**How:** Use HTML5 Audio objects to play short `.mp3` or `.wav` files when sliders are moved or the "INITIATE REACTION" button is clicked.

### 8. Warning Badges for Hazardous Combinations — Priority: LOW | Effort: SMALL
**What:** Visual alerts (e.g., a flashing red icon) when highly reactive chemicals are mixed in unsafe proportions.
**Why:** Reinforces safety education by showing consequences virtually.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add logic to the `change_tip` or a new `useEffect` that checks specific combinations and sets a `warning` state to display a badge.

### 9. First-Time User Onboarding Tour — Priority: LOW | Effort: LARGE
**What:** A guided tour highlighting UI elements (Chemical Rack, Test Tube, Status Panel) on first visit.
**Why:** Reduces friction for new students and aligns with standard SaaS/EdTech UX patterns.
**Where in code:** `client/src/App.jsx` or `client/src/pages/Dashboard.jsx`
**How:** Integrate a library like `react-joyride` and use `localStorage` to track if the user has completed the tour.

### 10. In-App Mini Quizzes — Priority: LOW | Effort: LARGE
**What:** A short 1-3 question quiz appearing after a successful reaction to test understanding.
**Why:** PraxiLabs heavily markets its built-in assessment capabilities.
**Where in code:** `client/src/pages/result.jsx`
**How:** Create a new `<QuizModal>` component triggered after a delay on the result page, feeding results back to the `history` database.

## Quick Wins (< 1 day each)
1. **Export Experiment History to CSV**: Simple data transformation using existing state.
2. **Quick "Clean Beaker" Reset Button**: Trivial state reset in `lab.jsx`.
3. **Pre-Experiment Safety Check**: A straightforward boolean state and modal overlay.
