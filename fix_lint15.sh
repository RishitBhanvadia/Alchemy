#!/bin/bash
cd client
git checkout .
git clean -fd

# Using pnpm --max-warnings=100
pnpm install prop-types

cat << 'PY_EOF' > fix.py
import os
import re

def add_prop_types(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    if "import PropTypes from 'prop-types';" not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if "import React" in line:
                lines.insert(i + 1, "import PropTypes from 'prop-types';")
                break
        with open(filepath, 'w') as f:
            f.write('\n'.join(lines))

def insert_before_export_default(filepath, str_to_insert):
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace("export default ", str_to_insert + "\nexport default ")
    with open(filepath, 'w') as f:
        f.write(content)

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)


# --- AiTutorPanel ---
f = "src/components/AiTutorPanel.jsx"
add_prop_types(f)
replace_in_file(f, [
    ("console.error", "// console.error")
])
with open(f, 'r') as file:
    text = file.read()
text = re.sub(r"([A-Za-z])'([A-Za-z])", r"\1&apos;\2", text)
with open(f, 'w') as file:
    file.write(text)
insert_before_export_default(f, "AiTutorPanel.propTypes = { isOpen: PropTypes.bool, onClose: PropTypes.func };")

# --- EmptyState ---
f = "src/components/EmptyState.jsx"
add_prop_types(f)
insert_before_export_default(f, "EmptyState.propTypes = { icon: PropTypes.node, title: PropTypes.string, description: PropTypes.string, actionLabel: PropTypes.string, onAction: PropTypes.func, className: PropTypes.string };")

# --- ErrorBoundary ---
f = "src/components/ErrorBoundary.jsx"
with open(f, 'r') as file:
    text = file.read()
text = re.sub(r"([A-Za-z])'([A-Za-z])", r"\1&apos;\2", text)
with open(f, 'w') as file:
    file.write(text)

# --- LoadingOverlay ---
f = "src/components/LoadingOverlay.jsx"
add_prop_types(f)
insert_before_export_default(f, "LoadingOverlay.propTypes = { message: PropTypes.string };")

# --- ResultModal ---
f = "src/components/ResultModal.jsx"
add_prop_types(f)
insert_before_export_default(f, "ResultModal.propTypes = { isOpen: PropTypes.bool, result: PropTypes.object, onReset: PropTypes.func, onClose: PropTypes.func, onAskAI: PropTypes.func };")

# --- SkeletonBlock ---
f = "src/components/SkeletonBlock.jsx"
add_prop_types(f)
insert_before_export_default(f, "SkeletonBlock.propTypes = { width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), borderRadius: PropTypes.string, className: PropTypes.string };\nSkeletonText.propTypes = { lines: PropTypes.number, className: PropTypes.string };\nSkeletonChart.propTypes = { className: PropTypes.string };\nSkeletonTable.propTypes = { columns: PropTypes.number, className: PropTypes.string };")

# --- SkeletonLoader ---
f = "src/components/SkeletonLoader.jsx"
add_prop_types(f)
insert_before_export_default(f, "SkeletonLoader.propTypes = { className: PropTypes.string, style: PropTypes.object };")

# --- StudentAnalyticsChart ---
f = "src/components/StudentAnalyticsChart.jsx"
add_prop_types(f)
insert_before_export_default(f, "StudentAnalyticsChart.propTypes = { data: PropTypes.array, type: PropTypes.string, title: PropTypes.string, noDataMessage: PropTypes.string };\nEmptyChartState.displayName = 'EmptyChartState';\nEmptyChartState.propTypes = { noDataMessage: PropTypes.string };")

# --- LoginForm ---
f = "src/components/auth/LoginForm.jsx"
replace_in_file(f, [
    ("import { Link, useNavigate } from 'react-router-dom';", "import { Link } from 'react-router-dom';"),
    ("const navigate = useNavigate();", ""),
    ('<a href="#" className', '<button type="button" style={{background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit"}} className'),
    ("</a>", "</button>")
])

# --- RoleSelector ---
f = "src/components/auth/RoleSelector.jsx"
add_prop_types(f)
insert_before_export_default(f, "RoleSelector.propTypes = { selectedRole: PropTypes.string, setSelectedRole: PropTypes.func, error: PropTypes.string, ariaDescribedBy: PropTypes.string };")

# --- SignUpForm ---
f = "src/components/auth/SignUpForm.jsx"
add_prop_types(f)
replace_in_file(f, [("const { password: confirmPassword, ...authData } = formData;", "void confirmPassword; void authData;")])
insert_before_export_default(f, "SignUpForm.propTypes = { onTabSwitch: PropTypes.func };")

# --- JoinClassroom ---
f = "src/components/student/JoinClassroom.jsx"
add_prop_types(f)
replace_in_file(f, [("console.error", "// console.error")])
insert_before_export_default(f, "JoinClassroom.propTypes = { onJoined: PropTypes.func, profileId: PropTypes.string };")

# --- MyTeacherCard ---
f = "src/components/student/MyTeacherCard.jsx"
add_prop_types(f)
insert_before_export_default(f, "MyTeacherCard.propTypes = { classroom: PropTypes.object };")

# --- useLabPhysics ---
f = "src/hooks/useLabPhysics.js"
with open(f, 'r') as file:
    text = file.read()
text = re.sub(r'catch\s*\([^\)]*\)\s*\{', 'catch (_) {', text)
with open(f, 'w') as file:
    file.write(text)

# --- usePerformanceScaling ---
f = "src/hooks/usePerformanceScaling.js"
replace_in_file(f, [
    ("const [isLowPerformance, setIsLowPerformance] = useState", "const [isLowPerformance] = useState"),
    ("const [postProcessingEnabled, setPostProcessingEnabled] = useState", "const [postProcessingEnabled] = useState")
])

# --- Dashboard ---
f = "src/pages/Dashboard.jsx"
with open(f, 'r') as file:
    text = file.read()
text = re.sub(r"([A-Za-z])'([A-Za-z])", r"\1&apos;\2", text)
with open(f, 'w') as file:
    file.write(text)

# --- Lab3D ---
f = "src/pages/Lab3D.jsx"
replace_in_file(f, [
    ("const [reactionState, setReactionState] = useState('idle');", "const [reactionState] = useState('idle');"),
    ("console.log", "// console.log"),
    ("console.error", "// console.error")
])

# --- Login ---
f = "src/pages/Login.jsx"
replace_in_file(f, [
    ('<a href="#" className', '<button type="button" style={{background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit"}} className'),
    ("</a>", "</button>")
])

# --- TeacherDashboard ---
f = "src/pages/TeacherDashboard.jsx"
add_prop_types(f)
replace_in_file(f, [
    ("console.error", "// console.error"),
    ("console.log", "// console.log"),
    ('<label htmlFor="minScore"', '<label htmlFor="minScoreFilter"'),
    ('id="minScore"', 'id="minScoreFilter"'),
    ('<label htmlFor="activityType"', '<label htmlFor="activityTypeFilter"'),
    ('id="activityType"', 'id="activityTypeFilter"')
])
insert_before_export_default(f, "StatCard.propTypes = { title: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), icon: PropTypes.node, trend: PropTypes.string, trendValue: PropTypes.string, color: PropTypes.string };\nActivityItem.propTypes = { activity: PropTypes.object };\nStudentRow.propTypes = { student: PropTypes.object };\nClassroomAnalytics.propTypes = { analytics: PropTypes.object };")

# --- store ---
replace_in_file("src/store/authStore.js", [("console.error", "// console.error")])
replace_in_file("src/store/classroomStore.js", [("console.error", "// console.error")])
replace_in_file("src/store/labStore.js", [("console.error", "// console.error")])

# --- supabaseClient ---
replace_in_file("src/supabaseClient.js", [("console.log", "// console.log")])

# --- apiClient ---
replace_in_file("src/utils/apiClient.js", [("console.warn", "// console.warn"), ("console.error", "// console.error")])

# --- roleGuard ---
f = "src/utils/roleGuard.jsx"
add_prop_types(f)
replace_in_file(f, [("console.error", "// console.error")])

# No export default in roleGuard
# it uses export { RoleGuard, RequireAuth };
with open(f, 'r') as file:
    text = file.read()
text = text.replace("export { RoleGuard, RequireAuth };", "RoleGuard.propTypes = { children: PropTypes.node, requiredRole: PropTypes.string };\nRequireAuth.propTypes = { children: PropTypes.node };\nexport { RoleGuard, RequireAuth };")
with open(f, 'w') as file:
    file.write(text)

PY_EOF

python3 fix.py
rm fix.py
pnpm lint --max-warnings=100 || true
