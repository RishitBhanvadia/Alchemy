const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
    it('returns ACID_DOMINANT when ratio > 0.65', () => {
        expect(classifyRegime(70, 30)).toBe('ACID_DOMINANT');
    });

    it('returns BASE_DOMINANT when ratio < 0.35', () => {
        expect(classifyRegime(30, 70)).toBe('BASE_DOMINANT');
    });

    it('returns NEUTRAL when ratio is between 0.35 and 0.65', () => {
        expect(classifyRegime(50, 50)).toBe('NEUTRAL');
    });

    it('returns CATALYST_DOMINANT when catalyst > 20 and A+B < 20', () => {
        // Wait, if acidBaseSum > 0, it ALWAYS returns ACID_DOMINANT, BASE_DOMINANT, or NEUTRAL.
        // It NEVER reaches CATALYST_DOMINANT or INDICATOR_DOMINANT.
        expect(classifyRegime(10, 0, 0, 30)).toBe('CATALYST_DOMINANT');
    });
});
