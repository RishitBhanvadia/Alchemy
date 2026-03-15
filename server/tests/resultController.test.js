const { calculateResult } = require('../controllers/resultController');

// mock res and req
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// We will mock the supabase client so it doesn't actually call the database,
// but we only want to check the rounding error logic
jest.mock('@supabase/supabase-js', () => {
  const eqMock = jest.fn().mockReturnThis();
  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: eqMock,
        single: jest.fn(() => Promise.resolve({ data: { product_name: 'test' }, error: null }))
      }))
    }))
  };
});

describe('Result Controller rounding errors logic', () => {
    it('should correctly round numbers that sum up to exactly 100 for 22, 22, 22, 0', async () => {
        const req = {
            body: {
                chem_a: 22,
                chem_b: 22,
                chem_c: 22,
                chem_d: 0
            }
        };
        const res = mockResponse();

        await calculateResult(req, res);

        // Before adjust, final_add is 60. Then we have rounding adjustments.
        // It should eventually call supabase with A: 40, B: 30, C: 30, D: 0
        // We cannot directly inspect internal A, B, C, D without modifying the code to export them,
        // but since we mocked supabase, we can check how it was called.
        // The first 'eq' call is for A, the second for B, etc.
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient();

        expect(supabase.from().eq).toHaveBeenCalledWith('conc_a', 40);
        expect(supabase.from().eq).toHaveBeenCalledWith('conc_b', 30);
        expect(supabase.from().eq).toHaveBeenCalledWith('conc_c', 30);
        expect(supabase.from().eq).toHaveBeenCalledWith('conc_d', 0);
    });

    it('should correctly round numbers that sum up to exactly 100 for 5, 5, 5, 5', async () => {
        const req = {
            body: {
                chem_a: 5,
                chem_b: 5,
                chem_c: 5,
                chem_d: 5
            }
        };
        const res = mockResponse();

        await calculateResult(req, res);

        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient();

        expect(supabase.from().eq).toHaveBeenCalledWith('conc_a', 10);
        expect(supabase.from().eq).toHaveBeenCalledWith('conc_b', 30);
        expect(supabase.from().eq).toHaveBeenCalledWith('conc_c', 30);
        expect(supabase.from().eq).toHaveBeenCalledWith('conc_d', 30);
    });
});
