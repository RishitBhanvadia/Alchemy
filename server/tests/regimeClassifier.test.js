const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
  it('should return CATALYST_DOMINANT when C is high and A+B is low but > 0', () => {
    const result = classifyRegime(5, 5, 0, 90);
    expect(result).toBe('CATALYST_DOMINANT');
  });

  it('should return INDICATOR_DOMINANT when I is high and A+B is low but > 0', () => {
    const result = classifyRegime(5, 5, 90, 0);
    expect(result).toBe('INDICATOR_DOMINANT');
  });
});
