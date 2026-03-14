
## 2025-02-17 - Improve Empty State in History
**Problem:** The empty state for the experiment log in `history.jsx` was a plain string of text, which violated the app's established neon/glassmorphism design and lacked a clear visual hierarchy or Call-To-Action (CTA) for the user to start their first experiment.
**Context:** This app heavily relies on strong visual feedback and a consistent futuristic UI. A blank or plain text empty state breaks immersion and does not guide the user towards their primary goal: conducting experiments.
**Solution:** Replaced the plain text with a structured glassmorphism container (`.empty-state-container`) featuring a neon flask icon, a distinct title ("NO RECORDS FOUND"), descriptive text, and a styled primary CTA button (`<Link to="/dashboard">`) that navigates the user directly to the experiment selection dashboard. This creates a cohesive look and reduces UX friction for new users.
