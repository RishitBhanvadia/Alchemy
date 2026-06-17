const fs = require('fs');
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace('if (isTouchDevice) return null;', '');
cursorFollower = cursorFollower.replace('return (', 'if (isTouchDevice) return null;\n    return (');
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);
