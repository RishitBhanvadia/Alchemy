const fs = require('fs');

let content = fs.readFileSync('client/src/pages/history.jsx', 'utf8');

// I noticed from the previous eslint output that prop-types warnings persist because created_at might be required? Actually the warning in history.jsx is:
//   39:53  warning  'exp' is missing in props validation                  react/prop-types
//   46:51  warning  'exp.color' is missing in props validation            react/prop-types
//   48:54  warning  'exp.outcome_label' is missing in props validation    react/prop-types
//   51:51  warning  'exp.created_at' is missing in props validation       react/prop-types
//   53:47  warning  'exp.experiment_type' is missing in props validation  react/prop-types
// It seems the prop types definition is not matching correctly because it's defined after `export default History;` or the linter doesn't pick it up properly.
// The line `39:53` matches `const HistoryRow = React.memo(function HistoryRow({ exp }) { return (`

// Move HistoryRow.propTypes to right after HistoryRow.displayName
content = content.replace(/HistoryRow\.propTypes = \{[\s\S]*?\}\.isRequired,\n\};\n/, '');

const propTypesCode = `
HistoryRow.propTypes = {
    exp: PropTypes.shape({
        id: PropTypes.string,
        color: PropTypes.string,
        outcome_label: PropTypes.string,
        created_at: PropTypes.string,
        experiment_type: PropTypes.string,
        chem_a: PropTypes.number,
        chem_b: PropTypes.number,
        chem_i: PropTypes.number,
        chem_c: PropTypes.number,
    }).isRequired,
};
`;

content = content.replace("HistoryRow.displayName = 'HistoryRow';", "HistoryRow.displayName = 'HistoryRow';" + propTypesCode);

fs.writeFileSync('client/src/pages/history.jsx', content);
