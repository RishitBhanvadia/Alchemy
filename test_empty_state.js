const fs = require('fs');
let code = fs.readFileSync('client/src/components/EmptyState.jsx', 'utf8');
code = code.replace("import './EmptyState.css';", "import PropTypes from 'prop-types';\nimport './EmptyState.css';");
code = code + "\nEmptyState.propTypes = { icon: PropTypes.node, title: PropTypes.string, description: PropTypes.string, actionLabel: PropTypes.string, onAction: PropTypes.func, className: PropTypes.string };\n";
fs.writeFileSync('client/src/components/EmptyState.jsx', code);
