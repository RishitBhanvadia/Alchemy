## 2026-05-28 - Alchemistry Virtual Labs
**Market Insight:** Virtual chemistry labs are shifting from pre-scripted steps to open sandbox physics engines with AI tutoring. Real-time frustration detection and gamified daily recommendations are key differentiators.
**Codebase Match:** Alchemistry uses React and Three.js with an existing `labStore` for states. It lacks an AI tutor (`chatHistory` exists but no proactive AI) and daily personalized recommendations.
**Opportunity:** Integrate an AI tutor component that monitors the 3D lab state (via `labStore`) and a daily recommendation system on the dashboard to improve engagement and skill building.
