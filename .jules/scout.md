## 2026-05-07 - Interactive Guidance Gap
**Market Insight:** Top virtual chemistry simulators like ChemVerse AI and PhET Simulations explicitly guide users through experimental procedures and teach relevant chemical theories directly within the lab environment, rather than relying on pure sandbox exploration.
**Codebase Match:** Alchemistry currently relies on a sandbox approach in `Lab3D.jsx` and separate assignments, lacking a dedicated in-lab component for procedural guidance.
**Opportunity:** Developing an `ExperimentGuide` component overlay within `Lab3D.jsx` to map out step-by-step procedures would significantly align the product with established market expectations.
## 2026-05-07 - Theory and Context Gap
**Market Insight:** Products like VirtualChem Labs explicitly tie their virtual experiments to educational resources, tutorials, and real-world computational chemistry concepts, ensuring students understand *why* a reaction happens, not just *what* happens.
**Codebase Match:** Alchemistry's `Lab3D.jsx` environment is highly interactive but relies on a generic AI tutor for explanations. There is no persistent, structured theoretical context (like reaction equations) built into the primary lab UI.
**Opportunity:** Implementing an integrated "Theory/Concept" reference panel in the lab would bridge the gap between gamified simulation and structured learning, aligning with the educational depth seen in competitor platforms.
