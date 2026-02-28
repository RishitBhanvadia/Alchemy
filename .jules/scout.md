## 2024-11-06 - Missing Data Export Utility in History View
**Market Insight:** Top ed-tech platforms (Labster, PraxiLabs) treat virtual labs not just as visual experiences, but as data generation tools for real-world lab reports. The ability to export data is a table-stakes requirement for academic utility.
**Codebase Match:** The `history.jsx` component successfully queries `experiment_results` from Supabase and renders them, but leaves the data trapped in the UI.
**Opportunity:** Implementing a client-side CSV export function on the `History` page is a high-value, low-effort addition that bridges the gap between visual simulation and academic application.

## 2024-11-06 - Lack of Virtual Safety Protocol (PPE) Enforcement
**Market Insight:** A consistent pattern across leading virtual labs is enforcing safety protocols (like equipping goggles and gloves) before allowing interaction with chemicals, reinforcing real-world habits.
**Codebase Match:** The `Lab` component allows immediate interaction with chemicals (e.g., `hcl.png`, `nacl.png`) without any preliminary safety checks or state blocks.
**Opportunity:** Adding a mandatory `hasPPE` check (e.g., a modal overlay) before enabling the chemical selection UI introduces critical educational friction, aligning the app closer to market standards.
