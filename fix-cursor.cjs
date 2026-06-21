const fs = require('fs');
const filePath = 'client/src/components/CursorFollower.jsx';

let data = fs.readFileSync(filePath, 'utf8');

const regex = /if \(isTouchDevice\) return null;\s+const \[clicking, setClicking\] = useState\(false\);\s+const \[hovering, setHovering\] = useState\(false\);/;

if (regex.test(data)) {
  data = data.replace(regex, 'if (isTouchDevice) return null;');
  fs.writeFileSync(filePath, data, 'utf8');
  console.log('Fixed CursorFollower.jsx');
} else {
  console.log('Regex did not match.');
}
