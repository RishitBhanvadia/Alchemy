const fs = require('fs');
const file = 'client/src/components/CreateClassModal.jsx';
let content = fs.readFileSync(file, 'utf8');

// Undo bad comments
content = content.replace('/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */', '');
content = content.replace('/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */', '');

fs.writeFileSync(file, content);
