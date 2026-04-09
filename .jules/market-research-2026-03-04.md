# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments via a 3D environment.
**Market:** EdTech / Virtual Science Lab / Chemistry Simulator
**Date:** 2026-03-04
**Competitors Researched:** Labster, PraxiLabs, ExploreLearning Gizmos, ChemCollective

## Executive Summary
The virtual chemistry lab market focuses heavily on bridging the gap between theoretical knowledge and practical application in a safe, cost-effective environment. While Alchemistry provides an excellent 3D sandbox for mixing chemicals and observing basic reactions, it lacks the structured educational scaffolding that defines market leaders. The biggest opportunities lie in adding guided learning paths (tutorials), real-time theoretical data visualization (e.g., chemical equations, molecular views), and knowledge assessment features directly into the experiment flow.

## Competitor Analysis
*   **Labster:** The market leader, known for highly gamified, story-driven 3D simulations. Differentiates with strong narrative contexts (e.g., "Solve a crime using chromatography") and built-in quizzes.
*   **PraxiLabs:** Focuses on realistic, curriculum-aligned 3D simulations. Differentiates with an AI Lab Assistant ("Oxi"), automated performance analytics for teachers, and detailed molecular-level visualization.
*   **ExploreLearning Gizmos:** Focuses on interactive math and science simulations. Differentiates with deep, variable-driven simulations that emphasize the scientific method (hypothesis, test, conclude).
*   **ChemCollective:** A project from Carnegie Mellon, more basic visually but highly rigorous. Differentiates with structured problems, virtual titration setups that require exact calculations, and auto-grading.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Guided Tutorials:** Competitors provide step-by-step guidance on how to use the lab equipment and perform specific experiments. Alchemistry drops users directly into a sandbox.
*   **Learning Objectives/Scenarios:** Competitors frame experiments around a goal (e.g., "Synthesize NaCl"). Alchemistry has no built-in goals.

### Differentiating Opportunities (Stand-out features)
*   **Real-time Molecular Visualization:** Showing what happens at the atomic level during a reaction, not just the macroscopic color change.
*   **In-Lab Knowledge Checks:** Prompting the user with a quick quiz about the expected reaction before showing the result.
*   **AI Lab Assistant / Tooltips:** Contextual help that guides the student if they get stuck or mix the wrong chemicals.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Sidebars:** A side panel that displays the current objective, relevant theory, or chemical equations dynamically based on user actions.
*   **Gamified Safety:** Requiring the user to virtually "equip" safety gear (goggles, gloves) before the experiment controls become active.

## Prioritised Recommendations

### 1. Guided Onboarding Tour — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step interactive tutorial that highlights UI elements (e.g., the chemical rack, the test tube, the action button) on first login.
**Why:** First-time users need to understand the interface and the goal of the simulation. This is table-stakes for EdTech tools.
**Where in code:** `client/src/App.jsx` or a wrapper around `client/src/pages/lab.jsx` and other lab pages.
**How:** Introduce a `react-joyride` or a custom tooltip overlay system. Store a `hasSeenTutorial` flag in `localStorage`. Wrap the chemical sliders and the "INITIATE REACTION" button in the target refs.

### 2. "Current Objective" Sidebar — Priority: HIGH | Effort: SMALL
**What:** A small panel in the lab interface that displays a specific goal (e.g., "Goal: Create a neutral solution by mixing equal parts HCl and NaOH" - note: need to add NaOH or adapt to current chemicals).
**Why:** Transforms the app from a pure sandbox into a structured learning tool, aligning with curriculum requirements.
**Where in code:** `client/src/pages/lab.jsx` (and other modules like `titration.jsx`).
**How:** Add a new `<div className="glass-panel objective-panel">` to the right side of the `Lab` component (currently, there is a minimal status panel). Create a hardcoded list of objectives or fetch them from a new `/api/objectives` endpoint.

### 3. Pre-Reaction Knowledge Check — Priority: MEDIUM | Effort: SMALL
**What:** A modal that interrupts the "INITIATE REACTION" flow to ask a multiple-choice question about the expected outcome (e.g., "What color do you expect this mixture to turn?").
**Why:** Forces active recall and engagement rather than passive button clicking, a key feature in tools like Labster.
**Where in code:** `client/src/pages/lab.jsx` (specifically inside the `useHandlePlayClick` function).
**How:** Instead of immediately triggering `setAnimate(true)`, open a `<KnowledgeCheckModal>` component. On correct answer (or after an attempt), proceed with the animation and navigation to `/result`.

### 4. Real-time Chemical Equation Display — Priority: MEDIUM | Effort: MEDIUM
**What:** Dynamically displaying the balanced chemical equation based on the slider values before or during the reaction.
**Why:** Bridges the gap between the visual simulation (macroscopic) and the theoretical chemistry (symbolic).
**Where in code:** `client/src/pages/result.jsx` or `client/src/pages/lab.jsx`.
**How:** Create a helper function in `client/src/utils/chemistry.js` that maps combinations of `chemA`, `chemB`, `chemC`, `chemD` to string representations of equations. Render this string in the UI when `chemA > 0`, etc.

### 5. Virtual Safety Gear Check — Priority: LOW | Effort: SMALL
**What:** A UI requirement to toggle "Safety Goggles" and "Lab Coat" on before the chemical sliders become active.
**Why:** A common, simple gamification element in virtual labs that reinforces real-world lab safety protocols.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** Add two boolean state variables (`gogglesOn`, `coatOn`). Add toggle buttons in the UI. Conditionally disable the `input[type="range"]` elements if `!gogglesOn || !coatOn`.

## Quick Wins (< 1 day each)
1.  **"Current Objective" Sidebar:** Easily added to the existing `lab.jsx` layout by expanding the existing `status-panel`.
2.  **Virtual Safety Gear Check:** A simple state-based disable logic for the sliders in `lab.jsx`.
3.  **Pre-Reaction Knowledge Check:** Intercepting the existing button click in `lab.jsx` to show a simple modal before routing to `/result`.