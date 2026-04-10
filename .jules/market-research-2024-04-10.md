# Market Research Report
**App:** Alchemistry is a React-based 3D virtual chemistry laboratory that enables students to conduct safe, interactive experiments and track results while providing teachers with analytics.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-04-10
**Competitors Researched:** Labster, PraxiLabs, ExploreLearning Gizmos, WhimsyLabs

## Executive Summary
The virtual chemistry lab market is highly focused on safety, cost-reduction, and enhancing student retention through interactive experiences. While Alchemistry has an excellent 3D foundation and AI integration, it currently functions more as a sandbox. Top competitors excel by structuring the learning experience (theory, quizzes), enforcing safety protocols virtually, and providing robust data tools for both students and teachers. Adding these expected features will transition Alchemistry from a simulation to a complete educational platform.

## Competitor Analysis
- **Labster:** The market leader. Focuses on immersive, gamified experiences with strong storytelling, pre-lab theory, and post-lab quizzes.
- **PraxiLabs:** Strong emphasis on LMS integration, AI assistance, automated performance analytics, and cost reduction.
- **ExploreLearning Gizmos:** Highly focused on data visualization, graphing, and aligning simulations with real-world sensemaking and inquiry-based learning.
- **WhimsyLabs:** Focuses on repetition and practical technique mastery before touching real equipment.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Pre-lab briefings / Theory sections
- Post-experiment quizzes for assessment
- Lab safety enforcement (e.g., virtual PPE)
- Data export capabilities for lab reports

### Differentiating Opportunities (Stand-out features)
- Gamified safety hazards (e.g., penalties for missing PPE or wrong combinations)
- Integrated graphing of chemical reactions over time
- Collaborative multiplayer experiments

### UX Patterns (Design/interaction patterns common in top products)
- Guided step-by-step onboarding for the first experiment
- Clear visual indicators of safety compliance
- Persistent "Lab Manual" or "Theory" sidebar

## Prioritised Recommendations

### 1. Pre-Lab Briefings — Priority: HIGH | Effort: MEDIUM
**What:** A modal or slide-over that presents the theory and objective before an experiment starts.
**Why:** Competitors emphasize that practicals without theory are less effective. It sets expectations.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Add a `PreLabBriefing` component that renders before the 3D canvas is interactive, pulling markdown/text based on the selected `experiment_type`.

### 2. Post-Lab Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** A short 3-question quiz triggered after a successful reaction.
**Why:** Teachers need to assess understanding, not just task completion.
**Where in code:** `client/src/components/ResultModal.jsx` (or a new `QuizModal.jsx` triggered by it).
**How:** Enhance `ResultModal` to include a "Take Quiz" button that renders a simple form validating against an API endpoint or static config.

### 3. Lab Safety (PPE) Toggle — Priority: HIGH | Effort: SMALL
**What:** A UI requirement to "equip" goggles and gloves before the "INITIATE REACTION" button is enabled.
**Why:** Safety is the #1 reason schools buy virtual labs. Reinforcing the habit is critical.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `safetyEquipped` state to `Lab3D.jsx`. Disable the `initiate-reaction-btn` until checkboxes for "Goggles" and "Gloves" are checked.

### 4. CSV Export for Experiment History — Priority: MEDIUM | Effort: SMALL
**What:** A button to export the experiment log to CSV.
**Why:** Students need data for lab reports; teachers need it for external gradebooks.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that maps the `logs` array to CSV using Papa Parse or a simple blob download.

### 5. Step-by-Step Onboarding — Priority: MEDIUM | Effort: MEDIUM
**What:** Contextual tooltips guiding the user through their first experiment (adjusting sliders, hitting react).
**Why:** Reduces initial friction and cognitive load for new users.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/App.jsx`
**How:** Add a `hasSeenOnboarding` flag to `localStorage`. Use a library like `react-joyride` or custom absolute-positioned tooltips over the sliders.

### 6. Interactive Graphing Module — Priority: LOW | Effort: LARGE
**What:** A real-time graph showing concentration/pH changes during the reaction.
**Why:** Deepens the scientific understanding beyond just seeing a color change (a key strength of Gizmos).
**Where in code:** `client/src/components/ResultModal.jsx` or a new panel in `Lab3D.jsx`.
**How:** Integrate `recharts` (already in `package.json`) to plot simulated data points generated during the `loading` state of the reaction.

### 7. Virtual Lab Manual Sidebar — Priority: LOW | Effort: MEDIUM
**What:** A collapsible sidebar containing reference material (periodic table, formula sheets).
**Why:** Keeps students in the app rather than Googling answers.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `LabManualSidebar` component similar to the `AiTutorPanel` that toggles via a button on the side of the screen.

### 8. Shareable Experiment Results — Priority: LOW | Effort: SMALL
**What:** A "Copy Link" or "Share" button for a specific experiment outcome.
**Why:** Encourages collaboration and allows students to easily submit specific results to teachers.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Add a button that copies a formatted string or a unique deep link (if routing supports it) to the clipboard.

### 9. Enhanced Error Feedback (Safety Violations) — Priority: MEDIUM | Effort: SMALL
**What:** Specific feedback when a reaction fails due to dangerous combinations, rather than generic "Reaction failed".
**Why:** Turning failures into learning opportunities is a hallmark of good simulations.
**Where in code:** `client/src/pages/Lab3D.jsx` (Reaction logic)
**How:** Update the `reactionResult` handling to display custom error messages (e.g., "Explosion Risk: Acid too concentrated") in the `sr-only` div and UI.

### 10. Teacher Custom Assignments — Priority: MEDIUM | Effort: LARGE
**What:** UI for teachers to create custom assignment targets (e.g., "Synthesize water with 80% accuracy").
**Why:** Required for full LMS replacement; currently assignments seem rigid.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add a form to `TeacherDashboard` that posts to a new `/api/assignments` endpoint.

## Quick Wins (< 1 day each)
1. **Lab Safety (PPE) Toggle:** Just UI state managing the disabled attribute of the play button.
2. **CSV Export for Experiment History:** The data is already loaded in the client; just needs formatting and a Blob download.
3. **Pre-Lab Briefings:** A simple modal rendering static text before the main 3D canvas is revealed.
