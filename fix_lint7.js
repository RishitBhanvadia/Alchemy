const fs = require('fs');

// CursorFollower: early return properly
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace('        if (isTouchDevice) return null;\n    return () => removeEventListeners();', '        return () => removeEventListeners();');
cursorFollower = cursorFollower.replace('    return (\n        <>\n', '    if (isTouchDevice) return null;\n    return (\n        <>\n');
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);
