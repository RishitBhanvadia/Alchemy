## 2024-05-24 - Missing Virtual PPE
**Market Insight:** All top virtual lab simulators (Labster, PraxiLabs) heavily emphasize safety protocols, often requiring virtual Personal Protective Equipment (PPE) checks before experiments begin.
**Codebase Match:** Alchemistry currently allows users to directly interact with chemicals (HCl, H2SO4) in `lab.jsx` and `titration.jsx` without any safety checks.
**Opportunity:** Add a virtual PPE checklist or required safety gear selection step before enabling experiment controls.

## 2024-05-24 - Data Export
**Market Insight:** Educational lab tools (PhET, ChemCollective) typically allow students and educators to export experiment results for analysis and grading.
**Codebase Match:** The `history.jsx` page displays past experiments but lacks any way to export this data.
**Opportunity:** Add a CSV export feature in `history.jsx` using the existing Supabase query data.
