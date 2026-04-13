## 2026-04-13 - Virtual Chemistry Labs: The Guided Onboarding Pattern
**Market Insight:** Top virtual lab products (Labster, PraxiLabs) heavily feature guided learning pathways, scenario-based learning, and embedded theory refreshers/tutorials right inside the 3D lab environment to prevent students from getting lost or guessing randomly. They have step-by-step onboarding for tools.
**Codebase Match:** Alchemistry currently drops students directly into the Lab3D environment with basic controls (mix chemicals) and an AI tutor on demand, but lacks a guided step-by-step interactive tutorial for first-time users or structured "missions". The AI tutor is reactive, not proactive. There is an `hasSeenTip` equivalent missing.
**Opportunity:** Introduce an interactive guided tour/overlay (like a react-joyride or custom intro modal sequence) that walks students through their first reaction in Lab3D to reduce cognitive load and replicate the structured guidance of premium competitors.

## 2026-04-13 - Performance Analytics Export
**Market Insight:** Products like Labster provide detailed dashboards for teachers with the ability to export student performance analytics.
**Codebase Match:** The TeacherDashboard has a data grid and analytics chart for score distribution, but no way to export this data (e.g., to CSV).
**Opportunity:** Add a "Export to CSV" button on the TeacherDashboard for experiment scores, since the data (`experimentScores`) is already queried and available client-side.

## 2026-04-13 - Gamification and Progress Tracking
**Market Insight:** Virtual science labs use gamified elements (points, badges, real-time feedback) to increase retention.
**Codebase Match:** Alchemistry tracks experiments in a History table but lacks a formalized gamified progress system (like an achievement system or progress bar for curriculum completion). It currently just lists logs and has a success celebration.
**Opportunity:** Implement a "Lab Mastery" dashboard module showing experiment count vs curriculum goals, or simple badges based on existing history logs.
