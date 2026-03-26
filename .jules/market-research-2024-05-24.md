# Market Research Report
**App:** Alchemistry is a 3D virtual chemistry laboratory for students, built with React and Three.js, offering interactive experiments and AI tutoring.
**Market:** EdTech / Virtual Science Labs
**Date:** 2024-05-24
**Competitors Researched:** PraxiLabs, iXR Labs, WhimsyLabs, Labster, ChemCollective

## Executive Summary
The virtual science lab market is transitioning from basic 2D simulations to immersive 3D, gamified experiences that directly integrate with learning management systems. Alchemistry has a solid foundation with its 3D environment (React Three Fiber) and real-time physics. However, to compete with top-tier platforms like Labster and PraxiLabs, it needs to enhance gamification (safety scores), deeper analytical tracking for teachers, and guided, step-by-step experiment tutorials.

## Competitor Analysis
*   **Labster:** The market leader. Known for gamified, story-driven simulations with strong safety training and comprehensive teacher dashboards.
*   **PraxiLabs:** Focuses heavily on LMS integration, deep analytics, and an AI Lab Assistant. Highly curriculum-aligned.
*   **WhimsyLabs / iXR Labs:** Strong on immersive VR/3D environments and bringing complex reactions to life safely.
*   **ChemCollective:** A free, accessible 2D alternative focusing on problem-solving over high-fidelity graphics.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Guided Onboarding/Tutorials:** Most platforms guide first-time users through the interface and basic interactions.
*   **Lab Notebook/Data Export:** Allowing students to export their experiment history (CSV/PDF) for assignments.

### Differentiating Opportunities (Stand-out features)
*   **Safety Gamification:** Penalizing or alerting users when dangerous chemical combinations are mixed, affecting a "Safety Score".
*   **Curriculum Alignment/Assignments:** Tying specific chemical configurations to assigned tasks with grading.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips:** Explaining instruments and chemicals on hover.
*   **Progress Indicators:** Showing completion status for assigned experiments.

## Prioritised Recommendations

### 1. Lab Notebook CSV Export — Priority: HIGH | Effort: SMALL
**What:** Add a "Download Notebook" button to export experiment history as CSV.
**Why:** Table-stakes feature for educational tools so students can submit data for assignments.
**Where in code:** `client/src/pages/history.jsx` (needs to be read to confirm)
**How:** Add a simple `exportToCSV` function using the existing `logs` data from `useHistoryStore` and trigger a file download.

### 2. Contextual Onboarding Tooltips — Priority: HIGH | Effort: MEDIUM
**What:** Add a guided tour for first-time users entering the 3D lab.
**Why:** Improves user adoption and reduces confusion about how to interact with the 3D environment and sliders.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a state flag `hasSeenTour` in localStorage. Use a library like `react-joyride` or custom CSS overlays to highlight the beaker, sliders, and AI tutor.

### 3. Lab Safety Score Gamification — Priority: MEDIUM | Effort: MEDIUM
**What:** Track and display a "Safety Score" that decreases when a student performs a dangerous reaction.
**Why:** Gamifies learning, teaches real-world consequences safely, and matches competitor features (e.g., Labster).
**Where in code:** `client/src/store/profileStore.js` (to add score state) and `client/src/components/ResultModal.jsx`.
**How:** When `reactionResult.is_dangerous` is true, decrement a safety score stored in the user's profile and display a warning animation.

### 4. Interactive Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Show chemical names and hazard warnings when hovering over 3D flasks.
**Why:** Standard UX pattern in virtual labs for accessibility and quick information retrieval.
**Where in code:** `client/src/components/3d-animations/DraggableFlask.jsx`
**How:** Add `onPointerOver` and `onPointerOut` events to the 3D meshes to display an HTML overlay (using `@react-three/drei` `Html` component) with chemical details.

## Quick Wins (< 1 day each)
1.  **Lab Notebook CSV Export:** Easily implementable using existing store data.
2.  **Interactive Equipment Tooltips:** Quick addition using existing Three.js components.
3.  **Safety Score (Client-Side Only initially):** Simple state addition and UI update on the dashboard.