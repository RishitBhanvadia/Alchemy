const fs = require('fs');

// CursorFollower
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace('        const [hovering, setHovering] = useState(false);\n', '');
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);
