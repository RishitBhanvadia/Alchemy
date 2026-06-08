const { computeReactionId } = require('../reactionHash');

describe('reactionHash logic', () => {
  it('should compute the correct reaction ID and weights', () => {
    // a=1, b=10, c=100, i=1000
    expect(computeReactionId(10, 0, 0, 0)).toBe(1);
    expect(computeReactionId(0, 10, 0, 0)).toBe(10);
    expect(computeReactionId(0, 0, 10, 0)).toBe(1000); // 10% indicator
    expect(computeReactionId(0, 0, 0, 10)).toBe(100);  // 10% catalyst
    expect(computeReactionId(10, 10, 10, 10)).toBe(1111);
  });

  it('should compute the correct reaction ID with a custom threshold', () => {
    // Custom threshold of 5
    expect(computeReactionId(5, 0, 0, 0, 5)).toBe(1);
    expect(computeReactionId(4, 0, 0, 0, 5)).toBe(0);
    expect(computeReactionId(5, 5, 5, 5, 5)).toBe(1111);
  });
});
