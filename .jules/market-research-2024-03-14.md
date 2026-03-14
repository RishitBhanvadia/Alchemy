# Market Research Report
**App:** Alchemistry is a virtual 3D chemistry laboratory web app that allows students to safely conduct interactive chemistry experiments (inorganic, organic, and titration) and provides teachers with a dashboard to track student performance and scores.
**Market:** EdTech / Virtual Science Laboratory Software
**Date:** 2024-03-14
**Competitors Researched:** Vic's Science Studio, Futuclass, ExploreLearning Gizmos, PraxiLabs

## Executive Summary
The virtual chemistry lab market focuses heavily on interactive, risk-free simulations of real-world chemical reactions, aimed at high school and university students. Top competitors differentiate themselves through extensive experiment libraries, gamified learning elements, and robust teacher analytics. Alchemistry currently offers a strong foundational 3D experience and basic teacher/student tracking. The biggest opportunities for Alchemistry lie in enhancing the onboarding/guidance experience for students, expanding the accessibility of the simulations, and providing richer assessment tools to align with top-tier virtual lab platforms.

## Competitor Analysis
*   **Vic's Science Studio:** A VR-focused tool offering over 100 guided experiments. Key differentiator is the strong emphasis on accurate visual simulation of reactions (color changes, precipitates) and a teacher dashboard for assigning tasks.
*   **Futuclass:** Focuses on gamification for middle/high schoolers. Key differentiator is short (5-10 min) puzzle-like modules with instant feedback and comprehensive teacher resources (lesson plans, worksheets).
*   **ExploreLearning Gizmos:** A broad interactive STEM simulation platform. Key differentiator is the focus on allowing students to experiment with variables, develop hypotheses, and draw conclusions within the simulation.
*   **PraxiLabs:** A mature 3D virtual lab platform aimed at universities. Key differentiator is the highly realistic lab environments ("feel like I'm in a real lab") and deep integration with Learning Management Systems (LMS).

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Guided Tutorials/Onboarding:** Most platforms provide step-by-step guidance for first-time users. Alchemistry throws users into the 3D lab with minimal contextual help beyond basic tooltips.
*   **Exportable Lab Reports:** Students often need to submit findings. Competitors offer ways to export data or generated lab reports. Alchemistry stores history but lacks an easy export feature.

### Differentiating Opportunities (Stand-out features)
*   **Variable Manipulation & Hypothesis Testing:** Gizmos excels here. Alchemistry currently allows mixing specific chemicals, but explicitly framing this as "Hypothesis -> Test -> Conclude" within the UI would elevate the educational value.
*   **Gamified Instant Feedback:** Futuclass uses instant feedback well. Alchemistry calculates scores, but adding real-time, visual "hints" or "warnings" during the mixing process (before the final result) could improve engagement.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Assistance:** "Help" buttons or overlays that explain what specific equipment or chemicals do when hovered over or clicked, rather than relying solely on a separate AI tutor panel.
*   **Clear Experiment Objectives:** A persistent UI panel showing the current goal or task required for the specific lab module.

## Prioritised Recommendations

### 1. Interactive Onboarding Overlay — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step interactive tutorial for first-time users entering the `/lab-3d` route, highlighting controls and goals.
**Why:** Competitors (like Vic's Science Studio) ensure users understand the interface immediately. This reduces friction and abandonment.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a state flag `hasSeenTutorial` in localStorage. If false, render an overlay component (e.g., `TutorialOverlay.jsx`) that uses a library like `react-joyride` or custom CSS overlays to highlight the chemical sliders and the "Initiate Reaction" button in sequence.

### 2. Export Experiment History to CSV/PDF — Priority: HIGH | Effort: SMALL
**What:** Allow students to download their experiment history as a CSV or PDF file.
**Why:** A table-stakes feature for educational tools (like PraxiLabs and Gizmos) so students can submit lab work to teachers outside the platform.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export" button near the "EXPERIMENT LOGS" title. Create a utility function using `Papa Parse` (or simple string building) to convert the `experiments` array into a CSV string and trigger a file download using a Blob URL.

### 3. Persistent Experiment Objectives Panel — Priority: MEDIUM | Effort: SMALL
**What:** A small, collapsable UI panel in the 3D lab that displays the specific goal of the current experiment (e.g., "Goal: Create an exothermic reaction using HCl").
**Why:** Futuclass and Gizmos frame activities around specific goals. Currently, Alchemistry users just mix things freely. Adding goals adds gamification and direction.
**Where in code:** `client/src/pages/Lab3D.jsx` and state management.
**How:** Add an `ObjectivePanel` component overlayed on the canvas. The objective text could be passed via route state from the Dashboard or stored in a configuration file based on the selected module.

### 4. Real-time Safety/Mixing Warnings — Priority: MEDIUM | Effort: MEDIUM
**What:** Visual warnings (e.g., a flashing icon or subtle screen tint) if a user is about to mix a highly volatile or incorrect combination before they hit "Initiate".
**Why:** Real labs emphasize safety. Simulating "danger" before an explosion adds realism and instant feedback, a key differentiator seen in Futuclass.
**Where in code:** `client/src/pages/Lab3D.jsx` (specifically around the `chemA`, `chemB` state changes).
**How:** Add a `useEffect` that monitors the `chemA`...`chemD` ratios. If certain thresholds are met (e.g., high acid + base), update a new state `safetyWarning` that triggers a CSS class change (e.g., red tint) on the `.lab3d-canvas-wrapper`.

### 5. Chemical Properties Hover Tooltips — Priority: LOW | Effort: SMALL
**What:** When hovering over a chemical slider or label, show a tooltip with basic properties (molar mass, hazard level).
**Why:** Contextual learning is a common UX pattern in top educational software.
**Where in code:** `client/src/pages/Lab3D.jsx` (inside the `.slider-card` elements).
**How:** Add `title` attributes to the `.label-group` elements or implement a custom tooltip component that displays static data about HCl, NaOH, etc., on `onMouseEnter`.

## Quick Wins (< 1 day each)
1.  **Export Experiment History:** (Recommendation #2) Very quick to implement using native browser APIs for CSV generation.
2.  **Chemical Properties Hover Tooltips:** (Recommendation #5) Simple HTML/CSS addition requiring no new state or API calls.
3.  **Persistent Experiment Objectives Panel:** (Recommendation #3) Adding a static UI component to display a goal string passed from the previous page.
