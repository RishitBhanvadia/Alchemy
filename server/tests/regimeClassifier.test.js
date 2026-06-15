const { classifyRegime } = require('../utils/regimeClassifier');

describe('regimeClassifier', () => {
    it('handles ACID_DOMINANT', () => {
        expect(classifyRegime(70, 20, 0, 0)).toBe('ACID_DOMINANT');
    });

    it('handles BASE_DOMINANT', () => {
        expect(classifyRegime(20, 70, 0, 0)).toBe('BASE_DOMINANT');
    });

    it('handles NEUTRAL', () => {
        expect(classifyRegime(50, 50, 0, 0)).toBe('NEUTRAL');
    });

    it('handles CATALYST_DOMINANT', () => {
        expect(classifyRegime(0, 0, 0, 30)).toBe('CATALYST_DOMINANT');
    });

    it('handles INDICATOR_DOMINANT', () => {
        expect(classifyRegime(0, 0, 35, 0)).toBe('INDICATOR_DOMINANT');
    });

    it('handles CATALYST correctly even with trace A/B amounts (Fixing catch-all logic precedence)', () => {
        expect(classifyRegime(1, 0, 0, 30)).toBe('CATALYST_DOMINANT');
    });

    it('handles INDICATOR correctly even with trace A/B amounts (Fixing catch-all logic precedence)', () => {
        expect(classifyRegime(1, 0, 40, 0)).toBe('INDICATOR_DOMINANT');
    });
});
