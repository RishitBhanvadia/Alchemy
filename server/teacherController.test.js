const { success, error } = require('./utils/response');

jest.mock('./supabaseClient', () => {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };
});

jest.mock('./utils/response', () => ({
  success: (res, data) => data,
  error: (res, code, msg, status) => ({ error: true, msg }),
}));

const mockSupabase = require('./supabaseClient');
const { getAnalytics } = require('./controllers/teacherController');

describe('teacherController.getAnalytics', () => {
  it('calculates average score correctly ignoring null/undefined scores', async () => {
    mockSupabase.eq.mockResolvedValueOnce({
      data: [{
        id: 'c1', class_name: 'Chemistry 101', class_code: 'CHEM101', created_at: '2023-01-01',
        memberships: [{ student_id: 's1' }, { student_id: 's2' }]
      }],
      error: null
    });

    mockSupabase.limit.mockResolvedValueOnce({
      data: [
        { score: 100 },
        { score: null },
        { score: 80 },
        { score: undefined },
        { score: 0 }
      ]
    });

    const req = { user: { id: 't1' } };
    const res = {};
    const result = await getAnalytics(req, res);

    console.log("Analytics result:", JSON.stringify(result, null, 2));

    // Average should be (100 + 80 + 0) / 3 = 60
    // Currently it divides by logs.length (5) and treats null as 0: (100 + 0 + 80 + 0 + 0) / 5 = 36
    expect(result.classrooms[0].average_score).toBe(60);
  });
});
