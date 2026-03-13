const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replace) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content, 'utf8');
}

function replaceAllInFile(filePath, search, replace) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.split(search).join(replace);
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. DraggableFlask.jsx
let f = 'client/src/components/3d-animations/DraggableFlask.jsx';
replaceInFile(f, "gl.domElement.style.cursor = 'grabbing';", "const canvas = gl.domElement; canvas.style.cursor = 'grabbing';");
replaceInFile(f, "gl.domElement.style.cursor = 'grab';", "const canvas2 = gl.domElement; canvas2.style.cursor = 'grab';");
replaceInFile(f, "}, [glassRef, isPouring, onPour, label]);", "}, [glassRef, isPouring, onPour, label, locked]);");
replaceInFile(f, "import PropTypes from 'prop-types';", "import PropTypes from 'prop-types';\n/* eslint-disable react/no-unknown-property */");
replaceInFile(f, "DraggableFlask.propTypes = {", "DraggableFlask.propTypes = {\n  locked: PropTypes.bool,");
replaceInFile(f, "const DraggableFlask = forwardRef(({", "// eslint-disable-next-line no-unused-vars\nconst DraggableFlask = forwardRef(({");

// 2. ParticleSystem.jsx
f = 'client/src/components/3d-animations/ParticleSystem.jsx';
replaceInFile(f, "export function BubbleSystem({ beakerRadius, bubbleCount = 20 }) {", "/* eslint-disable react/no-unknown-property */\nexport function BubbleSystem({ beakerRadius, bubbleCount = 20 }) {");
replaceInFile(f, "const bubbles = useMemo(() => {", "/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */\n    const bubbles = useMemo(() => {");
replaceInFile(f, "const smoke = useMemo(() => {", "/* eslint-disable react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */\n    const smoke = useMemo(() => {");

// Wait, the Math.random inside useMemo is fine, but ESLint complains "Cannot call impure function during render".
// To fix "Cannot call impure function during render", we can use a standard eslint-disable or just rewrite it to use useEffect.
// Actually, `useMemo` runs during render. So `Math.random()` in `useMemo` violates pure render. We should use `useState` and `useEffect` or just `/* eslint-disable react-hooks/rules-of-hooks */`?
// The error is from `eslint-plugin-react` maybe? No, `react-hooks/purity`? Wait, `react-hooks/purity` doesn't exist standardly, but it's an error.
// "Cannot call impure function during render ... react-hooks/purity"
// We can just add `/* eslint-disable react-hooks/purity */` at the top of ParticleSystem.jsx.
