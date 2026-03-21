# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js that allows students to safely conduct interactive 3D experiments and teachers to monitor them.
**Market:** Virtual Science Laboratory / EdTech (Chemistry Education)
**Date:** 2024-03-24
**Competitors Researched:** PraxiLabs, ChemCollective, VirtualChem Labs

## Executive Summary
The virtual chemistry lab market is transitioning from basic 2D simulators to immersive, curriculum-aligned 3D experiences. Top products differentiate themselves by offering robust learning aids, accessibility features, and deep teacher-student integrations. Alchemistry already has strong 3D visualization and basic role-based dashboards, but it lacks the contextual learning tools (like built-in lab manuals) and accessibility/export features that make its competitors classroom-ready at scale. Adding these features will bridge the gap between a visual simulator and a comprehensive educational platform.

## Competitor Analysis
*   **PraxiLabs:** Award-winning 3D virtual labs with a strong focus on student engagement and LMS integration. **Key Differentiator:** "Study Assistant" built into the lab, offering contextual information and multi-language support.
*   **ChemCollective:** A well-established, though older, 2D simulator. **Key Differentiator:** Strong emphasis on linking chemical computations with authentic laboratory chemistry, offering specific problem-solving scenarios and auto-graded activities.
*   **VirtualChem Labs:** Focuses on computational chemistry and molecular modeling. **Key Differentiator:** Real-world applications like drug design, expert workshops, and a strong community aspect.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Lab Manual / Experiment Guides:** Step-by-step instructions accessible directly within the lab interface.
*   **Data Export:** The ability for students to export experiment results (e.g., to CSV or PDF) for lab reports.

### Differentiating Opportunities (Stand-out features)
*   **Integrated Calculator/Notepad:** Tools within the lab view so students don't have to switch contexts to do stoichiometry calculations.
*   **Contextual Tooltips on Equipment:** Hovering over 3D equipment to see its name, purpose, and current state.

### UX Patterns (Design/interaction patterns common in top products)
*   **Split-Screen Interface:** Having the 3D lab on one side and the lab manual/data collection on the other.
*   **Guided Onboarding:** A quick interactive tutorial showing how to use the lab controls on first load.

## Prioritised Recommendations

### 1. Lab Manual / Experiment Guide Panel — Priority: HIGH | Effort: MEDIUM
**What:** A slide-out panel or modal within the 3D lab containing step-by-step instructions for specific experiments.
**Why:** Competitors like PraxiLabs provide structured learning paths. Without guides, students may aimlessly mix chemicals.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a new `LabManualPanel` component).
**How:** Create a toggleable panel that fetches experiment instructions from a new static data file or Supabase table, displaying steps and objectives alongside the 3D canvas.

### 2. Export Experiment Results to CSV — Priority: HIGH | Effort: SMALL
**What:** A button in the Result Modal and History page to download experiment data as a CSV file.
**Why:** Table stakes for educational tools. Students need to include data in their lab reports.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/history.jsx`.
**How:** Add an "Export to CSV" button that converts the `reactionResult` or log data array into CSV format and triggers a file download using standard browser APIs.

### 3. Integrated Lab Calculator — Priority: MEDIUM | Effort: SMALL
**What:** A simple, draggable calculator component available inside the lab view.
**Why:** Chemistry requires calculations (moles, molarity). Forcing students to leave the app breaks immersion.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a `FloatingCalculator` component).
**How:** Implement a basic React calculator component that can be toggled via an icon in the lab UI, perhaps using `framer-motion` for drag capabilities.

### 4. Interactive Equipment Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** 3D tooltips that appear when hovering over beakers, flasks, or chemicals in the 3D scene.
**Why:** Helps beginners identify equipment, matching the educational value of ChemCollective and PraxiLabs.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (and related 3D components).
**How:** Use `@react-three/drei`'s `Html` component to render HTML tooltips anchored to the 3D meshes on `pointerOver` events.

### 5. Guided Onboarding Tour — Priority: MEDIUM | Effort: MEDIUM
**What:** A one-time interactive tour highlighting the chemical rack, 3D canvas, and initiate button.
**Why:** Top products use onboarding to reduce friction. Our app relies on exploration, which can be daunting.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Integrate a library like `react-joyride` to walk new users through the UI elements, storing a `hasSeenTour` flag in `localStorage`.

### 6. Quick Reset / Undo Button — Priority: LOW | Effort: SMALL
**What:** A button to instantly empty the beaker without waiting for a reaction or a full page reload.
**Why:** Encourages experimentation by making mistakes cheap to fix.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a "Clear Beaker" button that calls the existing `reset` function from `useLabStore` and visually empties the 3D beaker.

### 7. Real-time Measurement Readouts — Priority: LOW | Effort: SMALL
**What:** Displaying the exact volume/mass of chemicals currently in the beaker, not just the slider percentages.
**Why:** Real labs require precise measurements, not just relative percentages.
**Where in code:** `client/src/pages/Lab3D.jsx` (UI overlay).
**How:** Map the percentage values (e.g., `chemA`) to realistic volume units (e.g., mL) and display them in a small overlay near the beaker.

### 8. Share Experiment Configuration — Priority: LOW | Effort: MEDIUM
**What:** A "Share" button that generates a URL containing the exact chemical mixture parameters.
**Why:** Allows teachers to send a specific starting state to students, or students to share findings.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Encode the slider values (`chemA`, `chemB`, etc.) into the URL query string and parse them on load to set the initial state.

### 9. Multi-language Support Framework — Priority: LOW | Effort: MEDIUM
**What:** Introduce a localization structure (e.g., using `react-i18next`) starting with the dashboard.
**Why:** Top-tier tools like PraxiLabs provide global reach; Alchemistry currently assumes English. Setting the foundation enables broader adoption.
**Where in code:** `client/src/App.jsx` and `client/src/pages/StudentDashboard.jsx`.
**How:** Wrap the application in an `I18nextProvider` and extract hardcoded English strings from `StudentDashboard.jsx` into a standard `en.json` file to establish the pattern.

### 10. Glossary of Terms — Priority: LOW | Effort: SMALL
**What:** A searchable list of chemistry terms and definitions accessible from the dashboard.
**Why:** Provides built-in reference material, similar to PraxiLabs' study assistants.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (Link to a new `Glossary.jsx` page).
**How:** Create a simple page or modal that renders definitions from a static JSON file.

## Quick Wins (< 1 day each)
1.  **Export Experiment Results to CSV:** High value for students writing reports, very quick to implement with a simple data mapping function.
2.  **Quick Reset / Undo Button:** The `reset` action already exists in the store; it just needs a dedicated UI button in the lab view.
3.  **Real-time Measurement Readouts:** A quick UI addition to map slider percentages to "mL" for a more authentic feel.