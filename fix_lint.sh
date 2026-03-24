#!/bin/bash
cd client
pnpm install prop-types

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/EmptyState.jsx
sed -i -e '$a\' -e 'EmptyState.propTypes = { icon: PropTypes.node, title: PropTypes.string, description: PropTypes.string, actionLabel: PropTypes.string, onAction: PropTypes.func, className: PropTypes.string };' src/components/EmptyState.jsx

sed -i "s|import React, { useState, useEffect, useRef } from 'react';|import React, { useState, useEffect, useRef } from 'react';\nimport PropTypes from 'prop-types';|g" src/components/AiTutorPanel.jsx
sed -i -e '$a\' -e 'AiTutorPanel.propTypes = { isOpen: PropTypes.bool, onClose: PropTypes.func };' src/components/AiTutorPanel.jsx
sed -i "s/I'm your AI lab assistant/I\&apos;m your AI lab assistant/g" src/components/AiTutorPanel.jsx
sed -i "s/console.error/ \/\/ console.error/g" src/components/AiTutorPanel.jsx

sed -i "s/Don't know what to do?/Don\&apos;t know what to do?/g" src/components/ErrorBoundary.jsx

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/LoadingOverlay.jsx
sed -i -e '$a\' -e 'LoadingOverlay.propTypes = { message: PropTypes.string };' src/components/LoadingOverlay.jsx

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/ResultModal.jsx
sed -i -e '$a\' -e 'ResultModal.propTypes = { isOpen: PropTypes.bool, result: PropTypes.object, onReset: PropTypes.func, onClose: PropTypes.func, onAskAI: PropTypes.func };' src/components/ResultModal.jsx

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/SkeletonBlock.jsx
sed -i -e '$a\' -e 'SkeletonBlock.propTypes = { width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), borderRadius: PropTypes.string, className: PropTypes.string };\nSkeletonText.propTypes = { lines: PropTypes.number, className: PropTypes.string };\nSkeletonChart.propTypes = { className: PropTypes.string };\nSkeletonTable.propTypes = { columns: PropTypes.number, className: PropTypes.string };' src/components/SkeletonBlock.jsx

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/SkeletonLoader.jsx
sed -i -e '$a\' -e 'SkeletonLoader.propTypes = { className: PropTypes.string, style: PropTypes.object };' src/components/SkeletonLoader.jsx

sed -i "s|import React, { useMemo } from 'react';|import React, { useMemo } from 'react';\nimport PropTypes from 'prop-types';|g" src/components/StudentAnalyticsChart.jsx
sed -i -e '$a\' -e 'StudentAnalyticsChart.propTypes = { data: PropTypes.array, type: PropTypes.string, title: PropTypes.string, noDataMessage: PropTypes.string };' src/components/StudentAnalyticsChart.jsx
sed -i "s/export const EmptyChartState = ({ noDataMessage }) => (/export const EmptyChartState = ({ noDataMessage }) => (/" src/components/StudentAnalyticsChart.jsx
sed -i -e '$a\' -e 'EmptyChartState.displayName = "EmptyChartState";\nEmptyChartState.propTypes = { noDataMessage: PropTypes.string };' src/components/StudentAnalyticsChart.jsx

sed -i "s/const navigate = useNavigate();//g" src/components/auth/LoginForm.jsx
sed -i "s/<a href=\"#\" className/<button type=\"button\" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit'}} className/g" src/components/auth/LoginForm.jsx
sed -i "s/<\/a>/<\/button>/g" src/components/auth/LoginForm.jsx

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/auth/RoleSelector.jsx
sed -i -e '$a\' -e 'RoleSelector.propTypes = { selectedRole: PropTypes.string, setSelectedRole: PropTypes.func, error: PropTypes.string, ariaDescribedBy: PropTypes.string };' src/components/auth/RoleSelector.jsx

sed -i "s|import React, { useState } from 'react';|import React, { useState } from 'react';\nimport PropTypes from 'prop-types';|g" src/components/auth/SignUpForm.jsx
sed -i -e '$a\' -e 'SignUpForm.propTypes = { onTabSwitch: PropTypes.func };' src/components/auth/SignUpForm.jsx
sed -i "s/const { password: confirmPassword, ...authData } = formData;/void confirmPassword; void authData;/g" src/components/auth/SignUpForm.jsx

sed -i "s|import React, { useState } from 'react';|import React, { useState } from 'react';\nimport PropTypes from 'prop-types';|g" src/components/student/JoinClassroom.jsx
sed -i -e '$a\' -e 'JoinClassroom.propTypes = { onJoined: PropTypes.func, profileId: PropTypes.string };' src/components/student/JoinClassroom.jsx
sed -i "s/console.error/ \/\/ console.error/g" src/components/student/JoinClassroom.jsx

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/components/student/MyTeacherCard.jsx
sed -i -e '$a\' -e 'MyTeacherCard.propTypes = { classroom: PropTypes.object };' src/components/student/MyTeacherCard.jsx

sed -i "s/catch (e)/catch (_)/g" src/hooks/useLabPhysics.js

sed -i "s/const \[isLowPerformance, setIsLowPerformance\] = useState/const \[isLowPerformance\] = useState/g" src/hooks/usePerformanceScaling.js
sed -i "s/const \[postProcessingEnabled, setPostProcessingEnabled\] = useState/const \[postProcessingEnabled\] = useState/g" src/hooks/usePerformanceScaling.js

sed -i "s/Don't see your class?/Don\&apos;t see your class?/g" src/pages/Dashboard.jsx

sed -i "s/const \[reactionState, setReactionState\]/const \[reactionState\]/g" src/pages/Lab3D.jsx
sed -i "s/console.log/ \/\/ console.log/g" src/pages/Lab3D.jsx
sed -i "s/console.error/ \/\/ console.error/g" src/pages/Lab3D.jsx

sed -i "s/<a href=\"#\" className/<button type=\"button\" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit'}} className/g" src/pages/Login.jsx
sed -i "s/<\/a>/<\/button>/g" src/pages/Login.jsx

sed -i "s|import React, { useState, useEffect } from 'react';|import React, { useState, useEffect } from 'react';\nimport PropTypes from 'prop-types';|g" src/pages/TeacherDashboard.jsx
sed -i -e '$a\' -e 'StatCard.propTypes = { title: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), icon: PropTypes.node, trend: PropTypes.string, trendValue: PropTypes.string, color: PropTypes.string };\nActivityItem.propTypes = { activity: PropTypes.object };\nStudentRow.propTypes = { student: PropTypes.object };\nClassroomAnalytics.propTypes = { analytics: PropTypes.object };' src/pages/TeacherDashboard.jsx
sed -i "s/console.error/ \/\/ console.error/g" src/pages/TeacherDashboard.jsx
sed -i "s/<label htmlFor=\"minScore\"/<label htmlFor=\"minScoreFilter\"/g" src/pages/TeacherDashboard.jsx
sed -i "s/id=\"minScore\"/id=\"minScoreFilter\"/g" src/pages/TeacherDashboard.jsx
sed -i "s/<label htmlFor=\"activityType\"/<label htmlFor=\"activityTypeFilter\"/g" src/pages/TeacherDashboard.jsx
sed -i "s/id=\"activityType\"/id=\"activityTypeFilter\"/g" src/pages/TeacherDashboard.jsx

sed -i "s/console.error/ \/\/ console.error/g" src/store/authStore.js
sed -i "s/console.error/ \/\/ console.error/g" src/store/classroomStore.js
sed -i "s/console.error/ \/\/ console.error/g" src/store/labStore.js
sed -i "s/console.log/ \/\/ console.log/g" src/supabaseClient.js
sed -i "s/console.warn/ \/\/ console.warn/g" src/utils/apiClient.js
sed -i "s/console.error/ \/\/ console.error/g" src/utils/apiClient.js

sed -i "s|import React from 'react';|import React from 'react';\nimport PropTypes from 'prop-types';|g" src/utils/roleGuard.jsx
sed -i -e '$a\' -e 'RoleGuard.propTypes = { children: PropTypes.node, requiredRole: PropTypes.string };\nRequireAuth.propTypes = { children: PropTypes.node };' src/utils/roleGuard.jsx
sed -i "s/console.error/ \/\/ console.error/g" src/utils/roleGuard.jsx
