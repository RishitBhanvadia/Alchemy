const fs = require('fs');

function applyFixes() {
    // 1. AiTutorPanel.jsx
    let aiTutor = fs.readFileSync('client/src/components/AiTutorPanel.jsx', 'utf8');
    aiTutor = aiTutor.replace("import React, { useState, useRef, useEffect } from 'react';", "import React, { useState, useRef, useEffect } from 'react';\nimport PropTypes from 'prop-types';");
    aiTutor = aiTutor.replace("export default AiTutorPanel;", "AiTutorPanel.propTypes = {\n  isOpen: PropTypes.bool.isRequired,\n  onClose: PropTypes.func.isRequired\n};\n\nexport default AiTutorPanel;");
    aiTutor = aiTutor.replace(/console\.error\('AI Tutorial error:', error\);/g, "// console.error('AI Tutorial error:', error);");
    fs.writeFileSync('client/src/components/AiTutorPanel.jsx', aiTutor);

    // 2. EmptyState.jsx
    let emptyState = fs.readFileSync('client/src/components/EmptyState.jsx', 'utf8');
    if (!emptyState.includes('import PropTypes')) {
        emptyState = emptyState.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        emptyState = emptyState.replace("export default EmptyState;", "EmptyState.propTypes = {\n  icon: PropTypes.string.isRequired,\n  title: PropTypes.string.isRequired,\n  description: PropTypes.string.isRequired,\n  actionLabel: PropTypes.string,\n  onAction: PropTypes.func,\n  className: PropTypes.string\n};\n\nexport default EmptyState;");
        fs.writeFileSync('client/src/components/EmptyState.jsx', emptyState);
    }

    // 3. LoadingOverlay.jsx
    let loadingOverlay = fs.readFileSync('client/src/components/LoadingOverlay.jsx', 'utf8');
    if (!loadingOverlay.includes('import PropTypes')) {
        loadingOverlay = loadingOverlay.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        loadingOverlay = loadingOverlay.replace("export default LoadingOverlay;", "LoadingOverlay.propTypes = {\n  message: PropTypes.string\n};\n\nexport default LoadingOverlay;");
        fs.writeFileSync('client/src/components/LoadingOverlay.jsx', loadingOverlay);
    }

    // 4. ResultModal.jsx
    let resultModal = fs.readFileSync('client/src/components/ResultModal.jsx', 'utf8');
    if (!resultModal.includes('import PropTypes')) {
        resultModal = resultModal.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        resultModal = resultModal.replace("export default ResultModal;", "ResultModal.propTypes = {\n  isOpen: PropTypes.bool.isRequired,\n  onClose: PropTypes.func.isRequired,\n  onAskAI: PropTypes.func.isRequired,\n  onReset: PropTypes.func.isRequired,\n  result: PropTypes.shape({\n    outcome_label: PropTypes.string,\n    product_formula: PropTypes.string,\n    color: PropTypes.string,\n    state_change: PropTypes.string,\n    thermal_effect: PropTypes.string,\n    is_dangerous: PropTypes.bool\n  })\n};\n\nexport default ResultModal;");
        fs.writeFileSync('client/src/components/ResultModal.jsx', resultModal);
    }

    // 5. SkeletonBlock.jsx
    let skeletonBlock = fs.readFileSync('client/src/components/SkeletonBlock.jsx', 'utf8');
    if (!skeletonBlock.includes('import PropTypes')) {
        skeletonBlock = skeletonBlock.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        skeletonBlock = skeletonBlock.replace("export const SkeletonBlock", "SkeletonBlock.propTypes = {\n  width: PropTypes.string,\n  height: PropTypes.string,\n  borderRadius: PropTypes.string,\n  className: PropTypes.string\n};\n\nexport const SkeletonBlock");
        skeletonBlock = skeletonBlock.replace("export const SkeletonText", "SkeletonText.propTypes = {\n  lines: PropTypes.number,\n  className: PropTypes.string\n};\n\nexport const SkeletonText");
        skeletonBlock = skeletonBlock.replace("export const SkeletonAvatar", "SkeletonAvatar.propTypes = {\n  className: PropTypes.string\n};\n\nexport const SkeletonAvatar");
        skeletonBlock = skeletonBlock.replace("export const SkeletonGrid", "SkeletonGrid.propTypes = {\n  columns: PropTypes.number,\n  className: PropTypes.string\n};\n\nexport const SkeletonGrid");
        fs.writeFileSync('client/src/components/SkeletonBlock.jsx', skeletonBlock);
    }

    // 6. SkeletonLoader.jsx
    let skeletonLoader = fs.readFileSync('client/src/components/SkeletonLoader.jsx', 'utf8');
    if (!skeletonLoader.includes('import PropTypes')) {
        skeletonLoader = skeletonLoader.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        skeletonLoader = skeletonLoader.replace("export default SkeletonLoader;", "SkeletonLoader.propTypes = {\n  className: PropTypes.string,\n  style: PropTypes.object\n};\n\nexport default SkeletonLoader;");
        fs.writeFileSync('client/src/components/SkeletonLoader.jsx', skeletonLoader);
    }

    // 7. StudentAnalyticsChart.jsx
    let studentAnalyticsChart = fs.readFileSync('client/src/components/StudentAnalyticsChart.jsx', 'utf8');
    if (!studentAnalyticsChart.includes('import PropTypes')) {
        studentAnalyticsChart = studentAnalyticsChart.replace("import React, { useMemo } from 'react';", "import React, { useMemo } from 'react';\nimport PropTypes from 'prop-types';");
        studentAnalyticsChart = studentAnalyticsChart.replace("export default StudentAnalyticsChart;", "StudentAnalyticsChart.propTypes = {\n  scores: PropTypes.array,\n  experimentName: PropTypes.string,\n  noDataMessage: PropTypes.string\n};\n\nexport default StudentAnalyticsChart;");
        fs.writeFileSync('client/src/components/StudentAnalyticsChart.jsx', studentAnalyticsChart);
    }

    // 8. RoleSelector.jsx
    let roleSelector = fs.readFileSync('client/src/components/auth/RoleSelector.jsx', 'utf8');
    if (!roleSelector.includes('import PropTypes')) {
        roleSelector = roleSelector.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        roleSelector = roleSelector.replace("export default RoleSelector;", "RoleSelector.propTypes = {\n  selectedRole: PropTypes.string.isRequired,\n  setSelectedRole: PropTypes.func.isRequired,\n  error: PropTypes.string,\n  ariaDescribedBy: PropTypes.string\n};\n\nexport default RoleSelector;");
        fs.writeFileSync('client/src/components/auth/RoleSelector.jsx', roleSelector);
    }

    // 9. SignUpForm.jsx
    let signUpForm = fs.readFileSync('client/src/components/auth/SignUpForm.jsx', 'utf8');
    if (!signUpForm.includes('import PropTypes')) {
        signUpForm = signUpForm.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport PropTypes from 'prop-types';");
        signUpForm = signUpForm.replace("export default SignUpForm;", "SignUpForm.propTypes = {\n  onTabSwitch: PropTypes.func.isRequired\n};\n\nexport default SignUpForm;");
        fs.writeFileSync('client/src/components/auth/SignUpForm.jsx', signUpForm);
    }

    // 10. JoinClassroom.jsx
    let joinClassroom = fs.readFileSync('client/src/components/student/JoinClassroom.jsx', 'utf8');
    if (!joinClassroom.includes('import PropTypes')) {
        joinClassroom = joinClassroom.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport PropTypes from 'prop-types';");
        joinClassroom = joinClassroom.replace("export default JoinClassroom;", "JoinClassroom.propTypes = {\n  onJoined: PropTypes.func.isRequired,\n  profileId: PropTypes.string.isRequired\n};\n\nexport default JoinClassroom;");
        joinClassroom = joinClassroom.replace(/console\.log/g, '// console.log');
        joinClassroom = joinClassroom.replace(/console\.error/g, '// console.error');
        fs.writeFileSync('client/src/components/student/JoinClassroom.jsx', joinClassroom);
    }

    // 11. MyTeacherCard.jsx
    let myTeacherCard = fs.readFileSync('client/src/components/student/MyTeacherCard.jsx', 'utf8');
    if (!myTeacherCard.includes('import PropTypes')) {
        myTeacherCard = myTeacherCard.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        myTeacherCard = myTeacherCard.replace("export default MyTeacherCard;", "MyTeacherCard.propTypes = {\n  classroom: PropTypes.shape({\n    class_name: PropTypes.string,\n    teacher: PropTypes.shape({\n      avatar_url: PropTypes.string,\n      display_name: PropTypes.string\n    })\n  }).isRequired\n};\n\nexport default MyTeacherCard;");
        fs.writeFileSync('client/src/components/student/MyTeacherCard.jsx', myTeacherCard);
    }

    // 12. roleGuard.jsx
    let roleGuard = fs.readFileSync('client/src/utils/roleGuard.jsx', 'utf8');
    if (!roleGuard.includes('import PropTypes')) {
        roleGuard = roleGuard.replace("import React from 'react';", "import React from 'react';\nimport PropTypes from 'prop-types';");
        roleGuard = roleGuard.replace("export const RoleGuard", "RoleGuard.propTypes = {\n  children: PropTypes.node,\n  requiredRole: PropTypes.string\n};\n\nexport const RoleGuard");
        roleGuard = roleGuard.replace("export const withRoleGuard", "WithRoleGuard.propTypes = {\n  children: PropTypes.node,\n  requiredRole: PropTypes.string\n};\n\nexport const withRoleGuard");
        roleGuard = roleGuard.replace(/console\.error/g, '// console.error');
        fs.writeFileSync('client/src/utils/roleGuard.jsx', roleGuard);
    }

    // Replace all other console usages
    const filesToClean = [
        'client/src/pages/Lab3D.jsx',
        'client/src/pages/TeacherDashboard.jsx',
        'client/src/store/authStore.js',
        'client/src/store/classroomStore.js',
        'client/src/store/labStore.js',
        'client/src/supabaseClient.js',
        'client/src/utils/apiClient.js'
    ];

    filesToClean.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/console\.log/g, '// console.log');
        content = content.replace(/console\.error/g, '// console.error');
        content = content.replace(/console\.warn/g, '// console.warn');
        fs.writeFileSync(file, content);
    });

    // Extra fix for TeacherDashboard props
    let teacherDashboard = fs.readFileSync('client/src/pages/TeacherDashboard.jsx', 'utf8');
    if (!teacherDashboard.includes('import PropTypes')) {
        teacherDashboard = teacherDashboard.replace("import React, { useState, useEffect, useCallback, useMemo } from 'react';", "import React, { useState, useEffect, useCallback, useMemo } from 'react';\nimport PropTypes from 'prop-types';");
        teacherDashboard = teacherDashboard.replace("const StatCard = ({ title, value, icon, trend, loading }) => (", "const StatCard = ({ title, value, icon, trend, loading }) => (\n");
        // we'll just add it to the top
        teacherDashboard = teacherDashboard + "\nStatCard.propTypes = { title: PropTypes.string, value: PropTypes.any, icon: PropTypes.string, trend: PropTypes.string, loading: PropTypes.bool };\n";
        fs.writeFileSync('client/src/pages/TeacherDashboard.jsx', teacherDashboard);
    }
}

applyFixes();
