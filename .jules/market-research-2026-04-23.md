# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive chemistry experiments (Organic, Inorganic, Titration) in a 3D environment, complete with a teacher dashboard for assignments.
**Market:** Educational Technology / Virtual STEM Labs
**Date:** 2026-04-23
**Competitors Researched:** PhET Interactive Simulations, ChemCollective Virtual Lab, Vic's Science Studio (VR), Futuclass

## Executive Summary
The virtual chemistry lab market is split between highly accessible but visually simple 2D web simulations (PhET, ChemCollective) and immersive but hardware-restricted VR experiences (Vic's Science Studio, Futuclass). Alchemistry occupies a strong middle ground by offering 3D web-based simulations. However, top competitors excel in gamification, interactive tactile elements (drag-and-drop pouring), and comprehensive teacher resources. The biggest opportunities for Alchemistry lie in enhancing the tactile interactivity of the 3D lab, improving real-time feedback loops, and expanding the assessment capabilities for teachers to match industry leaders.

## Competitor Analysis
- **PhET Interactive Simulations:** The industry standard for accessibility. Highly resource-rich with teacher guides and translations, but graphically dated and relies on 2D interactivity.
- **ChemCollective Virtual Lab:** Focuses heavily on the procedural accuracy of wet labs. Allows complex mixing but has a steeper learning curve and an outdated UI.
- **Vic's Science Studio:** A VR-first platform. Offers high realism (precipitates, color changes) and a strong teacher dashboard for tracking progress, but requires VR headsets.
- **Futuclass:** Highly gamified modules (5-10 mins) focused on puzzles and instant feedback. Excellent for younger students but less focused on free-form experimentation.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Exportable Lab Reports:** Competitors allow students to export their experiment logs (PDF/CSV) to submit as coursework.
- **Tactile Interactions:** Real chemistry involves pouring and measuring, not just using sliders. Competitors use drag-and-drop mechanics.

### Differentiating Opportunities (Stand-out features)
- **Gamified "Puzzle" Modules:** Inspired by Futuclass, offering short, structured challenges (e.g., "Synthesize X compound in under 3 moves") alongside the sandbox mode.
- **Real-time Error Feedback:** Instead of just a "failed" state, explaining *why* an experiment failed dynamically (e.g., "You added base too quickly").

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Tooltips on Hover:** Information about chemicals (molar mass, hazards) appearing on hover over beakers/flasks.
- **Step-by-step Guided Onboarding:** A tutorial mode that walks new users through their first experiment.

## Prioritised Recommendations

### 1. Exportable Lab Reports — Priority: HIGH | Effort: SMALL
**What:** Add functionality to export the user's experiment history to a CSV or PDF file.
**Why:** Standard feature in educational tools for homework submission. Users need a way to share results outside the platform.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export Log" button that utilizes a library like `papaparse` to convert the `logs` array from `useHistoryStore` into a downloadable CSV file.

### 2. Contextual Chemical Information (Hover Tooltips) — Priority: HIGH | Effort: SMALL
**What:** Display tooltips with chemical properties (Formula, Hazards, State) when hovering over chemical controls.
**Why:** Enhances the educational value without cluttering the UI, a common pattern in PhET.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Wrap the `.slider-card` elements in a Tooltip component that renders additional context (e.g., molar mass, safety warnings) on hover or focus.

### 3. Drag-and-Drop / Tactile Pouring Mechanics — Priority: MEDIUM | Effort: LARGE
**What:** Replace or supplement the UI sliders with interactable 3D flasks that the user can drag and "pour" into the main beaker.
**Why:** Bridges the gap between 2D web apps and VR experiences. Increases immersion and mirrors the physical lab experience better.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `DraggableFlask.jsx`
**How:** Expand the existing `DraggableFlask` implementation using `@use-gesture/react` to update the chemical state (`chemA`, etc.) based on the flask's tilt/rotation when positioned over the beaker.

### 4. Interactive Sandbox Challenges — Priority: MEDIUM | Effort: MEDIUM
**What:** Add a "Challenge Mode" to the Student Dashboard where students must achieve a specific reaction outcome.
**Why:** Gamification drives engagement. Competitors like Futuclass use short, objective-based puzzles successfully.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/store/assignmentStore.js`
**How:** Create a new section under "MY ASSIGNMENTS" for "Daily Challenges" that sets a specific target (e.g., "Create an Exothermic reaction") and tracks completion via the `experiment_results` table.

### 5. Detailed Error/Failure Analysis — Priority: MEDIUM | Effort: SMALL
**What:** Provide specific scientific reasons for reaction failures rather than generic error messages.
**Why:** "Reaction failed" is not educational. Explaining *why* it failed helps students learn from mistakes.
**Where in code:** `client/src/components/ResultModal.jsx` and backend logic.
**How:** Update the `ResultModal` to display a "Failure Analysis" section when `reactionState === 'error'`, pulling detailed reasons from the backend or AI Tutor context.

### 6. Dynamic Lab Manual Integration — Priority: LOW | Effort: MEDIUM
**What:** Embed relevant sections of the lab manual directly into the experiment pages.
**Why:** Currently, pages like `organic.jsx` tell users to "Refer Your Chemistry Lab Manual Page - 70". Users shouldn't have to leave the app.
**Where in code:** `client/src/pages/organic.jsx` and `inorganic.jsx`
**How:** Add a slide-out drawer component that displays the digitized manual content specific to the current experiment group.

### 7. Teacher Dashboard: Class Aggregate Analytics — Priority: LOW | Effort: MEDIUM
**What:** Provide teachers with charts showing aggregate class performance on specific experiments.
**Why:** Competitors offer robust tracking. Helps teachers identify concepts the whole class is struggling with.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` (specifically the analytics view)
**How:** Use `recharts` (already in `package.json`) to visualize data from the `experiment_results` table, grouped by experiment type and average score.

### 8. Interactive Onboarding Walkthrough — Priority: LOW | Effort: MEDIUM
**What:** A step-by-step guided tour for first-time users.
**Why:** Reduces the learning curve for the 3D interface.
**Where in code:** `client/src/pages/Lab3D.jsx` and `App.jsx`
**How:** Implement a state flag `hasSeenTutorial` in localStorage. If false, render a series of tooltips guiding the user to adjust sliders and click "Initiate Reaction".

### 9. Shareable Experiment Replays — Priority: LOW | Effort: LARGE
**What:** Allow users to share a link to a specific experiment outcome.
**Why:** Encourages collaboration and allows teachers to share specific examples.
**Where in code:** Routes, `client/src/pages/history.jsx`
**How:** Save the specific input parameters (`chemA`, `chemB`, etc.) to the database and create a shared route (e.g., `/shared-lab/:id`) that initializes the lab with those exact parameters.

### 10. Granular Titration Controls — Priority: LOW | Effort: SMALL
**What:** Add fine-tuning controls (drop-by-drop) to the Titration experiment.
**Why:** Titration requires precision. The current start/stop mechanism might be too blunt.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Add a "Single Drop" button that increments the `count` state by a very small amount, allowing for precise color changes near the endpoint.

## Quick Wins (< 1 day each)
1. **Exportable Lab Reports:** Implementing CSV export using standard JavaScript Blob/URL APIs on the history page.
2. **Contextual Chemical Information:** Adding native `title` attributes or simple hover tooltips to the slider controls in Lab3D.
3. **Granular Titration Controls:** Adding a single-drop button to the titration interface.
