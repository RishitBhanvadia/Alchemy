# Market Research Report
**App:** Alchemistry is a web-based virtual 3D chemistry laboratory where students conduct interactive experiments with real-time feedback and teachers track performance analytics.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-05-18
**Competitors Researched:** Labster, PhET Interactive Simulations, VirtualChemLabs, Concord Consortium

## Executive Summary
The virtual chemistry laboratory market is highly focused on replicating real-world lab protocols safely and providing actionable data to educators. Top platforms like Labster differentiate themselves through immersive onboarding, mandatory safety procedures (PPE), and robust teacher integrations. Alchemistry has a strong 3D foundation but lacks the structured "rails" (onboarding/safety) that define premium products in this space, as well as the data portability (exports) that teachers expect. Adding these features will significantly elevate Alchemistry's professional feel and usability.

## Competitor Analysis
*   **Labster:** The market leader. Key features include highly structured, narrative-driven simulations, mandatory virtual safety gear checks before starting experiments, and comprehensive teacher dashboards with LMS integration.
*   **PhET Interactive Simulations:** Focuses on open-ended, sandbox-style interactive math and science simulations. Excellent visual feedback but lacks structured assignment tracking and teacher analytics.
*   **VirtualChemLabs:** Offers workshops and learning tools alongside virtual experiments. Focuses heavily on aligning with standard curriculum topics.
*   **Concord Consortium:** Provides free STEM simulations. Strong emphasis on data visualization and graphing within the simulations themselves.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export for Teachers:** Teachers need to get student grades out of the platform and into their own gradebooks (e.g., via CSV). Alchemistry currently displays analytics but traps the data in the browser.
*   **Safety Protocol Simulation:** Real labs require safety gear. Virtual labs are expected to teach this habit. Alchemistry drops students straight into chemical mixing.

### Differentiating Opportunities (Stand-out features)
*   **Contextual AI Guidance:** Competitors offer "theory" tabs. Alchemistry has an `AiTutorPanel.jsx` but could proactively prompt students based on inactivity or specific incorrect chemical combinations.

### UX Patterns (Design/interaction patterns common in top products)
*   **Step-by-Step Onboarding Tour:** First-time users in complex 3D environments often feel lost. A guided tour (tooltips highlighting controls) is a standard pattern in top tools.
*   **Visual Checklists:** Showing users a checklist of required actions (e.g., "Mix Acid", "Mix Base", "Observe Reaction") to structure the learning experience.

## Prioritised Recommendations

### 1. Teacher Data Export (CSV) — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the teacher analytics view.
**Why:** Teachers consistently cite the need to integrate virtual lab scores with their existing Learning Management Systems (LMS) or gradebooks. This is a table-stakes feature for adoption.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` (specifically near the `StudentAnalyticsChart` section).
**How:** Create an `ExportButton` component. When clicked, take the existing `experimentScores` or `students` array data already fetched in the component, format it into a CSV string, and trigger a file download using a Blob URL.

### 2. Mandatory Virtual Safety Gear Check (PPE) — Priority: HIGH | Effort: MEDIUM
**What:** Require students to explicitly "equip" virtual safety goggles and gloves before the 3D simulation unlocks.
**Why:** Simulating real-world lab safety is a core value proposition of platforms like Labster. It reinforces good habits and makes the simulation feel more authentic and educational.
**Where in code:** `client/src/pages/Lab3D.jsx` and potentially `client/src/store/labStore.js`.
**How:** Add a `safetyGearEquipped` boolean state to `labStore.js`. In `Lab3D.jsx`, if this is false, render an overlay dialog over the canvas prompting the user to click buttons to equip "Goggles" and "Gloves". Disable the "INITIATE REACTION" button and sliders until equipped.

### 3. First-Time Guided Onboarding Tour — Priority: MEDIUM | Effort: MEDIUM
**What:** Implement a step-by-step tooltip overlay that guides new students through the UI (e.g., pointing out the chemical sliders, the initiate button, and the AI tutor).
**Why:** 3D interfaces can be intimidating. A brief guided tour ensures students understand the controls immediately, reducing frustration and support requests. This is a standard UX pattern in complex web apps.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/authStore.js` (or local storage).
**How:** Use a library like `react-joyride` or create a custom guided state. Check `localStorage` for a `hasSeenLabTour` flag. If false, show a sequence of tooltips anchored to the `.chem-slider`, `.action-button`, and `.ai-toggle-button` elements.

### 4. Interactive Visual Checklist — Priority: LOW | Effort: MEDIUM
**What:** A small floating panel in the 3D lab that shows the required steps for the current experiment (e.g., [ ] Add HCl, [ ] Add NaOH, [ ] Initiate Reaction) and checks them off as the student performs them.
**Why:** Provides structure to the open sandbox, helping students who might not know what to do next without having to consult an external manual.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new component `client/src/components/ExperimentChecklist.jsx`.
**How:** Create a UI overlay component that reads the current `chemA`, `chemB`, etc., values from `labStore.js` and updates the checklist state dynamically based on the slider values and `reactionState`.

## Quick Wins (< 1 day each)
1.  **Teacher Data Export (CSV):** The data is already fetched in `TeacherDashboard.jsx`; adding a CSV formatter and download button is a straightforward addition.
2.  **Safety Gear Check (PPE):** A simple modal overlay checking a boolean state in `Lab3D.jsx` before allowing interaction can be implemented quickly.
3.  **Basic Tooltip Onboarding:** Adding simple native browser tooltips (`title` attribute) or a basic CSS-based tooltip to the main controls if a full guided tour is too much effort.