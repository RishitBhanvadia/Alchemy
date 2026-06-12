const { classifyRegime } = require('../utils/regimeClassifier');

describe('regimeClassifier', () => {
    it('should classify as ACID_DOMINANT when acid ratio > 0.65', () => {
        expect(classifyRegime(70, 30, 0, 0)).toBe('ACID_DOMINANT');
    });

    it('should classify as BASE_DOMINANT when acid ratio < 0.35', () => {
        expect(classifyRegime(30, 70, 0, 0)).toBe('BASE_DOMINANT');
    });

    it('should classify as NEUTRAL when acid ratio is between 0.35 and 0.65', () => {
        expect(classifyRegime(50, 50, 0, 0)).toBe('NEUTRAL');
    });

    it('should classify as CATALYST_DOMINANT when catalyst > 20 and A+B < 20', () => {
        expect(classifyRegime(5, 5, 0, 25)).toBe('CATALYST_DOMINANT');
    });

    it('should classify as INDICATOR_DOMINANT when indicator > 30 and others minimal', () => {
        expect(classifyRegime(5, 5, 35, 10)).toBe('INDICATOR_DOMINANT');
    });

    it('should return NONE when no chemicals are present', () => {
        expect(classifyRegime(0, 0, 0, 0)).toBe('NONE');
    });
});
