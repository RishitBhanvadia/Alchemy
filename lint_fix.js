const fs = require('fs');

const fixUnused = (file, varName) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(new RegExp(`\\b${varName}\\b,?\\s*`, 'g'), '');
  fs.writeFileSync(file, content);
};

let content;
let file;

// client/src/components/auth/CTAButton.jsx: Loader2
file = 'client/src/components/auth/CTAButton.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/Loader2,? /g, '');
fs.writeFileSync(file, content);

// client/src/components/auth/RoleCard.jsx: Check
file = 'client/src/components/auth/RoleCard.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/Check,? /g, '');
fs.writeFileSync(file, content);

// client/src/components/auth/LoginForm.jsx: anchor-is-valid
file = 'client/src/components/auth/LoginForm.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<a href="#"([^>]*)>/g, '<button type="button" onClick={(e) => e.preventDefault()} $1>');
content = content.replace(/<\/a>/g, '</button>');
fs.writeFileSync(file, content);

// client/src/pages/AuthPage.jsx: anchor-is-valid
file = 'client/src/pages/AuthPage.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/<a href="#"([^>]*)>/g, '<button type="button" onClick={(e) => e.preventDefault()} $1>');
content = content.replace(/<\/a>/g, '</button>');
fs.writeFileSync(file, content);

// client/src/pages/Lab3D.jsx: useCallback
file = 'client/src/pages/Lab3D.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/useCallback,? /g, '');
fs.writeFileSync(file, content);

// client/src/components/auth/SignUpForm.jsx: aria-role
file = 'client/src/components/auth/SignUpForm.jsx';
content = fs.readFileSync(file, 'utf8');
// Elements with ARIA roles must use a valid, non-abstract ARIA role  jsx-a11y/aria-role
// It's probably `role="student"` or `role="teacher"` instead of proper roles. We can change it to `roleType="student"` or similar if it's a prop, or remove it. Let's see.
