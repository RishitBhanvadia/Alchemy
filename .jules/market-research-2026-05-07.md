# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory for students to conduct interactive, safe chemistry experiments with real-time feedback and an AI tutor.
**Market:** EdTech / Virtual Science Lab Simulations
**Date:** 2026-05-07
**Competitors Researched:** VirtualChem Labs, LabOnLaptop

## Executive Summary
The virtual chemistry lab market focuses heavily on providing realistic, safe, and accessible experimental environments for high school and university students. Top competitors differentiate themselves through comprehensive experiment varieties, robust accessibility, and integrated tutorials or theoretical resources. Alchemistry has a solid foundation with its 3D environment, real-time feedback, AI tutor, and gamified UI. However, it lacks several standard features seen in top products, such as comprehensive assessment tools and offline capabilities. By implementing targeted UX patterns and expanding its educational scaffolding, Alchemistry can significantly improve its market positioning.

## Competitor Analysis
*   **VirtualChem Labs:** Focuses on computational chemistry and molecular modeling, offering workshops and an expert community. Differentiates with professional-grade tools and industry applications.
*   **LabOnLaptop:** Focuses on broad science software (physics, chemistry, biology) for schools. Differentiates with curriculum alignment (CBSE, ICSE) and offline capabilities.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export/Lab Reports:** The ability for students to export their experiment history and results into a structured format (e.g., PDF or CSV) for submission.
*   **Detailed Analytics Dashboard:** Detailed breakdowns of student performance (time taken, accuracy, retries) visible to the student, not just the teacher.

### Differentiating Opportunities (Stand-out features)
*   **Molecular View:** A toggle or separate view to see the atomic/molecular interactions during a reaction, bridging macroscopic observation with microscopic theory.
*   **Offline Support:** Expanding accessibility by allowing core simulations to run without an active internet connection.

### UX Patterns (Design/interaction patterns common in top products)
*   **Persistent "Theory" or "Concept" Panel:** A readily accessible panel containing the underlying chemical equations and concepts relevant to the current experiment.
*   **First-Time User Onboarding Tooltips:** Contextual help for first-time users explaining what each UI element does.

## Prioritised Recommendations

### 1. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a button in the History page to export the student's experiment logs to a CSV file.
**Why:** A standard feature in educational tools for submitting work or offline review.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a "Download CSV" button. Map the `logs` array (from `useHistoryStore`) to a CSV string using standard JavaScript (or Papa Parse if added), and trigger a file download using a Blob and anchor tag.

### 2. Integrated "Theory/Concept" Reference — Priority: MEDIUM | Effort: SMALL
**What:** A toggleable informational modal or panel containing the chemical equations and basic theory related to the available chemicals (HCl, NaOH, etc.).
**Why:** Bridges the gap between practical simulation and theoretical understanding. Competitors often link simulations to textbook concepts.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/TheoryPanel.jsx` (new).
**How:** Add a new button (e.g., a "book" icon) next to the AI Tutor button. Clicking it opens a modal containing static or dynamically fetched Markdown/HTML content about acid-base reactions, catalysts, etc.

### 3. First-Time User Onboarding Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Contextual tooltips pointing to key UI elements (Chemical Sliders, Initiate Reaction, AI Tutor, History) during the user's first visit.
**Why:** Improves usability and ensures users understand the interface without external instruction.
**Where in code:** `client/src/pages/Lab3D.jsx` or a wrapper component.
**How:** Use `localStorage` to check a `hasSeenLabOnboarding` flag. If false, render a series of tooltips (using a library like `react-joyride` or a custom lightweight overlay) guiding the user through the controls.

### 4. Student Performance Dashboard — Priority: LOW | Effort: MEDIUM
**What:** A dedicated view for students to see their own aggregate statistics (total experiments, average score, most used chemicals).
**Why:** Gamifies the experience and provides self-reflection.
**Where in code:** `client/src/pages/StudentDashboard.jsx` or a new `client/src/pages/StudentStats.jsx`.
**How:** Query the user's `experiment_results` and `logs` to calculate metrics. Use a charting library (like Recharts, already in package.json) to visualize the data.

### 5. "Reset to Default" Button for Lab Controls — Priority: LOW | Effort: SMALL
**What:** A single button to reset all chemical sliders to 0%.
**Why:** Improves UX during repeated experiments, saving the user from manually dragging multiple sliders back.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a "Reset Sliders" icon/button near the controls that calls `setChemA(0)`, `setChemB(0)`, etc.

### 6. Contextual Error Messages for Invalid Mixtures — Priority: LOW | Effort: SMALL
**What:** Instead of a generic "Mix at least 2 chemicals", provide specific feedback when a reaction fails or produces no interesting result based on the specific chemicals mixed.
**Why:** Enhances the educational value of mistakes.
**Where in code:** `client/src/pages/Lab3D.jsx` (or the backend reaction logic).
**How:** Update the AI or reaction logic to return specific "hint" messages (e.g., "Acid and Acid won't react noticeably here") and display them in a toaster or near the controls.

## Quick Wins (< 1 day each)
1.  **Export Experiment History to CSV:** Easy to implement, high utility for students.
2.  **"Reset to Default" Button for Lab Controls:** Simple state update, immediately improves UX.
3.  **Integrated "Theory/Concept" Reference:** A static modal providing educational context with minimal backend interaction needed.
