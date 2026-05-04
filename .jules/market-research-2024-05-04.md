# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments.
**Market:** EdTech - Virtual Science Labs
**Date:** 2024-05-04
**Competitors Researched:** Labster, ChemCollective, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is dominated by platforms that blend immersive simulations with robust educational tools. Top competitors focus heavily on providing realistic lab experiences, structured learning pathways, and comprehensive data analysis for both students and educators. Alchemistry has a strong foundation with its 3D environment and AI tutor, but lacks some table-stakes educational features like data export and structured onboarding. Implementing these missing features will significantly enhance its viability as a classroom tool.

## Competitor Analysis
- **Labster:** The premium player in the space. Known for highly immersive, gamified 3D environments, complete storylines, and comprehensive educator dashboards. It emphasizes student engagement and learning outcomes.
- **ChemCollective:** A free, highly flexible 2D simulation tool. Its strength lies in open-ended inquiry and the ability for students to design their own experiments. It features precise and realistic transfer modes for chemicals.
- **PhET Interactive Simulations:** Extremely popular, accessible, and intuitive 2D simulations. Focuses heavily on visualizing abstract sub-microscopic concepts and provides excellent accessibility features.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Data Export:** Students and teachers need to export experiment results (CSV/PDF) for lab reports and grading.
- **Guided Onboarding/Tutorials:** First-time users need a step-by-step walkthrough of the 3D controls and lab procedures.
- **Precise Measurement Tools:** Ability to transfer exact volumes of chemicals (like in ChemCollective), rather than just binary add/remove actions.

### Differentiating Opportunities (Stand-out features)
- **Sub-microscopic Visualization:** Showing molecular-level animations of the reactions occurring in the beaker (similar to PhET).
- **Gamified Scenarios/Escape Rooms:** Adding narrative-driven challenges (like Labster) to increase engagement.

### UX Patterns (Design/interaction patterns common in top products)
- **Interactive Tooltips:** Contextual help that appears when hovering over or interacting with new equipment.
- **Realistic Equipment Handling:** Visual and physical feedback when pouring or mixing chemicals.

## Prioritised Recommendations

### 1. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the History page that exports the user's experiment logs.
**Why:** Essential for students writing lab reports and teachers tracking progress. Table stakes in educational software.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that takes the `logs` array, converts it to CSV format using Papa Parse (or manual string building), and triggers a file download.

### 2. Guided Lab Tutorial (First Run) — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step interactive overlay that guides new users through adding chemicals, viewing results, and using the AI tutor.
**Why:** 3D environments can be intimidating. Competitors (like ChemCollective) provide clear introductory videos or interactive tours.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a state flag `hasSeenTutorial` in localStorage. Use a library like `react-joyride` or custom overlay tooltips to highlight key UI elements (chemicals, AI button, reset) on first visit.

### 3. Precise Volume Transfer Mode — Priority: MEDIUM | Effort: LARGE
**What:** Allow users to specify the exact amount of chemical to add, rather than a single fixed "pour" action.
**Why:** ChemCollective's defining feature is "Precise Transfer" vs "Realistic Transfer". Crucial for accurate titration and quantitative analysis.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx` (and 3D components)
**How:** Update the `labStore` to track chemical amounts as continuous values instead of booleans. Add a UI slider or input field when a chemical is selected to determine the transfer volume.

### 4. Sub-microscopic Reaction View — Priority: LOW | Effort: LARGE
**What:** A toggleable view that shows the molecular interaction (e.g., ions combining) when a reaction occurs.
**Why:** PhET research shows this is the most effective way for students to understand abstract concepts.
**Where in code:** `client/src/components/ResultModal.jsx` and new 3D components
**How:** Create simple 2D or 3D animations using Framer Motion or Three.js that trigger based on the specific `reaction_id` when the ResultModal is opened.

## Quick Wins (< 1 day each)
1. Implement CSV Export on the History page.
2. Add a simple "Welcome Guide" modal on the first visit to the Lab page.
3. Add tooltips to the 3D lab controls (hover states for chemical bottles).
