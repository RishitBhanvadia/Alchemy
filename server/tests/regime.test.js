const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
    it('should classify NEUTRAL correctly', () => {
        expect(classifyRegime(50, 50)).toBe('NEUTRAL');
    });
    it('should classify ACID_DOMINANT correctly', () => {
        expect(classifyRegime(70, 30)).toBe('ACID_DOMINANT');
    });
    it('should classify BASE_DOMINANT correctly', () => {
        expect(classifyRegime(30, 70)).toBe('BASE_DOMINANT');
    });
    it('should handle catalyst dominance correctly', () => {
        // Here, a=0, b=0, i=0, c=100. acidBaseSum = 0.
        expect(classifyRegime(0, 0, 0, 100)).toBe('CATALYST_DOMINANT');
    });
    it('should handle indicator dominance correctly', () => {
        expect(classifyRegime(0, 0, 100, 0)).toBe('INDICATOR_DOMINANT');
    });
    it('should NOT classify as ACID_DOMINANT if only 1% acid and 99% catalyst', () => {
        // Currently a=1, b=0, c=99.
        // acidBaseSum = 1.
        // acidBaseSum > 0 is true.
        // ratio = 1 / 1 = 1 > 0.65 -> Returns ACID_DOMINANT!
        expect(classifyRegime(1, 0, 0, 99)).toBe('CATALYST_DOMINANT');
    });
});
