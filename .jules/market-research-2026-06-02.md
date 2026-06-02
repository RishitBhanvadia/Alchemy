# Market Research Report
**App:** A virtual chemistry laboratory where students mix chemicals in 3D, receive calculated reactions, and track assignments under teacher supervision.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-06-02
**Competitors Researched:** Labster, PraxiLabs, ChemCollective, Late Nite Labs

## Executive Summary
The virtual chemistry lab market is dominated by established players focusing on high-fidelity simulations (Labster) and structured, guided curriculum (PraxiLabs). Alchemistry differentiates itself with its lightweight, fast WebGL (Three.js) implementation and clean glassmorphism UI. However, it currently lacks the embedded educational scaffolding (in-context guides, step-by-step instructions, and export features) that are standard in this sector. Implementing these "table stakes" features will significantly mature the product without needing major backend changes.

## Competitor Analysis
* **Labster:** The market leader. Extremely high fidelity but resource-heavy. Key differentiator: Deeply guided scenarios with embedded theory, quizzes, and safety checks.
* **PraxiLabs:** Focuses on structured workflows and clear steps. Key differentiator: Excellent student progress tracking, step-by-step guidance, and lab reports.
* **ChemCollective:** Open-source, simpler 2D interface. Key differentiator: Focus on problem-solving and flexible sandbox play over visual flashiness. Highly accessible.
* **Late Nite Labs (Macmillan):** Known for robust instructor dashboards and standard catalog labs.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Guided Experiment Protocols:** Competitors provide step-by-step instructions visible during the experiment. Alchemistry's lab is a pure sandbox without on-screen guidance.
* **Lab Report Exporting:** Students need to save or submit their findings. Competitors allow exporting results as PDF or CSV.
* **In-Context Theory/Tooltips:** Explaining *why* a reaction happens during the mixing phase.

### Differentiating Opportunities (Stand-out features)
* **Real-time Safety Warnings:** Alerting students when they are mixing dangerous combinations (before the explosion).
* **Gamification (Badges/Achievements):** Adding a layer of progression to the pure sandbox.

### UX Patterns (Design/interaction patterns common in top products)
* **Split View:** Left pane for instructions/theory, right pane for the 3D lab interactable area.
* **Contextual Cursors:** Changing cursor icons based on the tool selected (pipette vs. beaker). Alchemistry has a custom cursor but not tool-specific ones.

## Prioritised Recommendations

### 1. Embedded Protocol Guide — Priority: HIGH | Effort: MEDIUM
**What:** A collapsible side panel or modal in the Lab page that shows step-by-step instructions for the current assignment.
**Why:** Top tools (Labster, PraxiLabs) guide students. A pure sandbox can be confusing.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Create a `ProtocolPanel` component. Fetch the active assignment via `useAssignmentStore` and display its steps.

### 2. Export Lab Results (PDF/CSV) — Priority: HIGH | Effort: SMALL
**What:** A button on the Result page to download the experiment outcome.
**Why:** Standard requirement for chemistry courses (ChemCollective, PraxiLabs have it).
**Where in code:** `client/src/pages/result.jsx`
**How:** Add an "Export Result" button. Use the browser's native `window.print()` for a quick PDF, or map the `location.state` and API response to a CSV string and trigger a download.

### 3. Pre-Reaction Safety Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Warning icons that appear near the chemical controls if an unsafe combination is being prepared.
**Why:** Emphasises safety (a core selling point of Labster) before the user clicks "Initiate".
**Where in code:** `client/src/pages/lab.jsx`
**How:** Check the local state (`chemA`, `chemB`, etc.) against known dangerous combinations (or simply trigger if total concentration exceeds a safe limit) and show a warning badge.

### 4. Interactive Data Table for History — Priority: MEDIUM | Effort: SMALL
**What:** Upgrading the History view to allow sorting by reaction type, regime, or date.
**Why:** As students do more experiments, finding specific results becomes hard.
**Where in code:** `client/src/pages/history.jsx` (and potentially `StudentDashboard.jsx`)
**How:** The app already uses `@tanstack/react-table`. Implement sorting and filtering columns on the existing history data fetched from `useHistoryStore`.

### 5. Gamified Badges for First Reactions — Priority: MEDIUM | Effort: MEDIUM
**What:** Visual badges on the Student Dashboard for achieving specific milestones (e.g., "First Neutralization").
**Why:** Gamification drives engagement in EdTech platforms.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Calculate achievements dynamically based on the `logs` array from `useHistoryStore` and display them in a new "Achievements" section.

### 6. Reaction Formula Helper — Priority: LOW | Effort: SMALL
**What:** An expandable section on the Results page that breaks down the chemical equation.
**Why:** Helps bridge the gap between visual simulation and theoretical chemistry.
**Where in code:** `client/src/pages/result.jsx`
**How:** Use the `product_formula` returned by the API and render it nicely, perhaps using a small library for chemical equations or just formatted HTML sub/superscripts.

### 7. Teacher Dashboard: Class Averages — Priority: LOW | Effort: MEDIUM
**What:** A chart showing the average score or completion rate for a classroom's assignments.
**Why:** Late Nite Labs excels at instructor insights. The current Teacher Dashboard could use aggregate views.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Since the app has `recharts`, add a small bar chart summarizing the `assignments` data for the selected classroom.

### 8. Restart Experiment Button — Priority: LOW | Effort: SMALL
**What:** A quick way to clear the current test tube in the Lab.
**Why:** Encourages iterative experimentation (ChemCollective pattern).
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "Reset" button that sets `chemA`, `chemB`, `chemC`, `chemD` back to 0.

### 9. Contextual Cursor Icons — Priority: LOW | Effort: SMALL
**What:** Changing the custom cursor to match the action (e.g., a dropper icon when adjusting sliders).
**Why:** Enhances the tactile feel of the virtual lab.
**Where in code:** `client/src/components/CursorFollower.jsx`
**How:** Add a prop or global state to change the rendered icon based on what the user is hovering over.

### 10. Glossary / Dictionary Modal — Priority: LOW | Effort: MEDIUM
**What:** A quick-reference modal for chemical terms.
**Why:** Labster provides an embedded encyclopedia.
**Where in code:** `client/src/components/Navbar.jsx` (or a floating action button)
**How:** A static JSON list of terms and a simple search modal.

## Quick Wins (< 1 day each)
1. **Export Lab Results:** Adding a simple CSV download or print button to `result.jsx`.
2. **Restart Experiment Button:** A reset state button in `lab.jsx`.
3. **Interactive Data Table:** Leveraging the existing TanStack Table to add sorting to the history view.
