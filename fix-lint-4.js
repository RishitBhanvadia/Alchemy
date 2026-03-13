const fs = require('fs');
function replaceInFile(filePath, search, replace) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content, 'utf8');
}
let f = 'client/src/components/3d-animations/DraggableFlask.jsx';
replaceInFile(f, "}, [camera, gl]);", "}, [camera, gl, locked, label]);");
