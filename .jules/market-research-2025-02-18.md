# Market Research Report
**App:** Alchemistry is a cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Educational Chemistry Simulation Software
**Date:** 2025-02-18
**Competitors Researched:** Labster, Beyond Labz, PhET Interactive Simulations, ExploreLearning Gizmos, PraxiLabs

## Executive Summary
The virtual chemistry lab market is rapidly growing, focusing on immersive learning and accessibility. Top competitors emphasize gamification, standard-aligned assessments, and realistic sandbox environments. Alchemistry has a strong 3D foundation and gamified UI, but lacks deeper analytical tools and personalized guidance seen in market leaders. The biggest opportunities lie in exporting experiment data, adding contextual help, and improving accessibility to match educational standards.

## Competitor Analysis
*   **Labster:** Immersive 3D labs with gamified assessments and detailed reporting. Strong on institutional integration but heavy on resources.
*   **Beyond Labz:** Focuses on photorealistic virtual laboratories for advanced chemistry. Very realistic but lacks the modern, accessible UI of Alchemistry.
*   **PhET Interactive Simulations:** Free, research-based simulations. Excellent for conceptual learning and widely accessible, but less realistic 3D.
*   **PraxiLabs:** Interactive 3D labs with real-time feedback. Good balance of realism and education, similar target to Alchemistry.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export:** Users expect to export experiment results for reports or grading. Alchemistry currently lacks a way to export logs.
*   **Contextual Onboarding:** New users need guidance on how to use the lab. Alchemistry has basic instructions but no interactive walkthrough.

### Differentiating Opportunities (Stand-out features)
*   **Real-time Assessments:** Integrating quiz questions or target outcomes directly into the lab experience, not just post-experiment.
*   **Accessibility (Screen Readers/Keyboard):** While Alchemistry has some ARIA labels, making the entire 3D interaction fully keyboard/screen-reader friendly is a major differentiator in education.

### UX Patterns (Design/interaction patterns common in top products)
*   **Progressive Disclosure:** Showing advanced controls only when needed to avoid overwhelming students.
*   **In-context Tooltips:** Hover states explaining chemical properties before mixing.

## Prioritised Recommendations

### 1. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a button to export the user's experiment history to a CSV file.
**Why:** Educational tools require data export for student reports and teacher grading. This is a basic expectation in this market.
**Where in code:** `client/src/pages/history.jsx` (or wherever the history logs are rendered).
**How:** Map the existing `logs` array from `useHistoryStore` to CSV format and trigger a download using a Blob.

### 2. Contextual Chemical Tooltips — Priority: HIGH | Effort: SMALL
**What:** Add informational tooltips when hovering over chemical sliders in the 3D lab.
**Why:** Competitors use tooltips to teach chemical properties *before* the experiment, enhancing conceptual learning.
**Where in code:** `client/src/pages/Lab3D.jsx` (around `.slider-card` elements).
**How:** Add `title` attributes or a custom Tooltip component to show basic chemical info (e.g., "Hydrochloric Acid: Strong acid, highly corrosive").

### 3. Keyboard Navigation for 3D Lab Controls — Priority: MEDIUM | Effort: SMALL
**What:** Ensure all sliders and the "Initiate Reaction" button are fully accessible via keyboard (Tab and Arrow keys).
**Why:** Accessibility is a strict requirement for educational software (WCAG compliance).
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/Lab3D.css`.
**How:** Verify `tabIndex` on custom elements, add visible focus styles in CSS (`:focus-visible`), and ensure standard `<input type="range">` accessibility.

### 4. Guided First-Time Onboarding — Priority: MEDIUM | Effort: MEDIUM
**What:** Add a lightweight intro overlay or tooltip sequence for first-time users entering the lab.
**Why:** Reduces cognitive load and abandonment rate, a common pattern in top tools like Labster.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new state in `localStorage`.
**How:** Check `localStorage` for `hasSeenLabIntro`; if false, show a simple modal explaining the controls, then set to true.

### 5. Detailed Error/Failure Feedback — Priority: MEDIUM | Effort: SMALL
**What:** Provide specific scientific reasons when a reaction fails or produces no result.
**Why:** Competitors emphasize "learning from failure" by explaining *why* an experiment didn't work.
**Where in code:** `client/src/pages/Lab3D.jsx` and the backend `titrationController.js` or `experimentController.js`.
**How:** Expand the `reactionResult` handling to display descriptive error messages based on the chemical mix, rather than just "Mixing Chemicals...".

### 6. Quick Reset Button for Lab — Priority: LOW | Effort: SMALL
**What:** A button to instantly reset all chemical sliders to 0%.
**Why:** Improves user flow when conducting multiple experiments sequentially.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a "Reset Sliders" button that calls `setChemA(0)`, `setChemB(0)`, etc.

### 7. Teacher Dashboard: Student Progress Export — Priority: MEDIUM | Effort: SMALL
**What:** Allow teachers to export class assignment progress.
**Why:** Essential for classroom management and grading.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` or `client/src/pages/ClassroomDetail.jsx`.
**How:** Similar to student history export, convert the classroom's student progress data to CSV.

### 8. Enhanced Loading States for 3D Assets — Priority: LOW | Effort: SMALL
**What:** Display a progress bar or percentage while the 3D environment loads.
**Why:** Large 3D assets can cause perceived performance issues; clear feedback improves UX.
**Where in code:** `client/src/pages/Lab3D.jsx` (inside the Suspense fallback).
**How:** Use `useProgress` from `@react-three/drei` to show actual loading percentage.

### 9. Mobile-Friendly Action Buttons — Priority: LOW | Effort: SMALL
**What:** Adjust touch targets and spacing for mobile users in the lab.
**Why:** Accessibility and expanding device support, matching PhET's broad device compatibility.
**Where in code:** `client/src/pages/Lab3D.css`.
**How:** Increase padding and minimum height for `.chem-slider` thumbs and `.action-button` on small screens.

### 10. Dark/Light Mode Support — Priority: LOW | Effort: MEDIUM
**What:** Add a theme toggle.
**Why:** Standard UI feature, helps with visual accessibility.
**Where in code:** `client/src/App.jsx`, `client/src/app.css`.
**How:** Add a theme context and CSS variables for light mode overrides.

## Quick Wins (< 1 day each)
1.  **Export Experiment History to CSV:** High value for students/teachers, easy to implement with existing store data.
2.  **Contextual Chemical Tooltips:** Simple UI addition that significantly boosts educational value.
3.  **Keyboard Navigation/Focus Styles:** Critical for accessibility compliance and quick to fix in CSS.
