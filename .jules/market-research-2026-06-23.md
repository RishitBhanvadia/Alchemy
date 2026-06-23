# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory built with React and Three.js for interactive STEM education.
**Market:** Virtual Lab Simulators / STEM Education EdTech
**Date:** 2026-06-23
**Competitors Researched:** Labster, PhET Interactive Simulations, ChemCollective

## Executive Summary
The virtual lab simulator market is shifting from standalone sandboxes to integrated, structured learning environments with strong educator controls and analytics. While Alchemistry has strong 3D visualization and real-time interaction, it currently lacks the structured learning paths, formative assessments, and robust teacher analytics found in top competitors like Labster and PhET. The biggest opportunity for Alchemistry is bridging the gap between a pure sandbox and a guided learning tool by introducing in-simulation guidance and structured reporting.

## Competitor Analysis
*   **Labster:** The market leader in guided, 3D virtual STEM labs. Key differentiators include highly structured learning paths, embedded quizzes, strong LMS integration, and detailed teacher dashboards. It excels at procedural training but can feel restrictive compared to open sandboxes.
*   **PhET Interactive Simulations:** Widely used, free interactive simulations focusing on concept visualization. Key differentiators are low friction (easy to embed/use), strong focus on variables/graphs, and wide accessibility. It is less procedure-focused and lacks built-in assessment.
*   **ChemCollective Virtual Labs:** Focuses on quantitative chemistry problem-solving (stoichiometry, equilibrium). Key differentiators are its strong alignment with traditional chemistry curriculum and flexibility for instructors to create custom prompts, though its UX is less modern than 3D platforms.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Lab Procedures:** Step-by-step guidance within the lab environment, rather than just an open sandbox.
*   **Formative Assessment:** In-simulation questions or knowledge checks to verify understanding before allowing progression.
*   **Detailed Analytics Dashboard:** Deeper insights for teachers beyond basic score distributions (e.g., time spent, common errors).

### Differentiating Opportunities (Stand-out features)
*   **Interactive Conceptual Visualizations:** Dynamic graphs or molecular-level views alongside the macroscopic 3D simulation (similar to PhET).
*   **Customizable Lab Scenarios:** Tools for teachers to define specific parameters or target outcomes for experiments.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips/Hints:** Providing immediate feedback when a user makes a procedural error or hovers over equipment.
*   **Progress Tracking within Labs:** Visual indicators (checklists, progress bars) showing steps completed in a specific experiment.

## Prioritised Recommendations

### 1. Embedded Knowledge Checks — Priority: HIGH | Effort: MEDIUM
**What:** Add small quiz modals that appear after key steps in an experiment (e.g., after mixing chemicals) to test understanding.
**Why:** Competitors like Labster use this to ensure students aren't just clicking through. It adds instructional value to the sandbox.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/ResultModal.jsx`
**How:** Create a `KnowledgeCheckModal` component. Trigger it based on `reactionState` transitions in `Lab3D.jsx` before showing the final `ResultModal`.

### 2. In-Lab Procedural Checklist — Priority: HIGH | Effort: SMALL
**What:** A side panel or overlay displaying the required steps for the current assignment or a standard experiment.
**Why:** Helps guide students through procedures, reducing confusion and mirroring the structured approach of leading simulators.
**Where in code:** `client/src/pages/Lab3D.jsx` (or a new component `client/src/components/LabChecklist.jsx`)
**How:** Add a collapsible panel in the `lab3d-controls-container` that tracks state (e.g., "Select Acid", "Set Concentration", "Initiate").

### 3. Molecular Visualization Toggle — Priority: MEDIUM | Effort: LARGE
**What:** A button to switch from the macroscopic view (beakers) to a 2D or 3D molecular representation of the reaction.
**Why:** PhET excels because it shows *why* reactions happen. Adding this elevates Alchemistry from a procedure simulator to a concept simulator.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` or similar 3D component.
**How:** Implement a secondary Three.js scene or a React overlay that renders particle models based on the current `chemA`, `chemB`, etc., states.

### 4. Expanded Teacher Analytics Dashboard — Priority: MEDIUM | Effort: MEDIUM
**What:** Add metrics for "Average Time to Completion" and "Common Errors" to the teacher dashboard.
**Why:** Teachers need actionable data to identify struggling students, a key selling point for enterprise tools.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Update the Supabase `experiment_results` table to track time and specific errors. Fetch and visualize this data alongside the existing score distribution.

### 5. Contextual Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Tooltips that explain the purpose and safety warnings of chemicals/equipment when hovered.
**Why:** Standard UX pattern in educational tools to provide just-in-time learning without cluttering the UI.
**Where in code:** `client/src/pages/Lab3D.jsx` (slider cards) and 3D object components.
**How:** Add `title` attributes or custom tooltip components to the chemical sliders and 3D objects in the canvas.

## Quick Wins (< 1 day each)
1.  **Contextual Equipment Tooltips:** Easy to add text descriptions to existing UI elements.
2.  **In-Lab Procedural Checklist:** Can be implemented as simple state-driven text overlay in the Lab3D view.
3.  **Basic Analytics Export:** Add a "Download CSV" button to the `TeacherDashboard` for the current data table.
