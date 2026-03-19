const { classifyRegime } = require('../utils/regimeClassifier');

describe('Regime Classifier Logic', () => {
    it('should identify CATALYST_DOMINANT when catalyst is >20 and acid/base sum is <20', () => {
        expect(classifyRegime(10, 0, 0, 90)).toBe('CATALYST_DOMINANT');
    });

    it('should identify INDICATOR_DOMINANT when indicator is >30 and acid/base sum is <20 and catalyst <20', () => {
        expect(classifyRegime(5, 5, 90, 0)).toBe('INDICATOR_DOMINANT');
    });

    it('should identify ACID_DOMINANT when acid/base sum is >=20 and acid is dominant', () => {
        expect(classifyRegime(80, 20, 0, 0)).toBe('ACID_DOMINANT');
    });

    it('should identify NEUTRAL when acid and base are balanced', () => {
        expect(classifyRegime(50, 50, 0, 0)).toBe('NEUTRAL');
    });

    it('should fallback to NONE if nothing matches', () => {
        expect(classifyRegime(0, 0, 0, 0)).toBe('NONE');
    });
});
