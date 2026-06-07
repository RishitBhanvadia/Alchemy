# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive science experiments.
**Market:** EdTech / Virtual Laboratory Simulations
**Date:** 2024-05-18
**Competitors Researched:** Labster, PhET Interactive Simulations, Unreal Chemist, ChemLab

## Executive Summary
The virtual chemistry lab market focuses heavily on safe, interactive, and visually engaging simulation of chemical reactions. While the current application offers a modern 3D interface and essential experiment modules, there are critical gaps in user guidance, gamification, and comprehensive assessment tools that top competitors leverage effectively. Implementing targeted UX improvements and expanding the utility of existing features will significantly elevate the application's standing in the market.

## Competitor Analysis
*   **Labster:** The market leader in comprehensive, browser-based 3D virtual labs. Key differentiators include highly guided storylines, built-in quizzes, and strong LMS integration.
*   **PhET Interactive Simulations:** Focuses on simple, highly interactive 2D simulations for conceptual understanding. Key differentiator is accessibility and ease of use without complex storylines.
*   **Unreal Chemist:** A mobile-first 3D chemistry lab app. Key differentiators include a dynamic interactive periodic table, a "crazy scientist" mode for open-ended exploration, and a powerful built-in chemistry solver.
*   **ChemLab:** A classic desktop-based simulation tool. Key differentiator is detailed, procedure-focused experimentation with side-by-side observation logging.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Interactive Periodic Table:** A readily accessible reference tool during experiments.
*   **Guided Onboarding/Tutorial:** Initial walkthrough for navigating the 3D lab environment.

### Differentiating Opportunities (Stand-out features)
*   **In-Lab Chemistry Solver/Calculator:** A tool to assist with calculations (e.g., molarity, balancing equations) during an experiment.
*   **Observation Notebook:** A dedicated UI element to log notes and observations while the experiment is running, which can then be saved to the history.

### UX Patterns (Design/interaction patterns common in top products)
*   **Gamified Feedback:** Immediate, visual feedback (e.g., color changes, particle effects, score popups) when a correct step is taken.
*   **Contextual Tooltips:** Hints that appear when interacting with specific equipment for the first time.

## Prioritised Recommendations

### 1. Interactive Periodic Table Overlay — Priority: HIGH | Effort: MEDIUM
**What:** A toggleable periodic table that students can access while in the 3D lab.
**Why:** Standard feature in competitors (Unreal Chemist). Students often need atomic weights or properties during experiments.
**Where in code:** `client/src/components/Navbar.jsx` (to add toggle) and a new `client/src/components/PeriodicTable.jsx` component.
**How:** Create a React component that renders a periodic table grid over the 3D canvas when toggled.

### 2. Guided 3D Lab Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** A short, interactive tutorial upon first entering the 3D lab.
**Why:** Helps users understand how to interact with the Three.js environment (Labster uses strong guidance).
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/authStore.js`.
**How:** Add a `hasSeenTutorial` boolean to the user profile. If false, show a sequence of tooltips pointing to key interaction areas in the 3D scene.

### 3. In-Lab Observation Notebook — Priority: MEDIUM | Effort: SMALL
**What:** A slide-out panel where students can type notes during the experiment.
**Why:** ChemLab uses this effectively to tie observation to procedure. Currently, results seem to be generated post-experiment.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `client/src/components/ObservationNotebook.jsx`.
**How:** Create a floating, draggable UI panel using Framer Motion. Save the contents to local state and append them to the final result payload.

### 4. Contextual Equipment Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Hover tooltips on 3D lab equipment showing their name and current state (e.g., "Beaker: 50ml HCl").
**Why:** Improves discoverability and reduces cognitive load, a common UX pattern in modern simulations.
**Where in code:** The individual Three.js equipment components within `client/src/components/` (assuming they exist).
**How:** Use `@react-three/drei`'s `Html` component to render text overlays when the user hovers over an object's mesh.

### 5. Gamified Success Feedback — Priority: LOW | Effort: SMALL
**What:** Visual and auditory feedback when a reaction successfully completes.
**Why:** Increases engagement, similar to Futuclass and Unreal Chemist.
**Where in code:** The reaction handling logic in the Three.js components or `client/src/pages/Lab3D.jsx`.
**How:** Integrate simple particle effects (using GSAP or Three.js) and a success toast notification when a reaction condition is met.

## Quick Wins (< 1 day each)
1.  **In-Lab Observation Notebook:** A simple UI overlay mapped to state.
2.  **Contextual Equipment Tooltips:** Easy to add using `@react-three/drei`'s `Html`.
3.  **Gamified Success Feedback:** Quick addition using existing toast libraries and basic CSS animations.
