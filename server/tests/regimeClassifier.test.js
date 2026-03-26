const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
  it('should correctly identify INDICATOR_DOMINANT when indicator > 30, others minimal', () => {
    // A: 10, B: 0, I: 90, C: 0
    expect(classifyRegime(10, 0, 90, 0)).toBe('INDICATOR_DOMINANT');
  });

  it('should correctly identify CATALYST_DOMINANT when catalyst > 20, others minimal', () => {
    // A: 5, B: 5, I: 0, C: 90
    expect(classifyRegime(5, 5, 0, 90)).toBe('CATALYST_DOMINANT');
  });

  it('should correctly identify ACID_DOMINANT when A+B > 0 and A ratio > 0.65', () => {
    expect(classifyRegime(80, 20, 0, 0)).toBe('ACID_DOMINANT');
  });

  it('should correctly identify BASE_DOMINANT when A+B > 0 and A ratio < 0.35', () => {
    expect(classifyRegime(20, 80, 0, 0)).toBe('BASE_DOMINANT');
  });

  it('should correctly identify NEUTRAL when A+B > 0 and A ratio between 0.35 and 0.65', () => {
    expect(classifyRegime(50, 50, 0, 0)).toBe('NEUTRAL');
  });

  it('should identify NONE when no conditions are met', () => {
    expect(classifyRegime(0, 0, 0, 0)).toBe('NONE');
  });
});
