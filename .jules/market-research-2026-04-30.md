# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** EdTech / STEM Virtual Lab Software
**Date:** 2026-04-30
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

## Executive Summary
The virtual chemistry lab market is characterized by a need for realistic, safe, and engaging learning environments. Top competitors focus on immersive 3D simulations, robust LMS integrations, and detailed analytical feedback. Alchemistry has a strong foundation with its 3D environment and Supabase backend, but there's a significant opportunity to improve student engagement and assessment by incorporating features like exportable lab reports, structured quiz integrations, and explicit safety protocol onboarding, which are standard in industry-leading tools.

## Competitor Analysis
- **Labster:** Market leader known for highly gamified, story-driven simulations. Key differentiators: deep LMS integration, extensive catalog of experiments, and integrated quizzes.
- **PraxiLabs:** Focuses on accessibility and detailed feedback. Key differentiators: bilingual support, comprehensive PDF lab manuals, and unlimited student trials.
- **Beyond Labz:** Strong emphasis on open-ended exploration and realistic analytical outcomes. Key differentiators: robust data export and open-world style lab benches.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Exportable lab reports (PDF/CSV) for assignments.
- Built-in pre-lab quizzes or knowledge checks.

### Differentiating Opportunities (Stand-out features)
- Gamified safety protocol onboarding before entering the 3D lab.
- Multi-language support for diverse classrooms.

### UX Patterns (Design/interaction patterns common in top products)
- Contextual tooltips explaining equipment functions on first hover.
- Step-by-step progress tracking visible during the experiment.

## Prioritised Recommendations

### 1. Exportable Lab Reports — Priority: HIGH | Effort: MEDIUM
**What:** Allow students to export their experiment history and results as a PDF or CSV.
**Why:** Expected by teachers for grading and by students for assignments.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`
**How:** Add an `ExportButton` component in the history and result views. Use a library like `papaparse` or `jspdf` to convert the `logs` from `useHistoryStore` into a downloadable file.

### 2. Pre-Lab Knowledge Checks — Priority: HIGH | Effort: MEDIUM
**What:** A short quiz required before starting an experiment.
**Why:** Ensures students understand the concepts before executing the simulation, a standard in Labster.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a `PreLabModal` that fetches questions based on the experiment type. Require passing the quiz before dismissing the modal to interact with the 3D canvas.

### 3. Safety Protocol Onboarding — Priority: MEDIUM | Effort: SMALL
**What:** A mandatory click-through safety checklist (e.g., "put on goggles") before the first lab session.
**Why:** Reinforces real-world lab safety, a key selling point for PraxiLabs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `hasSeenSafety` flag to `labStore` (persisted or fetched from user profile). If false, show a `SafetyModal` component over the 3D canvas.

### 4. Contextual Equipment Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Informational tooltips when hovering over 3D lab equipment (beakers, flasks).
**Why:** Reduces cognitive load for new users learning the interface.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (and related 3D components)
**How:** Use React Three Fiber's `onPointerOver` and `onPointerOut` events to update a `currentHint` state in `labStore`, displaying the hint in the UI overlay.

### 5. Step-by-Step Progress Tracker — Priority: MEDIUM | Effort: MEDIUM
**What:** A visual tracker showing current progress through a multi-step experiment.
**Why:** Keeps students oriented, especially in complex organic/titration labs.
**Where in code:** `client/src/components/titration_setup.jsx` and `client/src/pages/organic.jsx`
**How:** Create a `ProgressBar` component that reads the current step from the respective store or component state and displays it at the top of the lab view.

### 6. Customizable Lab Environments — Priority: LOW | Effort: LARGE
**What:** Allow teachers to restrict specific chemicals or tools per assignment.
**Why:** Enables focused learning objectives without distractions.
**Where in code:** `client/src/components/ClassroomManager.jsx` and `client/src/store/classroomStore.js`
**How:** Extend the classroom/assignment schema in Supabase to include an `allowed_chemicals` array. Filter the available tools in the 3D lab based on this array.

### 7. Bilingual/Multi-language Support — Priority: LOW | Effort: LARGE
**What:** Option to switch the UI between languages.
**Why:** Expands market reach, a feature highlighted by PraxiLabs.
**Where in code:** Global (e.g., `client/src/App.jsx`)
**How:** Integrate `react-i18next` and wrap text strings across the app. Add a language selector in the `Navbar`.

### 8. Teacher Analytics Enhancements — Priority: MEDIUM | Effort: MEDIUM
**What:** Deeper insights into student performance, such as time spent per step.
**Why:** Helps teachers identify where students struggle.
**Where in code:** `client/src/components/StudentAnalyticsChart.jsx`
**How:** Add telemetry tracking to `labStore` actions and send aggregated data to a new Supabase table. Update the chart to visualize this new data.

### 9. Gamified Achievement Badges — Priority: LOW | Effort: MEDIUM
**What:** Visual badges for completing specific milestones (e.g., "First Titration").
**Why:** Increases student engagement and motivation.
**Where in code:** `client/src/pages/Profile.jsx` and backend user profile schema.
**How:** Implement an achievement system. Check conditions after each successful experiment and award badges, displaying them on the profile.

### 10. Direct LMS Integration (LTI) — Priority: LOW | Effort: LARGE
**What:** Integration with Canvas, Blackboard, etc.
**Why:** Essential for adoption in larger educational institutions.
**Where in code:** Server routes and authentication flow.
**How:** Implement LTI 1.3 standards on the Node.js server to handle authentication and grade passback.

## Quick Wins (< 1 day each)
1. Safety Protocol Onboarding modal.
2. Contextual Equipment Tooltips using `onPointerOver`.
3. Exportable Lab Reports using a simple CSV generator.