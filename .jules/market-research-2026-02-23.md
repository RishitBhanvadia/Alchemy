# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory.
**Market:** EdTech / Virtual Science Labs
**Date:** 2026-02-23
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual science lab market is mature, with leaders like Labster and PraxiLabs offering highly immersive, curriculum-aligned experiences with deep LMS integration and AI assistance. PhET dominates the free/accessible space with highly interactive, accessible simulations.

Alchemistry has a strong visual foundation with its 3D React Three Fiber implementation, but it currently functions more as a "sandbox" than a complete educational tool. To compete, it needs to bridge the gap between "simulation" and "coursework" by adding assessment, data portability (reporting), and structured guidance (onboarding). The lack of accessibility features also limits institutional adoption.

## Competitor Analysis
| Competitor | Key Strengths | UX Approach | Gap for Alchemistry |
| :--- | :--- | :--- | :--- |
| **Labster** | Story-driven, immersive 3D, automated grading. | High-fidelity, cinematic. | **Assessment & Grading:** Alchemistry lacks quizzes or graded outcomes. |
| **PraxiLabs** | AI Assistant ("Oxi"), Gamification, LMS Integration. | 3D, game-like, multilingual. | **Teacher Tools:** Alchemistry has no instructor view or data export. |
| **PhET** | Accessibility (A11y), Open-ended exploration, Free. | 2D/Pseudo-3D, intuitive drag-and-drop. | **Accessibility:** Alchemistry's 3D controls need keyboard/screen reader support. |

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Lab Reports/Data Export:** Students need to submit their work. Competitors allow exporting results to PDF or CSV. Alchemistry's `History` page is read-only.
*   **Onboarding/Tutorials:** Complex 3D interfaces require guidance. Competitors use step-by-step overlays. Alchemistry drops users directly into the lab.
*   **Accessibility:** WCAG compliance is mandatory for EdTech. Alchemistry has basic focus states but lacks semantic descriptions for 3D interactions.

### Differentiating Opportunities (Stand-out features)
*   **AI Lab Assistant:** PraxiLabs uses this well. A simple "Lab Assistant" chat or context-aware helper could differentiate Alchemistry from older, static simulations.
*   **Gamification:** Badges, streaks, or "Safety Scores" to encourage engagement.
*   **Safety Checklists:** A "Pre-lab Safety Quiz" adds realism and educational value.

### UX Patterns
*   **Guided Workflows:** Instead of open controls, competitors often "highlight" the next step (e.g., "Now pick up the beaker").
*   **Real-time Feedback:** Immediate visual cues when a reaction is successful or dangerous (Alchemistry does this well with color changes, but could add text feedback).

## Prioritised Recommendations

### 1. Export Experiment Data (CSV/PDF) — Priority: HIGH | Effort: SMALL
**What:** Add a "Download Report" button to the `History` page and `Result` modal.
**Why:** Students cannot use the tool for assignments without a way to submit evidence. All competitors offer this.
**Where in code:** `client/src/pages/history.jsx`, `client/src/pages/result.jsx`.
**How:** Use a library like `jspdf` or simple CSV string generation to export the `experiments` state array.

### 2. Guided Lab Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** An interactive tour for first-time users in the Lab module.
**Why:** 3D interfaces are overwhelming. Users need to know *how* to interact with the sliders and test tubes.
**Where in code:** `client/src/pages/lab.jsx`, new component `client/src/components/OnboardingTour.jsx`.
**How:** Use `react-joyride` or a simple state-driven overlay pointing to the "Chemical Rack" and "Initiate Button".

### 3. Accessibility Improvements (A11y) — Priority: HIGH | Effort: MEDIUM
**What:** Add `aria-labels`, `role="slider"`, and keyboard navigation support to chemical controls.
**Why:** Essential for compliance and inclusivity (PhET's key differentiator).
**Where in code:** `client/src/pages/lab.jsx`, `client/src/components/testtube.jsx`.
**How:** Ensure `<input type="range">` has descriptive labels. Add keyboard listeners to 3D interactive elements if possible.

### 4. Lab Safety Pre-Check — Priority: MEDIUM | Effort: SMALL
**What:** A modal before entering the Lab requiring users to "Put on Goggles" (click a checkbox) or answer a safety question.
**Why:** Adds educational realism and gamifies the start experience (like Labster).
**Where in code:** `client/src/pages/lab.jsx` (on mount).
**How:** A simple React Portal modal that blocks interaction until "Safety Checks" are passed.

### 5. Teacher/Admin Dashboard View — Priority: MEDIUM | Effort: MEDIUM
**What:** A toggle or separate view to see "Class Statistics" (mocked for now).
**Why:** Teachers are the buyers. They need to see that they *can* track student progress.
**Where in code:** `client/src/pages/Dashboard.jsx`.
**How:** Add a "Teacher Mode" toggle that switches the "History" card to a "Class Reports" card.

### 6. Gamification Badges — Priority: LOW | Effort: SMALL
**What:** Award badges for "First Reaction", "Perfect Titration", etc.
**Why:** Increases engagement (PraxiLabs strategy).
**Where in code:** `client/src/pages/result.jsx`, `client/src/pages/history.jsx`.
**How:** Store badges in `localStorage` or Supabase and display them on the Dashboard or History page.

### 7. "Lab Assistant" Helper — Priority: LOW | Effort: MEDIUM
**What:** A floating "Chat" or "Tip" widget that offers context-aware advice (e.g., "Try adding HCL first").
**Why:** Differentiator. Mimics PraxiLabs' "Oxi" without the full AI complexity initially.
**Where in code:** `client/src/components/LabAssistant.jsx`, included in `Lab.jsx`.
**How:** A component that watches `chemA`, `chemB` state and suggests moves if the user is idle.

### 8. Mobile Responsiveness for Sliders — Priority: MEDIUM | Effort: MEDIUM
**What:** Ensure chemical sliders and buttons are touch-friendly.
**Why:** Students often use tablets. 3D controls can be finicky.
**Where in code:** `client/src/pages/lab.css`.
**How:** Increase touch targets (min 44px) and verify `touch-action` CSS properties.

### 9. Real-time Text Feedback — Priority: LOW | Effort: SMALL
**What:** A "Log" or "Console" panel in the Lab showing "Added 10ml HCL", "Reaction Started", etc.
**Why:** Reinforces the scientific method and provides a text record of actions.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** A scrollable `div` that appends strings whenever `handleChemicalChange` is called.

### 10. High Contrast Mode — Priority: LOW | Effort: SMALL
**What:** A toggle to switch from the "Neon/Dark" theme to a "High Contrast/Light" theme.
**Why:** Accessibility for visually impaired users.
**Where in code:** `client/src/index.css` (CSS variables), `client/src/components/Navbar.jsx`.
**How:** Toggle a class on the `<body>` that overrides CSS variables.

## Quick Wins (< 1 day each)
1.  **Export Data (CSV):** Simple JS function on the History page.
2.  **Lab Safety Pre-Check:** Simple modal on Lab load.
3.  **Real-time Text Feedback:** Simple state array displaying logs in the Lab UI.
