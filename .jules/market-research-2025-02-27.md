# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory that enables students to conduct interactive experiments and allows teachers to manage classrooms and monitor analytics.
**Market:** EdTech / Science Simulation Software / Virtual Laboratories
**Date:** 2025-02-27
**Competitors Researched:** Labster, PraxiLabs, VirtualChem Labs

## Executive Summary
The virtual chemistry lab market is dominated by platforms that prioritize high-fidelity simulations, guided learning, and teacher-student workflows. While Alchemistry has strong 3D visualization and real-time interaction capabilities using React Three Fiber, it lacks some of the foundational educational workflow features expected by users in this space. The top opportunities lie in bridging the gap between simply running an experiment and integrating that experiment into a formal educational workflow—specifically through data export, contextual guidance, and reference materials.

## Competitor Analysis
* **Labster:** The market leader, known for immersive, gamified 3D simulations. Differentiators include heavy use of storytelling, quizzes interspersed within the lab, and comprehensive student progress tracking.
* **PraxiLabs:** Focuses heavily on realistic lab procedures and equipment. Differentiators include very explicit step-by-step guidance, lab manual integration, and strong LMS compatibility.
* **VirtualChem Labs:** A cloud-based platform focused on computational chemistry. Differentiators include real-world applications (like drug discovery) and interactive 3D visualizations of molecular structures.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Lab Report / Data Export:** Students need to save or submit their results. Competitors allow exporting results to PDF or CSV.
*   **In-Lab Reference Materials:** Real labs have periodic tables and formula sheets. Competitors provide these as quick-access overlays.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Progress Tracking:** Earning badges or experience points for successfully completing different types of reactions or avoiding safety hazards.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Onboarding:** First-time users are guided through the lab environment interface step-by-step to understand how to move and interact.

## Prioritised Recommendations

### 1. CSV Data Export for Lab History — Priority: HIGH | Effort: SMALL
**What:** Add an "Export CSV" button to the History page that downloads the user's past experiment logs.
**Why:** In the EdTech market, students must submit proof of work, and teachers need data. This is a foundational expectation.
**Where in code:** `client/src/pages/history.jsx`
**How:** Create a utility function to convert the existing `logs` array from `useHistoryStore` into CSV format. Add a download button to the UI that triggers this function and creates a downloadable Blob.

### 2. In-Lab Reference Panel (Periodic Table) — Priority: HIGH | Effort: MEDIUM
**What:** Add a slide-out or modal panel in the 3D lab environment containing a Periodic Table and basic formulas.
**Why:** Chemistry students constantly reference these materials. Forcing them to leave the tab breaks immersion.
**Where in code:** `client/src/pages/Lab3D.jsx` and new component `client/src/components/ReferencePanel.jsx`
**How:** Create a floating UI button in the `Lab3D` overlay that toggles a React component containing a static or interactive periodic table image/data.

### 3. Contextual First-Run Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Add a guided tour for the `StudentDashboard` and `Lab3D` environments the first time a user logs in.
**Why:** 3D navigation in the browser can be non-intuitive for some students. Guided onboarding reduces user drop-off.
**Where in code:** `client/src/pages/StudentDashboard.jsx`, `client/src/pages/Lab3D.jsx`, and a new `useOnboardingStore`.
**How:** Use `localStorage` to track if a user has seen the tutorial. If not, use a library like `react-joyride` or custom overlay components to highlight key UI elements (e.g., "Click here to start an Organic experiment").

### 4. Safety Hazard Warnings / Penalties — Priority: MEDIUM | Effort: SMALL
**What:** Implement a visual warning or "deduction" if incompatible chemicals are mixed.
**Why:** Safe lab practice is a core competency taught via virtual labs. Competitors simulate accidents (like explosions or spills) to teach safety.
**Where in code:** `server/controllers/` (where reactions are calculated) or `client/src/pages/Lab3D.jsx`.
**How:** Add a new outcome type in the reaction logic for "Hazardous Mix". When triggered, display a prominent warning modal to the user instead of just a standard result.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** Modifying `history.jsx` to parse the `logs` state into a CSV string and trigger a download takes < 2 hours.
2. **Hazard Warning UI:** Adding a specific, red-styled modal in `Lab3D` when a specific "bad" combination is made.
3. **Reference Panel:** A simple modal with a high-quality Periodic Table image that can be toggled via a button on the UI layer of the lab.
