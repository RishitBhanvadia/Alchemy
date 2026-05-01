# Market Research Report
**App:** A virtual 3D chemistry laboratory platform enabling interactive and safe student experiments.
**Market:** EdTech / Virtual Science Labs
**Date:** 2024-05-01
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is transitioning from simple 2D simulations to immersive 3D environments that emphasize both experiential learning and educator workflow integration. While Alchemistry has a strong foundation with its interactive 3D lab and AI tutor integration, it currently lacks table-stakes educator features like data export, and differentiating immersion features like pre-lab safety protocols. Implementing these will significantly boost its appeal for institutional adoption.

## Competitor Analysis
- **Labster:** Market leader known for highly gamified, immersive 3D environments. Differentiator: Strong narrative-driven experiments and rigorous safety protocol simulations before lab work begins.
- **PraxiLabs:** Focuses on realistic 3D simulations across STEM. Differentiator: Comprehensive educator dashboards with built-in assessments, detailed auto-generated reports, and multilingual support.
- **ChemCollective:** An established, open platform. Differentiator: Deep repository of pre-authored, curriculum-aligned scenarios, though it lacks modern 3D visual fidelity.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Data Export:** Educators and students expect to be able to export lab results for offline grading or lab reports. Alchemistry's `/history` page displays logs but cannot export them.
- **Guided Walkthrough/Tutorial:** First-time users often need a contextual guide for 3D controls beyond a static overlay.

### Differentiating Opportunities (Stand-out features)
- **Pre-lab Safety Protocol:** Simulating the requirement to "put on PPE" (Personal Protective Equipment) before entering the lab reinforces real-world safety standards, a feature heavily praised in Labster.
- **Curriculum Alignment Metadata:** Tagging experiments with standard curriculum topics (e.g., NGSS standards) to help teachers find relevant setups.

### UX Patterns (Design/interaction patterns common in top products)
- **Real-time Data Visualization:** Live graphing of temperature/pH changes during the reaction, rather than just a final outcome state.
- **Gamified Progress Tracking:** Earning badges or showing a progress bar for mastering different types of reactions.

## Prioritised Recommendations

### 1. CSV Export for Experiment Logs — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to download experiment history as a CSV file.
**Why:** Table-stakes for EdTech. Teachers need tangible outputs for grading, and students need data for written lab reports.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" `<button>` near the page title. In the `onClick` handler, map the `logs` array (from `useHistoryStore`) to CSV format (Outcome, Date, Type, Chemicals) and trigger a download using a Blob and temporary `<a>` element.

### 2. Pre-Lab Safety Check (PPE Gate) — Priority: MEDIUM | Effort: SMALL
**What:** A quick modal requiring users to acknowledge safety protocols (e.g., "Goggles on", "Gloves on") before the 3D lab initializes.
**Why:** Reinforces real-world lab safety (a key selling point for virtual labs like Labster) and adds to the immersion.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Introduce a `showSafetyCheck` state variable. Render a modal on initial load. The user must click "Acknowledge Safety Rules" to set `showSafetyCheck` to false and reveal the 3D Canvas.

### 3. Contextual First-Time Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Step-by-step tooltips highlighting the chemical sliders, the initiate button, and the AI tutor for first-time users.
**Why:** The current static text ("Use arrow keys...") is easily missed. Guided onboarding is standard in complex 3D web apps.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/userSettingsStore.js` (to be created/updated).
**How:** Add a `hasSeenLabTutorial` flag in local storage. If false, overlay a simple sequence of positioned tooltips explaining the UI elements, updating the flag upon completion.

### 4. Real-time Live Graphing Placeholder — Priority: LOW | Effort: MEDIUM
**What:** A dynamic visual graph showing simulated temperature or pH changes while the reaction state is 'loading'.
**Why:** Enhances the scientific realism compared to a simple loading spinner, matching PraxiLabs' detailed data visualization.
**Where in code:** `client/src/components/PhysicsLab.jsx` (or a new `ReactionGraph.jsx` component rendered in `Lab3D.jsx`).
**How:** While `reactionState === 'loading'`, display a small overlay with a simple animated line chart (e.g., using Recharts or Chart.js) simulating a curve that plateaus.

### 5. Curriculum Tags on Experiments — Priority: LOW | Effort: SMALL
**What:** Display curriculum relevance tags (e.g., "Acids & Bases", "Redox") on the result and history screens.
**Why:** Helps educators justify the use of the tool by explicitly tying virtual activities to their syllabus requirements.
**Where in code:** `client/src/pages/history.jsx` and `server/controllers/experimentController.js` (or database schema).
**How:** Extend the `experiment_type` logic to include standard tags, and render these as small pill badges next to the experiment type in the history table.

## Quick Wins (< 1 day each)
1. **CSV Export for Experiment Logs:** High value for educators, very fast to implement using standard browser APIs.
2. **Pre-Lab Safety Check:** Easy to build using existing modal patterns in the app.
3. **Add "Mix at least 2 chemicals" tooltip:** Make the existing warning more prominent with a contextual tooltip pointing to the sliders.
