# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js enabling students to conduct safe, interactive chemistry experiments in a 3D environment while teachers monitor progress.
**Market:** Virtual Science Laboratory & EdTech Simulation Software
**Date:** 2025-05-15
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

## Executive Summary
The virtual chemistry laboratory market is highly focused on providing realistic, risk-free environments that augment or replace physical labs. Key competitors emphasize curriculum alignment, comprehensive 3D simulations (covering general, organic, and analytical chemistry), and strong analytics platforms for educators to track student performance and comprehension. While Alchemistry already possesses a solid 3D simulation foundation and basic role-based dashboards, the biggest opportunities lie in adding robust assessment tools (custom quizzes integrated into the workflow), real-time contextual AI assistance ("AI Lab Assistant"), and gamification to increase student retention and engagement.

## Competitor Analysis
* **Labster:** The market leader. Key differentiators include high-quality narrative-driven simulations, extensive curriculum alignment (AP Chemistry, NGSS), and pre-built textbook alignments. They also offer a "UbiSim" VR product.
* **PraxiLabs:** Focuses heavily on gamification and educator tools. Key differentiators include an "AI Lab Assistant" (Oxi) that provides real-time guidance, a custom quiz builder linked directly to experiments, and strong performance analytics.
* **Beyond Labz:** Focuses on an "open-ended" sandbox approach where students can make mistakes safely. Key differentiators include realistic data generation, a built-in "Lab Cam" to record and share setups/results, and strong integration with VLEs.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Custom Assessments:** Teachers need the ability to assign specific tasks or quizzes tied directly to an experiment's outcome, rather than just seeing a pass/fail assignment status.
* **Granular Analytics:** Tracking where a student spent the most time or where they failed in a multi-step process, not just the final outcome label.

### Differentiating Opportunities (Stand-out features)
* **Context-Aware AI Tutor:** An AI assistant that knows the current state of the chemicals in the beaker and guides the student, similar to PraxiLabs' "Oxi".
* **Experiment Recording/Snapshotting:** Allowing students to capture the state of their experiment or graph to share with teachers, similar to Beyond Labz' "Lab Cam".

### UX Patterns (Design/interaction patterns common in top products)
* **Gamification Elements:** Badges, experience points (XP), or streaks visible on the student dashboard.
* **Step-by-Step Guided Mode:** An optional "guided" overlay that walks a novice through an experiment step-by-step before releasing them into the open sandbox.

## Prioritised Recommendations

### 1. Context-Aware AI Tutor Upgrade — Priority: HIGH | Effort: MEDIUM
**What:** Enhance the existing \`AiTutorPanel\` to receive the current chemical concentrations (\`chemA\`, \`chemB\`, etc.) and \`reactionState\` from the Lab3D environment.
**Why:** Competitors like PraxiLabs heavily market their "AI Lab Assistant." This bridges the gap between a generic chatbot and a true lab assistant.
**Where in code:** \`client/src/pages/Lab3D.jsx\` and \`client/src/components/AiTutorPanel.jsx\`
**How:** Pass the current lab state as props to the AI panel and prepend a hidden system prompt to the user's message (e.g., "The student currently has 50% HCl and 50% NaOH mixed...").

### 2. Custom Quiz Builder for Teachers — Priority: HIGH | Effort: LARGE
**What:** Allow teachers to create custom multiple-choice quizzes that students must pass before or after an experiment.
**Why:** Table-stakes feature for EdTech platforms (seen in Labster and PraxiLabs) to ensure comprehension, not just interaction.
**Where in code:** \`client/src/pages/TeacherDashboard.jsx\` (UI) and \`server/routes/\` (API)
**How:** Add a new "Create Quiz" modal in the teacher dashboard, store questions in a new Supabase \`quizzes\` table, and link them to assignments.

### 3. Student Gamification (XP & Badges) — Priority: MEDIUM | Effort: SMALL
**What:** Add a simple XP system and display badges on the Student Dashboard based on the number of successful experiments.
**Why:** Increases student retention and engagement, a key selling point for PraxiLabs.
**Where in code:** \`client/src/pages/StudentDashboard.jsx\` and \`client/src/store/historyStore.js\`
**How:** Calculate XP based on the number of logs fetched in \`StudentDashboard\`. Display a visual "Rank" or "Badge" next to the welcome text.

### 4. "Lab Cam" / Snapshot Feature — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow students to take a screenshot of their 3D experiment state and attach it to their lab history log.
**Why:** Matches a popular feature in Beyond Labz, allowing teachers to see visual proof of the experiment state.
**Where in code:** \`client/src/pages/Lab3D.jsx\` and \`server/controllers/history.controller.js\`
**How:** Use \`gl.domElement.toDataURL()\` in the Three.js Canvas to capture the image, upload to Supabase storage, and link the URL in the history log.

### 5. Step-by-Step Guided Mode — Priority: MEDIUM | Effort: LARGE
**What:** A tutorial overlay that highlights which slider to move next for a specific target reaction.
**Why:** Lowers the barrier to entry for complex experiments, similar to Labster's guided narratives.
**Where in code:** \`client/src/components/\` (New Component)
**How:** Create a \`TutorialOverlay\` component that uses absolute positioning to highlight specific UI elements (\`chem-slider\`) based on a predefined sequence.

### 6. Granular Analytics Tracking — Priority: LOW | Effort: MEDIUM
**What:** Track intermediate steps (e.g., "Student added too much Base before Acid") rather than just the final "Success/Error" state.
**Why:** Teachers need actionable insights to help struggling students, as highlighted in Labster case studies.
**Where in code:** \`client/src/components/PhysicsLab.jsx\` and \`server/routes/history.js\`
**How:** Debounce and log slider changes or "failed" initiate attempts to a new \`analytics_events\` table.

### 7. Syllabus/Textbook Alignment Tags — Priority: LOW | Effort: SMALL
**What:** Add tags to experiments (e.g., "Aligns with AP Chem Ch 4") in the assignment view.
**Why:** Educators choose software based on how easily it maps to their existing curriculum (Labster highlights this heavily).
**Where in code:** \`client/src/pages/StudentDashboard.jsx\` (MODULE_CARDS)
**How:** Update the \`MODULE_CARDS\` constant to include a \`tags\` array and render them as small pill badges on the cards.

### 8. Concrete Materials / Physics Expansion — Priority: LOW | Effort: LARGE
**What:** Add a new module for testing physical properties (e.g., density, specific heat).
**Why:** Competitors often bundle Physics and Chemistry. Expanding the scope increases the total addressable market.
**Where in code:** \`client/src/pages/\` and \`client/src/App.jsx\`
**How:** Create a new \`PhysicsLab3D\` route and corresponding Three.js environment.

### 9. Dedicated "Safety Mistakes" Mode — Priority: LOW | Effort: MEDIUM
**What:** Intentionally allow dangerous combinations (e.g., adding water to acid incorrectly) and show a simulated "explosion" or warning.
**Why:** Beyond Labz highlights the ability to "safely make mistakes". Currently, the app prevents invalid reactions via logic.
**Where in code:** \`client/src/components/PhysicsLab.jsx\`
**How:** Add specific "failure" animations in Three.js and log them as safety violations in the student's history.

### 10. Bulk Student Import via CSV — Priority: LOW | Effort: SMALL
**What:** Allow teachers to upload a CSV of student emails to automatically generate class rosters.
**Why:** Reduces friction for onboarding entire schools.
**Where in code:** \`client/src/pages/ClassroomDetail.jsx\`
**How:** Add a CSV parser (e.g., Papa Parse) to read a file and batch-insert students into the classroom via a new Supabase edge function.

## Quick Wins (< 1 day each)
1. **Student Gamification (XP & Badges):** Can be implemented entirely on the frontend by deriving XP from the existing \`logs\` array.
2. **Syllabus/Textbook Alignment Tags:** Just requires updating a constant array and adding a simple UI badge.
3. **Context-Aware AI Tutor Upgrade:** Only requires passing existing React state into the AI prompt template.
