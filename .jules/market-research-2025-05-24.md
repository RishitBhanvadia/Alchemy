# Market Research Report
**App:** A React and Three.js-based web virtual chemistry laboratory platform for students and teachers featuring interactive 3D simulations.
**Market:** EdTech / Virtual Science Labs Software
**Date:** 2025-05-24
**Competitors Researched:** Labster, PhET Interactive Simulations, Beyond Labz, PraxiLabs

## Executive Summary
The virtual lab software market is dominated by comprehensive, highly-realistic simulations designed for institutional adoption and conceptual sandbox tools for rapid exploration. Alchemistry's strength lies in its visually modern "glassmorphism" UI and real-time Three.js integration. However, the app lacks crucial educational scaffolding features (like in-lab theory or step-by-step guidance) and realistic lab tools (like data logging or specific equipment usage) that top competitors provide to ensure students aren't just mixing chemicals randomly, but actually learning scientific principles.

## Competitor Analysis
- **Labster:** The market leader. Key differentiator: Highly gamified, scenario-based learning with a strong emphasis on theory, safety protocols, and realistic procedures (e.g., putting on gloves).
- **PhET Interactive Simulations:** The most accessible tool. Key differentiator: Intuitive, unguided conceptual playgrounds focusing on specific physics/chemistry laws with very clear visual feedback.
- **PraxiLabs:** Focused on step-by-step procedures. Key differentiator: Detailed visual presentation of complex procedures and strong multi-language support.
- **Beyond Labz:** Focuses strongly on chemistry. Key differentiator: Highly detailed and accurate simulated equipment and data collection mechanisms.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Embedded Theory/Instructions:** Competitors always provide context for *why* an experiment is being done, not just a sandbox. Alchemistry's `Lab3D` only has "Drag and pour the chemicals".
- **Safety Protocols/Equipment:** Virtual labs usually simulate safety (goggles, gloves) as part of the learning.
- **Data Logging/Export:** Students need to record data for lab reports. Currently, history is just a visual log.

### Differentiating Opportunities (Stand-out features)
- **Gamified Scenarios/Missions:** Labster excels here. Wrapping experiments in real-world problems (e.g., "Analyze this water sample").
- **Real-time Graphing:** PhET is great at showing relationships (e.g., pH vs. volume added in titration) instantly.
- **Multi-language Support:** PraxiLabs uses this effectively for global reach.

### UX Patterns (Design/interaction patterns common in top products)
- **Guided Onboarding/Tutorials:** Step-by-step "first-time" walkthroughs.
- **Contextual Tooltips:** Explaining what a tool or chemical is when hovered.
- **Split-Screen View:** Having the lab on one side and a digital notebook/instructions on the other.

## Prioritised Recommendations

### 1. Embedded Experiment Instructions / Lab Manual — Priority: HIGH | Effort: MEDIUM
**What:** Add a collapsable "Lab Manual" or "Instructions" panel inside the 3D lab view.
**Why:** Competitors like Labster and PraxiLabs never drop students into an empty lab without context. Students need guided steps to achieve learning outcomes.
**Where in code:** `client/src/pages/Lab3D.jsx` and create `client/src/components/LabManual.jsx`.
**How:** Create a side-panel component that fetches current assignment details (from `assignmentStore`) or displays default guided steps for the sandbox, toggled via a button similar to the AI Tutor or History panel.

### 2. Contextual Chemical Tooltips — Priority: HIGH | Effort: SMALL
**What:** Show information about chemicals (e.g., safety hazards, molar mass, description) when hovering over them in the UI.
**Why:** Increases educational value. Currently, sliders just show names (e.g., "Hydrochloric Acid"). Users need to know *what* they are handling, mimicking real-world safety data sheets (SDS) expected in Beyond Labz.
**Where in code:** `client/src/pages/Lab3D.jsx` (Slider cards section).
**How:** Add a simple CSS-based or React tooltip to the `.slider-card` headers that displays brief chemical properties.

### 3. CSV Export for Experiment History — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to download their experiment history as a CSV file.
**Why:** Table stakes for educational tools. Students need to submit data for lab reports, a feature standard in Beyond Labz and Labster.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add an "Export to CSV" button that uses the existing `logs` array, mapping it to CSV format (using a small utility or Papa Parse) and triggering a download.

### 4. Interactive "First-Time" Onboarding Tour — Priority: MEDIUM | Effort: MEDIUM
**What:** A guided tour highlighting key UI elements (sliders, AI tutor, history, canvas) on first visit.
**Why:** Top UX pattern across all platforms. Reduces confusion when faced with complex interfaces.
**Where in code:** `client/src/pages/Lab3D.jsx` or a global wrapper.
**How:** Implement a lightweight guided tour (e.g., using `react-joyride` or a custom overlay sequence) that triggers if a `hasSeenLabTour` flag is not in `localStorage`.

### 5. Real-Time pH / Temperature Readouts — Priority: MEDIUM | Effort: MEDIUM
**What:** Visual meters on the lab screen showing current pH or temperature based on the chemical mix.
**Why:** Differentiating feature similar to PhET's visual feedback. Enhances realism beyond just waiting for an outcome label.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`.
**How:** Add UI overlays in `Lab3D.jsx` that read derived values based on `chemA`, `chemB` (e.g., a simple pH calculation function) and update dynamically as sliders move.

### 6. "Reset to Checkpoint" Functionality — Priority: LOW | Effort: SMALL
**What:** Allow users to undo the last chemical addition rather than completely resetting the lab.
**Why:** Common in detailed simulators to prevent frustration when making a small mistake at the end of a long procedure.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Keep a history stack of state changes in `labStore` and add an "Undo" button next to the "Reset Lab" functionality.

### 7. Virtual Safety Gear Check — Priority: LOW | Effort: MEDIUM
**What:** Require students to "equip" virtual safety goggles/gloves before the "Initiate Reaction" button becomes active.
**Why:** Safety training is a core selling point for Labster and PraxiLabs.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a small UI checklist or toggle buttons for "Goggles" and "Gloves". Disable the play button unless these are checked.

### 8. Shareable Experiment Snapshots — Priority: LOW | Effort: MEDIUM
**What:** Allow students to take a "snapshot" of their successful reaction (3D view + stats) to share with teachers or peers.
**Why:** Encourages engagement and provides visual proof of work.
**Where in code:** `client/src/components/ResultModal.jsx`.
**How:** Use HTML-to-canvas or capture the Three.js canvas state when the result modal opens, providing a "Download Image" button.

### 9. Scenario-Based "Missions" UI — Priority: LOW | Effort: LARGE
**What:** A wrapper around standard experiments that frames them as real-world problems (e.g., "The local river is acidic, neutralize a sample").
**Why:** Gamification drives engagement in top competitors like Labster.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/Lab3D.jsx`.
**How:** Extend the `assignments` model to include "flavor text" and scenario descriptions, displaying them prominently when entering the lab.

### 10. Integrated Quiz/Knowledge Checks — Priority: LOW | Effort: LARGE
**What:** Pop-up multiple-choice questions during or immediately after an experiment before showing the result.
**Why:** Ensures students understand *why* a reaction happened, an expected feature for institutional software.
**Where in code:** `client/src/components/ResultModal.jsx` or a new component.
**How:** Interrupt the flow between clicking "Initiate" and seeing the result with a quick question fetched from a question bank related to the mixed chemicals.

## Quick Wins (< 1 day each)
1. **CSV Export for Experiment History:** Easily added to the existing history table using the currently loaded data.
2. **Contextual Chemical Tooltips:** Simple CSS/React additions to the existing slider cards to add immediate educational value.
3. **Virtual Safety Gear Check:** A fun, simple UI addition that instantly adds a layer of realistic lab procedure.
