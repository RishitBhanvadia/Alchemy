# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory that enables interactive experiments, classroom management, and real-time AI tutoring.
**Market:** Educational Technology (EdTech) - Virtual STEM Laboratories
**Date:** 2026-05-05
**Competitors Researched:** Labster, ChemCollective, PraxiLabs

## Executive Summary
The virtual chemistry lab market is highly competitive, emphasizing realistic 3D simulations, student engagement, and educator analytics. While Alchemistry excels with its real-time 3D React Three Fiber setup and AI Tutor, it lags behind established players in table-stakes features like gamification, robust data export, and accessibility options. Bridging these gaps will significantly enhance its appeal to both educational institutions and individual learners.

## Competitor Analysis
- **Labster:** Industry leader known for highly immersive gamified simulations with storytelling elements and comprehensive educator dashboards.
- **ChemCollective:** Focuses heavily on the raw scientific accuracy of virtual labs and offers extensive pre-built, standardized scenarios.
- **PraxiLabs:** Differentiates with strong multilingual support, detailed supplementary materials (videos, documents), and robust LMS integration.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Exportable experiment reports (PDF/CSV) for grading.
- Built-in contextual tooltip/onboarding system for first-time users.
- Clear achievement/badge system for completing experiments.

### Differentiating Opportunities (Stand-out features)
- Collaborative multiplayer lab sessions.
- Scenario-based learning (e.g., "Solve the environmental crisis using chemistry").
- Detailed accessibility settings (colorblind mode for indicators, high contrast).

### UX Patterns (Design/interaction patterns common in top products)
- Step-by-step interactive checklists within the lab interface.
- Persistent "Safety Goggles/Equipment" verification before starting.

## Prioritised Recommendations

### 1. CSV Data Export for Experiment Results — Priority: HIGH | Effort: SMALL
**What:** Allow teachers and students to export experiment history and results as CSV files.
**Why:** Educators need easily portable data for grading and LMS integration, a standard feature in Labster and PraxiLabs.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/ClassroomDetail.jsx`
**How:** Add an `ExportCSVButton` component that utilizes the existing `historyStore` logs and formats them into a downloadable CSV using a lightweight utility.

### 2. Gamified Achievement Badges — Priority: HIGH | Effort: MEDIUM
**What:** Introduce visual badges (e.g., "First Reaction", "Titration Master") displayed on the student dashboard.
**Why:** Gamification drastically improves student retention and completion rates in educational software.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Add a `badges` array to the Supabase user profile schema. Render a `BadgeGrid` component on the profile and dashboard based on the user's completed experiments count from `historyStore`.

### 3. Interactive Lab Checklist — Priority: MEDIUM | Effort: SMALL
**What:** A collapsible sidebar checklist guiding students through the steps of a specific experiment.
**Why:** Reduces cognitive overload for students in the 3D environment, a common UX pattern in ChemCollective.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a simple `ExperimentChecklist` React component overlaying the Canvas, driven by a new state in `labStore` that tracks current experiment progress.

### 4. Contextual First-Time Onboarding Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Step-by-step guided tour highlighting key UI elements (AI Tutor, Beakers, Burner) on first visit.
**Why:** 3D interfaces can be unintuitive; top products always guide new users.
**Where in code:** `client/src/App.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Add a `hasSeenOnboarding` flag to `localStorage`. Use a library like `react-joyride` or a custom overlay to highlight refs in the `Lab3D` component if the flag is false.

### 5. Mandatory Safety Equipment Check — Priority: MEDIUM | Effort: SMALL
**What:** A modal requiring users to "equip" virtual safety goggles and gloves before the 3D lab loads.
**Why:** Reinforces real-world lab safety protocols, highly requested by educators.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `SafetyModal` component that blocks interaction with the `Canvas` until the user clicks to acknowledge and equip safety gear, updating a local state.

### 6. Accessibility Colorblind Mode Toggle — Priority: LOW | Effort: MEDIUM
**What:** A setting to adjust the colors of chemical reactions and UI indicators for colorblind users.
**Why:** Essential for educational tools to be inclusive, especially for visual-heavy subjects like chemistry.
**Where in code:** `client/src/components/Navbar.jsx` and `client/src/pages/titration.jsx`
**How:** Add a toggle in the Navbar that updates a CSS variable or state context, which the `titration` component and `Lab3D` materials use to switch to colorblind-safe palettes (e.g., swapping red/green for blue/orange).

### 7. Teacher Announcement Banner — Priority: LOW | Effort: SMALL
**What:** A customizable banner on the student dashboard for teachers to post messages or due dates.
**Why:** Improves classroom communication without relying on external LMS platforms.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/ClassroomDetail.jsx`
**How:** Add an `announcement` field to the classroom schema in Supabase. Display this text at the top of the `StudentDashboard` if the student is enrolled in that class.

### 8. Experiment Reset Button (Undo) — Priority: LOW | Effort: SMALL
**What:** A quick "Reset Lab" button to clear the current beaker states without refreshing the page.
**Why:** Encourages trial and error learning without the friction of a full page reload.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `resetLab` action to `labStore` that clears `chemA`, `chemB`, etc. Bind this action to a new floating button in the `Lab3D` UI.

### 9. Shareable "Reaction Snippets" — Priority: LOW | Effort: MEDIUM
**What:** Allow students to generate a shareable link or image of their final reaction result.
**Why:** Fosters peer-to-peer sharing and engagement.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Implement an `html2canvas` utility in the `ResultModal` to capture the result summary and allow the user to download or copy it to the clipboard.

### 10. Built-in Periodic Table Reference — Priority: LOW | Effort: SMALL
**What:** A quick-access periodic table modal available from any lab view.
**Why:** Essential reference material; currently users might have to leave the app to check properties.
**Where in code:** `client/src/components/Navbar.jsx`
**How:** Add a `PeriodicTableModal` component triggered by a button in the Navbar, displaying a static, well-formatted SVG or CSS-grid periodic table.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** Easily implementable using existing history data and a library like `papaparse` or simple string formatting.
2. **Experiment Reset Button:** Simply adding a state-clearing function to the existing Zustand store.
3. **Mandatory Safety Equipment Check:** A basic React modal state before rendering the main Canvas.
