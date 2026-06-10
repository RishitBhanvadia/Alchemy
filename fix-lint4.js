const fs = require('fs');

// CursorFollower.jsx early return
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace("    if (isTouchDevice) return null;", "");
cursorFollower = cursorFollower.replace("    return (\n        <>", "    if (isTouchDevice) return null;\n\n    return (\n        <>");
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);

// CreateClassModal.jsx
let createClassModal = fs.readFileSync('client/src/components/CreateClassModal.jsx', 'utf8');
createClassModal = createClassModal.replace('<div style={styles.modal} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>', '<div style={styles.modal} role="dialog" aria-modal="true">');
fs.writeFileSync('client/src/components/CreateClassModal.jsx', createClassModal);

console.log("Fixes 4 applied");
