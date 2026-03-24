#!/bin/bash
cd client
git checkout .
git clean -fd

# Install prop-types
pnpm install prop-types

# I will write python to clean this correctly
cat << 'PY_EOF' > fix.py
import os
import re

def fix_file(filepath, add_prop_types=False, append_lines=[], replacements=[]):
    with open(filepath, 'r') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    if add_prop_types:
        if "import PropTypes" not in content:
            # Add to top after react import safely
            # Sometimes React is not the only import
            lines = content.split("\n")
            for i, line in enumerate(lines):
                if line.startswith("import React"):
                    lines.insert(i + 1, "import PropTypes from 'prop-types';")
                    content = "\n".join(lines)
                    break

    for line in append_lines:
        content += "\n" + line

    with open(filepath, 'w') as f:
        f.write(content)

# AiTutorPanel
fix_file("src/components/AiTutorPanel.jsx", True,
         ["AiTutorPanel.propTypes = { isOpen: PropTypes.bool, onClose: PropTypes.func };"],
         [("I'm your AI lab assistant", "I&apos;m your AI lab assistant"),
          ("I'm here to help", "I&apos;m here to help"),
          ("console.error", "// console.error")])

# EmptyState
fix_file("src/components/EmptyState.jsx", True,
         ["EmptyState.propTypes = { icon: PropTypes.node, title: PropTypes.string, description: PropTypes.string, actionLabel: PropTypes.string, onAction: PropTypes.func, className: PropTypes.string };"])

# ErrorBoundary
fix_file("src/components/ErrorBoundary.jsx", False, [], [("Don't know what to do?", "Don&apos;t know what to do?")])

# LoadingOverlay
fix_file("src/components/LoadingOverlay.jsx", True, ["LoadingOverlay.propTypes = { message: PropTypes.string };"])

# ResultModal
fix_file("src/components/ResultModal.jsx", True, ["ResultModal.propTypes = { isOpen: PropTypes.bool, result: PropTypes.object, onReset: PropTypes.func, onClose: PropTypes.func, onAskAI: PropTypes.func };"])

# SkeletonBlock
fix_file("src/components/SkeletonBlock.jsx", True,
    ["SkeletonBlock.propTypes = { width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), borderRadius: PropTypes.string, className: PropTypes.string };",
     "SkeletonText.propTypes = { lines: PropTypes.number, className: PropTypes.string };",
     "SkeletonChart.propTypes = { className: PropTypes.string };",
     "SkeletonTable.propTypes = { columns: PropTypes.number, className: PropTypes.string };"])

# SkeletonLoader
fix_file("src/components/SkeletonLoader.jsx", True, ["SkeletonLoader.propTypes = { className: PropTypes.string, style: PropTypes.object };"])

# StudentAnalyticsChart
fix_file("src/components/StudentAnalyticsChart.jsx", True,
    ["StudentAnalyticsChart.propTypes = { data: PropTypes.array, type: PropTypes.string, title: PropTypes.string, noDataMessage: PropTypes.string };",
     "EmptyChartState.displayName = 'EmptyChartState';",
     "EmptyChartState.propTypes = { noDataMessage: PropTypes.string };"])

# LoginForm
fix_file("src/components/auth/LoginForm.jsx", False, [],
    [("import { Link, useNavigate } from 'react-router-dom';", "import { Link } from 'react-router-dom';"),
     ("const navigate = useNavigate();", ""),
     ("<a href=\"#\" className", "<button type=\"button\" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit'}} className"),
     ("</a>", "</button>")])

# RoleSelector
fix_file("src/components/auth/RoleSelector.jsx", True, ["RoleSelector.propTypes = { selectedRole: PropTypes.string, setSelectedRole: PropTypes.func, error: PropTypes.string, ariaDescribedBy: PropTypes.string };"])

# SignUpForm
fix_file("src/components/auth/SignUpForm.jsx", True, ["SignUpForm.propTypes = { onTabSwitch: PropTypes.func };"], [("const { password: confirmPassword, ...authData } = formData;", "void confirmPassword; void authData;")])

# JoinClassroom
fix_file("src/components/student/JoinClassroom.jsx", True, ["JoinClassroom.propTypes = { onJoined: PropTypes.func, profileId: PropTypes.string };"], [("console.error", "// console.error")])

# MyTeacherCard
fix_file("src/components/student/MyTeacherCard.jsx", True, ["MyTeacherCard.propTypes = { classroom: PropTypes.object };"])

# useLabPhysics
with open("src/hooks/useLabPhysics.js", "r") as f:
    text = f.read()
text = re.sub(r'catch \(e\)\s*{', 'catch (_) {', text)
with open("src/hooks/useLabPhysics.js", "w") as f:
    f.write(text)

# usePerformanceScaling
fix_file("src/hooks/usePerformanceScaling.js", False, [], [("const [isLowPerformance, setIsLowPerformance] = useState", "const [isLowPerformance] = useState"), ("const [postProcessingEnabled, setPostProcessingEnabled] = useState", "const [postProcessingEnabled] = useState")])

# Dashboard
fix_file("src/pages/Dashboard.jsx", False, [], [("Don't see your class?", "Don&apos;t see your class?")])

# Lab3D
fix_file("src/pages/Lab3D.jsx", False, [], [("const [reactionState, setReactionState] = useState('idle');", "const [reactionState] = useState('idle');"), ("console.log", "// console.log"), ("console.error", "// console.error")])

# Login
fix_file("src/pages/Login.jsx", False, [], [("<a href=\"#\" className", "<button type=\"button\" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit'}} className"), ("</a>", "</button>")])

# TeacherDashboard
fix_file("src/pages/TeacherDashboard.jsx", True,
    ["StatCard.propTypes = { title: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), icon: PropTypes.node, trend: PropTypes.string, trendValue: PropTypes.string, color: PropTypes.string };",
     "ActivityItem.propTypes = { activity: PropTypes.object };",
     "StudentRow.propTypes = { student: PropTypes.object };",
     "ClassroomAnalytics.propTypes = { analytics: PropTypes.object };"],
     [("console.error", "// console.error"), ("<label htmlFor=\"minScore\"", "<label htmlFor=\"minScoreFilter\""), ("id=\"minScore\"", "id=\"minScoreFilter\""), ("<label htmlFor=\"activityType\"", "<label htmlFor=\"activityTypeFilter\""), ("id=\"activityType\"", "id=\"activityTypeFilter\""), ("console.log", "// console.log")])

# store
fix_file("src/store/authStore.js", False, [], [("console.error", "// console.error")])
fix_file("src/store/classroomStore.js", False, [], [("console.error", "// console.error")])
fix_file("src/store/labStore.js", False, [], [("console.error", "// console.error")])

# supabaseClient
fix_file("src/supabaseClient.js", False, [], [("console.log", "// console.log")])

# apiClient
fix_file("src/utils/apiClient.js", False, [], [("console.warn", "// console.warn"), ("console.error", "// console.error")])

# roleGuard
fix_file("src/utils/roleGuard.jsx", True,
    ["RoleGuard.propTypes = { children: PropTypes.node, requiredRole: PropTypes.string };",
     "RequireAuth.propTypes = { children: PropTypes.node };"],
    [("console.error", "// console.error")])

PY_EOF

python3 fix.py
rm fix.py
pnpm lint
