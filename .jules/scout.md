## 2026-03-01 - Virtual PPE as a Core Engagement Metric
**Market Insight:** Top competitors in the virtual chemistry space (like PraxiLabs and Labster) emphasize safety to the extent that it acts as a primary engagement hook and selling point ("0% Dangers") before any actual simulation begins.
**Codebase Match:** The `client/src/pages/lab.jsx` file immediately drops users into mixing chemicals without any prerequisite actions or context.
**Opportunity:** Implementing a virtual "PPE check" (e.g., clicking to equip goggles) before enabling the `INITIATE REACTION` button. This small, code-simple change dramatically aligns the product with market expectations for educational safety.
