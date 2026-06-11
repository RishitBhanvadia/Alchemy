# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory enabling students to conduct interactive chemistry experiments and teachers to monitor progress.
**Market:** High School & Higher Ed Virtual Science Labs (EdTech)
**Date:** 2026-06-11
**Competitors Researched:** Labster, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is dominated by tools focusing on high fidelity (Labster) or extreme accessibility and conceptual play (PhET). Alchemistry has a strong 3D foundation and built-in LMS features (dashboards). However, to reach parity with market leaders, it must improve accessibility features like data sonification, whilst adding curriculum alignment tools that drive educator adoption.

## Competitor Analysis
- **Labster:** High-fidelity 3D labs with strong curriculum alignment (AP Chem, NGSS) and detailed teacher tracking. Focuses heavily on realistic narrative-driven scenarios.
- **PhET:** Highly accessible, highly interactive 2D/3D physics and chemistry simulations. Focuses on core concepts, multi-language support, and sonification (audio feedback for data).

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Support for detailed result exporting (CSV/PDF) for student analytics.
- Built-in calculator/scratchpad during experiments.

### Differentiating Opportunities (Stand-out features)
- Sonification of data (audio cues mapped to changes in temperature or pH).
- Narrative-based mission objectives overlay.

### UX Patterns (Design/interaction patterns common in top products)
- Contextual tooltips explaining lab equipment upon first hover.
- Curriculum standard tags (e.g., "NGSS", "AP Chem") on assignment cards.

## Prioritised Recommendations

### 1. Curriculum Standard Tags — Priority: HIGH | Effort: SMALL
**What:** Add tags like "AP Chem" or "General Chem I" to lab modules.
**Why:** Teachers search for and adopt tools based on standards alignment (as seen in Labster).
**Where in code:** `MODULE_CARDS` in `client/src/pages/StudentDashboard.jsx`.
**How:** Add a `tags` array to the module data structures and render them as small pill badges on the UI cards.

### 2. Export Results to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow teachers to download analytics.
**Why:** Standard LMS requirement; teachers need offline records for grading.
**Where in code:** `client/src/components/StudentAnalyticsChart.jsx`.
**How:** Add an `ExportButton` component that allows downloading the chart's source data in CSV format using a basic blob download.

### 3. Data Sonification for Reactions — Priority: MEDIUM | Effort: MEDIUM
**What:** Play changing audio tones based on temperature or pH shifts during reactions.
**Why:** Major accessibility feature popularized by PhET; helps visually impaired students and adds multi-sensory feedback.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Add a `useAudioFeedback` hook that maps `temperature` to Web Audio API oscillator frequency.

### 4. Interactive Contextual Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** "First-time use" popovers explaining what 3D objects (beakers, flasks) do.
**Why:** Reduces cognitive load and onboarding time.
**Where in code:** `client/src/components/Beaker.jsx` and `client/src/components/Flask.jsx`.
**How:** Wrap 3D elements in `@react-three/drei`'s `Html` component conditionally rendered if a `hasSeenTutorial` flag in `localStorage` is false.

### 5. In-Lab Scratchpad/Calculator — Priority: MEDIUM | Effort: SMALL
**What:** A slide-out panel for students to take notes or calculate molarity without leaving the 3D lab.
**Why:** Prevents context switching and tab-jumping during complex titration or stoichiometry tasks.
**Where in code:** `client/src/pages/Lab3D.jsx` alongside the `AiTutorPanel`.
**How:** Create a `ScratchpadPanel.jsx` component overlay with a simple `<textarea>` and calculator UI, saving state to `localStorage`.

### 6. Multi-Language Support Foundation — Priority: LOW | Effort: MEDIUM
**What:** Externalize text strings for future translation.
**Why:** Expanding to global markets requires i18n, a major feature of PhET.
**Where in code:** Throughout `client/src/components/Navbar.jsx` and `client/src/pages/StudentDashboard.jsx`.
**How:** Introduce `react-i18next` and move hardcoded strings to a JSON translation file.

### 7. Reaction Safety Warnings — Priority: LOW | Effort: SMALL
**What:** Pre-experiment safety warnings for specific hazardous virtual combinations.
**Why:** Reinforces real-world lab safety protocols.
**Where in code:** `client/src/store/labStore.js` `initiateReaction` method.
**How:** Add an alert or warning modal state if specific chemical combinations are selected before initiating the reaction.

### 8. "Reset to Default" Quick Button — Priority: MEDIUM | Effort: SMALL
**What:** A one-click button to reset all chemicals and temperature.
**Why:** Users often make mistakes and want to restart quickly without refreshing the page.
**Where in code:** `client/src/pages/Lab3D.jsx` UI overlay.
**How:** Add a button that resets relevant store values and clears the 3D visual state.

## Quick Wins (< 1 day each)
1. Add Curriculum Standard Tags to modules.
2. Implement Export to CSV for history and analytics.
3. Add a "Reset to Default" quick button in the 3D Lab.
