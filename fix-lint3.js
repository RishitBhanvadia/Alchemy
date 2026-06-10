const fs = require('fs');

// CursorFollower.jsx early return
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace("    if (isTouchDevice) return null;\n    const [clicking, setClicking] = useState(false);\n    const [hovering, setHovering] = useState(false);", "    const [clicking, setClicking] = useState(false);\n    const [hovering, setHovering] = useState(false);\n\n    if (isTouchDevice) return null;");
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);

// CreateClassModal.jsx
let createClassModal = fs.readFileSync('client/src/components/CreateClassModal.jsx', 'utf8');
// Fix: jsx-a11y/no-noninteractive-element-interactions by removing the outer div wrapper interactions, or making it a presentation role. But wait, it's an overlay that closes the modal.
// Overlay should be a div with presentation role or a div with role=button? Actually, the error says "Non-interactive elements should not be assigned mouse or keyboard event listeners". This is triggered by a div with `role="dialog"` or similar having `onClick`.
// But wait, the `onClick={(e) => e.stopPropagation()}` on the dialog div causes this.
// Let's remove `onClick={(e) => e.stopPropagation()}` and `onClick={handleClose}` from the overlay, and use a standard backdrop implementation if possible. Or we can just change them to not have onClick?
// Actually, `role="presentation"` on the overlay or `aria-hidden` might help? Wait, `<div style={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">` triggers it because dialog is non-interactive but has onClick.
createClassModal = createClassModal.replace('<div style={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">', '<div style={styles.modal} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>');
createClassModal = createClassModal.replace('<div style={styles.overlay} onClick={handleClose} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === \'Enter\' || e.key === \' \') handleClose(e); }}>', '<div style={styles.overlay} onMouseDown={handleClose} role="presentation">');

fs.writeFileSync('client/src/components/CreateClassModal.jsx', createClassModal);
console.log("Fixes 3 applied");
