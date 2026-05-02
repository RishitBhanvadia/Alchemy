const { joinClassroom } = require('../controllers/classroomController');
const supabase = require('../supabaseClient');

jest.mock('../supabaseClient', () => ({
  from: jest.fn()
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('classroomController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('joinClassroom', () => {
    it('should convert code to uppercase and find the classroom', async () => {
      const req = { body: { code: 'a1b2c' }, user: { id: 'user1' } };
      const res = mockRes();

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({ data: { id: 'class1' }, error: null });

      supabase.from.mockImplementation((table) => {
        if (table === 'classrooms') {
          return { select: mockSelect, eq: mockEq, limit: mockLimit, single: mockSingle };
        }
        return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), insert: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: {}, error: null }) };
      });

      await joinClassroom(req, res);

      expect(mockEq).toHaveBeenCalledWith('class_code', 'A1B2C');
    });
  });
});
