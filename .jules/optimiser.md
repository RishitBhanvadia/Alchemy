## 2025-02-27 - Debounced Search in Teacher Dashboard
**Bottleneck:** Search input in TeacherDashboard was updating global filter on every keystroke, causing unnecessary re-renders of the student list.
**Impact:** The student list updates dynamically based on the global filter which applies to all rows. When there are many rows, continuous updating impacts performance significantly as the table and chart are both heavy components. Adding debounce delayed filtering reducing the number of heavy renders on typing.
**Learning:** Debouncing user input used to filter heavy components is a reliable performance optimisation.
