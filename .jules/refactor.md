## 2024-03-24 - [Extract TeacherDashboard table rendering]
**Before:** TeacherDashboard component contained ~400 lines just for rendering the student data table and its mobile card view alternative directly inside the main return statement.
**Issue:** Deeply nested JSX making it hard to follow the component's structure. The component is 775 lines long and acts as a God component.
**Learning:** Extracting complex view-specific rendering logic (like Tanstack tables with multiple views based on screen size) into smaller, dedicated sub-components improves readability and separation of concerns without changing business logic.
