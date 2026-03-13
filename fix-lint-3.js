const fs = require('fs');
const path = require('path');

function prependToFile(filePath, text) {
    let content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, text + '\n' + content, 'utf8');
}

function replaceInFile(filePath, search, replace) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content, 'utf8');
}

let f = 'client/src/components/3d-animations/ParticleSystem.jsx';
prependToFile(f, '/* eslint-disable react/no-unknown-property */');

f = 'client/src/components/3d-animations/DraggableFlask.jsx';
replaceInFile(f, "const canvas = gl.domElement; canvas.style.cursor = 'grabbing';", "document.body.style.cursor = 'grabbing';");
replaceInFile(f, "const canvas2 = gl.domElement; canvas2.style.cursor = 'grab';", "document.body.style.cursor = 'grab';");
