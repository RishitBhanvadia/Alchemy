# Market Research Report
**App:** Alchemistry is a virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive organic, inorganic, and titration experiments with real-time feedback.
**Market:** EdTech / Virtual Science Labs
**Date:** 2024-05-24
**Competitors Researched:** Labster, PhET Interactive Simulations, PraxiLabs

## Executive Summary
The virtual chemistry lab market focuses heavily on safe, accessible experimentation with immediate feedback. Top competitors emphasize immersive 3D environments, gamified learning, and robust teacher dashboards for student tracking. Alchemistry has a solid foundation with its interactive 3D lab and teacher dashboard. However, it currently lacks interactive onboarding, in-lab theoretical context, and granular progress reporting, which are table stakes in premium EdTech platforms. Addressing these gaps will significantly enhance its educational value.

## Competitor Analysis
*   **Labster:** The market leader in immersive 3D labs. Differentiates with a strong narrative/story-based approach, digital mentors, and embedded quizzes during experiments to ensure comprehension.
*   **PhET Interactive Simulations (by CU Boulder):** The standard for accessible, free interactive simulations. Excels at visualising invisible concepts (like molecular bonds) and offers highly intuitive, game-like drag-and-drop mechanics.
*   **PraxiLabs:** Focuses on realistic 3D labs and curriculum alignment. Features strong analytical chemistry experiments and provides detailed step-by-step guidance and safety warnings directly within the virtual environment.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Contextual Onboarding:** New users need a quick tutorial on how to use the 3D lab controls and navigate the interface.
*   **In-Lab Safety Warnings:** Virtual labs use virtual safety gear (goggles, gloves) to reinforce real-world safety habits.
*   **Experiment Instructions/Manual:** A side panel with the current experiment's goal, required chemicals, and step-by-step procedures.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Knowledge Checks:** Mid-experiment questions (similar to Labster) to ensure students understand the "why" behind reactions, not just the "how".
*   **Exportable Lab Reports:** The ability for students to download a PDF/CSV of their experiment results for submission and teacher review.

### UX Patterns (Design/interaction patterns common in top products)
*   **Reset to Default State:** A quick "Clear Bench" or "Reset" button is standard across all platforms for easy iteration.
*   **Visual Formula Builders:** Dragging elements to form compounds visually before observing the reaction.

## Prioritised Recommendations

### 1. In-Lab "Lab Manual" Panel — Priority: HIGH | Effort: MEDIUM
**What:** A collapsible side panel in the 3D Lab showing the current experiment's objective, required chemicals, and step-by-step instructions.
**Why:** Competitors like PraxiLabs and Labster provide constant in-context guidance. Currently, Alchemistry users might not know what combination of chemicals achieves a specific learning outcome.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `LabManualPanel` component that toggles open/closed. Fetch structured experiment instructions from a new Supabase table or local JSON data based on the selected module.

### 2. Contextual 3D Lab Onboarding Tooltips — Priority: HIGH | Effort: SMALL
**What:** A one-time interactive tour highlighting the chemical sliders, the 3D canvas, and the AI Tutor button.
**Why:** PhET's success is largely due to immediate intuitiveness. A complex 3D interface requires basic onboarding to prevent user drop-off.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/App.jsx`
**How:** Add a `hasSeenLabTour` flag to `localStorage`. If false, render a simple overlay sequence (using a lightweight library or custom CSS) pointing to key UI elements on the first visit.

### 3. "Clear Bench" / Quick Reset Button — Priority: MEDIUM | Effort: SMALL
**What:** A prominent button to instantly set all chemical sliders back to 0.
**Why:** This is a standard UX pattern in all simulation tools (PhET, Gizmos) to allow rapid iteration and experimentation without manually dragging multiple sliders back to zero.
**Where in code:** `client/src/pages/Lab3D.jsx` (Controls container)
**How:** Add a "Reset Sliders" button next to the "Initiate Reaction" button that calls `setChemA(0)`, `setChemB(0)`, `setChemC(0)`, and `setChemD(0)`. (Note: `handleResetLab` exists but seems tied to the result modal; we need a pre-reaction reset).

### 4. Exportable Lab Report (PDF/CSV) — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow students to download their experiment results from the History page or Result Modal.
**Why:** EdTech tools need to integrate with existing school workflows, and teachers require submissions.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`
**How:** Add a "Download Report" button. Use the existing result data and a library like `jspdf` or simply generate a formatted CSV using Blob and a download link.

### 5. Pre-Reaction Safety Checklist — Priority: LOW | Effort: SMALL
**What:** A simple confirmation modal before initiating a reaction reminding students to "put on" virtual goggles and gloves.
**Why:** Reinforces real-world lab safety, which is a key selling point for virtual labs like Labster.
**Where in code:** `client/src/pages/Lab3D.jsx` (`handlePlayClick`)
**How:** Intercept the `handlePlayClick` function to show a simple modal with checkboxes for "Goggles" and "Gloves" before proceeding with the API call.

## Quick Wins (< 1 day each)
1.  **"Clear Bench" Button:** Add a pre-reaction reset button for the chemical sliders in `Lab3D.jsx`.
2.  **Contextual Onboarding Tooltips:** Implement basic `localStorage` backed tooltips for first-time lab users.
3.  **Pre-Reaction Safety Checklist:** Add a simple checklist confirmation before allowing a reaction to start.
