const { classifyRegime } = require('../regimeClassifier');

describe('classifyRegime', () => {
  it('returns CATALYST_DOMINANT when C is present and A+B is minimal', () => {
    expect(classifyRegime(5, 5, 0, 30)).toBe('CATALYST_DOMINANT');
  });

  it('returns INDICATOR_DOMINANT when I is present and others are minimal', () => {
    expect(classifyRegime(5, 5, 40, 0)).toBe('INDICATOR_DOMINANT');
  });

  it('returns ACID_DOMINANT when ratio > 0.65', () => {
    expect(classifyRegime(10, 5)).toBe('ACID_DOMINANT');
  });

  it('returns BASE_DOMINANT when ratio < 0.35', () => {
    expect(classifyRegime(3, 7)).toBe('BASE_DOMINANT');
  });

  it('returns NEUTRAL when 0.35 <= ratio <= 0.65', () => {
    expect(classifyRegime(5, 5)).toBe('NEUTRAL');
    expect(classifyRegime(6.5, 3.5)).toBe('NEUTRAL');
    expect(classifyRegime(3.5, 6.5)).toBe('NEUTRAL');
  });

  it('returns NONE when all inputs are 0', () => {
    expect(classifyRegime(0, 0, 0, 0)).toBe('NONE');
  });
});
