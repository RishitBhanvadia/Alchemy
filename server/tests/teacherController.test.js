const { getAnalytics } = require('../controllers/teacherController');
const supabase = require('../supabaseClient');

jest.mock('../supabaseClient', () => {
  return {
    from: jest.fn()
  };
});

describe('teacherController logic', () => {
  it('should ignore null/undefined scores when calculating average_score', async () => {
    const req = { user: { id: 'teacher1' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    const mockClassrooms = [
      {
        id: 'c1',
        class_name: 'Chem 101',
        class_code: 'CODE1',
        memberships: [{ student_id: 's1' }, { student_id: 's2' }]
      }
    ];

    const mockLogs = [
      { id: 1, score: 100 },
      { id: 2, score: null }, // this should be ignored, not treated as 0
      { id: 3, score: undefined }, // this should be ignored
      { id: 4, score: 50 }
    ];

    const mockSelect = jest.fn();
    const mockEq = jest.fn();
    const mockIn = jest.fn();
    const mockOrder = jest.fn();
    const mockLimit = jest.fn();

    supabase.from.mockImplementation((table) => {
      if (table === 'classrooms') {
        return {
          select: mockSelect.mockReturnValue({
            eq: mockEq.mockResolvedValue({ data: mockClassrooms, error: null })
          })
        };
      }
      if (table === 'experiment_results') {
        return {
          select: mockSelect.mockReturnValue({
            in: mockIn.mockReturnValue({
              order: mockOrder.mockReturnValue({
                limit: mockLimit.mockResolvedValue({ data: mockLogs, error: null })
              })
            })
          })
        };
      }
    });

    await getAnalytics(req, res);

    // Get the response data passed to res.json
    const callArgs = res.json.mock.calls[0][0];
    // avg should be (100 + 50) / 2 = 75, NOT (100 + 0 + 0 + 50) / 4 = 37.5
    expect(callArgs.data.classrooms[0].average_score).toBe(75);
  });
});
