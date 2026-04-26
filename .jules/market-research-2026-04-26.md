# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js, enabling students to safely conduct interactive 3D experiments with real-time feedback and an AI tutor.
**Market:** EdTech - Virtual Science Labs & STEM Education Simulations
**Date:** 2026-04-26
**Competitors Researched:** Labster, PhET Interactive Simulations, Unreal Chemist

## Executive Summary
The virtual chemistry lab market focuses heavily on realism, safety preparation, and integration with educational curricula. Top products emphasize not just mixing chemicals, but understanding the underlying physical properties (pH, temperature) and documenting outcomes. Alchemistry has a strong foundation with its 3D environment and AI tutor, but lacks detailed real-time telemetry, gamified safety protocols, and robust export tools for lab reports. Implementing these table-stakes features and UX patterns will elevate Alchemistry from a sandbox to a comprehensive learning platform.

## Competitor Analysis
*   **Labster:** The market leader, known for immersive, gamified 3D simulations that embed quizzes, safety procedures, and storytelling into the lab experience.
*   **PhET Interactive Simulations:** A widely used, free platform that focuses on clear, interactive visualisations of specific scientific concepts (e.g., pH scales, molecular structures) rather than full 3D lab recreations.
*   **Unreal Chemist:** A mobile-first app offering extensive chemical mixing combinations (400+ chemicals), real-time monitoring of pH and temperature, and a "mad scientist" mode for unconstrained experimentation.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Real-time Sensor Data:** Competitors (like Unreal Chemist) display dynamic metrics such as pH, temperature, and solubility as chemicals mix. Alchemistry only shows concentration percentages.
*   **Exportable Lab Reports:** Educational tools require students to submit findings. Competitors offer CSV or PDF exports of experiment history, whereas Alchemistry only has a viewable table (`history.jsx`).

### Differentiating Opportunities (Stand-out features)
*   **Pre-Lab Safety Protocols:** Labster requires students to equip virtual safety gear (goggles, gloves) before interacting with hazardous materials. This reinforces real-world lab habits.
*   **Contextual Molecular View:** While Alchemistry shows macro-level reactions, PhET excels at showing the molecular/atomic level changes during a reaction.

### UX Patterns (Design/interaction patterns common in top products)
*   **Data Tooltips:** Interactive elements (like beakers or flasks) show hover-tooltips with current chemical composition and state.

## Prioritised Recommendations

### 1. Real-Time Telemetry Display (pH & Temperature) — Priority: HIGH | Effort: MEDIUM
**What:** Add a persistent UI panel in the 3D lab showing real-time estimated pH and temperature based on the current mixture.
**Why:** Expected in all top virtual labs (Unreal Chemist, Labster) to teach the *why* of reactions, not just the visual *what*.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`.
**How:** Create a new `TelemetryPanel` component that reads `chemA`, `chemB`, `chemI`, `chemC` from `useLabStore` and calculates an estimated pH/Temp, displaying it alongside the chemical sliders.

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the History page.
**Why:** A table-stakes feature for educational platforms allowing students to use data in external spreadsheet tools or submit to LMS.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add a new button above the history table. Use an `onClick` handler that converts `logs` array to CSV format and triggers a file download using a `Blob`.

### 3. Pre-Experiment Safety Verification — Priority: MEDIUM | Effort: SMALL
**What:** A simple modal requiring students to "Equip Safety Goggles and Gloves" before the lab controls become active.
**Why:** Differentiating feature inspired by Labster that reinforces real-world safety procedures, highly valued by educators.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a `SafetyCheckModal` component that blocks interaction with the `slider-grid` until the user clicks an "Acknowledge Safety Procedures" button. Store the acknowledged state locally.

### 4. Interactive Beaker Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Display a floating label over the 3D beaker showing its current total volume and primary contents.
**Why:** Common UX pattern to provide immediate context without looking away from the 3D scene.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (or `Beaker.jsx`).
**How:** Use `@react-three/drei`'s `Html` component attached to the Beaker mesh to render a small CSS tooltip that updates based on store values.

### 5. "Mad Scientist" Sandbox Toggle — Priority: LOW | Effort: SMALL
**What:** Add a toggle in the UI that removes classroom restrictions (if any) and allows mixing all available chemicals for unpredictable results.
**Why:** Inspired by Unreal Chemist; encourages unconstrained exploration outside of assignments.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`.
**How:** Add a "Sandbox Mode" toggle that bypasses the `lockedChems` filter fetched from classroom settings.

## Quick Wins (< 1 day each)
1.  **Export Experiment History to CSV:** ~30 lines of code in `history.jsx`.
2.  **Pre-Experiment Safety Verification:** Simple modal in `Lab3D.jsx`.
3.  **"Mad Scientist" Sandbox Toggle:** Easy UI switch and conditional logic bypass.
