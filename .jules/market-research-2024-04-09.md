# Market Research Report
**App:** Alchemistry is a web-based 3D virtual chemistry laboratory that enables students to conduct safe, interactive experiments using React, Three.js, and an AI Tutor.
**Market:** Virtual STEM Education Software / Virtual Chemistry Labs
**Date:** 2024-04-09
**Competitors Researched:** Vic's Science Studio, Futuclass, Beyond Labz, Labster

## Executive Summary
The virtual chemistry lab market focuses heavily on gamification, immediate feedback, and risk-free experimentation, combining accurate simulations with integrated learning aids. While Alchemistry has a solid foundation with its 3D environment, reaction simulations, and AI Tutor, it lacks several standard features found in top competitors, such as an interactive periodic table reference, gamified knowledge checks (quizzes), and data export functionalities for lab reports. Implementing these will significantly bridge the gap between Alchemistry and market leaders.

## Competitor Analysis
- **Vic's Science Studio**: An all-in-one virtual chemistry lab offering over 100 guided experiments and a comprehensive teacher dashboard for tracking progress. Key differentiator: Broad experiment library with realistic visual reactions.
- **Futuclass**: Focuses on gamified chemistry lessons for middle and high school students, featuring short, interactive puzzle-like modules. Key differentiator: High engagement through gamification and instant feedback.
- **Beyond Labz**: Provides highly realistic, open-ended virtual lab environments for general and organic chemistry, allowing students to make safe mistakes. Key differentiator: Deep, realistic simulation mimicking actual lab environments.
- **Labster**: Offers a vast library of virtual lab simulations with embedded quizzes, 3D animations, and strong curriculum alignment. Key differentiator: Integrated learning journey combining simulation, theory, and assessment.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Interactive Periodic Table Reference**: Competitors provide built-in access to element data during experiments.
- **Lab Report/Data Export**: The ability to export experiment history or results to CSV/PDF for assignments.

### Differentiating Opportunities (Stand-out features)
- **Embedded Quizzes/Knowledge Checks**: Gamified questions before or after experiments to reinforce learning (similar to Futuclass and Labster).
- **Guided Experiment Tutorials**: Step-by-step interactive onboarding for new experiments.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Tooltips on Hover**: Highlighting chemical properties or safety warnings before mixing.

## Prioritised Recommendations

### 1. Interactive Periodic Table Overlay — Priority: HIGH | Effort: MEDIUM
**What:** Add a quick-access Periodic Table panel that students can open during experiments to check atomic weights, properties, and electron configurations.
**Why:** Standard feature in all top virtual labs (Labster, Beyond Labz); saves students from leaving the app to look up basic chemical information.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a new toggle button) and a new `PeriodicTablePanel.jsx` component.
**How:** Create a floating, draggable UI component displaying the periodic table data (using a static JSON file), toggled via a new icon in the `lab3d-controls-container`.

### 2. CSV Export for Experiment History — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to export their experiment logs (reactions, outcomes, timestamps) as a CSV file.
**Why:** Teachers require documented proof of work, and students need data for lab reports. Competitors strongly feature "lab book" exports.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/Lab3D.jsx` (history panel).
**How:** Add an "Export to CSV" button in the history views. Use standard JavaScript blob/URL methods to convert the existing `historyLogs` array into a downloadable CSV string.

### 3. Contextual Chemical Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show the chemical formula, hazard symbols, and a brief description when hovering over the chemical sliders or 3D models.
**Why:** Improves educational value and mimics the safety awareness taught in real labs (a key selling point of Beyond Labz).
**Where in code:** `client/src/pages/Lab3D.jsx` (around `.slider-card` elements).
**How:** Add `title` attributes or a custom tooltip component wrapping the `.chem-name` and `.chem-formula` elements in the `slider-grid`.

### 4. Guided Experiment "Missions" (Mini-Quizzes) — Priority: MEDIUM | Effort: LARGE
**What:** Introduce optional, short "missions" (e.g., "Synthesize water") that provide a goal and verify the result, rewarding completion.
**Why:** Gamification drives engagement. Futuclass and Labster heavily utilize mission-based learning rather than just open sandbox play.
**Where in code:** A new `client/src/components/MissionPanel.jsx` integrated into `client/src/pages/Lab3D.jsx`.
**How:** Define a list of predefined tasks in a JSON config. Track the `reactionResult` in `Lab3D.jsx` against the active task condition and trigger the `SuccessCelebration` when matched.

### 5. Quick Reset "Undo" Button — Priority: LOW | Effort: SMALL
**What:** A prominent, single-click "Clear Lab" button to reset the chemical sliders and the 3D environment instantly without navigating through the result modal.
**Why:** Encourages rapid trial-and-error experimentation, a core value proposition of open-ended virtual labs.
**Where in code:** `client/src/pages/Lab3D.jsx` (in `.lab3d-actions`).
**How:** Expose the existing `handleResetLab` function to a dedicated button next to the "INITIATE REACTION" button.

## Quick Wins (< 1 day each)
1. **CSV Export for Experiment History**: Can be built entirely client-side using the existing Zustand `historyStore`.
2. **Contextual Chemical Tooltips**: Simple UI addition using CSS or native HTML titles on the slider labels.
3. **Quick Reset "Undo" Button**: Reusing the existing `handleResetLab` state logic on a new UI button in the main lab view.
