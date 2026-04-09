## 2024-05-24 - AI Tutor Context Awareness Gap
**Market Insight:** Top virtual chemistry labs (like Labster and PraxiLabs) offer contextual hints or step-by-step guidance that are aware of the student's exact current state in an experiment, preventing them from feeling completely stuck.
**Codebase Match:** The Alchemistry app already has an `AiTutorPanel` and a `currentHint` feature in `labStore.js`, but hints are fetched via a generic debounced call (`/api/ai/hint`) when chemicals are added, which might lack deep contextual awareness of specific learning objectives or assignment requirements.
**Opportunity:** Enhance the AI Tutor to be contextually aware of the student's current assignment and the specific experiment they are running, providing more targeted, step-by-step guidance rather than general hints.

## 2024-05-24 - Pre-Lab Quizzes and Safety Protocols
**Market Insight:** Almost all standard virtual labs (Labster, Beyond Labz) require students to complete safety checks or pre-lab theoretical quizzes before entering the 3D simulation to ensure conceptual understanding.
**Codebase Match:** The app allows students to directly enter the `Lab3D.jsx` environment from the dashboard without any gating mechanism or safety/theory validation.
**Opportunity:** Introduce a Pre-Lab component that acts as a gatekeeper to the 3D Lab. Students must complete a short, dynamically generated quiz or review safety protocols before the 3D canvas is unlocked.

## 2024-05-24 - Interactive Lab Manual / Theory Integration
**Market Insight:** Competitors integrate a "Lab Manual" or theory section directly into the lab environment. Students can pull up theoretical background, formulas, and expected procedures while performing the experiment.
**Codebase Match:** The `Lab3D.jsx` interface relies on the user knowing what to do or asking the AI. There is no integrated "Lab Manual" or theoretical reference panel.
**Opportunity:** Add a collapsible "Lab Manual" side panel in the 3D Lab that dynamically displays theory and formulas relevant to the current experiment or assignment.

## 2024-05-24 - Gamification and Achievements
**Market Insight:** Gamification elements like badges, levels, or experience points (XP) are prominent in tools like Labster to increase engagement and motivation.
**Codebase Match:** The app tracks scores in `experiment_logs` and displays "PASS/PENDING" for assignments, but lacks a visible gamified progression system for the student.
**Opportunity:** Implement a badge or XP system in the `StudentDashboard.jsx` and `Profile.jsx` based on the number of successful reactions or assignments completed.
