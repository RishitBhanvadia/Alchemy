const fs = require('fs');

// 1. fix LoginForm
let loginForm = fs.readFileSync('client/src/components/auth/LoginForm.jsx', 'utf8');
loginForm = loginForm.replace('Forgot password?\n          </a>', 'Forgot password?\n          </button>');
fs.writeFileSync('client/src/components/auth/LoginForm.jsx', loginForm);

// 2. fix clicking redeclaration in CursorFollower
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace('let clicking = false;', '');
// let's just check the file first
