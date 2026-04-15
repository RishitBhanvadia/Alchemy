const { normalise } = require('../controllers/resultController');

describe('normalise', () => {
    it('should not hallucinate non-zero values for 0 inputs', () => {
        // If a=33.3, b=33.3, i=33.3, c=0
        // total = 99.9. a/total*100 = 33.33 -> 33
        // 100 - 33 - 33 - 33 = 1. So c becomes 1 instead of 0.
        const result = normalise(33.3, 33.3, 33.3, 0);
        expect(result[3]).toBe(0);
        expect(result[0] + result[1] + result[2] + result[3]).toBe(100);
    });

    it('should handle small rounding differences correctly', () => {
        const result = normalise(30, 30, 30, 10);
        expect(result).toEqual([30, 30, 30, 10]);
    });

    it('should assign rounding difference to the largest value', () => {
        const result = normalise(33.3, 33.3, 33.3, 0);
        // Largest values are a, b, i (they are all equal). The logic should pick one of them.
        expect(result).toEqual([34, 33, 33, 0]); // Assuming it picks the first one
    });

    it('should preserve 0% for actual 0s', () => {
        const result = normalise(0, 0, 0, 1);
        expect(result).toEqual([0, 0, 0, 100]);
    });

    it('should distribute diff to largest even when multiple 0s exist', () => {
        const result = normalise(1, 1, 1, 0);
        expect(result).toEqual([34, 33, 33, 0]);
    });
});
