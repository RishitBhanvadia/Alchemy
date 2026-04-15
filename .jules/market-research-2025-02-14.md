# Market Research Report
**App:** Alchemistry is a web-based interactive 3D virtual chemistry laboratory utilizing React and Three.js that allows students to safely conduct experiments with real-time feedback and an AI Tutor.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2025-02-14
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual chemistry laboratory market is highly competitive and rapidly growing, characterized by a shift towards immersive, 3D experiential learning and accessibility. Top competitors emphasize guided learning pathways, comprehensive environmental controls, and integrated assessments alongside real-time feedback. While Alchemistry has a strong foundation with its 3D environment and AI Tutor, it lacks structured onboarding, advanced environmental variables (e.g., temperature and pressure), and in-app quizzes, which are table stakes in the premium segment. By addressing these gaps, Alchemistry can significantly boost engagement and align more closely with institutional expectations.

## Competitor Analysis
* **Labster:** A premium platform that offers highly immersive 3D simulations with scenario-based learning, guided pathways, and built-in accessibility tools (keyboard navigation, screen reader support).
* **PraxiLabs:** Focuses on practice-centric simulations offering a "game-like experience" with an AI assistant ("Oxi"), custom quiz builders, and deep performance analytics for educators.
* **PhET Interactive Simulations:** Provides highly accessible, free simulations with a focus on specific micro-interactions. Key features include variable controls (e.g., changing volume, heat, gravity) and inclusive design features like interactive descriptions for screen readers.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Guided Onboarding/Tutorials:** First-time users in top platforms receive step-by-step guidance on how to navigate the 3D space and use controls. Alchemistry relies on basic text overlays.
* **Assessment/Quizzes:** Platforms like PraxiLabs integrate quizzes directly with experiments to validate learning. Alchemistry only provides a result modal and AI explanation.
* **Environmental Controls:** Competitors like PhET allow manipulation of temperature and pressure, whereas Alchemistry currently focuses primarily on chemical concentration percentages.

### Differentiating Opportunities (Stand-out features)
* **Exportable Lab Reports:** The ability to export experiment history and results as a CSV or PDF for submission.
* **Gamification/Achievements:** Earning badges or passing specific scenarios to unlock advanced chemicals.
* **Scenario-based Missions:** Rather than a pure sandbox, providing a specific problem (e.g., "Neutralize this acid spill") with clear win conditions.

### UX Patterns (Design/interaction patterns common in top products)
* **Interactive Tooltips:** Highlighting new or unused tools in the UI.
* **Real-time Performance Metrics:** Progress bars during experiments.
* **Accessibility Modes:** High contrast options and robust screen reader support beyond basic ARIA labels.

## Prioritised Recommendations

### 1. Interactive Onboarding Walkthrough — Priority: HIGH | Effort: MEDIUM
**What:** Add a guided, step-by-step onboarding overlay for first-time users in the Lab3D environment.
**Why:** Competitors like Labster provide guided pathways. This reduces the learning curve and prevents users from feeling lost in the sandbox.
**Where in code:** `client/src/pages/Lab3D.jsx` and create a new `client/src/components/TutorialOverlay.jsx`.
**How:** Implement a state variable (`hasSeenTutorial` in localStorage) that triggers a sequenced overlay highlighting the chemical sliders, the "Initiate Reaction" button, and the 3D canvas controls.

### 2. Environmental Controls (Temperature) — Priority: HIGH | Effort: MEDIUM
**What:** Introduce a temperature slider that affects reaction outcomes.
**Why:** PhET and PraxiLabs allow environmental manipulation, which is crucial for comprehensive chemistry education (e.g., endothermic/exothermic reactions).
**Where in code:** `client/src/pages/Lab3D.jsx` and the backend reaction logic.
**How:** Add a new `slider-card` for Temperature in the `lab3d-controls-container` and pass the value to the backend API during the reaction initiation.

### 3. In-App Quiz/Assessment Integration — Priority: HIGH | Effort: LARGE
**What:** Add a short quiz or knowledge check after a successful reaction.
**Why:** PraxiLabs' custom quiz builder is a key selling point for educators to ensure students are learning, not just playing.
**Where in code:** `client/src/components/ResultModal.jsx` and a new `QuizModal.jsx`.
**How:** Extend the `ResultModal` with a "Take Quiz" button that opens a short multiple-choice assessment based on the `outcome_label`, scoring the user and saving to the `AssignmentStore`.

### 4. Exportable Lab History — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to export their experiment logs as a CSV file.
**Why:** Essential for students to submit lab reports to teachers outside of the platform.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add an "Export to CSV" button in the history header that formats the `logs` array and triggers a browser download using standard Blob and URL.createObjectURL.

### 5. Gamified Achievement Badges — Priority: MEDIUM | Effort: MEDIUM
**What:** Introduce visual badges on the profile/dashboard for completing specific types of reactions (e.g., "Acid-Base Master", "Explosion Expert").
**Why:** Increases student engagement and retention, a pattern seen in modern EdTech apps.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/Profile.jsx`.
**How:** Parse the `logs` data in `StudentDashboard` to unlock badges based on condition checks (e.g., count of exothermic reactions) and display them in a new section.

### 6. Interactive Component Tooltips — Priority: LOW | Effort: SMALL
**What:** Add hover tooltips explaining the function of each chemical.
**Why:** Provides contextual learning without overwhelming the user, similar to Labster's embedded theory refreshers.
**Where in code:** `client/src/pages/Lab3D.jsx` (specifically inside the `slider-card` elements).
**How:** Use a standard tooltip component or CSS hover states on the `chem-name` and `chem-formula` to display a brief description of the chemical.

### 7. High-Contrast Accessibility Mode — Priority: LOW | Effort: MEDIUM
**What:** A toggle for a high-contrast theme.
**Why:** PhET prioritizes inclusive design. Ensuring the app is usable by visually impaired students expands market reach.
**Where in code:** `client/src/App.jsx` and `client/src/components/Navbar.jsx`.
**How:** Add a theme toggle in the Navbar that appends a `high-contrast` class to the `<body>`, overriding CSS variables with higher contrast colors.

### 8. Real-time Progress/Status Bar during Reaction — Priority: LOW | Effort: SMALL
**What:** Replace the simple loading spinner with a descriptive progress bar.
**Why:** Provides better feedback during the wait time, keeping students engaged.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`.
**How:** Update the `isReacting` state to cycle through descriptive text (e.g., "Mixing...", "Heating...", "Analyzing...") while the 3D animation plays.

### 9. Scenario-Based Assignments UI — Priority: MEDIUM | Effort: MEDIUM
**What:** Improve the assignment cards to show a specific "Mission" or scenario rather than just a target score.
**Why:** Labster uses scenario-based learning to contextualize the science.
**Where in code:** `client/src/pages/StudentDashboard.jsx`.
**How:** Update the `assignment-card` UI to include a brief "Mission Briefing" string from the assignment data, making the task feel more like a quest.

### 10. Pause/Resume Feature for Long Experiments — Priority: LOW | Effort: LARGE
**What:** Allow users to pause the simulation or save the current state of the lab.
**Why:** Useful for complex setups, aligning with PraxiLabs' "Anytime, Anywhere" flexible navigation.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new endpoint to save lab state.
**How:** Serialize the current chemical slider values into the database against the user session, and load them on mount.

## Quick Wins (< 1 day each)
1. **Exportable Lab History:** Easy to implement client-side CSV generation in `history.jsx`.
2. **Interactive Component Tooltips:** Quick UI update in `Lab3D.jsx` to add HTML `title` attributes or a simple CSS tooltip.
3. **Real-time Progress/Status Bar during Reaction:** Simple text rotation during the loading state in `Lab3D.jsx`.
