## 2024-05-24 - Guided Chemistry Lab Paradigm
**Market Insight:** Top virtual labs (Labster, PraxiLabs) have shifted from open sandboxes to guided curriculums with persistent procedure checklists and formative in-experiment quizzes to bridge the gap between "playing with chemicals" and structured learning.
**Codebase Match:** Alchemistry's core 3D simulation (`client/src/pages/Lab3D.jsx`) and `ResultModal` are strong but lack a structured step-by-step panel and immediate pedagogical feedback during the experiment process.
**Opportunity:** Introduce a `ProcedurePanel` component reading from a new `procedures` array in `labStore`, and add formative quizzes to `ResultModal` to transform the platform into a structured educational tool.
