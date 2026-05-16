const fs = require('fs');
const content = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');

const newContent = content.replace(
  "if (isTouchDevice) return null;",
  ""
);

fs.writeFileSync('client/src/components/CursorFollower.jsx', newContent);
