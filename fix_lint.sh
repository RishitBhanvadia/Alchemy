#!/bin/bash
cd client
npm install -D prop-types

# Add generic prop-types ignores or fix where easy
sed -i 's/export default function AiTutorPanel({ isOpen, onClose }) {/import PropTypes from "prop-types";\n\nexport default function AiTutorPanel({ isOpen, onClose }) {/g' src/components/AiTutorPanel.jsx
sed -i '/export default function AiTutorPanel/,$!b;//!b;/}/!b;a AiTutorPanel.propTypes = {\n  isOpen: PropTypes.bool.isRequired,\n  onClose: PropTypes.func.isRequired,\n};' src/components/AiTutorPanel.jsx
