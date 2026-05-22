const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime bug', () => {
    it('shows early return bug when acidBaseSum > 0', () => {
        // If we have 10% acid, 0% base, 40% indicator, 10% catalyst
        // acidBaseSum = 10.
        // The first if block catches it and returns 'ACID_DOMINANT'
        // Even though Indicator is 40% and catalyst is 10%, which should be INDICATOR_DOMINANT
        // based on the logic below it:
        // if (chem_i > 30 && acidBaseSum < 20 && chem_c < 20) { return 'INDICATOR_DOMINANT'; }

        expect(classifyRegime(10, 0, 40, 10)).toBe('INDICATOR_DOMINANT');
    });
});
