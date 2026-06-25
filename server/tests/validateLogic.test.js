const { validate } = require('../middleware/validate');

describe('Validation Middleware LogicGuard', () => {
  it('should validate reaction correctly with chem_i instead of chem_d', () => {
    const req = {
      body: {
        chem_a: 50,
        chem_b: 50,
        chem_c: 0,
        chem_i: 0
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const middleware = validate('reaction');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should fail validation if chem_i is missing', () => {
    const req = {
      body: {
        chem_a: 50,
        chem_b: 50,
        chem_c: 0
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const middleware = validate('reaction');
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.objectContaining({ message: expect.stringContaining("chem_i is required.") }) })
    );
  });
});
