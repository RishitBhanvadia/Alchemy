# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory for students to safely conduct experiments, complete assignments, and track their results, while teachers monitor progress.
**Market:** STEM Education Technology / Virtual Science Simulator
**Date:** 2026-03-27
**Competitors Researched:** Labster, PhET Interactive Simulations, ExploreLearning Gizmos, ChemCollective

## Executive Summary
The virtual chemistry lab market is highly competitive but distinct from standard EdTech SaaS. Products like Labster focus on high-fidelity, storyline-based 3D immersion, while PhET prioritizes interactive manipulatives. Alchemistry sits beautifully in the middle: offering excellent 3D visual feedback with gamified classroom progress. However, top competitors differentiate themselves by ensuring the platform serves as a true *scientific tool*—providing robust data export, digital lab notebooks for observations, and explicit safety feedback during mistakes. By implementing a few straightforward data-handling and UI features, Alchemistry can elevate its pedagogical value to match industry leaders while remaining lightweight.

## Competitor Analysis
- **Labster:** Deeply immersive 3D labs with built-in storylines and comprehensive quiz assessments. Criticized for being expensive, occasionally buggy, and requiring heavy resources.
- **PhET (Univ of Colorado):** Open-source, highly interactive manipulatives focusing on conceptual understanding (adjusting sliders for molarity/volume and instantly seeing results). Lacks a built-in assignment/progress tracker.
- **ExploreLearning Gizmos:** Standards-aligned, focuses heavily on manipulatives and assessment questions. Less visually impressive but excellent for direct classroom integration.
- **ChemCollective:** Focuses strictly on computational chemistry, allowing students to link chemical computations with authentic lab chemistry. Extremely robust mathematically, but visually dated.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Digital Lab Notebook:** A place for students to type personal observations or conclusions alongside their raw experimental data.
- **Data Export:** The ability to download titration curves or experiment history as CSV files for use in external lab reports or Excel/Google Sheets.
- **Variable Fine-Tuning:** The ability to explicitly define concentrations (Molarity) and exact volumes (mL) rather than just "mixing chemicals."

### Differentiating Opportunities (Stand-out features)
- **Contextual Safety Warnings:** Immediate, visual feedback (like a hazard warning or a "broken beaker" animation) when a dangerous combination is attempted (e.g., pouring water into concentrated acid).
- **Gamified "Accidents":** Letting students fail safely but dramatically (e.g., explosions, color changes, smoke) to reinforce safety rules.

### UX Patterns (Design/interaction patterns common in top products)
- **Interactive Sliders:** Using sliders for precise measurement of titrants rather than discrete clicks.
- **Split-View Analysis:** Viewing the 3D lab environment simultaneously alongside a real-time updating graph (like a titration curve).

## Prioritised Recommendations

### 1. CSV Data Export for History and Titration — Priority: HIGH | Effort: SMALL
**What:** Add an "Export to CSV" button to the History table and Titration graphs.
**Why:** In real chemistry classes, students must write lab reports using raw data. Top competitors (PhET, Gizmos) allow data extraction.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/titration.jsx`
**How:** Add a simple `exportToCSV()` utility function using native JS `Blob` and `URL.createObjectURL`. Add an `ExportButton` component above the history table and titration chart.

### 2. Digital Lab Notebook (Notes on Experiments) — Priority: HIGH | Effort: MEDIUM
**What:** Allow students to add personal text notes to their completed experiments.
**Why:** A core part of scientific methodology is observation. Without it, the app is just a mixing game.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`, plus a new database column `student_notes` in the `experiments` table.
**How:** Add a text area in `ResultModal.jsx` labeled "Add your observations..." and update the `saveExperiment` API call to include it. Display notes in an expandable row in `history.jsx`.

### 3. Contextual Safety Warnings/Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show interactive safety warnings when students hover over or mix specific chemicals.
**Why:** Safety is paramount in chemistry. Products like Labster enforce safety protocols (PPE, correct mixing order).
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `safetyWarnings` object in `labStore.js`. When `initiateReaction` is called with a hazardous combination, display a red `toast.error` (using existing `react-hot-toast`) explaining the safety violation before running the reaction animation.

### 4. Interactive Volume/Molarity Sliders — Priority: MEDIUM | Effort: MEDIUM
**What:** Replace or supplement standard "add chemical" buttons with sliders for precise volume/molarity selection.
**Why:** PhET labs are famous because students can continuously scrub a slider and see immediate visual/data changes.
**Where in code:** `client/src/components/titration_setup.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Add a standard `<input type="range" />` component tied to the `chem_a`/`chem_b` states in `labStore`, updating the visual fill level of the 3D beakers dynamically via `react-three-fiber` props.

### 5. "Ask AI" Context Injection — Priority: MEDIUM | Effort: SMALL
**What:** Automatically pre-fill the AI Tutor prompt with the current failed reaction or specific assignment details.
**Why:** Reduces friction for students who don't know *what* to ask the AI when they get stuck, a common issue in open-ended virtual labs.
**Where in code:** `client/src/components/AiTutorPanel.jsx` and `client/src/components/ResultModal.jsx`
**How:** When `handleAskAI` is triggered from a failed `ResultModal`, pass the `reactionResult` as an initial prop to `AiTutorPanel` and pre-populate the chat input with "Why did combining [Chem A] and [Chem B] result in [Outcome]?"

### 6. Classroom Leaderboard / Gamification — Priority: LOW | Effort: MEDIUM
**What:** Add a lightweight leaderboard showing the number of successful experiments per student in a classroom.
**Why:** Gamification drives engagement in EdTech SaaS.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `server/routes/classroomRoutes.js`
**How:** Add a new endpoint to fetch top 5 students by successful experiment count in the current `classroom_id`. Display a "Top Scientists" widget on the `StudentDashboard`.

### 7. Real-time Titration Curve Rendering — Priority: LOW | Effort: LARGE
**What:** Animate the titration curve drawing line-by-line as the virtual drops fall, rather than showing the final static chart.
**Why:** Helps students correlate the visual color change (phenolphthalein/BTB) with the exact inflection point on the graph.
**Where in code:** `client/src/pages/titration.jsx` (assuming it uses Recharts or similar).
**How:** Use `setInterval` or `requestAnimationFrame` to push data points to the graph's state array sequentially, synchronized with the 3D drop animation duration.

### 8. Teacher "Focus Mode" (Locking Modules) — Priority: LOW | Effort: MEDIUM
**What:** Allow teachers to temporarily disable all modules except the one currently being taught.
**Why:** Teachers complain that students play around with other simulations instead of focusing on the assigned task (a common Gizmos/Labster complaint).
**Where in code:** `server/routes/classroomRoutes.js`, `client/src/pages/TeacherDashboard.jsx`, and `client/src/pages/StudentDashboard.jsx`.
**How:** Add `active_module` to the `classrooms` table. In `StudentDashboard.jsx`, disable routing to non-active modules (except "Free Play" if enabled).

### 9. Shareable "Experiment Certificates" — Priority: LOW | Effort: SMALL
**What:** A fun, printable summary of a successful complex experiment (e.g., "Master of Titration" certificate).
**Why:** Creates a viral/shareable moment for younger students, increasing product love.
**Where in code:** `client/src/pages/history.jsx` or `client/src/components/SuccessCelebration.jsx`
**How:** Add a "Print Certificate" button that opens a styled, print-only CSS view of the experiment result with the student's name and date.

### 10. Undo/Reset Last Step — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to undo the last chemical added rather than resetting the entire lab.
**Why:** Lowers frustration when a student accidentally clicks the wrong beaker after 5 minutes of setup.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Keep an array of previous states in `labStore`. Add a "Undo" button that pops the last state and restores the chemical quantities.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** Just adding a `Blob` download link in `history.jsx` and `titration.jsx`.
2. **"Ask AI" Context Injection:** Passing the current failed reaction state as a prop to the `AiTutorPanel`.
3. **Contextual Safety Warnings:** Adding a hardcoded map of dangerous chemical combos and showing a `toast.error` before allowing the reaction to proceed.
