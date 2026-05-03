const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
  it('should identify CATALYST_DOMINANT when A+B is small but non-zero', () => {
    // A=5, B=5 (Sum=10 < 20), C=30 (>20)
    expect(classifyRegime(5, 5, 0, 30)).toBe('CATALYST_DOMINANT');
  });

  it('should identify INDICATOR_DOMINANT when A+B is small but non-zero', () => {
    // A=5, B=5 (Sum=10 < 20), I=35 (>30)
    expect(classifyRegime(5, 5, 35, 0)).toBe('INDICATOR_DOMINANT');
  });

  it('should identify ACID_DOMINANT when A/A+B > 0.65', () => {
    expect(classifyRegime(70, 30, 0, 0)).toBe('ACID_DOMINANT');
  });

  it('should identify BASE_DOMINANT when A/A+B < 0.35', () => {
    expect(classifyRegime(30, 70, 0, 0)).toBe('BASE_DOMINANT');
  });

  it('should identify NEUTRAL when 0.35 <= A/A+B <= 0.65', () => {
    expect(classifyRegime(50, 50, 0, 0)).toBe('NEUTRAL');
  });
});
