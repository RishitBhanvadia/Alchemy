
## 2025-02-27 - Safety and Procedural Workflows in Lab Simulators
**Market Insight:** Top competitors (Labster, PraxiLabs) focus heavily on procedural accuracy—forcing students to equip safety gear and follow checklists before interacting with chemicals—rather than just the visual mixing.
**Codebase Match:** Alchemistry's `Lab3D.jsx` immediately drops users into the simulation with active sliders. It lacks an introductory "safety check" phase or active step-by-step guidance.
**Opportunity:** Implementing a lightweight `SafetyCheckModal` on lab initialization and a collapsible assignment checklist will drastically improve educational realism and parity with market leaders with minimal 3D engine modifications.
