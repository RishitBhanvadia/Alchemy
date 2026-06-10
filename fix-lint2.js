const fs = require('fs');

// CursorFollower.jsx parsing error: Identifier 'clicking' has already been declared
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace("    const [clicking, setClicking] = useState(false);\n    const [hovering, setHovering] = useState(false);\n\n    if (isTouchDevice) return null;", "    if (isTouchDevice) return null;");
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);

// CreateClassModal.jsx
let createClassModal = fs.readFileSync('client/src/components/CreateClassModal.jsx', 'utf8');
// Fix: jsx-a11y/no-static-element-interactions & jsx-a11y/click-events-have-key-events
createClassModal = createClassModal.replace('<div style={styles.overlay} onClick={handleClose}>', '<div style={styles.overlay} onClick={handleClose} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === \'Enter\' || e.key === \' \') handleClose(e); }}>');
createClassModal = createClassModal.replace('<div style={styles.modal} onClick={(e) => e.stopPropagation()}>', '<div style={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">');
fs.writeFileSync('client/src/components/CreateClassModal.jsx', createClassModal);

console.log("Fixes 2 applied");
