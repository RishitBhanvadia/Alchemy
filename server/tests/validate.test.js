const { validate } = require('../middleware/validate');
const { error } = require('../utils/response');

// Mock response object
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Validate Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('reaction validator', () => {
    it('should validate valid reaction payload with chem_i', () => {
      const req = {
        body: {
          chem_a: 10,
          chem_b: 20,
          chem_i: 30,
          chem_c: 40
        }
      };
      const res = mockRes();

      const middleware = validate('reaction');
      middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail if chem_i is missing', () => {
      const req = {
        body: {
          chem_a: 10,
          chem_b: 20,
          chem_c: 40
        }
      };
      const res = mockRes();

      const middleware = validate('reaction');
      middleware(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: expect.stringContaining('chem_i is required')
        })
      }));
    });
  });
});
