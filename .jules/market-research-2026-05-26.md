# Market Research Report
**App:** Alchemistry is a web-based interactive 3D virtual chemistry laboratory, built with React and Three.js, that enables students to conduct safe simulated experiments (organic, inorganic, titration) and provides teachers with analytics.
**Market:** Virtual Science Laboratory & EdTech Simulation
**Date:** 2026-05-26
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual science lab market is driven by the need for accessible, safe, and cost-effective alternatives to physical labs. Top competitors focus on immersive 3D simulations (Labster, PraxiLabs) or highly interactive, concept-focused 2D simulations (PhET). The standout features across the market emphasize robust institutional tools (LMS integration, data export, custom quizzes) and high student engagement (game-like experiences, AI assistants, multilingual support). Alchemistry has a strong foundation with its 3D environment and basic AI tutor, but has clear opportunities to enhance its teacher analytics, assessment capabilities, and accessibility.

## Competitor Analysis
- **Labster:** A leader in immersive 3D virtual labs for higher ed and high schools. Differentiates with a massive library of experiments, storyline-driven game mechanics, and deep LMS integrations.
- **PraxiLabs:** Focuses on realistic 3D interaction with built-in AI assistants ("Oxi"), detailed performance analytics, custom quiz builders, and bilingual support.
- **PhET Interactive Simulations:** Provides free, highly interactive, and intuitive math and science simulations. Differentiates with research-backed design, focusing on making invisible concepts visible without complex 3D environments, and extreme accessibility.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Data Export for Teachers: Competitors provide easy ways to export grades and analytics for use in other systems (LMS or Excel).
- Pre/Post Lab Assessments: Built-in quizzes to test knowledge before and after the practical simulation.
- Walkthrough/Tutorial Overlays: Guided step-by-step onboarding for first-time users in complex 3D scenes.

### Differentiating Opportunities (Stand-out features)
- Gamification & Progression: Awarding badges, XP, or unlocking experiments as students progress.
- Multi-Language Support: Offering UI and instructions in multiple languages to expand accessibility.

### UX Patterns (Design/interaction patterns common in top products)
- Contextual Tooltips: Brief hints that appear near UI elements.
- Always-Accessible Lab Manuals: A sidebar or modal that holds theory and instructions during the experiment.

## Prioritised Recommendations

### 1. CSV Data Export for Analytics — Priority: HIGH | Effort: SMALL
**What:** Add a button to export student experiment results as a CSV file.
**Why:** Data export is table stakes for teachers who need to input grades into their school's LMS.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an "Export CSV" button near the "Score Analytics" header. Use the existing `experimentScores` array and a simple function to generate a CSV blob and trigger a download.

### 2. Pre-experiment Safety/Knowledge Quiz — Priority: HIGH | Effort: MEDIUM
**What:** A short 3-question modal before starting an experiment.
**Why:** Top platforms like PraxiLabs integrate assessments directly with experiments to verify understanding before practice.
**Where in code:** `client/src/pages/Lab3D.jsx` (or individual lab pages)
**How:** Create a `PreLabQuizModal` component that triggers on component mount or before the "Initiate Reaction" button becomes active.

### 3. Lab Manual Sidebar Overlay — Priority: MEDIUM | Effort: SMALL
**What:** A collapsible sidebar containing theory and instructions for the current experiment.
**Why:** Students need reference material during the simulation without leaving the 3D view.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Create a `LabManualSidebar` component similar to the existing `AiTutorPanel`. Populate it with static markdown or text based on the experiment type.

### 4. Interactive First-Time Tutorial — Priority: MEDIUM | Effort: MEDIUM
**What:** A guided tour highlighting the sliders, action button, and 3D view.
**Why:** 3D interfaces can be confusing. Walkthroughs are a standard UX pattern in complex edtech tools.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a lightweight tour using a library like `react-joyride` or custom state (`tourStep`), using existing refs for the slider cards and the initiate button.

### 5. Multi-Language (i18n) Support — Priority: MEDIUM | Effort: LARGE
**What:** Infrastructure to translate the UI.
**Why:** PraxiLabs and PhET heavily market their multilingual capabilities.
**Where in code:** Entire `client/src/` (wrapping text in a translation hook)
**How:** Install `react-i18next`, create a translation JSON for English and Spanish, and add a language toggle to the `Navbar`.

### 6. Gamification: XP & Badges System — Priority: LOW | Effort: MEDIUM
**What:** Visual rewards for successful experiments.
**Why:** Game-like experiences increase student engagement and retention.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and backend user profile.
**How:** Add `xp` and `badges` columns to the user profile. Update the `SuccessCelebration` component to display XP gained, and show total XP on the dashboard.

### 7. Pause/Resume Functionality — Priority: LOW | Effort: LARGE
**What:** Ability to save experiment state and return later.
**Why:** Flexibility for students who run out of time during a class period.
**Where in code:** `client/src/pages/Lab3D.jsx` and backend experiment state.
**How:** Add a "Save State" button that serializes `chemA`, `chemB`, etc., and saves to the database. Add a "Resume" option on the dashboard.

### 8. Contextual Tooltips on Hover — Priority: MEDIUM | Effort: SMALL
**What:** Info boxes when hovering over chemical names.
**Why:** Immediate clarification of terms without needing to ask the AI.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Wrap the `.chem-name` elements in a reusable `Tooltip` component that displays the chemical formula and a brief safety note.

### 9. Custom Experiment Settings for Teachers — Priority: LOW | Effort: MEDIUM
**What:** Allow teachers to hide/show specific chemicals or change thresholds.
**Why:** Teachers want control over the curriculum.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and backend.
**How:** Create a "Settings" tab in the classroom detail view to update JSON configuration for the lab.

### 10. Student Progress Progress Bar — Priority: LOW | Effort: SMALL
**What:** Visual indicator of completed experiments vs total available.
**Why:** Gamified motivation for students.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Calculate completed distinct experiments divided by total known experiments, and display a progress bar in the dashboard header.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** Just a few lines of JavaScript to download the existing data array.
2. **Contextual Tooltips:** Add standard CSS/React tooltips to chemical names.
3. **Student Progress Bar:** A simple visual UI addition to the student dashboard based on existing data.
