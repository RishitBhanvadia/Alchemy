const { computeReactionId } = require('../utils/reactionHash');

describe('reactionHash', () => {
    it('should compute correct ID for acid only', () => {
        expect(computeReactionId(15, 0, 0, 0)).toBe(1);
    });

    it('should compute correct ID for base only', () => {
        expect(computeReactionId(0, 15, 0, 0)).toBe(10);
    });

    it('should compute correct ID for catalyst only', () => {
        expect(computeReactionId(0, 0, 0, 15)).toBe(100);
    });

    it('should compute correct ID for indicator only', () => {
        expect(computeReactionId(0, 0, 15, 0)).toBe(1000);
    });

    it('should compute correct ID for a complex mixture', () => {
        expect(computeReactionId(15, 15, 15, 15)).toBe(1111);
    });

    it('should ignore chemicals below the threshold', () => {
        expect(computeReactionId(5, 5, 5, 5)).toBe(0);
    });
});
