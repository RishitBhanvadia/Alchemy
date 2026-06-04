Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory using React and Three.js for interactive STEM education.
**Market:** EdTech / Virtual Science Simulators
**Date:** 2024-05-18
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

Executive Summary
The virtual science laboratory market is dominated by comprehensive platforms like Labster and PraxiLabs. They differentiate themselves through rich, real-world contextual scenarios, strong accessibility features, and robust assessment tools. While Alchemistry has excellent 3D foundations and basic AI integration, it currently lacks guided real-world application contexts, comprehensive accessibility navigation in 3D space, and data export functionalities that educators expect for assessment.

Competitor Analysis
- **Labster:** Market leader. Known for gamified, immersive 3D labs with real-world scenarios (e.g., solving a crime using DNA analysis). Strong curriculum alignment and accessibility features.
- **PraxiLabs:** Focuses on realistic simulations with step-by-step guided experiments. Emphasizes user-friendly interfaces and strong assessment/feedback tools.
- **Beyond Labz:** Specializes in chemistry and physics. Open-ended virtual laboratory simulation platform emphasizing procedure learning and technique practice.

Gap Analysis
Table Stakes (Expected by users, missing from app)
- Data Export: Educators and students expect to be able to export lab results (e.g., CSV).
- Step-by-Step Guided Mode: Novice students need structured tutorials before open experimentation.
- Curriculum Alignment Mapping: Explicit mapping of modules to standard curriculum outcomes.

Differentiating Opportunities (Stand-out features)
- Real-World Scenarios: Framing experiments within a story or real-world problem (like environmental testing).
- Accessibility in 3D: Screen-reader friendly navigation within the 3D canvas environment itself.

UX Patterns (Design/interaction patterns common in top products)
- Gamification: Progress bars, badges, or achievement popups.
- Split View: Persistent procedural instructions alongside the interactive simulation.

Prioritised Recommendations

1. CSV Export for Experiment History — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to download their experiment history as a CSV file.
**Why:** Essential for lab reports and grading. All competitors offer data export.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/TeacherDashboard.jsx`.
**How:** Add an ExportButton component that maps the `logs` from `useHistoryStore` to CSV using Papa Parse or standard Blob creation.

2. Step-by-Step Guided Mode Toggle — Priority: HIGH | Effort: MEDIUM
**What:** A toggleable guided mode that highlights which chemical to add next.
**Why:** PraxiLabs uses this to prevent novice frustration.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a `guidedMode` state. Use the `lockedChems` logic to sequentially unlock chemicals based on a predefined scenario script.

3. Real-World Context Descriptions — Priority: MEDIUM | Effort: SMALL
**What:** Update module cards with real-world applications (e.g., "Titration: Test Water Purity").
**Why:** Increases engagement. Labster excels at contextual learning.
**Where in code:** `MODULE_CARDS` constant in `client/src/pages/StudentDashboard.jsx`.
**How:** Add a `context` string to each object in `MODULE_CARDS` and display it in the module UI.

4. Gamified Success Feedback — Priority: MEDIUM | Effort: SMALL
**What:** Enhance the existing `SuccessCelebration` with specific achievement badges based on the reaction outcome.
**Why:** Labster's gamification significantly boosts student retention.
**Where in code:** `client/src/pages/Lab3D.jsx` (specifically around `SuccessCelebration`).
**How:** Pass the `reactionResult.outcome_label` into the celebration component to display custom badges (e.g., "Master of Acids!").

5. Persistent Procedural Side-Panel — Priority: MEDIUM | Effort: MEDIUM
**What:** A collapsible side panel showing the theoretical steps of the experiment alongside the 3D canvas.
**Why:** Common UX pattern to avoid students switching tabs for instructions.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Create a `ProcedurePanel` component that reads from a new state or prop defining the current experiment's theoretical steps.

6. Enhanced Screen-Reader Support for 3D Elements — Priority: MEDIUM | Effort: MEDIUM
**What:** Add keyboard navigable, hidden DOM elements that correspond to the 3D chemical interactions.
**Why:** Critical for compliance in EdTech.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Expand the existing `sr-only` aria-live region to include focusable buttons that mimic the sliders for keyboard-only users.

7. Teacher Analytics: Export Classroom Data — Priority: LOW | Effort: SMALL
**What:** Allow teachers to export the student data grid.
**Why:** Teachers need this for their own gradebooks.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Add an export function to the `@tanstack/react-table` instance.

8. Student Progress Overview — Priority: LOW | Effort: MEDIUM
**What:** A visual progress bar on the StudentDashboard showing completion of all modules.
**Why:** Helps students track their learning journey.
**Where in code:** `client/src/pages/StudentDashboard.jsx`.
**How:** Calculate completed distinct modules from `useHistoryStore` and render a `ProgressBar` component.

9. AI Tutor Proactive Hints — Priority: LOW | Effort: LARGE
**What:** The AI tutor automatically suggests a hint if a student is idle for > 2 minutes.
**Why:** Prevents students from getting stuck silently.
**Where in code:** `client/src/pages/Lab3D.jsx` and `server/controllers/aiController.js`.
**How:** Implement an idle timer in `Lab3D.jsx` that triggers a specific `hint` request to the AI controller.

10. Scenario-Based Assessment Quizzes — Priority: LOW | Effort: LARGE
**What:** A short, 3-question quiz presented after a successful reaction to test conceptual understanding.
**Why:** PraxiLabs integrates assessments directly into the lab flow.
**Where in code:** `client/src/components/ResultModal.jsx`.
**How:** Extend the `ResultModal` to fetch and display dynamic questions based on the `reactionResult`.

Quick Wins (< 1 day each)
1. CSV Export for Experiment History
2. Real-World Context Descriptions in Module Cards
3. Teacher Analytics: Export Classroom Data
