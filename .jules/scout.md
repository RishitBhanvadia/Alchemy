## 2025-02-24 - Virtual Lab Competitive Analysis
**Market Insight:** Top virtual labs (Labster, ChemCollective) strongly differentiate by linking simulation back to theoretical learning (theory refreshers) and offering robust quantitative controls (precise volume/molarity).
**Codebase Match:** Alchemistry currently uses abstract percentage sliders and lacks theory explanations in the results modal, but the existing `ResultModal` and `Lab3D` slider architecture makes adding these features straightforward.
**Opportunity:** Adding a CSV export to the History page and an onboarding tooltip to Lab3D are immediate, high-impact table stakes that require minimal effort (~30 lines each).
