# Scout's Journal

## 2026-02-26 - [Virtual Safety Protocols as Educational Standard]
**Market Insight:** Every major competitor in the "Virtual Lab" space (PraxiLabs, Labster) treats safety protocols as a core gameplay mechanic, not just a warning. Users must "put on" virtual PPE (gloves, goggles, coat) before entering the lab. This reinforces real-world safety habits even in a simulation.
**Codebase Match:** Alchemistry currently has zero safety enforcement. The `Lab` component allows immediate interaction with chemicals. There is only a small "NOTE" about solution molarity.
**Opportunity:** Implementing a "Safety Check" modal before the `Lab` component renders would instantly elevate the educational value and realism of the app, aligning it with premium market standards for very low effort.
