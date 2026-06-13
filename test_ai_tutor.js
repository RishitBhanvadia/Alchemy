const fs = require('fs');
let code = fs.readFileSync('client/src/components/AiTutorPanel.jsx', 'utf8');
code = code.replace("import './AiTutorPanel.css';", "import PropTypes from 'prop-types';\nimport './AiTutorPanel.css';");
code = code + "\nAiTutorPanel.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };\n";
fs.writeFileSync('client/src/components/AiTutorPanel.jsx', code);
