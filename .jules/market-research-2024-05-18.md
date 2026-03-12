# Market Research Report
**App:** A modern, web-based 3D virtual chemistry laboratory for students, featuring organic, inorganic, titration, and physics experiments with real-time feedback and progress tracking.
**Market:** Educational Technology (Virtual Labs / Science Simulators)
**Date:** 2024-05-18
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz, PhET, ChemCollective

## Executive Summary
The virtual chemistry lab market is transitioning from basic 2D interactive tools to fully immersive, gamified 3D environments that emphasise pedagogical guidance over open-ended play. While our application features strong technical foundations with 3D Canvas integration and diverse experiment types, it lacks the guided learning and safety-oriented feedback loop that leading competitors offer. The biggest opportunity lies in introducing an "AI Tutor" / contextual hint system and strict safety protocols that mimic real-world lab environments, which are highly demanded by educational institutions for student assessment.

## Competitor Analysis
* **Labster:** Market leader focusing on high-end, immersive 3D simulations. Differentiators: Built-in pedagogical storytelling, comprehensive LMS integration, and detailed performance analytics tracking every student click.
* **PraxiLabs:** Rapidly growing competitor. Differentiators: "Oxi" virtual AI assistant offering real-time hints, custom quiz builder linked to specific experiments, and strong gamification elements to keep students engaged.
* **ChemCollective:** Older but widely used platform. Differentiators: Strong focus on inquiry-based, open-ended problem solving and pre/post-lab assignments.
* **Beyond Labz & PhET:** Strong in accurate physical modeling, often used as supplemental material rather than a full curriculum replacement.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
* **Lab Safety Simulator:** Competitors strictly enforce PPE (goggles, gloves) before entering the lab. Our app has no concept of safety violations.
* **Detailed Analytics & Export:** Instructors expect to download comprehensive session reports. Currently, our app only saves a basic `score` to Supabase without an export function.
* **Pre/Post-Lab Quizzes:** Expected in educational settings to test comprehension before and after the practical simulation.

### Differentiating Opportunities (Stand-out features)
* **Virtual Assistant/Tutor:** A contextual, on-screen helper (like PraxiLabs' Oxi) that gives hints when a student is stuck during an experiment (e.g., in `titration.jsx` when they over-titrate).
* **Consequences for Mistakes:** Instead of just disabling buttons or showing a "wrong" text, showing a visual consequence (e.g., beaker shattering, safe explosion animation) significantly improves engagement.

### UX Patterns (Design/interaction patterns common in top products)
* **Guided vs. Open Mode:** Top products offer both a strict "Guided Mode" (step-by-step instructions) and an "Exploration Mode." Our app only offers an open mode.
* **In-Lab Manual:** A floating or slide-out drawer containing the chemistry manual, rather than requiring students to have a physical copy or open a new tab.

## Prioritised Recommendations

### 1. Lab Safety Protocol Check (PPE) — Priority: HIGH | Effort: SMALL
**What:** A required safety checklist modal before starting any experiment.
**Why:** Table stakes for educational virtual labs. Teaches critical real-world lab discipline.
**Where in code:** `client/src/pages/Dashboard.jsx` (before routing) or as a wrapper component in `Lab3D.jsx` / `titration.jsx`.
**How:** Create a `SafetyModal` component requiring users to click "Put on Goggles" and "Put on Gloves" before the "Enter Lab" button activates.

### 2. Contextual Lab Assistant (Tutor) — Priority: HIGH | Effort: MEDIUM
**What:** A floating assistant icon that provides context-aware hints based on the current experiment state.
**Why:** Prevents students from getting stuck and abandoning the simulation, matching PraxiLabs' "Oxi" feature.
**Where in code:** New component `client/src/components/LabAssistant.jsx`, integrated into `titration.jsx` and `Lab3D.jsx`.
**How:** Pass the current state (e.g., `count` in titration, or `chemA` in Lab3D) to the Assistant, which renders a speech bubble with a hint if the user is inactive for >30 seconds or makes a mistake.

### 3. PDF/CSV Report Export — Priority: MEDIUM | Effort: SMALL
**What:** A button to export the user's experiment history.
**Why:** Teachers need to collect grades and proof of work.
**Where in code:** `client/src/pages/history.jsx` (assuming this exists based on routing).
**How:** Add a "Download Report" button that uses `jspdf` or simply creates a CSV blob from the fetched `experiment_results` data.

### 4. Interactive Lab Manual Drawer — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out panel containing the theoretical background and steps for the current experiment.
**Why:** Keeps students inside the immersive environment instead of switching tabs or looking at physical books (e.g., fixing the hardcoded "Refer Your Chemistry Lab Manual Page - 51" in `inorganic.jsx`).
**Where in code:** `client/src/components/LabManual.jsx` (new) added to `inorganic.jsx`, `organic.jsx`, etc.
**How:** A right-aligned sliding drawer toggled by a "Manual" button in the `Navbar` or screen edge.

### 5. Gamified Badges / Achievements — Priority: MEDIUM | Effort: SMALL
**What:** Visual badges awarded for specific accomplishments (e.g., "Perfect Titration", "Safety First").
**Why:** Increases student retention and engagement.
**Where in code:** `client/src/pages/Profile.jsx` and `client/src/pages/titration.jsx` (on success).
**How:** Add an `achievements` array column to the Supabase user profile. Display these as glowing icons on the Profile page.

### 6. Visual Consequences for Errors — Priority: LOW | Effort: LARGE
**What:** Visual/audio feedback when dangerous chemicals are mixed incorrectly (e.g., in `Lab3D.jsx`).
**Why:** Highly memorable learning experience; safe environment to fail.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `client/src/pages/Lab3D.jsx`.
**How:** If incompatible chemicals are mixed, trigger a GSAP screen shake animation, a warning sound, and reset the beaker.

### 7. Step-by-Step Guided Mode — Priority: LOW | Effort: LARGE
**What:** An optional mode that highlights the exact next button/element to click.
**Why:** Reduces cognitive overload for beginner students.
**Where in code:** Across all experiment pages (`titration.jsx`, `lab.jsx`, etc.).
**How:** A global context `useGuidedMode()` that applies a glowing CSS pulse to the next required interactive element based on a predefined step sequence.

### 8. Pre-Experiment Knowledge Check — Priority: LOW | Effort: MEDIUM
**What:** A quick 3-question quiz before allowing the user to start the titration or inorganic analysis.
**Why:** Ensures students understand the theory before playing with the simulation.
**Where in code:** Intercept route in `App.jsx` or display modal on load in `titration.jsx`.
**How:** A simple React modal with multiple-choice questions fetched from a static JSON file.

### 9. Dark/Light Mode Toggle — Priority: LOW | Effort: SMALL
**What:** While the current dark neon theme is great, educational accessibility standards often require high-contrast light modes.
**Why:** Broadens accessibility and institutional compliance.
**Where in code:** `client/src/app.css` and a toggle in `Navbar.jsx`.
**How:** Use CSS variables (already partially implemented) and toggle a `data-theme="light"` attribute on the `body`.

### 10. Pause/Resume Simulation — Priority: LOW | Effort: SMALL
**What:** Ability to pause the titration timer or animations.
**Why:** Students may need to take notes during fast-paced changes.
**Where in code:** `client/src/pages/titration.jsx`.
**How:** Add a pause state that clears the `setInterval` in the titration timer logic.

## Quick Wins (< 1 day each)
1. **Lab Safety Protocol Check:** Simple modal added to Dashboard links.
2. **PDF/CSV Report Export:** Add CSV blob generation to History page.
3. **Interactive Lab Manual Drawer:** Replace "Refer to page 51" text with an expandable UI component.
