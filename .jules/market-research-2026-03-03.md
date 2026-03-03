# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory enabling students to conduct safe, interactive experiments with real-time feedback.
**Market:** EdTech / Virtual Science Laboratories (STEM Education)
**Date:** 2026-03-03
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry laboratory market is highly focused on combining realistic 3D simulations with structured learning paths. Top competitors like Labster and PraxiLabs go beyond open-sandbox environments by offering scenario-based learning, guided tutorials, integrated assessments, and comprehensive teacher analytics. While Alchemistry has a solid foundation with its 3D interactive modules (Titration, Organic, Inorganic) and a modern glassmorphism UI, it lacks structured guidance and real-time data visualization. By integrating guided workflows, theoretical quizzes, and dynamic data representation directly into the existing codebase, Alchemistry can significantly improve student retention and learning outcomes, closing the gap with established market leaders.

## Competitor Analysis

*   **Labster:** The industry leader in virtual lab simulations. Known for its highly gamified, scenario-based learning approach (e.g., solving real-world problems like acidic contamination in a lake). Key differentiators include built-in quiz questions for theory reinforcement, detailed performance analytics for instructors, and guided learning pathways.
*   **PraxiLabs:** Focuses on immersive 3D virtual labs with strong LMS integration. Standout features include an AI Lab Assistant ("Oxi") for real-time personalized guidance, a custom quiz builder linked to experiments, and extensive performance tracking. It offers a "game-like" experience with hints, lab manuals, and cautionary notes.
*   **ChemCollective:** A well-established, open-ended virtual lab sponsored by the National Science Foundation. It excels in inquiry-based learning and provides a "concentration viewer" that dynamically shows the amounts of each element in a solution during an experiment, bridging the gap between physical lab actions and theoretical chemistry.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Structured Onboarding & Guidance:** Users expect step-by-step guidance or tutorials when entering complex 3D environments, whereas Alchemistry currently drops them straight into the modules (e.g., `lab.jsx`, `titration.jsx`) with minimal instructions.
*   **In-Experiment Assessment:** The ability to test theoretical knowledge (quizzes/MCQs) before, during, or after the practical simulation to ensure comprehension, rather than just grading the final physical action (like volume used in titration).
*   **Real-time Data Visualization:** Visual representation of changing variables (like concentration or pH) during the experiment, rather than just an end result.

### Differentiating Opportunities (Stand-out features)
*   **Virtual Lab Assistant / Contextual Hints:** A helper system that can provide personalized hints when a student is stuck or makes an error (similar to PraxiLabs' "Oxi"), rather than generic failure messages.
*   **Scenario-Based Missions:** Framing experiments within a real-world context (e.g., "Analyze this water sample for contamination") rather than just abstract chemical mixing, increasing engagement.

### UX Patterns (Design/interaction patterns common in top products)
*   **Gamified Feedback Loops:** Instant, granular feedback on actions with visual cues (e.g., progress bars, achievement popups) to reinforce learning.
*   **Comprehensive Instructor Dashboard:** A centralized view for teachers to monitor individual student progress, module completion rates, and assessment scores, rather than just a personal history log.

## Prioritised Recommendations

### 1. Interactive Onboarding Overlay for New Modules — Priority: HIGH | Effort: MEDIUM
**What:** Add a guided, step-by-step overlay tutorial that highlights UI elements when a user first opens a lab module.
**Why:** Competitors (Labster, PraxiLabs) use guided pathways to prevent user confusion in complex 3D environments. This is a table-stakes UX pattern for EdTech tools.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/titration.jsx`
**How:** Create a reusable `<TutorialOverlay>` component using React state to track the current step. Use CSS to highlight specific `ref` elements (like the chemical rack or test tube) while dimming the background. Store a `hasSeenTutorial` flag in `localStorage` to show it only once per user.

### 2. Real-Time Concentration/Data Viewer — Priority: HIGH | Effort: MEDIUM
**What:** A dynamic data panel showing the current concentration or molarity of the solution as chemicals are added.
**Why:** ChemCollective's "concentration viewer" is a core feature that bridges practical actions with theoretical understanding. Alchemistry currently relies only on visual indicators (liquid height/color).
**Where in code:** `client/src/pages/lab.jsx`
**How:** Expand the `status-panel` on the right side. Create a new component `<DataViewer>` that takes `chemA`, `chemB`, `chemC`, `chemD` as props and calculates the resulting molarity or mixture composition dynamically, rendering it as a simple bar chart or numerical list.

### 3. Pre/Post-Experiment Theory Quizzes — Priority: HIGH | Effort: SMALL
**What:** A short 3-question multiple-choice quiz that appears before starting an experiment to test fundamental concepts.
**Why:** Labster integrates quiz questions directly into the workflow to support an inquiry-based approach. This ensures students understand *why* they are performing the experiment.
**Where in code:** `client/src/pages/titration.jsx` and new component `client/src/components/TheoryQuiz.jsx`
**How:** Create a simple modal component that renders a set of hardcoded JSON questions related to the module (e.g., acid-base theory for titration). Prevent the "CONFIRM SELECTION" or "INITIATE REACTION" buttons from enabling until the quiz is passed.

### 4. Contextual "Hint" System — Priority: MEDIUM | Effort: SMALL
**What:** A button that provides specific advice based on the current state of the experiment if a user gets stuck or makes an error.
**Why:** PraxiLabs uses a virtual assistant to provide hints, which reduces frustration and keeps students engaged.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Add a `?` icon button near the control panel. When clicked, it evaluates the current state (e.g., if `add_kmn` is true but the user hasn't clicked it) and sets a `hintMessage` state to display actionable advice like "Try adding the indicator next."

### 5. Enhanced Instructor Analytics Dashboard — Priority: MEDIUM | Effort: LARGE
**What:** Transform the current Dashboard into a dedicated teacher view that aggregates student scores and experiment completion data.
**Why:** Both Labster and PraxiLabs heavily market their instructor tools. A dashboard that tracks class performance is critical for institutional adoption.
**Where in code:** `client/src/pages/Dashboard.jsx` and Supabase backend queries.
**How:** Modify `Dashboard.jsx` to check user roles (e.g., `user.user_metadata.role === 'teacher'`). If teacher, fetch aggregated data from the `experiment_results` table using Supabase, and display average scores and completion rates using a charting library like Chart.js or simple CSS progress bars, replacing the standard module selection grid.

## Quick Wins (< 1 day each)
1.  **Pre/Post-Experiment Theory Quizzes:** Can be implemented quickly with a basic modal and hardcoded questions to immediately add educational value.
2.  **Contextual "Hint" System:** Simple conditional logic based on existing state variables in `titration.jsx` to provide immediate feedback.
3.  **Real-Time Concentration/Data Viewer:** The raw data (`chemA`, etc.) is already available in state; rendering it numerically in the existing status panel is a straightforward UI addition.
