# Market Research Report
**App:** A web-based 3D interactive virtual chemistry laboratory for students to perform safe, simulated experiments with AI tutor support and teacher dashboard monitoring.
**Market:** EdTech / Virtual Science Labs
**Date:** 2024-04-24
**Competitors Researched:** Labster, Beyond Labz, PraxiLabs

## Executive Summary
The virtual chemistry lab market is dominated by platforms that blend open-ended exploration with structured, curriculum-aligned guidance. While Alchemistry has a strong 3D foundation and AI tutor integration, it currently functions mostly as a sandbox. The biggest opportunities lie in bridging the gap between open play and classroom utility by adding structured worksheets, safety elements, and data portability. Implementing these features will make the tool significantly more viable for educators to adopt.

## Competitor Analysis
- **Labster:** Focuses heavily on gamified, story-driven learning with strict learning objectives and assessment quizzes built directly into the flow.
- **Beyond Labz:** Offers the "Best of Both Worlds" with open-ended benches paired with guided worksheets/lab books and auto-graded assessments.
- **PraxiLabs:** Highlights curriculum alignment, real-time analytics, LMS integration, and a built-in custom quiz builder for teachers.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Structured lab manuals/worksheets alongside the simulation.
- Exportable lab results (CSV/PDF) for assignment submission.
- Safety gear/protocol acknowledgment before starting experiments.

### Differentiating Opportunities (Stand-out features)
- AI-guided "Lab Book" that actively checks off steps as students perform them in the 3D space.
- In-simulation quizzes that pop up at critical reaction points.

### UX Patterns (Design/interaction patterns common in top products)
- Persistent "Clipboard" or "Lab Book" UI element overlaid on the 3D view.
- Clear success/failure visual states with immediate "Try Again" vs "Continue" paths.

## Prioritised Recommendations

### 1. CSV Data Export for Lab History — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to export past experiments.
**Why:** Teachers need a way to collect student results if they aren't fully using the internal dashboard. Students need to include data in lab reports.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a button above the history table. Use a simple CSV string builder mapping the `logs` state (Outcome, Date, Chemicals) and trigger a browser download via a Blob.

### 2. Pre-Lab Safety Checklist — Priority: HIGH | Effort: SMALL
**What:** A mandatory modal requiring students to acknowledge safety gear (e.g., Goggles, Gloves) before the lab un-blurs.
**Why:** Competitors emphasize safety training even in virtual environments. It reinforces real-world lab habits.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a boolean state `hasPassedSafety` defaulting to false. Conditionally render a modal over the `Canvas` that requires clicking three checkboxes before setting state to true and allowing interaction.

### 3. Step-by-Step Guided Mode Toggle — Priority: MEDIUM | Effort: MEDIUM
**What:** An optional "Guided Mode" that shows a checklist of target chemicals to mix.
**Why:** Beyond Labz explicitly markets their dual open/guided approach. Pure sandbox is too unstructured for lower grade levels.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Create a `LabChecklist` component that floats on the side, taking an array of target steps (e.g., "Mix 50% HCl"). Listen to `chemA`/`chemB` state changes to check them off.

### 4. Custom Teacher Quizzes — Priority: MEDIUM | Effort: LARGE
**What:** Allow teachers to attach a short quiz to an assigned classroom module.
**Why:** PraxiLabs and Labster both feature built-in assessments to prove learning retention.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and backend DB
**How:** Add a UI in the teacher dashboard to create questions. Store in a new `quizzes` table linked to `classrooms`. Prompt students to answer after an experiment completes in `ResultModal.jsx`.

### 5. Persistent Lab Book UI — Priority: LOW | Effort: MEDIUM
**What:** Replace the hidden "History" side-panel in the lab with a persistently visible, skeuomorphic "Lab Book" tab.
**Why:** Enhances the feeling of being in a real lab, a common UX pattern in top competitors.
**Where in code:** `client/src/pages/Lab3D.jsx` & `Lab3D.css`
**How:** Redesign the `lab-history-panel` from a sliding pane to a fixed right-side panel styled like a notebook, showing real-time notes from the AI Tutor and recent mixes.

## Quick Wins (< 1 day each)
1. **CSV Export in History:** ~20 lines of code, massive utility for student assignments.
2. **Pre-Lab Safety Modal:** Simple React modal, reinforces educational value.
3. **"Mix at least 2 chemicals" Warning Enhancement:** Make the existing warning in `Lab3D` more prominent (red text/shake animation) to prevent confusing empty reactions.