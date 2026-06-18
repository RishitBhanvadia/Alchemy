const fs = require('fs');

function addPropTypes(filepath, componentName, propsObject) {
  let content = fs.readFileSync(filepath, 'utf8');
  if (!content.includes("import PropTypes from 'prop-types';")) {
    content = content.replace(/(import React.*?from 'react';)/, "$1\nimport PropTypes from 'prop-types';");
  }

  const propTypesStr = `\n${componentName}.propTypes = {\n` +
    Object.entries(propsObject).map(([key, type]) => `  ${key}: PropTypes.${type}`).join(',\n') +
    `\n};\n`;

  if (!content.includes(`${componentName}.propTypes =`)) {
    content = content.replace(new RegExp(`(export default ${componentName};)`), propTypesStr + "\n$1");
  }
  fs.writeFileSync(filepath, content);
}

// ResultModal
addPropTypes('client/src/components/ResultModal.jsx', 'ResultModal', {
  isOpen: 'bool.isRequired',
  result: 'shape({\n    outcome_label: PropTypes.string,\n    product_formula: PropTypes.string,\n    color: PropTypes.string,\n    state_change: PropTypes.string,\n    thermal_effect: PropTypes.string,\n    is_dangerous: PropTypes.bool\n  })',
  onReset: 'func.isRequired',
  onClose: 'func.isRequired',
  onAskAI: 'func.isRequired'
});

// SkeletonBlock
addPropTypes('client/src/components/SkeletonBlock.jsx', 'SkeletonBlock', {
  width: 'string',
  height: 'string',
  borderRadius: 'string',
  className: 'string'
});
let skeletonBlockJsx = fs.readFileSync('client/src/components/SkeletonBlock.jsx', 'utf8');
if (!skeletonBlockJsx.includes("SkeletonText.propTypes =")) {
    skeletonBlockJsx = skeletonBlockJsx.replace(/(export const SkeletonCard =)/, `SkeletonText.propTypes = {\n  lines: PropTypes.number,\n  className: PropTypes.string\n};\n\n$1`);
}
if (!skeletonBlockJsx.includes("SkeletonCard.propTypes =")) {
    skeletonBlockJsx = skeletonBlockJsx.replace(/(export const SkeletonTableRow =)/, `SkeletonCard.propTypes = {\n  className: PropTypes.string\n};\n\n$1`);
}
if (!skeletonBlockJsx.includes("SkeletonTableRow.propTypes =")) {
    skeletonBlockJsx = skeletonBlockJsx.replace(/(export default SkeletonBlock;)/, `SkeletonTableRow.propTypes = {\n  columns: PropTypes.number,\n  className: PropTypes.string\n};\n\n$1`);
}
fs.writeFileSync('client/src/components/SkeletonBlock.jsx', skeletonBlockJsx);


// SkeletonLoader
let skeletonLoaderJsx = fs.readFileSync('client/src/components/SkeletonLoader.jsx', 'utf8');
if (!skeletonLoaderJsx.includes("import PropTypes from 'prop-types';")) {
  skeletonLoaderJsx = "import PropTypes from 'prop-types';\n" + skeletonLoaderJsx;
}
if (!skeletonLoaderJsx.includes("GenericSkeleton.propTypes =")) {
    skeletonLoaderJsx += `\nGenericSkeleton.propTypes = { className: PropTypes.string, style: PropTypes.object };\n`;
}
fs.writeFileSync('client/src/components/SkeletonLoader.jsx', skeletonLoaderJsx);

// StudentAnalyticsChart
addPropTypes('client/src/components/StudentAnalyticsChart.jsx', 'StudentAnalyticsChart', {
  noDataMessage: 'string'
});

// SuccessCelebration
addPropTypes('client/src/components/SuccessCelebration.jsx', 'SuccessCelebration', {
  active: 'bool.isRequired',
  onComplete: 'func.isRequired'
});

// AuthCard
addPropTypes('client/src/components/auth/AuthCard.jsx', 'AuthCard', {
  children: 'node.isRequired'
});

// AuthPage
addPropTypes('client/src/components/auth/AuthPage.jsx', 'AuthPage', {
  children: 'node.isRequired'
});

// CTAButton
addPropTypes('client/src/components/auth/CTAButton.jsx', 'CTAButton', {
  children: 'node.isRequired',
  onClick: 'func',
  loading: 'bool',
  type: 'string',
  icon: 'oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.object])'
});

// InputField
addPropTypes('client/src/components/auth/InputField.jsx', 'InputField', {
  label: 'string.isRequired',
  icon: 'oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.object]).isRequired',
  type: 'string',
  placeholder: 'string',
  value: 'string.isRequired',
  onChange: 'func.isRequired',
  onBlur: 'func',
  error: 'string',
  name: 'string.isRequired',
  disabled: 'bool'
});

// RoleCard
addPropTypes('client/src/components/auth/RoleCard.jsx', 'RoleCard', {
  userRole: 'string.isRequired',
  selected: 'bool.isRequired',
  onSelect: 'func.isRequired'
});

// RoleSelector
addPropTypes('client/src/components/auth/RoleSelector.jsx', 'RoleSelector', {
  selectedRole: 'string',
  setSelectedRole: 'func.isRequired',
  error: 'string'
});

// SignUpForm
addPropTypes('client/src/components/auth/SignUpForm.jsx', 'SignUpForm', {
  onTabSwitch: 'func.isRequired'
});

// TabSwitcher
addPropTypes('client/src/components/auth/TabSwitcher.jsx', 'TabSwitcher', {
  activeTab: 'string.isRequired',
  onTabChange: 'func.isRequired'
});

// JoinClassroom
addPropTypes('client/src/components/student/JoinClassroom.jsx', 'JoinClassroom', {
  onJoined: 'func.isRequired',
  profileId: 'string'
});

// MyTeacherCard
addPropTypes('client/src/components/student/MyTeacherCard.jsx', 'MyTeacherCard', {
  classroom: 'shape({\n    class_name: PropTypes.string,\n    meeting_link: PropTypes.string,\n    meeting_type: PropTypes.string,\n    teacher: PropTypes.shape({\n      avatar_url: PropTypes.string,\n      display_name: PropTypes.string\n    })\n  })'
});

// TeacherDashboard
addPropTypes('client/src/pages/TeacherDashboard.jsx', 'TeacherDashboard', {
  analytics: 'bool'
});

// MeetingCodeCard
addPropTypes('client/src/components/MeetingCodeCard.jsx', 'MeetingCodeCard', {
  code: 'string.isRequired',
  meetingUrl: 'string.isRequired',
  platform: 'string.isRequired',
  onClose: 'func.isRequired'
});

// roleGuard
let roleGuardJsx = fs.readFileSync('client/src/utils/roleGuard.jsx', 'utf8');
if (!roleGuardJsx.includes("import PropTypes from 'prop-types';")) {
  roleGuardJsx = roleGuardJsx.replace(/(import React.*?from 'react';)/, "$1\nimport PropTypes from 'prop-types';");
}
if (!roleGuardJsx.includes("PrivateRoute.propTypes =")) {
    roleGuardJsx += `\nPrivateRoute.propTypes = {\n  children: PropTypes.node.isRequired\n};\n`;
}
if (!roleGuardJsx.includes("RoleRoute.propTypes =")) {
    roleGuardJsx += `\nRoleRoute.propTypes = {\n  children: PropTypes.node.isRequired,\n  requiredRole: PropTypes.string.isRequired\n};\n`;
}
fs.writeFileSync('client/src/utils/roleGuard.jsx', roleGuardJsx);

// EmptyState
addPropTypes('client/src/components/EmptyState.jsx', 'EmptyState', {
  icon: 'string',
  title: 'string.isRequired',
  description: 'string.isRequired',
  actionLabel: 'string',
  onAction: 'func',
  className: 'string'
});

// LoadingOverlay
addPropTypes('client/src/components/LoadingOverlay.jsx', 'LoadingOverlay', {
  message: 'string'
});


console.log('Prop types added');
