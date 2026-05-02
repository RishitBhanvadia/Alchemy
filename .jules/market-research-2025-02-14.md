# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory enabling students to conduct interactive, safe chemistry experiments.
**Market:** EdTech / Virtual Science Lab Simulators
**Date:** 2025-02-14
**Competitors Researched:** Labster, PraxiLabs, Futuclass

## Executive Summary
The virtual lab simulator market is focused on providing accessible, safe, and engaging alternatives to physical labs. Top competitors differentiate through guided learning pathways, strict safety training, and robust teacher analytics. Alchemistry currently offers a strong 3D sandbox but lacks the structured onboarding, safety protocols, and data export features expected in top-tier educational tools. Implementing these features will significantly enhance its classroom readiness.

## Competitor Analysis
- **Labster:** The market leader. Key differentiators include gamified scenario-based learning (escape rooms), guided learning pathways, and embedded theory refreshers.
- **PraxiLabs:** Focuses on accessibility in emerging markets. Differentiates with step-by-step walkthrough guides, explicit lab safety training modules, and bilingual support.
- **Futuclass:** A gamified VR/Web tool for younger students. Differentiates with short 5-10 minute interactive modules and instant feedback.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Pre-lab safety checks and PPE (Personal Protective Equipment) requirements.
- Data export functionality for experiment history (CSV/PDF) for lab reports.
- Contextual onboarding/tooltips for first-time users.

### Differentiating Opportunities (Stand-out features)
- Gamified achievements and badges for successful experiments.
- Real-time embedded quizzes during the lab workflow.
- Chemical hazard information (MSDS) tooltips.

### UX Patterns (Design/interaction patterns common in top products)
- Step-by-step instructional overlays during complex procedures.
- Toggleable scientific units (Molarity, Volume) instead of abstract percentages.
- Clear distinction between "Practice" mode and "Assessment" mode.

## Prioritised Recommendations

### 1. Lab History CSV Export — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the experiment history page.
**Why:** Standard feature in all competitors (e.g., PraxiLabs) allowing students to submit data or analyze it in Excel.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that uses standard CSV formatting to convert `logs` state into a CSV and trigger a browser download.

### 2. Pre-Lab Safety Checklist (PPE) — Priority: HIGH | Effort: MEDIUM
**What:** A quick modal before entering the 3D lab requiring the student to "equip" safety gear (goggles, gloves).
**Why:** Essential in real labs and competitors like Labster. Reinforces safety protocols.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `SafetyChecklistModal` that renders over the 3D `<Canvas>` on initial load. Users must check off items before the `isPlayDisabled` check passes.

### 3. In-Lab Contextual Tooltips (Onboarding) — Priority: HIGH | Effort: MEDIUM
**What:** Step-by-step guided tour on first load (e.g., "Here are the sliders", "Click here to react").
**Why:** Competitors use Walkthrough Guides to prevent students from getting stuck.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use `localStorage` to track `hasSeenLabTour` and conditionally render an onboarding overlay highlighting the slider controls and initiate button.

### 4. Chemical MSDS / Info Cards — Priority: MEDIUM | Effort: SMALL
**What:** Hovering over a chemical name displays a tooltip with its properties and hazards.
**Why:** Connects the simulation to real chemical properties, matching competitor depth.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add an `(i)` icon next to chemical names in the `.slider-card` headers that toggles a small tooltip with static data like molar mass and hazards.

### 5. Realistic Measurement Units — Priority: MEDIUM | Effort: MEDIUM
**What:** Toggle between Percentage (%) and realistic units (Molarity, mL, grams).
**Why:** Real labs don't just use abstract percentages. Enhances educational value.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a state `unitType` and a toggle switch, visually converting the 0-100 slider values into representative scientific units in the UI.

### 6. Download Lab Report (PDF) — Priority: MEDIUM | Effort: MEDIUM
**What:** Button to download the experiment result as a formatted lab report.
**Why:** Teachers often require formal submissions, a key feature in competitors.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Add a "Download Report" button that uses `window.print()` or `html2pdf.js` to save the modal content and relevant reaction context.

### 7. Student Achievements / Badges — Priority: LOW | Effort: MEDIUM
**What:** Display unlocked badges (e.g., "First Reaction", "Safety First").
**Why:** Gamification drives engagement; Futuclass and Labster heavily use this.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Map specific `logs` outcomes to badges and render a new "Achievements" section in the dashboard grid.

### 8. Embedded Quick Quizzes — Priority: LOW | Effort: LARGE
**What:** After a reaction, ask a quick multiple-choice question before showing the AI explanation.
**Why:** PraxiLabs uses interactive quizzes directly in the workflow to assess understanding.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Render a conditional quiz component inside the modal based on the reaction type before showing the full result details.

### 9. Teacher Analytics: Time-on-Task — Priority: LOW | Effort: LARGE
**What:** Track and display how long students spend in the lab per assignment.
**Why:** Labster provides deep performance analytics, including time spent on tasks.
**Where in code:** `client/src/pages/ClassroomDetail.jsx` and `client/src/store/labStore.js`
**How:** Start a timer on lab mount, record it on reaction completion, save to the backend, and display in the teacher dashboard.

### 10. Dark/Light Mode Toggle — Priority: LOW | Effort: SMALL
**What:** Add a theme toggle, as virtual labs can be visually intense.
**Why:** Accessibility and standard user expectation in modern EdTech platforms.
**Where in code:** `client/src/components/Navbar.jsx`
**How:** Add a theme toggle button that switches a CSS variable theme class on the `<body>` element.

## Quick Wins (< 1 day each)
1. Lab History CSV Export (`history.jsx`)
2. Chemical MSDS / Info Cards (`Lab3D.jsx`)
3. Download Lab Report (PDF) (`ResultModal.jsx`)
