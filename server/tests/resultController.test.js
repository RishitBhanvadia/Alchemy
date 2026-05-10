const fs = require('fs');
const path = require('path');

describe('resultController normalise logic', () => {
  let normalise;

  beforeAll(() => {
    // Extract the normalise function since it's not exported
    const content = fs.readFileSync(path.join(__dirname, '../controllers/resultController.js'), 'utf8');
    const lines = content.split('\n');
    const startIdx = lines.findIndex(l => l.includes('function normalise'));
    const endIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('}'));
    const normCode = lines.slice(startIdx, endIdx + 1).join('\n');

    const testFn = new Function('a', 'b', 'i', 'c', normCode + '\nreturn normalise(a, b, i, c);');
    normalise = testFn;
  });

  it('should normalise [1, 1, 1, 0] properly without hallucinating a value for c', () => {
    // 1, 1, 1, 0 = 33.333% each.
    // Previously, normalise would round each to 33, then compute nc = 100 - 33 - 33 - 33 = 1.
    // Meaning a chemical that had 0 concentration gets 1% concentration.
    // The fixed logic should distribute the remaining 1 to the largest existing value.
    const result = normalise(1, 1, 1, 0);
    expect(result).toEqual([34, 33, 33, 0]);
  });

  it('should normalise [33.4, 33.4, 33.4, 0] to exactly 100 without hallucinating a value for c', () => {
    // Previously, 33.4 would round down to 33, producing [33, 33, 33, 1]
    const result = normalise(33.4, 33.4, 33.4, 0);
    expect(result).toEqual([34, 33, 33, 0]);
  });

  it('should normalise exactly when already a multiple of 10', () => {
    const result = normalise(30, 30, 40, 0);
    expect(result).toEqual([30, 30, 40, 0]);
  });

  it('should normalise [0, 0, 0, 5] properly to exactly [0, 0, 0, 100]', () => {
    const result = normalise(0, 0, 0, 5);
    expect(result).toEqual([0, 0, 0, 100]);
  });
});
