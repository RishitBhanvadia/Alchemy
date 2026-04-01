# Market Research Report
**App:** Alchemistry is a web-based 3D virtual chemistry laboratory built with React, Three.js, and Supabase that enables students to conduct safe, interactive chemistry experiments in a 3D environment with real-time feedback.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-10-24
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual science lab market is transitioning from basic 2D simulations (PhET) to immersive, gamified 3D experiences (Labster, PraxiLabs). Alchemistry has a strong technical foundation with its 3D environment, AI tutor, and teacher dashboard. To compete with top-tier platforms, Alchemistry needs to bridge the gap between sandbox exploration and structured curriculum delivery by adding contextual onboarding, robust exporting/sharing options, and deeper gamification elements.

## Competitor Analysis
* **Labster:** The market leader. Known for highly immersive, story-driven 3D simulations. Differentiators: Built-in assessment checkpoints, embedded mini-games, and strong LMS integration.
* **PraxiLabs:** Focuses on realistic, step-by-step experiment replication. Differentiators: Bilingual support, very clear step-by-step procedural guides ("lab manual" overlay), and detailed post-lab reports.
* **PhET Interactive Simulations:** The free, standard tool. 2D, highly interactive, and focused on intuitive variable manipulation rather than realistic 3D graphics. Differentiators: Huge accessibility features, cross-device compatibility, and easy embeddability.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* Contextual onboarding / First-time user tour.
* Exportable lab reports (PDF/CSV) for assignments.
* Step-by-step interactive lab manual overlay during experiments.

### Differentiating Opportunities (Stand-out features)
* Proactive AI Tutor that triggers based on student idle time or mistakes.
* Real-time collaborative sessions (multiplayer labs).
* Gamification badges/achievements for completing specific compound discoveries.

### UX Patterns (Design/interaction patterns common in top products)
* "Reset Table" button prominently displayed.
* Visual indicators for chemical safety (e.g., warning icons for volatile mixes).
* Accessible keyboard navigation for 3D elements.

## Prioritised Recommendations

### 1. Exportable Lab Reports — Priority: HIGH | Effort: MEDIUM
**What:** Allow students to export their experiment history and results as a PDF or CSV.
**Why:** Essential for homework submission. PraxiLabs and Labster both emphasize easily shareable proof of work.
**Where in code:** `client/src/store/historyStore.js` and `client/src/components/InExpResult.jsx`
**How:** Add an "Export CSV" function to the historyStore that maps the `logs` array to a CSV format, and a "Download Report" button on the experiment result modal using `html2canvas` and `jsPDF`.

### 2. Proactive AI Tutor Guidance — Priority: HIGH | Effort: MEDIUM
**What:** The AI tutor should pop up with hints if the user is idle or mixes an incorrect/dangerous combination.
**Why:** Competitors use embedded digital mentors to prevent students from getting stuck. We already have the AI component.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/AiTutorPanel.jsx`
**How:** Add an idle timer hook in `Lab3D.jsx`. If idle for >60s, trigger `AiTutorPanel` to open with a contextual prompt based on currently selected tools.

### 3. First-Time User Tour (Onboarding) — Priority: HIGH | Effort: SMALL
**What:** A step-by-step highlight tour of the lab interface for new users.
**Why:** 3D interfaces can be overwhelming. Top products guide the user to their first action.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a lightweight library like `driver.js` or `react-joyride`. Track `hasSeenTour` in localStorage or Supabase user profile.

### 4. Interactive Step-by-Step Lab Manual — Priority: MEDIUM | Effort: LARGE
**What:** A collapsible side panel listing the exact steps required for an assigned experiment, with checkboxes that auto-tick when completed.
**Why:** Bridges the gap between sandbox mode and structured assignments.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/assignmentStore.js`
**How:** Update assignment schema to include `steps` (JSON). Create a `LabManualPanel` component that listens to lab state to auto-complete steps.

### 5. Gamification Badges — Priority: MEDIUM | Effort: MEDIUM
**What:** Award badges for discovering new compounds or completing modules.
**Why:** Drives engagement and replayability, a core feature of Labster.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/store/historyStore.js`
**How:** Create a new `badges` table in Supabase. When an experiment log is saved in historyStore, check against badge criteria. Display earned badges in the Student Dashboard.

### 6. Safety Warning Indicators — Priority: MEDIUM | Effort: SMALL
**What:** Show visual warning icons when mixing volatile chemicals.
**Why:** Reinforces real-world lab safety protocols.
**Where in code:** `client/src/components/3d-animations/`
**How:** Add `isVolatile: boolean` to compound data. If selected chemicals are volatile, render a pulsating warning icon overlay on the 3D scene.

### 7. Global "Reset Lab" Button — Priority: MEDIUM | Effort: SMALL
**What:** A single, prominent button to clear the workbench.
**Why:** Standard UX pattern in all virtual labs to quickly restart an experiment.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a floating action button that triggers the existing state clearing functions for beakers, flasks, and selected chemicals.

### 8. Improved Accessibility (Keyboard/ARIA) — Priority: MEDIUM | Effort: MEDIUM
**What:** Ensure all UI elements in the lab are keyboard navigable.
**Why:** PhET sets the standard for accessibility. Necessary for institutional adoption.
**Where in code:** `client/src/components/` (all interactive components)
**How:** Audit and add `tabIndex`, `aria-label`, and `onKeyDown` handlers to custom buttons and tool panels.

### 9. Shareable "Snapshot" of Workbench — Priority: LOW | Effort: SMALL
**What:** Allow students to take a screenshot of their current 3D setup.
**Why:** Useful for asking teachers for help or sharing cool reactions.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use Three.js `renderer.domElement.toDataURL()` to capture the canvas and trigger a download.

### 10. Teacher Analytics Export — Priority: LOW | Effort: SMALL
**What:** Allow teachers to download a CSV of their classroom's performance.
**Why:** Required for grading systems integration.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an export button that maps the `logs` and `assignments` data to a CSV.

## Quick Wins (< 1 day each)
1. **Global "Reset Lab" Button:** Easily added to the Lab3D UI to improve immediate usability.
2. **Shareable "Snapshot" of Workbench:** Quick to implement using existing Three.js renderer capabilities.
3. **Exportable Lab Reports (CSV):** A straightforward mapping of the existing `logs` state to a CSV download in the historyStore.
