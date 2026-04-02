# Market Research Report
**App:** A virtual chemistry laboratory enabling students to conduct interactive 3D experiments and titrations.
**Market:** Virtual Science Education / EdTech
**Date:** 2024-05-18
**Competitors Researched:** Labster, Beyond Labz, ChemCollective

## Executive Summary
The virtual chemistry laboratory market focuses heavily on immersive realism and structured learning paths. While Alchemistry excels in core simulation mechanics (3D lab, physics-based mixing), top competitors differentiate themselves through contextual guidance, robust data collection, and gamified assessments within the lab environment. Adding interactive lab notebooks and step-by-step experiment guides represent the most significant opportunities to elevate Alchemistry to industry standards.

## Competitor Analysis
- **Labster**: The market leader in high-fidelity 3D simulations. Differentiates with story-driven missions, built-in quizzes that interrupt the simulation to assess learning, and an interactive virtual tablet for notes.
- **Beyond Labz**: Focuses on open-ended sandbox environments with strong emphasis on real-time data collection. Students use a "virtual lab book" to record observations and graphs.
- **ChemCollective**: A widely-used free tool that shines in stoichiometry and quantitative analysis. Features a persistent workspace where multiple solutions can be tracked and measured simultaneously.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Interactive Lab Notebook for recording observations.
- Step-by-step experiment procedures accessible within the 3D environment.
- Formative assessments/quizzes during or after an experiment.

### Differentiating Opportunities (Stand-out features)
- Real-time data graphing for titrations.
- Periodic table reference tool directly integrated into the lab UI.
- Contextual safety warnings (e.g., mixing dangerous chemicals triggering a specific visual/audio feedback).

### UX Patterns (Design/interaction patterns common in top products)
- Floating contextual menus when interacting with lab equipment.
- Visual "tablet" or "clipboard" UI element to display instructions.
- Clearer visual distinction between "sandbox" mode and "assigned" mode.

## Prioritised Recommendations

### 1. Interactive Lab Notebook — Priority: HIGH | Effort: MEDIUM
**What:** A slide-out panel allowing students to type notes and record observations during experiments.
**Why:** Standard in Labster and Beyond Labz; essential for translating simulation play into educational value.
**Where in code:** Add a `LabNotebook.jsx` component to `client/src/components/` and toggle it via a button in `client/src/pages/Lab3D.jsx` (similar to the history toggle).
**How:** Create a React component with a text area that saves state to `localStorage` or a new `notes` table in Supabase, linked to the `reaction_id`.

### 2. Step-by-Step Procedure Panel — Priority: HIGH | Effort: SMALL
**What:** A UI component that displays the current assignment's required steps while in the lab.
**Why:** Prevents students from feeling lost in the sandbox, a common pain point in open-ended simulations.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/assignmentStore.js`.
**How:** Fetch assignment details and display them in a dismissible floating card within the `lab3d-canvas-wrapper`.

### 3. Integrated Periodic Table — Priority: MEDIUM | Effort: SMALL
**What:** A quick-reference periodic table modal accessible from any lab module.
**Why:** Students frequently need to check atomic weights or properties during titrations and inorganic chemistry.
**Where in code:** `client/src/components/Navbar.jsx` or a new floating action button in `client/src/pages/StudentDashboard.jsx`.
**How:** Add a modal component displaying a static SVG or CSS grid periodic table, loaded lazily.

### 4. Real-time Titration Graphing — Priority: MEDIUM | Effort: MEDIUM
**What:** A line graph that updates live as the student drops titrant, plotting pH vs volume.
**Why:** Critical for teaching the concept of equivalence points, present in all major competitors.
**Where in code:** `client/src/pages/titration.jsx`.
**How:** Integrate a charting library (like `recharts`) and update the data array inside the `timerId` interval in `titration.jsx`.

### 5. Contextual Safety Warnings — Priority: LOW | Effort: SMALL
**What:** Specific alerts or visual effects when mixing incompatible or dangerous chemicals.
**Why:** Reinforces lab safety principles without physical risk.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Add logic to `initiateReaction` to detect unsafe combinations and trigger a specific toast notification or UI overlay before showing the result.

### 6. Sandbox vs Assignment Mode Toggle — Priority: LOW | Effort: MEDIUM
**What:** Distinct visual states or entry points for completing a teacher-assigned lab vs open experimentation.
**Why:** Helps focus students on tasks. Competitors strictly separate these flows.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/App.jsx`.
**How:** Pass a `mode=assignment` prop or query parameter to `Lab3D.jsx` when launched from the assignments card, restricting available chemicals to only those needed.

### 7. Exportable Lab Reports — Priority: MEDIUM | Effort: MEDIUM
**What:** Ability to export experiment history and notebook entries to PDF or CSV.
**Why:** Teachers need verifiable artifacts for grading.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/result.jsx`.
**How:** Add an "Export" button using a library like `jspdf` or mapping the history data to CSV format.

### 8. Multi-Vessel Workspace — Priority: LOW | Effort: LARGE
**What:** Support for managing multiple beakers/flasks simultaneously.
**Why:** Needed for complex multi-step reactions (like ChemCollective).
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `client/src/store/labStore.js`.
**How:** Refactor state to support an array of vessels rather than a single set of `chemA`, `chemB`, etc.

### 9. Interactive Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Hover states explaining what each piece of lab equipment does.
**Why:** Aids onboarding for new users unfamiliar with lab apparatus.
**Where in code:** `client/src/pages/titration.jsx` and `Lab3D.jsx`.
**How:** Add `title` or custom tooltip components to the SVG elements and 3D objects.

### 10. In-Lab Formative Quizzes — Priority: MEDIUM | Effort: LARGE
**What:** Multiple choice questions that pop up at critical points in an experiment.
**Why:** Labster's core differentiator; ensures active cognitive engagement.
**Where in code:** `client/src/pages/Lab3D.jsx` and new `QuizModal.jsx`.
**How:** Define trigger points in the lab logic that pause the simulation and mount a quiz component.

## Quick Wins (< 1 day each)
1. **Integrated Periodic Table**: Easy to add a modal with an image/SVG to the Navbar.
2. **Step-by-Step Procedure Panel**: Simple UI overlay in `Lab3D.jsx` pulling from existing assignment data.
3. **Interactive Equipment Tooltips**: Adding title attributes or basic CSS tooltips to the titration controls.
