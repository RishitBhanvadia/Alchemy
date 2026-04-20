# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React, Three.js, and Supabase that enables students to conduct safe, interactive 3D chemistry experiments while providing teachers with classroom management and progress tracking tools.
**Market:** EdTech / Virtual Science Education
**Date:** 2026-04-20
**Competitors Researched:** PraxiLabs, ChemCollective, Labster

## Executive Summary
The virtual science education market is shifting from static 2D simulations toward immersive, gamified 3D environments that integrate tightly with learning management systems (LMS). Top players (PraxiLabs, Labster) are differentiating through AI-driven personalized guidance ("lab assistants"), detailed performance analytics for educators, and robust formative assessments. Alchemistry has a solid foundation with its Three.js 3D environment, student/teacher roles, and basic classroom management, but it currently lacks the in-experiment scaffolding (contextual hints) and robust automated assessment mechanisms that are table stakes in the competitive landscape.

## Competitor Analysis

**1. PraxiLabs**
*   **Key Features:** Immersive 3D science labs, LMS integration, Performance analytics, Custom Quiz Builder.
*   **Differentiators:** AI Lab Assistant ("Oxi") for real-time personalized guidance, gamified simulations with built-in question banks.

**2. ChemCollective**
*   **Key Features:** Autograded virtual labs, real-world scenarios, interactive tutors.
*   **Differentiators:** Teacher hints/solutions, worksheets, concept tests integrated into the simulation flow.

**3. Labster**
*   **Key Features:** 300+ interactive simulations, LMS integration, direct manipulation in 3D.
*   **Differentiators:** Mathematical modeling integration, automated grading, breakout rooms/collaboration tools within virtual classes.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Automated Formative Assessment:** Built-in quizzes or autograded steps during the experiment. Currently, Alchemistry has experiment modules (`client/src/pages/Lab3D.jsx`) but no explicit inline quizzing.
*   **In-Experiment Guidance/Hints:** Real-time feedback and hints during the simulation. Alchemistry lacks an interactive tutor or hint system.
*   **Comprehensive Teacher Analytics:** Beyond basic tracking. `TeacherDashboard.jsx` needs more granular data on student interactions within specific experiments.

### Differentiating Opportunities (Stand-out features)
*   **AI/Interactive Lab Assistant:** Similar to PraxiLabs' "Oxi", a floating helper in the 3D lab environment.
*   **Custom Experiment/Quiz Builder:** Allowing teachers in `ClassroomDetail.jsx` to build custom questions attached to specific experiments.
*   **Real-World Scenario Mapping:** Contextualizing experiments within real-world problems.

### UX Patterns (Design/interaction patterns common in top products)
*   **Gamified Progress:** Badges/Achievements. (Note: Alchemistry already has this in `Profile.jsx`! We should enhance its visibility).
*   **Split-Screen Interface:** Having the 3D lab on one side and a dynamic worksheet/instructions panel on the other.

## Prioritised Recommendations

### 1. In-Experiment Hint & Guidance System — Priority: HIGH | Effort: MEDIUM
**What:** Add a contextual hint system ("Virtual Assistant") that provides real-time guidance during 3D experiments.
**Why:** ChemCollective and PraxiLabs both emphasize interactive tutors. It prevents student frustration and improves learning retention.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Create a `HintAssistant` component that overlays the 3D canvas. Add a `useState` for `currentStep` and `showHint` in `Lab3D.jsx`, mapping hints to specific interactions in the Three.js scene.

### 2. Inline Formative Assessments (Quizzes) — Priority: HIGH | Effort: MEDIUM
**What:** Integrate short, autograded multiple-choice questions at key steps within an experiment.
**Why:** Automated grading and built-in question banks are standard in Labster and PraxiLabs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/ResultModal.jsx`
**How:** Extend the experiment data model to include `quizQuestions`. Render a modal quiz dialog when specific chemical reactions occur, storing the score in the existing Supabase results table.

### 3. Enhanced Teacher Analytics Dashboard — Priority: HIGH | Effort: MEDIUM
**What:** Add detailed visual analytics (charts) to track aggregate classroom performance and common student errors.
**Why:** PraxiLabs emphasizes "Performance Analytics" for smarter teaching decisions. Our `TeacherDashboard.jsx` currently lists students but lacks deep visual insights.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Integrate `recharts` (already in `package.json`) to create bar/line charts showing average experiment scores and completion times based on the existing Supabase data.

### 4. Custom Quiz Builder for Teachers — Priority: MEDIUM | Effort: LARGE
**What:** Allow teachers to attach custom questions to specific lab assignments.
**Why:** PraxiLabs' "Custom Quiz Builder" is a strong differentiator for educators wanting control over assessments.
**Where in code:** `client/src/pages/ClassroomDetail.jsx`
**How:** Add a new tab/section in `ClassroomDetail.jsx` for assignment creation. Create a form to input question/answer pairs and store them in a new Supabase table linked to the assignment ID.

### 5. Split-Panel Lab Interface — Priority: MEDIUM | Effort: SMALL
**What:** Redesign the lab view to feature a persistent side-panel for instructions and lab notes, rather than overlapping modals.
**Why:** Standard UX pattern in complex simulations to keep instructions visible alongside the 3D environment.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Update the CSS layout of `Lab3D.jsx` to use a CSS Grid structure (e.g., `grid-cols-[1fr_300px]`), placing the `<Canvas>` on the left and a new `LabInstructions` component on the right.

### 6. Interactive Worksheets — Priority: MEDIUM | Effort: MEDIUM
**What:** Digital worksheets that students fill out before and after the simulation.
**Why:** ChemCollective uses worksheets to guide study and bridge the gap between theory and practical simulation.
**Where in code:** `client/src/pages/organic.jsx`, `titration.jsx`, `inorganic.jsx`
**How:** Add a "Pre-Lab" and "Post-Lab" form section to the specific experiment pages before launching the `Lab3D` view. Save responses to the database.

### 7. Real-world Scenario Contextualization — Priority: LOW | Effort: SMALL
**What:** Wrap existing experiments in real-world narratives (e.g., "Analyze the acidity of this local water sample" instead of just "Titration").
**Why:** ChemCollective heavily uses real-world scenarios to increase engagement.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and module pages.
**How:** Update the static `description` text in `StudentDashboard.jsx` and the intro text of experiment modules to frame the tasks as real-world problems.

### 8. Downloadable Lab Reports (CSV/PDF export) — Priority: LOW | Effort: SMALL
**What:** Allow students and teachers to export experiment results.
**Why:** Table stakes feature for academic software to allow submission of assignments outside the platform.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/Result.jsx`
**How:** Add an "Export to CSV" button in `history.jsx` using a simple Blob download utility function that maps the existing results array to CSV format.

### 9. Gamification Visibility Enhancement — Priority: LOW | Effort: SMALL
**What:** Make the existing badge system more prominent immediately after an experiment.
**Why:** Gamified progress boosts retention. We already have the logic in `Profile.jsx`.
**Where in code:** `client/src/pages/success.jsx` or `ResultModal.jsx`
**How:** Import the badge logic into the success screen and conditionally render a "New Badge Unlocked!" animation using `framer-motion` if a new threshold is met.

### 10. Direct LMS Integration Preparation (LTI/SCORM) — Priority: LOW | Effort: LARGE
**What:** Architect the backend and frontend auth to support LTI (Learning Tools Interoperability) for Canvas/Blackboard integration.
**Why:** Labster and PraxiLabs emphasize LMS integration as a core selling point for institutional adoption.
**Where in code:** `server/routes/auth.js` (Backend) and `client/src/App.jsx`
**How:** This is a major architectural addition. Begin by researching Supabase SAML/SSO capabilities and plan a new Express route dedicated to handling LTI launch requests.

## Quick Wins (< 1 day each)
1.  **Split-Panel Lab Interface:** Update CSS in `Lab3D.jsx` to a grid layout to keep instructions visible alongside the 3D scene.
2.  **Downloadable Lab Reports:** Add a CSV export button to `history.jsx` using basic JavaScript Blob handling.
3.  **Real-world Scenario Contextualization:** Rewrite the descriptions in `StudentDashboard.jsx` to frame experiments as real-world problems.