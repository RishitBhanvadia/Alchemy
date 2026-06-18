const fs = require('fs');

// 1. App.jsx - Fix console log
let appJsx = fs.readFileSync('client/src/App.jsx', 'utf8');
appJsx = appJsx.replace(/console\.log\('Redirecting to:', target, 'Profile role:', profile\.role\);/, "// console.log('Redirecting to:', target, 'Profile role:', profile.role);");
fs.writeFileSync('client/src/App.jsx', appJsx);

// 2. AuthPage.jsx - Fix anchor tags
let authPageJsx = fs.readFileSync('client/src/pages/AuthPage.jsx', 'utf8');
authPageJsx = authPageJsx.replace(/<a href="#" className="text-lab-cyan hover:text-lab-cyan\/80 transition-colors">/g, '<button type="button" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors cursor-pointer bg-transparent border-none p-0 inline font-inherit">');
authPageJsx = authPageJsx.replace(/<\/a>/g, '</button>');
fs.writeFileSync('client/src/pages/AuthPage.jsx', authPageJsx);

// 3. LoginForm.jsx - Fix anchor tags
let loginFormJsx = fs.readFileSync('client/src/components/auth/LoginForm.jsx', 'utf8');
loginFormJsx = loginFormJsx.replace(/<a href="#" className="text-\[12px\] font-medium text-\[#6366f1\] hover:text-\[#818cf8\] uppercase tracking-\[0\.05em\] transition-colors duration-150 unhover:no-underline hover:underline">/, '<button type="button" className="text-[12px] font-medium text-[#6366f1] hover:text-[#818cf8] uppercase tracking-[0.05em] transition-colors duration-150 unhover:no-underline hover:underline cursor-pointer bg-transparent border-none p-0">');
loginFormJsx = loginFormJsx.replace(/Forgot Password\?<\/a>/, 'Forgot Password?</button>');
fs.writeFileSync('client/src/components/auth/LoginForm.jsx', loginFormJsx);

// 4. SignUpForm.jsx - Fix aria roles
let signUpFormJsx = fs.readFileSync('client/src/components/auth/SignUpForm.jsx', 'utf8');
signUpFormJsx = signUpFormJsx.replace(/role="student"/g, 'userRole="student"');
signUpFormJsx = signUpFormJsx.replace(/role="teacher"/g, 'userRole="teacher"');
signUpFormJsx = signUpFormJsx.replace(/options: \{\n          data: \{ full_name: formData\.fullName, role: formData\.role \}/g, 'options: {\n          data: { full_name: formData.fullName, role: formData.role }');
fs.writeFileSync('client/src/components/auth/SignUpForm.jsx', signUpFormJsx);

// 5. RoleCard.jsx - Update to receive userRole
let roleCardJsx = fs.readFileSync('client/src/components/auth/RoleCard.jsx', 'utf8');
roleCardJsx = roleCardJsx.replace(/const RoleCard = \(\{ role, selected, onSelect \}\) => \{/g, "const RoleCard = ({ userRole, selected, onSelect }) => {");
roleCardJsx = roleCardJsx.replace(/const isStudent = role === 'student';/g, "const isStudent = userRole === 'student';");
roleCardJsx = roleCardJsx.replace(/onClick=\{\(\) => onSelect\(role\)\}/g, "onClick={() => onSelect(userRole)}");
roleCardJsx = roleCardJsx.replace(/import \{ GraduationCap, FlaskConical, Check \} from 'lucide-react';/g, "import { GraduationCap, FlaskConical } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/RoleCard.jsx', roleCardJsx);

// 6. CTAButton.jsx - Fix unused Loader2
let ctaButtonJsx = fs.readFileSync('client/src/components/auth/CTAButton.jsx', 'utf8');
ctaButtonJsx = ctaButtonJsx.replace(/import \{ Loader2, ArrowRight, UserPlus \} from 'lucide-react';/, "import { ArrowRight, UserPlus } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/CTAButton.jsx', ctaButtonJsx);

// 7. CursorFollower.jsx - Fix duplicate variables
let cursorFollowerJsx = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollowerJsx = cursorFollowerJsx.replace(/    const \[clicking, setClicking\] = useState\(false\);\n    const \[hovering, setHovering\] = useState\(false\);\n\n    if \(isTouchDevice\) return null;\n    const \[clicking, setClicking\] = useState\(false\);\n    const \[hovering, setHovering\] = useState\(false\);/, "    if (isTouchDevice) return null;\n");
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollowerJsx);

// 8. CreateClassModal.jsx - Fix a11y roles
let createClassModalJsx = fs.readFileSync('client/src/components/CreateClassModal.jsx', 'utf8');
createClassModalJsx = createClassModalJsx.replace(/<div style=\{styles\.overlay\} onClick=\{handleClose\}>/, '<div style={styles.overlay} onClick={handleClose} role="presentation">');
createClassModalJsx = createClassModalJsx.replace(/<div style=\{styles\.modal\} onClick=\{\(e\) => e\.stopPropagation\(\)\}>/, '<div style={styles.modal} onClick={(e) => e.stopPropagation()} role="presentation">');
fs.writeFileSync('client/src/components/CreateClassModal.jsx', createClassModalJsx);

// 9. AiTutorPanel.jsx - Fix console.error & add propTypes
let aiTutorPanelJsx = fs.readFileSync('client/src/components/AiTutorPanel.jsx', 'utf8');
aiTutorPanelJsx = aiTutorPanelJsx.replace(/import React, \{ useState, useRef, useEffect \} from 'react';/, "import React, { useState, useRef, useEffect } from 'react';\nimport PropTypes from 'prop-types';");
aiTutorPanelJsx = aiTutorPanelJsx.replace(/console\.error\('AI Tutorial error:', error\);/, "// console.error('AI Tutorial error:', error);");
aiTutorPanelJsx += "\n\nAiTutorPanel.propTypes = {\n  isOpen: PropTypes.bool.isRequired,\n  onClose: PropTypes.func.isRequired\n};\n";
fs.writeFileSync('client/src/components/AiTutorPanel.jsx', aiTutorPanelJsx);

// 10. CanvasContainer.jsx - Fix console logs
let canvasContainerJsx = fs.readFileSync('client/src/components/3d-animations/CanvasContainer.jsx', 'utf8');
canvasContainerJsx = canvasContainerJsx.replace(/console\.warn\('\[CanvasContainer\] WebGL context lost — will attempt restore'\);/, "// console.warn('[CanvasContainer] WebGL context lost — will attempt restore');");
canvasContainerJsx = canvasContainerJsx.replace(/console\.warn\('\[CanvasContainer\] WebGL context restored'\);/, "// console.warn('[CanvasContainer] WebGL context restored');");
fs.writeFileSync('client/src/components/3d-animations/CanvasContainer.jsx', canvasContainerJsx);

// 11. Lab3D.jsx - Fix unused import
let lab3dJsx = fs.readFileSync('client/src/pages/Lab3D.jsx', 'utf8');
lab3dJsx = lab3dJsx.replace(/import \{ Suspense, lazy, useEffect, useState, useCallback \} from 'react';/, "import { Suspense, lazy, useEffect, useState } from 'react';");
fs.writeFileSync('client/src/pages/Lab3D.jsx', lab3dJsx);

console.log('Linting issues fixed');
