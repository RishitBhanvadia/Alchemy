const fs = require('fs');
const path = require('path');

describe('resultController normalise logic', () => {
    let normalise;
    beforeAll(() => {
        const content = fs.readFileSync(path.join(__dirname, '../controllers/resultController.js'), 'utf8');
        const normaliseFnString = content.match(/function normalise\(a, b, i, c\) \{[\s\S]*?\n\}/)[0];
        normalise = new Function('a', 'b', 'i', 'c', normaliseFnString + '\nreturn normalise(a, b, i, c);');
    });

    it('should correctly normalise without inventing nonexistent chemicals due to rounding errors', () => {
        expect(normalise(33.3, 33.3, 33.4, 0)).toEqual([33, 33, 34, 0]);
    });

    it('should correctly normalise maintaining sum of 100', () => {
         const result = normalise(33.3, 33.3, 33.4, 0);
         const sum = result.reduce((a, b) => a + b, 0);
         expect(sum).toBe(100);
    });

    it('should correctly normalise without inventing nonexistent chemicals due to rounding errors (second test)', () => {
        expect(normalise(10, 10, 10, 70)).toEqual([10, 10, 10, 70]);
    });
});
