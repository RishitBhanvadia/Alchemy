const fs = require('fs');

function replaceInFile(file, search, replace) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
}

// 1. Lab3D.jsx
let lab3d = fs.readFileSync('client/src/pages/Lab3D.jsx', 'utf8');
lab3d = lab3d.replace("import { Suspense, lazy, useEffect, useState, useCallback } from 'react';", "import { Suspense, lazy, useEffect, useState } from 'react';");
fs.writeFileSync('client/src/pages/Lab3D.jsx', lab3d);

// 2. AuthPage.jsx
let authPage = fs.readFileSync('client/src/pages/AuthPage.jsx', 'utf8');
authPage = authPage.replace(/<a href="#" className="([^"]+)">Terms of Service<\/a>/, '<button type="button" className="$1 cursor-pointer">Terms of Service</button>');
authPage = authPage.replace(/<a href="#" className="([^"]+)">Privacy Policy<\/a>/, '<button type="button" className="$1 cursor-pointer">Privacy Policy</button>');
fs.writeFileSync('client/src/pages/AuthPage.jsx', authPage);

// 3. LoginForm.jsx
let loginForm = fs.readFileSync('client/src/components/auth/LoginForm.jsx', 'utf8');
loginForm = loginForm.replace(
    /<a href="#" className="text-\[12px\] font-medium text-\[#6366f1\] hover:text-\[#818cf8\] uppercase tracking-\[0\.05em\] transition-colors duration-150 unhover:no-underline hover:underline">\s*Forgot password\?\s*<\/a>/m,
    '<button type="button" className="text-[12px] font-medium text-[#6366f1] hover:text-[#818cf8] uppercase tracking-[0.05em] transition-colors duration-150 hover:underline cursor-pointer">\n            Forgot password?\n          </button>'
);
fs.writeFileSync('client/src/components/auth/LoginForm.jsx', loginForm);

// 4. RoleCard.jsx
let roleCard = fs.readFileSync('client/src/components/auth/RoleCard.jsx', 'utf8');
roleCard = roleCard.replace("import { GraduationCap, FlaskConical, Check } from 'lucide-react';", "import { GraduationCap, FlaskConical } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/RoleCard.jsx', roleCard);

// 5. CTAButton.jsx
let ctaButton = fs.readFileSync('client/src/components/auth/CTAButton.jsx', 'utf8');
ctaButton = ctaButton.replace("import { ArrowRight, Loader2, UserPlus, Atom } from 'lucide-react';", "import { ArrowRight, UserPlus, Atom } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/CTAButton.jsx', ctaButton);

// 6. SignUpForm.jsx
// React has a bug or eslint-plugin-jsx-a11y gets confused by `role="student"` because `role` is an HTML attribute for ARIA roles.
// Since it's a custom component RoleCard, we should rename the prop from `role` to `userRole`.
let signUpForm = fs.readFileSync('client/src/components/auth/SignUpForm.jsx', 'utf8');
signUpForm = signUpForm.replace(/<RoleCard \n            role="student"/g, '<RoleCard \n            userRole="student"');
signUpForm = signUpForm.replace(/<RoleCard \n            role="teacher"/g, '<RoleCard \n            userRole="teacher"');
fs.writeFileSync('client/src/components/auth/SignUpForm.jsx', signUpForm);

roleCard = fs.readFileSync('client/src/components/auth/RoleCard.jsx', 'utf8');
roleCard = roleCard.replace("const RoleCard = ({ role, selected, onSelect }) => {", "const RoleCard = ({ userRole, selected, onSelect }) => {");
roleCard = roleCard.replace("const isStudent = role === 'student';", "const isStudent = userRole === 'student';");
roleCard = roleCard.replace("onClick={() => onSelect(role)}", "onClick={() => onSelect(userRole)}");
fs.writeFileSync('client/src/components/auth/RoleCard.jsx', roleCard);

console.log("Fixes applied");
