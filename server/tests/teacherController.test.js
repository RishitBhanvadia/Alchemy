const { getAnalytics } = require('../controllers/teacherController');
const supabase = require('../supabaseClient');
const { success, error } = require('../utils/response');

jest.mock('../supabaseClient', () => ({
  from: jest.fn()
}));

jest.mock('../utils/response', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

describe('Teacher Controller - getAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should ignore null scores when calculating average_score', async () => {
    const mockClassrooms = [
      {
        id: 1,
        class_name: 'Test Class',
        class_code: 'TEST1',
        created_at: '2023-01-01',
        memberships: [
          { student_id: 's1' },
          { student_id: 's2' }
        ]
      }
    ];

    const mockLogs = [
      { id: 1, score: 100, outcome_label: 'A', experiment_type: 'T', created_at: '2023-01-01' },
      { id: 2, score: null, outcome_label: 'B', experiment_type: 'T', created_at: '2023-01-02' },
      { id: 3, score: 50, outcome_label: 'C', experiment_type: 'T', created_at: '2023-01-03' }
    ];

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockClassrooms, error: null }),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockLogs, error: null })
    };

    supabase.from.mockImplementation(() => mockQuery);

    const req = { user: { id: 'teacher1' } };
    const res = {};

    await getAnalytics(req, res);

    expect(success).toHaveBeenCalled();
    const responseData = success.mock.calls[0][1];

    // The average of 100 and 50 is 75.
    // If the null score was counted as 0, the average would be (100+0+50)/3 = 50.
    expect(responseData.classrooms[0].average_score).toBe(75);
  });
});
