# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment, while teachers manage classrooms and monitor analytics.
**Market:** EdTech / Virtual Science Simulators
**Date:** 2026-06-25
**Competitors Researched:** PraxiLabs, PhET Interactive Simulations, Labster

## Executive Summary
The virtual chemistry lab market is transitioning from flash-like simulations to immersive 3D experiences. Top products like PraxiLabs and Labster prioritize not only realistic visual fidelity but also strong educator toolkits: LMS integration, custom quiz builders, and actionable performance analytics. Alchemistry holds a strong foundation in 3D fidelity and core interactions. The biggest opportunity lies in bridging the gap between student lab work and teacher workflows—adding features that help educators track, assess, and export student progress seamlessly.

## Competitor Analysis
* **PraxiLabs:** Focuses heavily on institutional sales, offering a vast library of 3D biology, chemistry, and physics simulations. Key differentiators include a custom quiz builder, performance analytics dashboard, AI Lab Assistant ("Oxi"), and seamless LMS integration.
* **PhET Interactive Simulations:** Free, browser-based 2D/3D simulations widely used in K-12 and higher ed. Key differentiators are accessibility, gamified exploration, and extensive multi-language support. It lacks deep teacher tracking tools, relying on teachers to provide external worksheets.
* **Labster:** High-end VR/3D virtual labs focused on universities. Key differentiators are gamified storylines, embedded quiz assessments, and detailed instructor dashboards for tracking student engagement and scores.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Data Export for Educators:** Competitors allow teachers to export student performance and grades. Alchemistry has analytics but lacks an export-to-CSV/PDF feature.
* **In-Experiment Guidance (Step-by-Step Instructions):** Market leaders provide clear, structured procedural checklists during experiments. Alchemistry has hints but could benefit from a structured "Lab Protocol" checklist panel.

### Differentiating Opportunities (Stand-out features)
* **Custom Quiz / Pre-lab Assessments:** Allowing teachers to define pre-lab quizzes or custom assignments tied to specific chemical reactions.
* **Accessibility Enhancements:** PhET excels here. Adding High Contrast modes and screen-reader support to 3D elements in Alchemistry.

### UX Patterns (Design/interaction patterns common in top products)
* **Immersive Context Menus:** In-world tooltips and interactions instead of traditional UI overlays.
* **Real-time Performance Metrics:** Live progress bars or mastery scores visible to both student and teacher during the experiment.

## Prioritised Recommendations

### 1. CSV Data Export for Analytics — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to export student grades and experiment histories.
**Why:** Table stakes for educators managing grades. Teachers need to move data from Alchemistry into their own LMS or gradebooks.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/pages/history.jsx`
**How:** Create an `ExportButton.jsx` component using a library like `papaparse` or native Blob creation to convert existing state data (`logs` / `analytics`) into a downloadable CSV file.

### 2. Lab Protocol Checklist Panel — Priority: HIGH | Effort: MEDIUM
**What:** A side panel in the 3D lab that tracks the step-by-step procedural workflow of an experiment.
**Why:** Top platforms (PraxiLabs, Labster) guide students through structured workflows. It reduces cognitive load and ensures pedagogical alignment.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `steps` array to `labStore`. Create a `ProtocolPanel.jsx` component that renders the steps as a checklist, updating state as the student completes interactions (e.g., "Add 5ml HCl").

### 3. Integrated Pre-Lab / Post-Lab Quizzes — Priority: MEDIUM | Effort: LARGE
**What:** Allow teachers to attach short multiple-choice quizzes to specific experiments.
**Why:** Differentiator. PraxiLabs emphasizes its Custom Quiz Builder. This validates student learning beyond just clicking through the simulation.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `server/controllers/classroomController.js`
**How:** Extend the `Assignment` data model to include `quiz_questions`. Add a quiz UI modal in `Lab3D.jsx` that must be passed before or after the reaction.

### 4. High-Contrast / Accessibility Mode — Priority: MEDIUM | Effort: SMALL
**What:** A toggle in the UI to increase contrast, increase font sizes, and provide clearer borders for interactive elements.
**Why:** PhET is renowned for accessibility. Virtual labs often exclude visually impaired students.
**Where in code:** `client/src/App.jsx` and `client/src/accessibility.css`
**How:** Add a theme toggle in `Navbar.jsx` that appends a `.high-contrast` class to the body, applying targeted CSS overrides.

### 5. Multi-Language Support (i18n) — Priority: LOW | Effort: LARGE
**What:** Support for multiple languages (Spanish, French, etc.).
**Why:** PhET supports dozens of languages, drastically expanding its market reach globally.
**Where in code:** Entire client application.
**How:** Integrate `react-i18next`. Extract all hardcoded strings into JSON translation files and replace them with the `useTranslation` hook.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** The data already exists in the Zustand stores (`useHistoryStore`); mapping it to CSV is a straightforward, high-impact feature for teachers.
2. **High-Contrast Mode:** CSS-only solution that provides immediate accessibility benefits.
3. **Lab Protocol Checklist (Static Version):** Even a non-interactive checklist showing the required steps for the current module would provide immediate value with minimal effort.
