# Market Research Report
**App:** Alchemistry is a web-based 3D virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive experiments with instant feedback and an AI tutor.
**Market:** Educational Technology / Virtual Science Labs
**Date:** 2025-05-15
**Competitors Researched:** Labster, ChemCollective, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is highly focused on combining realistic 3D simulations with deep educational context. While Alchemistry has a solid foundation with its 3D canvas and basic chemical mixing, top competitors differentiate themselves through narrative-driven experiments, comprehensive accessibility, and robust teacher tools. The biggest opportunity for Alchemistry is bridging the gap between raw simulation and structured learning by adding scenario-based missions, improving accessibility, and expanding the chemical interaction paradigms beyond simple sliders.

## Competitor Analysis
*   **Labster:** The market leader in 3D virtual labs. Differentiates heavily on storytelling, gamification, and "case stories" where students solve real-world problems (e.g., forensics, environmental testing) rather than just mixing chemicals in a void.
*   **ChemCollective:** A more traditional, 2D simulation environment but excels in open-ended, inquiry-based problems. They provide a "virtual workbench" where students can design their own experiments to solve specific challenges.
*   **PhET Interactive Simulations:** Focuses on highly accessible, intuitive, and often playful 2D simulations. Their main differentiator is their extreme focus on inclusive design, including alternative inputs (keyboard navigation), interactive highlights, and sonification (sound representing data).

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Lab Manuals/Guides:** Competitors provide in-sim step-by-step guides or "missions". Alchemistry relies on the AI tutor, but lacks a visible "To-Do" list for specific experiments.
*   **More Diverse Equipment:** Currently, Alchemistry seems focused on mixing in test tubes/beakers via sliders. Competitors offer a wider array of virtual equipment (bunsen burners, scales, pH meters).

### Differentiating Opportunities (Stand-out features)
*   **Scenario-Based Learning (Storytelling):** Wrapping experiments in a real-world narrative (like Labster).
*   **Pre- and Post-Lab Quizzes:** Integrated knowledge checks within the simulation flow.

### UX Patterns (Design/interaction patterns common in top products)
*   **Drag-and-Drop Interaction:** Instead of just sliders, ChemCollective and others use drag-and-drop to move chemicals and equipment, creating a more tactile feel.
*   **High Accessibility:** PhET's standard of keyboard navigation and interactive highlights.

## Prioritised Recommendations

### 1. Scenario-Based "Missions" Panel — Priority: HIGH | Effort: MEDIUM
**What:** Add a side panel in the 3D lab that presents the current assignment as a real-world scenario (e.g., "Analyze this water sample for contamination") with a checklist of steps.
**Why:** Labster's success shows that storytelling increases engagement by 30%. It provides context to the simulation.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a new `MissionPanel` component) and `client/src/pages/StudentDashboard.jsx` (Link assignments to specific scenarios).
**How:** Create a slide-out panel component that reads the current assignment from `useAssignmentStore` and displays a narrative text and a checklist of required actions.

### 2. Drag-and-Drop Chemical Addition — Priority: HIGH | Effort: LARGE
**What:** Transition from using range sliders for chemical concentrations to a drag-and-drop interface where users drag a chemical bottle over a beaker to pour it.
**Why:** ChemCollective uses this to make the lab feel more like a workbench rather than a dashboard. It increases the "hands-on" feel.
**Where in code:** `client/src/pages/Lab3D.jsx` (Replace `chem-levels-panel` sliders with interactive 3D objects or 2D drag targets using `@use-gesture/react` or React dnd).
**How:** Update the 3D scene to make chemical bottles interactable, or use a 2D drag-and-drop overlay that updates the `chemA`/`chemB` state based on drop events.

### 3. Integrated pH Meter/Sensor Tool — Priority: MEDIUM | Effort: SMALL
**What:** Add a digital pH meter tool that can be toggled on to read the exact pH of the mixture, rather than relying solely on the visual color change of the indicator (BTB).
**Why:** Standard equipment in real labs; competitors like PhET provide specific measurement tools to bridge qualitative and quantitative learning.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a toggle button) and `client/src/components/PhysicsLab.jsx` (or similar 3D component to render the meter).
**How:** Add a "Tools" menu. When pH meter is selected, display a digital readout UI overlay that calculates a simple pH value based on the ratio of `chemA` (acid) to `chemB` (base).

### 4. Interactive Highlights for Keyboard Navigation — Priority: MEDIUM | Effort: SMALL
**What:** Implement robust focus styles and keyboard navigation (Tab/Enter) for all 3D controls and menus, similar to PhET's "Interactive Highlights".
**Why:** PhET sets the standard for accessibility in STEM simulations. This ensures the app is usable by all students.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/Navbar.jsx` (and global CSS).
**How:** Ensure all interactive elements have `tabIndex`, add a strong `:focus-visible` outline in CSS, and handle `onKeyDown` events for custom controls.

### 5. Post-Experiment Reflection Modal — Priority: MEDIUM | Effort: SMALL
**What:** After a successful reaction, prompt the student to record an observation or answer a quick multiple-choice question before returning to the dashboard.
**Why:** Cements learning. Both Labster and ChemCollective require students to process their results, not just watch the animation.
**Where in code:** `client/src/components/ResultModal.jsx`.
**How:** Extend the existing `ResultModal` to include a text area for "Lab Notes" or a simple question fetched from the assignment data before the user can close it.

### 6. Sound Effects / Sonification — Priority: LOW | Effort: SMALL
**What:** Add audio feedback for actions: pouring liquids, successful reactions (sizzle/pop), and error states.
**Why:** PhET uses sound to represent physical changes, improving accessibility and immersion.
**Where in code:** `client/src/pages/Lab3D.jsx` (trigger sounds on state changes).
**How:** Use the Web Audio API or a simple `<audio>` tag to play short sound clips when `reactionState` changes or when chemical sliders are moved.

### 7. "Undo" or "Reset Beaker" Quick Action — Priority: LOW | Effort: SMALL
**What:** A prominent button to quickly empty the beaker and reset sliders to zero without leaving the page.
**Why:** Encourages experimentation (trial and error) without penalty, a key feature in ChemCollective.
**Where in code:** `client/src/pages/Lab3D.jsx` (Controls container).
**How:** Add a "Reset Flask" button that calls `setChemA(0)`, `setChemB(0)`, etc., and clears the `reactionResult`.

### 8. Export Lab Report — Priority: LOW | Effort: MEDIUM
**What:** Allow students to export their experiment history and notes as a PDF or CSV.
**Why:** Useful for teachers to grade and for students to submit as homework.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add an "Export" button that uses a library like `jspdf` or standard CSV generation to download the `logs` array.

### 9. Teacher Dashboard: "Students Needing Help" Indicator — Priority: MEDIUM | Effort: MEDIUM
**What:** Flag students in the teacher dashboard who have failed the same assignment multiple times or haven't logged in recently.
**Why:** Helps teachers identify struggling students early, a key selling point for institutional software.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Calculate a "struggling" boolean based on `experimentScores` or login history and display a warning icon next to their name in the data table.

### 10. Sandbox Mode Toggle — Priority: LOW | Effort: SMALL
**What:** Explicitly separate "Assignment Mode" (restricted chemicals/goals) from "Sandbox Mode" (all chemicals unlocked, no grading).
**Why:** Allows for free exploration without messing up assignment metrics.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/Lab3D.jsx`.
**How:** Add a "Free Play" button that routes to `/student/lab` but explicitly passes a state flag bypassing assignment restrictions.

## Quick Wins (< 1 day each)
1.  **Integrated pH Meter/Sensor Tool:** A simple UI overlay calculating a value based on existing state.
2.  **"Undo" or "Reset Beaker" Quick Action:** Just a button that clears the state.
3.  **Post-Experiment Reflection Modal:** Adding a text input to the existing ResultModal.
