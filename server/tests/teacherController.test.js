// Set env vars so Supabase client doesn't throw during initialization
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key';
process.env.GEMINI_API_KEY = 'test_gemini';

const { getAnalytics } = require('../controllers/teacherController');
const supabase = require('../supabaseClient');

// Mock supabase client methods
jest.mock('../supabaseClient', () => {
  return {
    from: jest.fn()
  };
});

describe('Teacher Controller N+1 Optimization', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch analytics with a single experiment_results query', async () => {
    const classrooms = [
      { id: 'c1', name: 'Class 1', memberships: [{ student_id: 's1' }, { student_id: 's2' }] },
      { id: 'c2', name: 'Class 2', memberships: [{ student_id: 's3' }] }
    ];

    const logs = [
      { id: 'l1', user_id: 's1', score: 100 },
      { id: 'l2', user_id: 's3', score: 80 }
    ];

    supabase.from.mockImplementation((table) => {
      if (table === 'classrooms') {
        return {
          select: () => ({
            eq: () => ({ data: classrooms, error: null })
          })
        };
      }
      if (table === 'experiment_results') {
        return {
          select: () => ({
            in: (field, ids) => ({
              order: () => ({
                limit: () => ({ data: logs.filter(l => ids.includes(l.user_id)), error: null })
              })
            })
          })
        };
      }
    });

    const req = { user: { id: 'teacher-123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    await getAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    // 1 query for classrooms, 1 query for experiment_results
    expect(supabase.from).toHaveBeenCalledTimes(2);
  });
});
