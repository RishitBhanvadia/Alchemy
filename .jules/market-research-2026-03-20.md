# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory enabling interactive chemical simulations (like titration and 3D mixing), designed for high school/university students with teacher analytics.
**Market:** Virtual Science Education / Educational Technology (EdTech)
**Date:** 2026-03-20
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is highly focused on providing realistic, curriculum-aligned, and safe alternative practical experiences to physical laboratories. Top players emphasize immersive 3D simulations (Labster), gamified engagement with instant feedback (PraxiLabs), and strong connections between computation and practical application (ChemCollective). Alchemistry already has a solid foundation with its 3D environment, role-based access (Student/Teacher), and basic AI integration. The largest opportunities lie in enhancing in-experiment guidance, expanding assessment capabilities (quizzes/exporting data), and improving the accessibility and depth of the analytics provided to educators.

## Competitor Analysis
- **Labster:** The market leader in immersive STEM learning. They focus on highly detailed 3D simulations that replace or supplement wet labs, with a strong emphasis on curriculum alignment (e.g., AP Chemistry, General Chemistry). Differentiator: Comprehensive, polished simulations with storylines.
- **PraxiLabs:** Focuses on interactive 3D virtual labs specifically for science education, boasting a 60% reduction in lab costs. Differentiator: Gamified simulations, a built-in question bank, seamless LMS integration, and an "AI Lab Assistant" named Oxi for real-time guidance.
- **ChemCollective:** An online simulation tool designed to help students link chemical computations with authentic laboratory chemistry. Differentiator: Highly focused on the analytical and computational aspects of chemistry (acid-base, thermochemistry) rather than purely visual 3D experiences.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Pre/Post-experiment quizzes to assess learning outcomes.
- Export functionality for experiment data/results (e.g., CSV export for students and teachers).
- Step-by-step interactive onboarding/tutorials for first-time users.

### Differentiating Opportunities (Stand-out features)
- Real-time, contextual AI guidance during the 3D experiment (like PraxiLabs' "Oxi"), expanding beyond a standalone chat panel.
- Gamification elements (badges, detailed scoring based on precision and efficiency).
- Integrated computational tools (e.g., built-in calculators or molarity tables accessible within the lab UI).

### UX Patterns (Design/interaction patterns common in top products)
- Progress indicators during complex experiments (e.g., steps 1/5 completed).
- Contextual tooltips on lab equipment.
- Shareable URLs or access codes for specific experiment configurations.

## Prioritised Recommendations

### 1. Pre/Post-Experiment Assessment Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Add a short quiz before and after experiments to test theoretical knowledge.
**Why:** Competitors like PraxiLabs heavily feature built-in question banks. It validates the learning outcome of the simulation.
**Where in code:** Create a `QuizModal` component and integrate it into `client/src/pages/Lab3D.jsx` and `client/src/pages/titration.jsx` before initiating reactions and after the `ResultModal`.
**How:** Add a simple state to track quiz completion before allowing the reaction, storing results in a new table via Supabase.

### 2. Export Experiment Results to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to export log data as a CSV file.
**Why:** Analytical chemistry (ChemCollective style) requires data manipulation outside the app.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/TeacherDashboard.jsx`.
**How:** Add an `ExportButton` component that uses the existing data in `historyStore` or `TeacherDashboard` state and converts it to CSV format.

### 3. Contextual Onboarding Tutorial — Priority: MEDIUM | Effort: SMALL
**What:** Add a guided tour for first-time users entering the 3D lab.
**Why:** 3D interfaces can be unintuitive. Top competitors guide users through the controls immediately.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Implement a `hasSeenTutorial` flag in `localStorage`. If false, display an overlay highlighting the chemical sliders and the "Initiate Reaction" button.

### 4. Interactive Progress Tracker — Priority: MEDIUM | Effort: SMALL
**What:** A visual tracker showing the steps required to complete a module.
**Why:** Helps students understand where they are in complex experiments (e.g., Titration).
**Where in code:** `client/src/pages/titration.jsx`.
**How:** Add a simple horizontal progress bar component reflecting the states (`add_acid`, `add_kmn`, `drop`, `shake`).

### 5. In-Experiment Contextual AI Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Expand the AI feature to automatically suggest hints based on specific wrong actions, rather than just generating a general hint based on slider values.
**Why:** PraxiLabs' AI Assistant provides real-time, personalized guidance.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`.
**How:** Enhance the existing debounced hint fetch by passing the *history* of recent slider changes to the AI endpoint to provide more contextual advice.

### 6. Built-in Scientific Calculator/Tools Panel — Priority: LOW | Effort: SMALL
**What:** A sliding panel or modal with a calculator and basic periodic table reference.
**Why:** Students shouldn't need to leave the app to perform basic stoichiometry calculations (a core feature of ChemCollective).
**Where in code:** `client/src/components/` (create `ToolsPanel.jsx`) and include in `Lab3D.jsx` / `titration.jsx`.
**How:** Create a floating action button that toggles a simple React calculator component and a static image/data table of the periodic table.

### 7. Gamified Achievement Badges — Priority: LOW | Effort: MEDIUM
**What:** Award badges for specific milestones (e.g., "First Perfect Titration", "Mixed 10 Chemicals").
**Why:** Increases engagement and student retention (PraxiLabs touts gamified simulations).
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/history.jsx`.
**How:** Analyze the `logs` data in `historyStore`. Render specific SVG badges in the dashboard if certain criteria in the logs are met.

### 8. Enhanced Teacher Analytics: Completion Rates — Priority: MEDIUM | Effort: SMALL
**What:** Add a metric showing the percentage of the class that has completed a specific module.
**Why:** Teachers need quick, actionable insights into class progress.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Calculate completion by comparing the number of unique student IDs in the experiment logs to the total number of students in the classroom, rendering a simple pie chart or progress bar.

### 9. Shareable Experiment Configurations — Priority: LOW | Effort: MEDIUM
**What:** Allow teachers to configure a specific setup (e.g., locking certain chemicals, setting specific initial concentrations) and generate a link for students.
**Why:** Allows for targeted assignments.
**Where in code:** `server/routes/classroomRoutes.js` and `client/src/pages/TeacherDashboard.jsx`.
**How:** Add an endpoint to save an "assignment" configuration and a UI in the Teacher Dashboard to generate a unique URL parameter that `Lab3D.jsx` reads on load.

### 10. Equipment Tooltips/Labels — Priority: LOW | Effort: SMALL
**What:** Hover labels over 3D objects in the lab.
**Why:** Helps beginners identify laboratory equipment.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (or wherever the 3D objects are defined).
**How:** Use `@react-three/drei`'s `Html` component to render floating text labels over the beaker and flasks when hovered.

## Quick Wins (< 1 day each)
1. **Export Experiment Results to CSV:** High value for data analysis, simple to implement with existing store data.
2. **Contextual Onboarding Tutorial:** Easy to add via `localStorage` and basic CSS overlays.
3. **Interactive Progress Tracker:** Simple state-driven UI update in the Titration module.
