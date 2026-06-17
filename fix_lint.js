const fs = require('fs');

function replaceAll(file, search, replace) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
}

// 1. client/src/pages/Lab3D.jsx
let lab3d = fs.readFileSync('client/src/pages/Lab3D.jsx', 'utf8');
lab3d = lab3d.replace("import { Suspense, lazy, useEffect, useState, useCallback } from 'react';", "import { Suspense, lazy, useEffect, useState } from 'react';");
fs.writeFileSync('client/src/pages/Lab3D.jsx', lab3d);

// 2. client/src/pages/AuthPage.jsx
let authPage = fs.readFileSync('client/src/pages/AuthPage.jsx', 'utf8');
authPage = authPage.replace('<a href="#" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors">Terms of Service</a>', '<button type="button" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-[11px]">Terms of Service</button>');
authPage = authPage.replace('<a href="#" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors">Privacy Policy</a>', '<button type="button" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-[11px]">Privacy Policy</button>');
fs.writeFileSync('client/src/pages/AuthPage.jsx', authPage);

// 3. client/src/components/auth/SignUpForm.jsx
let signUpForm = fs.readFileSync('client/src/components/auth/SignUpForm.jsx', 'utf8');
signUpForm = signUpForm.replace('role="student"', 'userRole="student"');
signUpForm = signUpForm.replace('role="teacher"', 'userRole="teacher"');
fs.writeFileSync('client/src/components/auth/SignUpForm.jsx', signUpForm);

// 4. client/src/components/auth/RoleCard.jsx
let roleCard = fs.readFileSync('client/src/components/auth/RoleCard.jsx', 'utf8');
roleCard = roleCard.replace("import { GraduationCap, FlaskConical, Check } from 'lucide-react';", "import { GraduationCap, FlaskConical } from 'lucide-react';");
// RoleCard also uses `role` as prop, wait is that the role we just replaced?
// signUpForm was passing `role="student"`. We replaced it with `userRole="student"`.
// So we must update RoleCard to accept `userRole` instead of `role`.
roleCard = roleCard.replace("const RoleCard = ({ role, selected, onSelect }) => {", "const RoleCard = ({ userRole, selected, onSelect }) => {");
roleCard = roleCard.replace("const isStudent = role === 'student';", "const isStudent = userRole === 'student';");
roleCard = roleCard.replace("onClick={() => onSelect(role)}", "onClick={() => onSelect(userRole)}");
fs.writeFileSync('client/src/components/auth/RoleCard.jsx', roleCard);

// 5. client/src/components/auth/LoginForm.jsx
let loginForm = fs.readFileSync('client/src/components/auth/LoginForm.jsx', 'utf8');
loginForm = loginForm.replace('<a href="#" className="text-[12px] font-medium text-[#6366f1] hover:text-[#818cf8] uppercase tracking-[0.05em] transition-colors duration-150 unhover:no-underline hover:underline">', '<button type="button" className="text-[12px] font-medium text-[#6366f1] hover:text-[#818cf8] uppercase tracking-[0.05em] transition-colors duration-150 bg-transparent border-none p-0 cursor-pointer hover:underline">');
loginForm = loginForm.replace('Forgot password?</a>', 'Forgot password?</button>');
fs.writeFileSync('client/src/components/auth/LoginForm.jsx', loginForm);

// 6. client/src/components/auth/CTAButton.jsx
let ctaButton = fs.readFileSync('client/src/components/auth/CTAButton.jsx', 'utf8');
ctaButton = ctaButton.replace("import { ArrowRight, Loader2, UserPlus, Atom } from 'lucide-react';", "import { ArrowRight, UserPlus, Atom } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/CTAButton.jsx', ctaButton);
