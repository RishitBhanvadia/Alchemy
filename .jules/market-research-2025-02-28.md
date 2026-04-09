# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js allowing students to interactively conduct chemistry experiments (2D and 3D) within a teacher-managed classroom environment.
**Market:** Educational Technology (EdTech) / STEM Virtual Simulations
**Date:** 2025-02-28
**Competitors Researched:** Labster, Vic's Science Studio, Futuclass, ChemCollective

## Executive Summary
The virtual chemistry laboratory market is highly focused on combining realistic physical simulations with structured pedagogy. Top competitors emphasize not just mixing chemicals, but ensuring students understand the underlying theories through gamified assessments, structured learning paths, and robust safety paradigms (even in VR/3D spaces). Alchemistry provides a strong foundation with its 3D interactive labs and teacher dashboards, but lacks key pedagogical wrappers like step-by-step guided tutorials, in-lab assessments, and downloadable reports, which are critical for classroom integration and teacher adoption.

## Competitor Analysis
*   **Labster:** The market leader, offering 300+ simulations. Differentiates heavily with narrative-driven gamification, built-in quizzes, and direct LMS integration. Known for its high-fidelity 3D environments.
*   **Vic's Science Studio:** A VR-first lab focusing on a highly accurate chemical-physical engine. Differentiates by allowing students to perform potentially dangerous experiments safely and providing a deep teacher dashboard for tracking progress.
*   **Futuclass:** Gamified, bite-sized (5-10 min) VR/3D modules aimed at middle/high school. Differentiates by turning concepts like equation balancing into puzzle games with instant feedback.
*   **ChemCollective:** A free, 2D HTML5 virtual lab. Differentiates through its extensive library of scenario-based, inquiry-driven problems (e.g., stoichiometry, acid-base) where students must figure out the solution without hand-holding.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Hazard and Safety Labeling:** Real-world chemistry relies heavily on safety. While Alchemistry lists chemical names (HCl, NaOH), it lacks GHS hazard pictograms (e.g., Corrosive, Flammable) on the sliders or 3D beakers.
*   **Exportable Lab Reports:** Students need to submit proof of work. The app tracks history (`history.jsx`), but there's no way to download this as a PDF or CSV to submit to an LMS or teacher.

### Differentiating Opportunities (Stand-out features)
*   **In-Lab Assessments / Gamified Quizzes:** The app awards XP (`total_xp` in TeacherDashboard), but there are no quizzes during or after an experiment to test comprehension of *why* the reaction happened.
*   **Interactive Equation Balancer:** A dedicated module or visualizer that lets students drag and drop coefficients to balance equations before running the 3D simulation.

### UX Patterns (Design/interaction patterns common in top products)
*   **Step-by-Step Guided Mode:** Instead of an open sandbox with a single AI hint, top tools provide a "worksheet mode" with a checklist of steps to complete an experiment successfully.
*   **Real-time Data Plotting:** For modules like Titration, showing a real-time pH curve as the titrant is added, rather than just a final result.

## Prioritised Recommendations

### 1. Add GHS Hazard Labels to Chemicals — Priority: HIGH | Effort: SMALL
**What:** Display appropriate safety/hazard icons (e.g., Corrosive for HCl, Irritant for NaOH) next to chemical names in the UI.
**Why:** Safety is a core component of chemistry education. Competitors simulate the need for PPE and safety awareness. It adds realism and educational value.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/lab.jsx` (within the `slider-card` headers).
**How:** Add a mapping object for chemicals to hazard symbols. Render an SVG or image icon alongside the chemical name in the `label-group` div.

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow students to download their experiment logs as a CSV file.
**Why:** Table stakes for educational tools. Students need to submit work, and teachers need offline records.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" button. When clicked, map the `experiments` state array to a CSV string (using standard JS or Papa Parse) and trigger a download via a Blob.

### 3. Step-by-Step "Guided Worksheet" Mode — Priority: MEDIUM | Effort: MEDIUM
**What:** An optional overlay that gives students a checklist of steps to perform (e.g., "1. Add 50% HCl", "2. Add 20% Indicator").
**Why:** Open sandboxes can be overwhelming. Tools like Futuclass and Labster thrive on guided, bite-sized tasks.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `guidedMode` state to Zustand. Render a `ChecklistComponent` on the side that listens to `chemA`, `chemB` states. Check off items when sliders hit target ranges.

### 4. Real-time pH Curve in Titration — Priority: MEDIUM | Effort: MEDIUM
**What:** Display a line chart that updates dynamically as the user adds titrant, instead of just showing the endpoint.
**Why:** Visualizing data is critical in chemistry. Competitors use real-time graphing to connect actions to theoretical models.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Use Recharts (already in `package.json`). Create a state array `pHData` that appends the current volume and calculated pH as the titration progresses, rendering the chart beside the apparatus.

### 5. Post-Experiment Quiz Modal — Priority: MEDIUM | Effort: MEDIUM
**What:** A short 1-3 question multiple-choice quiz that pops up after a successful reaction, awarding bonus XP.
**Why:** Ties the visual simulation back to chemical theory, moving it from a "toy" to a learning tool, matching Labster's approach.
**Where in code:** `client/src/pages/Lab3D.jsx` (inside or replacing `ResultModal`) and a new `client/src/components/QuizModal.jsx`.
**How:** Modify `handlePlayClick` to trigger `QuizModal` before or after `ResultModal`. Store simple Q&A data locally or fetch from Supabase. Update `total_xp` on success.

### 6. Interactive Equation Balancer Module — Priority: LOW | Effort: LARGE
**What:** A new mini-game/module where students must balance the chemical equation before they are allowed to run the reaction in the 3D lab.
**Why:** Equation balancing is a core curriculum requirement (highlighted by Futuclass).
**Where in code:** `client/src/pages/Dashboard.jsx` (new card) and a new route/page `client/src/pages/Balancer.jsx`.
**How:** Build a drag-and-drop or stepper interface where users adjust stoichiometric coefficients. Validate against the correct balanced equation before unlocking the 3D simulation.

### 7. Chemical Properties Tooltip — Priority: LOW | Effort: SMALL
**What:** Hovering over a chemical formula shows its molar mass, state at room temp, and common uses.
**Why:** Provides contextual learning without cluttering the UI.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/lab.jsx`
**How:** Wrap the `.chem-formula` spans in a standard tooltip component that reads from a static JSON dictionary of chemical properties.

## Quick Wins (< 1 day each)
1.  **Add GHS Hazard Labels:** Simple UI update injecting SVGs into the slider cards in `Lab3D.jsx`.
2.  **Export History to CSV:** Adds immense value for classroom integration with minimal code in `history.jsx`.
3.  **Chemical Properties Tooltip:** Easy to implement static dictionary mapped to hover events on existing text.
