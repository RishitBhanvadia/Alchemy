# Market Research Report
**App:** A React and Three.js-based virtual chemistry laboratory enabling students to conduct safe, interactive experiments in a 3D environment.
**Market:** Virtual Chemistry Laboratories / STEM Education Software
**Date:** 2026-04-11
**Competitors Researched:** Labster, ChemCollective, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is evolving from basic visual simulations to comprehensive pedagogical platforms. Top competitors succeed by combining engaging visuals with robust post-lab analysis tools, safety protocols, and gamified learning elements. Alchemistry has a strong foundation with its 3D environment (React Three Fiber) and role-based access, but currently lacks the data export features and interactive safety elements expected in the market. Implementing data export, a real-time thermometer, and a pre-lab safety checklist represent the highest impact opportunities to elevate Alchemistry's educational value.

## Competitor Analysis
- **Labster:** The market leader, offering highly immersive, gamified 3D simulations with strong narrative elements and real-world scenarios. They report up to a 20% improvement in student test scores. Key differentiator: Story-driven labs and comprehensive pre/post-lab quizzes.
- **ChemCollective:** Focused on aqueous chemistry and problem-solving. Provides a highly customizable "Stockroom Explorer" and workbench where students can design their own experiments. Key differentiator: Open-ended, inquiry-based problem solving and extensive data collection tools.
- **PhET Interactive Simulations:** Provides clean, accessible 2D simulations focusing on specific concepts (e.g., atomic interactions, states of matter). Key differentiator: "Make the invisible visible" approach with highly visual, interactive representations of atomic-level phenomena and sensor readouts.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Data Export:** Competitors allow students to export experimental data for lab reports. Alchemistry's `historyStore` logs experiments but cannot export them.
- **Safety Protocols:** Virtual labs typically include simulated safety gear (goggles, gloves) to reinforce real-world habits. Alchemistry currently lacks pre-lab safety checks.
- **Detailed Sensor Readouts:** Competitors use thermometers, pH meters, and pressure gauges to quantify reactions. Alchemistry has a `useTemperature` hook but lacks an on-screen visual thermometer component.

### Differentiating Opportunities (Stand-out features)
- **Open-Ended Sandbox:** While Alchemistry has predefined reactions, expanding to a ChemCollective-style "Stockroom" where students can mix any available chemical would encourage inquiry-based learning.
- **Contextual Tooltips:** Context-aware hints based on the student's current action (e.g., "Mix acid and base slowly") improve the onboarding experience.

### UX Patterns (Design/interaction patterns common in top products)
- **Interactive Workbenches:** Drag-and-drop mechanics for glassware and chemicals (vs. just sliders).
- **Gamified Feedback:** Immediate visual or auditory feedback upon completing an objective, similar to Labster's progression system.

## Prioritised Recommendations

### 1. CSV Data Export for Lab Reports — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to export experiment history.
**Why:** Table stakes for educational tools; allows students to write lab reports based on virtual data.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`
**How:** Add a utility function that converts the `logs` array in `historyStore.js` to CSV format and triggers a download. Add an ExportButton component.

### 2. Real-time Visual Thermometer — Priority: HIGH | Effort: MEDIUM
**What:** Add a UI overlay displaying the current temperature.
**Why:** PhET and others make invisible changes visible. A thermometer makes exothermic/endothermic reactions quantifiable.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/hooks/useTemperature.js`
**How:** Create a `Thermometer.jsx` UI component that subscribes to the `temperature` and `thermalState` values from `useTemperature.js` and updates a visual bar.

### 3. Pre-Lab Safety Checklist — Priority: MEDIUM | Effort: SMALL
**What:** A modal requiring students to "equip" virtual safety goggles and gloves before entering the 3D lab.
**Why:** Reinforces real-world lab safety habits, a common feature in Labster.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `SafetyModal.jsx` component that displays on initial load. The student must click toggles to "wear" PPE before the `isInitialLoading` state resolves.

### 4. Interactive Stockroom / Reagent Shelf — Priority: MEDIUM | Effort: LARGE
**What:** Replace the current slider controls with a visual shelf of chemical bottles that can be dragged to the workbench.
**Why:** Mimics ChemCollective's successful UX pattern, making the simulation feel more like a real lab than a calculator.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Create a UI overlay or 3D shelf component. Use React DnD or Three.js raycasting to allow drag-and-drop selection of chemicals (updating `chemA`, `chemB`, etc. in `labStore.js`).

### 5. Contextual Learning Prompts (Tooltips) — Priority: MEDIUM | Effort: SMALL
**What:** Dynamic tooltips that appear when hovering over chemicals, explaining their properties or hazards.
**Why:** Provides just-in-time learning without overwhelming the user, standard in educational software.
**Where in code:** `client/src/components/AiTutorPanel.jsx` (could be expanded) or `client/src/pages/Lab3D.jsx`
**How:** Add `title` or custom tooltip attributes to the chemical sliders in `Lab3D.jsx` containing brief facts about HCl, NaOH, etc.

### 6. Gamified Achievement Badges — Priority: LOW | Effort: MEDIUM
**What:** Award badges for milestones (e.g., "First Reaction", "Perfect Neutralization").
**Why:** Increases student engagement, similar to Labster's gamified progression.
**Where in code:** `client/src/store/profileStore.js` and `client/src/pages/StudentDashboard.jsx`
**How:** Extend the Supabase `profiles` schema to track achievements. Update `StudentDashboard.jsx` to render earned badges.

### 7. Teacher Dashboard: Class Aggregate Analytics — Priority: MEDIUM | Effort: MEDIUM
**What:** Add a view showing the average score or common failure points for the entire class on a specific assignment.
**Why:** Teachers need actionable insights to adjust lesson plans, a key selling point for B2B educational software.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Create a new query in `supabaseClient.js` to aggregate `assignment_progress` across a `classroom_id`.

### 8. pH Indicator Visualizer — Priority: LOW | Effort: MEDIUM
**What:** An on-screen pH scale that highlights the current estimated pH based on the chemical mixture.
**Why:** Helps students correlate visual color changes (like BTB) with numerical pH values.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `pHScale.jsx` component that uses the `chemA` (acid) and `chemB` (base) values from `labStore.js` to estimate and display the current pH.

### 9. Shareable Experiment Links — Priority: LOW | Effort: SMALL
**What:** Allow students to share the specific outcome of their experiment via a URL parameter.
**Why:** Encourages collaboration and allows teachers to easily review specific student results.
**Where in code:** `client/src/pages/result.jsx` (or `ResultModal.jsx`)
**How:** Add a "Copy Link" button that encodes the reaction parameters (e.g., `?acid=50&base=50`) into the URL.

### 10. Built-in Glossary / Encyclopedia — Priority: LOW | Effort: MEDIUM
**What:** A searchable database of chemical terms and safety symbols accessible within the lab.
**Why:** Prevents students from needing to leave the app to look up terms.
**Where in code:** `client/src/components/Sidebar.jsx` or a new standalone modal.
**How:** Create a static JSON file with terms and definitions. Add a UI component to search and display them.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** Extremely fast to implement using standard browser APIs, high value for lab reports.
2. **Contextual Tooltips:** Can be added immediately to the existing slider controls using standard HTML attributes or a simple React wrapper.
3. **Pre-Lab Safety Checklist:** A simple React modal blocking entry until checkboxes are clicked.
