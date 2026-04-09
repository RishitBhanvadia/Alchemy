## 2024-05-18 - The "Missing Link" in Virtual Labs
**Market Insight:** Top virtual labs (Labster, Beyond Labz) don't just simulate chemistry; they simulate the scientific method by forcing students to record observations in virtual lab notebooks and tying those notes to specific simulation states.
**Codebase Match:** Alchemistry has robust 3D simulation and reaction history logging (`historyStore`), but lacks the active, student-driven observation layer during the experiment itself.
**Opportunity:** Adding an interactive "Lab Notebook" component that slides out during `Lab3D.jsx` sessions will bridge the gap between passive play and active learning.
