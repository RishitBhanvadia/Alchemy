# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js enabling students to conduct safe, interactive experiments.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-05-18
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is dominated by tools like Labster and PraxiLabs which provide immersive, gamified 3D simulations aimed at high school and university students. Alchemistry already has a strong foundation with its Three.js powered `Lab3D.jsx` environment and basic real-time simulation using `chemA`, `chemB`, `chemI`, and `chemC`. However, the app lacks the guided onboarding, assessment loops, and report export features that top competitors provide to ensure measurable learning outcomes.

## Competitor Analysis
- **Labster:** Enterprise-focused, heavy 3D immersion, strong LMS integration, and built-in interactive quizzes during experiments.
- **PraxiLabs:** Browser-based cloud virtual labs, strong focus on guided, step-by-step experiment tutorials.
- **Beyond Labz:** Wide coverage of STEM topics, features a highly realistic multi-subject environment, but is less modern in UI than Labster.
- **PhET Interactive Simulations:** Conceptual, highly accessible 2D simulations without complex graphics, widely used for basic concepts due to zero barriers to entry.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Guided Onboarding/Tutorials:** Competitors provide step-by-step walkthroughs for first-time users.
- **Lab Reports/Data Export:** Users expect to export their experiment logs (e.g., as CSV or PDF) for grading.

### Differentiating Opportunities (Stand-out features)
- **In-Lab Knowledge Checks:** Prompting users with a quick quiz after a reaction completes.
- **Contextual Tooltips:** Highlighting what each chemical slider does during the first interaction.

### UX Patterns (Design/interaction patterns common in top products)
- **Status Indicators:** Clearer visual cues when a reaction is ready to be initiated (Alchemistry relies on a simple button state and a small warning note).

## Prioritised Recommendations

### 1. Contextual Onboarding Tutorial — Priority: HIGH | Effort: MEDIUM
**What:** Add a guided, step-by-step tour for first-time users in the 3D Lab.
**Why:** Competitors like PraxiLabs excel because they don't leave students guessing. A tutorial reduces friction and improves learning outcomes.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Integrate a library like `react-joyride` or create a custom component triggered if `localStorage.getItem('hasSeenLabTutorial')` is false. Highlight the chemical sliders (`.chem-slider`) and the "INITIATE REACTION" button.

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow students to download their experiment logs.
**Why:** Table stakes for educational tools; students need to submit results to teachers. Top tools all support data export.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component. Since the history page already fetches logs from `useHistoryStore` (`const logs = useHistoryStore(state => state.logs);`), convert the fetched `logs` array to CSV format and trigger a file download using a Blob.

### 3. Post-Experiment Assessment Quiz — Priority: MEDIUM | Effort: MEDIUM
**What:** A short 1-2 question quiz modal that appears after a successful reaction.
**Why:** Labster integrates quizzes directly into the flow to reinforce learning. It proves the student understood *why* the reaction happened.
**Where in code:** `client/src/components/ResultModal.jsx` (or in `client/src/pages/Lab3D.jsx` after `ResultModal` is closed)
**How:** Modify `ResultModal` to include a "Take Quiz" button or automatically render a simple multiple-choice question before returning to the lab.

### 4. Dynamic Chemical Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show hover tooltips explaining the role of each chemical (e.g., "HCl - A strong acid").
**Why:** Helps bridge the gap between simulation and conceptual learning, similar to PhET's approach.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `title` attribute or a custom tooltip component to the `.slider-card` elements (e.g. `<div className="slider-card acid">`) for `chemA`, `chemB`, `chemI`, and `chemC`.

### 5. Reaction Readiness Progress Bar — Priority: LOW | Effort: SMALL
**What:** Replace the `<p className="note-warn">Mix at least 2 chemicals to start</p>` text with a visual progress bar or checkmarks.
**Why:** Improves UX by making the readiness state more obvious, a common pattern in gamified labs.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a small indicator component above the "INITIATE REACTION" button that lights up when `onOrNot()` returns true.

### 6. Classroom-Level Chemical Locks UI Improvement — Priority: LOW | Effort: SMALL
**What:** Visually distinguish chemicals that are locked by the teacher.
**Why:** The current implementation disables functionality but sliders still look enabled.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Update the `<input className="chem-slider" ... />` elements to be additionally visually styled (e.g. opacity reduction) if their corresponding chemical ID is in the `lockedChems` array, and add a lock icon overlay.

### 7. Real-time Experiment Validation — Priority: LOW | Effort: MEDIUM
**What:** Show real-time warnings if a student mixes incompatible or dangerous chemicals before hitting "INITIATE REACTION".
**Why:** Enhances the educational value by preventing errors and explaining *why* a mix is bad beforehand.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `useEffect` that checks the current combination of `chemA`, `chemB`, etc., against a list of known "bad" combinations and displays a warning banner.

### 8. Shareable Reaction Results — Priority: LOW | Effort: SMALL
**What:** Add a "Share Result" button to the Result Modal.
**Why:** Encourages collaboration and allows students to easily share their findings with peers or teachers.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Use the Web Share API or copy a formatted string (e.g., "I just created Water (H2O) in Alchemistry!") to the clipboard inside the modal logic.

### 9. Dark/Light Mode Toggle for UI — Priority: LOW | Effort: MEDIUM
**What:** Add a theme toggle for the UI panels surrounding the 3D canvas.
**Why:** Accessibility standard in modern web apps, though less critical for the 3D scene itself.
**Where in code:** `client/src/components/Navbar.jsx` and `client/src/app.css`
**How:** Add a toggle button in the Navbar that switches a `data-theme` attribute on the root `<html>` element, and define CSS variables for light mode.

### 10. Localization Support — Priority: LOW | Effort: LARGE
**What:** Support multiple languages.
**Why:** To reach a wider audience globally, matching competitors like PhET which are translated into dozens of languages.
**Where in code:** Across the application.
**How:** Integrate `react-i18next` and extract hardcoded strings into translation files.

## Quick Wins (< 1 day each)
1. **Export Experiment History to CSV**: Can be done entirely on the client side with existing data.
2. **Dynamic Chemical Tooltips**: Simple HTML/CSS additions to existing components.
3. **Classroom-Level Chemical Locks UI Improvement**: Minor styling updates to the sliders.