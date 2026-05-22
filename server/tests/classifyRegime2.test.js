const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
    it('returns INDICATOR_DOMINANT when indicator > 30, A+B < 20, and C < 20', () => {
        expect(classifyRegime(5, 5, 40, 10)).toBe('INDICATOR_DOMINANT');
    });
});
