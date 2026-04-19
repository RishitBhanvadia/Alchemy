## 2025-04-19 - Market Research Template
**Market Insight:** Market trends observed.
**Codebase Match:** How it maps to our application.
**Opportunity:** What to build and why.

## 2025-04-19 - Virtual Lab Market vs Codebase Fit
**Market Insight:** Top virtual chemistry labs (Labster, PraxiLabs) differentiate themselves from basic simulations (PhET) through gamification, structured narratives, LMS integration, and built-in assessment tools. Users value real-time feedback and safety without physical risk.
**Codebase Match:** Alchemistry currently provides an open-ended "sandbox" style `Lab3D.jsx` and simple history logging in `history.jsx`. It lacks structured assessments, data export, and formalized experiment narratives.
**Opportunity:** The highest-impact opportunity is bridging the gap between a pure sandbox and an educational tool. Adding assessment links (quizzes linked to experiments) or exportable lab reports (CSV/PDF from `history.jsx`) would significantly increase the utility for educators (who are target users via `TeacherDashboard.jsx`).
