import { describe, it, expect, vi } from 'vitest';
import handler from '../../../api/results.js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { result: 'Test reaction' }, error: null })
          })
        })
      })
    })
  })
}));

describe('Results API edge cases', () => {
  it('should handle rounding that results in nc < 0 without crashing or using negative concentrations', async () => {
    const req = {
      method: 'POST',
      body: {
        chem_a: 33.5,
        chem_b: 33.5,
        chem_i: 33.0,
        chem_c: 0
      }
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await handler(req, res);

    expect(res.json).toHaveBeenCalled();
    const result = res.json.mock.calls[0][0];
    expect(result.score).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
