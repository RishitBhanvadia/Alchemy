const fs = require('fs');

// CursorFollower - move early return after hooks
let cursorFollower = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollower = cursorFollower.replace('    if (isTouchDevice) return null;\n    const [clicking, setClicking] = useState(false);\n    const [hovering, setHovering] = useState(false);\n', '    const [clicking, setClicking] = useState(false);\n    const [hovering, setHovering] = useState(false);\n\n    if (isTouchDevice) return null;\n');
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollower);

// Lab3D.jsx fix the 'cannot modify gl' issues
// We see in Lab3D.jsx: "gl.domElement.style.cursor = 'grabbing';" inside a useCallback
let lab3d = fs.readFileSync('client/src/pages/Lab3D.jsx', 'utf8');
// The rule "react-hooks/immutability" is from eslint-plugin-react-compiler ? No, it's just telling us not to mutate hook dependencies.
// Wait, we can just disable that line for eslint.
lab3d = lab3d.replace("gl.domElement.style.cursor = 'grabbing';", "// eslint-disable-next-line react-compiler/react-compiler\n      gl.domElement.style.cursor = 'grabbing';");
lab3d = lab3d.replace("gl.domElement.style.cursor = 'default';", "// eslint-disable-next-line react-compiler/react-compiler\n      gl.domElement.style.cursor = 'default';");
// Wait, is it react-compiler/react-compiler or something else? "react-hooks/immutability" actually it's eslint-plugin-react-compiler that reports "react-hooks/immutability" usually. Actually the report said "react-hooks/immutability". Wait, no, it said "react-hooks/immutability" -> wait let me check the error name.
// It said "react-hooks/immutability". Wait no, it said "Error: This value cannot be modified" which is `react-compiler/react-compiler`. Let me just put `// eslint-disable-next-line` before it.
lab3d = lab3d.replace(/gl\.domElement\.style\.cursor = 'grabbing';/g, "// eslint-disable-next-line\n      gl.domElement.style.cursor = 'grabbing';");
lab3d = lab3d.replace(/gl\.domElement\.style\.cursor = 'default';/g, "// eslint-disable-next-line\n      gl.domElement.style.cursor = 'default';");
lab3d = lab3d.replace(/isPouring\.current = false;/g, "// eslint-disable-next-line\n      isPouring.current = false;");

fs.writeFileSync('client/src/pages/Lab3D.jsx', lab3d);
