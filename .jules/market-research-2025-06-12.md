# Market Research Report
**App:** Alchemistry - A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Virtual Chemistry Lab Software / EdTech
**Date:** 2025-06-12
**Competitors Researched:** PraxiLabs, Beyond Labz, Labster

## Executive Summary
The virtual chemistry lab market focuses heavily on realism, safety, assessment, and engagement. While Alchemistry has a strong 3D environment, competitors excel in LMS integrations, robust assessment tools, real-time analytics, and comprehensive lab manuals. Integrating structured assessments and richer analytical features into Alchemistry will significantly boost its value for educators and students alike.

## Competitor Analysis
*   **PraxiLabs:** Focuses on immersive 3D science labs, an AI lab assistant ("Oxi"), custom quiz builder, and performance analytics.
*   **Beyond Labz:** Offers open-ended, realistic virtual labs with a strong emphasis on data collection, graphing, and lab books.
*   **Labster:** A market leader known for high-quality gamified 3D simulations, integrated assessments, and deep LMS integrations.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Lab Manuals/Guides:** Step-by-step instructions and background theory integrated directly into the lab interface.
*   **Pre/Post-Lab Quizzes:** Built-in assessments to test understanding before and after the experiment.
*   **Lab Notebook/Data Collection:** A dedicated space for students to record observations, raw data, and draw graphs within the app.

### Differentiating Opportunities (Stand-out features)
*   **Interactive Graphing/Data Analysis:** Real-time graphing capabilities as experiments run (e.g., titration curves).
*   **Custom Experiment Builder for Teachers:** Tools for educators to design their own specific lab scenarios and assessment criteria.

### UX Patterns (Design/interaction patterns common in top products)
*   **Split-Screen Interface:** Simultaneously viewing the 3D lab environment alongside the lab manual or data collection tools.
*   **Gamified Progress/Rewards:** More robust achievement systems beyond a simple celebration modal.

## Prioritised Recommendations

### 1. Integrated Lab Notebook/Data Collection — Priority: HIGH | Effort: MEDIUM
**What:** A digital lab notebook accessible within the 3D lab environment for recording observations.
**Why:** Essential for science education; competitors like Beyond Labz heavily feature lab books for data collection.
**Where in code:** `client/src/pages/Lab3D.jsx`, create new component `client/src/components/LabNotebook.jsx`.
**How:** Add a floating or slide-out panel in the 3D lab where students can type notes, record data points (e.g., volume, color changes), and save it to their session/history.

### 2. Pre/Post-Lab Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Assessment modules tied to specific experiments.
**Why:** Educators need tools to verify learning. PraxiLabs highlights custom quiz builders.
**Where in code:** `client/src/components/ResultModal.jsx` or new `client/src/components/QuizModal.jsx`.
**How:** Add a quiz step before allowing access to an experiment, or after completing one, storing results in the database and displaying them on the Teacher Dashboard analytics.

### 3. Step-by-Step Lab Manual/Guide — Priority: HIGH | Effort: SMALL
**What:** An integrated, step-by-step procedure guide for the current experiment.
**Why:** Students need clear instructions without leaving the interface.
**Where in code:** `client/src/pages/Lab3D.jsx`, create `client/src/components/LabManualGuide.jsx`.
**How:** A collapsible sidebar containing the theoretical background and procedural steps for the selected experiment.

### 4. Real-time Titration Graphing — Priority: MEDIUM | Effort: MEDIUM
**What:** Live generation of a titration curve (pH vs. Volume) as the student performs a titration.
**Why:** Standard feature in advanced chemistry simulators to teach data interpretation.
**Where in code:** `client/src/pages/titration.jsx`.
**How:** Use an existing chart library (like Recharts already in `StudentAnalyticsChart.jsx`) to plot data points dynamically during the titration simulation.

### 5. Detailed Experiment History/Review — Priority: MEDIUM | Effort: SMALL
**What:** Enhanced history view showing the exact parameters, steps taken, and notes recorded.
**Why:** Crucial for revision and teacher review.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`.
**How:** Expand the history logs to include more granular data about the reaction process and display it in a detailed modal when a history item is clicked.

### 6. Classroom Announcements/Messages — Priority: MEDIUM | Effort: SMALL
**What:** A simple announcement board for teachers to communicate with their class.
**Why:** Basic LMS feature expected in educational tools.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/pages/StudentDashboard.jsx`.
**How:** Add an announcements table to Supabase and display the latest messages prominently on the student dashboard.

### 7. Export Data to CSV — Priority: LOW | Effort: SMALL
**What:** Ability to export lab results and notebook data to a CSV file.
**Why:** Useful for students to write external lab reports.
**Where in code:** `client/src/pages/history.jsx` or `client/src/pages/result.jsx`.
**How:** Add an "Export Data" button using a library like Papa Parse or simple blob creation to download experiment data.

### 8. Enhanced Gamification/Achievements — Priority: LOW | Effort: MEDIUM
**What:** A system of badges or achievements for completing specific types of experiments or streaks.
**Why:** Increases student engagement.
**Where in code:** `client/src/pages/Profile.jsx`, create `client/src/components/AchievementsBadge.jsx`.
**How:** Define a set of achievements in the database, evaluate them after reactions, and display badges on the user profile.

### 9. Interactive Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Hover/click information on lab equipment explaining its purpose and proper usage.
**Why:** Helps beginners learn equipment names and functions.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` or related 3D components.
**How:** Add `onPointerOver` events to 3D objects to display a 2D HTML overlay with the equipment's description.

### 10. Teacher Custom Experiment Assignment — Priority: LOW | Effort: LARGE
**What:** Allow teachers to assign specific experiments with custom parameters or expected outcomes to their classrooms.
**Why:** Provides flexibility for educators to tailor labs to their curriculum.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `server/routes/experimentRoutes.js`.
**How:** Build a UI for teachers to select an experiment template, modify parameters, and assign it to a class, then track completion status.

## Quick Wins (< 1 day each)
1.  **Step-by-Step Lab Manual/Guide:** A simple sidebar component to display text/HTML content for the procedure.
2.  **Export Data to CSV:** Adding a basic download button for history data is a quick frontend addition.
3.  **Detailed Experiment History/Review:** Expanding the existing history page UI to show more of the data already being saved.
