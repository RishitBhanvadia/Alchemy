process.env.SUPABASE_URL = "http://placeholder.url";
process.env.SUPABASE_KEY = "placeholderkey";
process.env.SUPABASE_SERVICE_ROLE_KEY = "placeholderkey";
process.env.GEMINI_API_KEY = "placeholderkey";

const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'resultController.js'), 'utf8');

const normalise = eval(`
  (() => {
    ${code.replace(/exports\.calculateResult = [^]+/, '')}
    return normalise;
  })()
`);

describe('resultController normalise logic', () => {
  it('correctly normalizes values so they sum to 100 exactly without introducing ghost components', () => {
    const case1 = normalise(33.51, 33.51, 32.98, 0);
    expect(case1).toEqual([34, 33, 33, 0]);
    expect(case1[0] + case1[1] + case1[2] + case1[3]).toBe(100);

    const case2 = normalise(33.33, 33.33, 33.33, 0);
    expect(case2).toEqual([34, 33, 33, 0]);
    expect(case2[0] + case2[1] + case2[2] + case2[3]).toBe(100);

    const case3 = normalise(1, 1, 1, 0);
    expect(case3).toEqual([34, 33, 33, 0]);
    expect(case3[0] + case3[1] + case3[2] + case3[3]).toBe(100);

    const case4 = normalise(0, 50, 0, 0);
    expect(case4).toEqual([0, 100, 0, 0]);
    expect(case4[0] + case4[1] + case4[2] + case4[3]).toBe(100);
  });
});
