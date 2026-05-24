# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for students to conduct interactive chemistry experiments safely.
**Market:** Virtual Science Education / EdTech
**Date:** 2026-05-24
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is highly focused on combining safe, immersive 3D simulations with strong assessment and performance tracking tools. Alchemistry currently offers a solid interactive physics and 3D simulation foundation, along with an AI tutor. However, top competitors differentiate themselves through extensive learning management system (LMS) integrations, guided learning pathways, quiz/assessment builders, and robust analytics that provide actionable insights to educators. Implementing features that help instructors track student progress and verify learning outcomes presents the most significant opportunity for Alchemistry.

## Competitor Analysis
*   **Labster**: A leader in virtual labs, offering immersive, scenario-based learning and gamified escape rooms. Differentiates with embedded theory refreshers, guided feedback, and comprehensive dashboards for instructors to track student progress.
*   **PraxiLabs**: Focuses on realistic 3D interaction with high fidelity to real-world labs. Key features include an AI lab assistant ("Oxi"), automated performance reports, and a custom quiz builder that integrates with LMS platforms.
*   **ChemCollective**: A widely used, simpler platform that provides virtual lab simulators alongside video demonstrations and tutorials, focusing on accessibility and straightforward practice of lab techniques.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   Guided learning pathways or tutorials to introduce the lab interface.
*   Assessment tools (quizzes/questions) tied directly to experiments.

### Differentiating Opportunities (Stand-out features)
*   Instructor performance analytics and automated progress reports.
*   Gamified, scenario-based experiments (e.g., "Escape the Lab" style challenges).
*   Exportable experiment data (e.g., CSV/PDF reports of student results).

### UX Patterns (Design/interaction patterns common in top products)
*   Interactive UI hints and step-by-step experiment walkthroughs.
*   Real-time progress bars or milestone trackers during an experiment.

## Prioritised Recommendations

### 1. Instructor Analytics Dashboard — Priority: HIGH | Effort: MEDIUM
**What:** Add a view in the TeacherDashboard to see aggregated student completion rates and success metrics for lab experiments.
**Why:** Competitors like Labster and PraxiLabs emphasize performance analytics to help teachers track learning outcomes.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Expand the existing analytics chart to pull data from the history API, showing the percentage of successful vs. failed reactions across a classroom.

### 2. Exportable Lab Reports — Priority: HIGH | Effort: SMALL
**What:** Allow students to export their experiment history and results as a CSV file.
**Why:** Standard feature in educational tools to allow students to submit work and teachers to review offline data.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export CSV" button that takes the `historyLogs` array, formats it into CSV using a simple utility function, and triggers a download.

### 3. Step-by-Step Guided Tutorial — Priority: MEDIUM | Effort: MEDIUM
**What:** Implement a guided tour (e.g., using a library like intro.js or custom tooltips) for first-time users entering the 3D lab.
**Why:** Top platforms (PraxiLabs) highlight guided tutorials as key for onboarding users to complex 3D interfaces.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Introduce a `hasSeenTutorial` flag in `localStorage`. If false, display contextual tooltips highlighting the chemical sliders, the 3D beaker area, and the "Initiate Reaction" button.

### 4. Interactive Quizzes Linked to Results — Priority: MEDIUM | Effort: LARGE
**What:** Add a post-experiment quiz to test theoretical understanding of the reaction just performed.
**Why:** Both Labster and PraxiLabs tightly integrate assessments with simulations to verify learning.
**Where in code:** `client/src/pages/result.jsx` and a new backend route in `server/routes/experimentRoutes.js`
**How:** After a successful reaction, display a brief 3-question multiple-choice quiz generated dynamically by the existing Gemini AI integration (`aiController.js`), and record the score.

### 5. "Escape Room" Style Scenarios — Priority: LOW | Effort: LARGE
**What:** Create gamified, goal-oriented lab sessions where students must achieve a specific reaction to "win."
**Why:** Labster's scenario-based learning (e.g., "Escape the Lab") drives high student engagement.
**Where in code:** New page `client/src/pages/ScenarioLab.jsx`
**How:** Create a wrapper around the 3D lab that sets a target outcome (e.g., "Neutralize the acid"). Students have a limited number of attempts to find the correct concentration ratio.

### 6. Embedded Theory Refreshers — Priority: LOW | Effort: SMALL
**What:** Provide quick access to the chemical properties and theory behind the available chemicals within the lab UI.
**Why:** Helps bridge the gap between simulation and textbook learning, a key feature in competitor platforms.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add an information icon next to each chemical slider that opens a small modal with text detailing its properties (e.g., HCl is a strong acid).

### 7. Real-Time Milestone Tracker — Priority: LOW | Effort: MEDIUM
**What:** A visual progress bar showing the steps required to complete a complex experiment.
**Why:** Common UX pattern in top virtual labs to guide students through multi-step procedures.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a stepper component that highlights steps (e.g., 1. Set Concentrations, 2. Initiate Reaction, 3. Review Results) as the state changes.

### 8. Enhanced AI Lab Assistant Context — Priority: MEDIUM | Effort: SMALL
**What:** Expand the existing AI tutor's context to include the student's past failure/success rate.
**Why:** PraxiLabs promotes personalized guidance from its AI assistant ("Oxi").
**Where in code:** `server/controllers/aiController.js`
**How:** Modify the `explainReaction` or `getHint` prompts to accept a parameter for previous attempts, allowing the AI to say, "I see you tried this earlier..."

### 9. Custom Assessment Builder for Teachers — Priority: LOW | Effort: LARGE
**What:** Allow teachers to create custom questions that appear during or after student experiments.
**Why:** PraxiLabs highlights a custom quiz builder as a major selling point for institutions.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and new backend schema.
**How:** Create a UI for teachers to define questions and link them to specific `reaction_outcome` results.

### 10. Pause/Resume Experiments — Priority: LOW | Effort: MEDIUM
**What:** Allow students to save the current state of chemical concentrations and resume later.
**Why:** Adds flexibility for remote learning, a benefit highlighted by virtual lab providers.
**Where in code:** `client/src/store/labStore.js`
**How:** Add an action to serialize the current `chemA`, `chemB`, `chemC`, `chemI` states to `localStorage` or the database, and load them on initialization.

## Quick Wins (< 1 day each)
1. **Exportable Lab Reports**: Add a CSV export button to the history page using existing state data.
2. **Embedded Theory Refreshers**: Add static info tooltips next to the chemical sliders in the 3D lab.
3. **Enhanced AI Context**: Pass basic history context into the existing Gemini prompts for more personalized hints.
