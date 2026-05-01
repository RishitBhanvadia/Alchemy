const { classifyRegime } = require('../../utils/regimeClassifier');

describe('classifyRegime', () => {
    it('should classify as ACID_DOMINANT when acid ratio is > 0.65', () => {
        expect(classifyRegime(70, 30)).toBe('ACID_DOMINANT');
    });

    it('should classify as BASE_DOMINANT when acid ratio is < 0.35', () => {
        expect(classifyRegime(30, 70)).toBe('BASE_DOMINANT');
    });

    it('should classify as NEUTRAL when acid ratio is between 0.35 and 0.65 inclusive', () => {
        expect(classifyRegime(50, 50)).toBe('NEUTRAL');
        expect(classifyRegime(65, 35)).toBe('NEUTRAL'); // Ratio exactly 0.65
        expect(classifyRegime(35, 65)).toBe('NEUTRAL'); // Ratio exactly 0.35
    });

    it('should classify as CATALYST_DOMINANT when A+B is 0 and C > 20', () => {
        expect(classifyRegime(0, 0, 0, 25)).toBe('CATALYST_DOMINANT');
    });

    it('should classify as INDICATOR_DOMINANT when A+B is 0, C < 20 and I > 30', () => {
        expect(classifyRegime(0, 0, 35, 10)).toBe('INDICATOR_DOMINANT');
    });

    it('should return NONE when all are below thresholds or 0', () => {
        expect(classifyRegime(0, 0, 0, 0)).toBe('NONE');
        expect(classifyRegime(0, 0, 10, 10)).toBe('NONE');
    });
});
