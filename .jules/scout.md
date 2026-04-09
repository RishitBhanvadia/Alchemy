# Scout Journal

This file contains critical market insights mapped to the Alchemistry codebase.

## 2024-05-24 - The Missing Link: Structured Learning Pathways
**Market Insight:** Top virtual chemistry labs (Labster, Beyond Labz) do not just offer an open sandbox; their core value lies in structured, scenario-based learning pathways (e.g., embedded lab manuals and pre/post-lab quizzes). The sandbox alone is insufficient for scalable education.
**Codebase Match:** Alchemistry currently provides an excellent 3D physics sandbox (`Lab3D.jsx`) and a basic assignment tracking system (`StudentDashboard.jsx`, `assignmentStore.js`), but lacks any in-lab guidance or assessment loops.
**Opportunity:** Build an interactive "Lab Manual" overlay in the `Lab3D` component that reads step-by-step instructions from the database or configuration, effectively turning open play into guided missions. This bridges the gap between engagement and verifiable learning outcomes.
