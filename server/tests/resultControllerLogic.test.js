// Mock supabase since we don't have db connection
const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
        data: { result: 'Test Result', product_name: 'Test Product' },
        error: null
    }),
    insert: jest.fn().mockResolvedValue({ error: null })
};
jest.mock('../supabaseClient', () => mockSupabase);

const { calculateResult } = require('../controllers/resultController');

// Mock response object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Result Controller Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly normalize without assigning to 0% chem_c', async () => {
        const req = {
            body: {
                chem_a: 33,
                chem_b: 33,
                chem_i: 33,
                chem_c: 0,
                student_id: '123'
            }
        };
        const res = mockResponse();

        await calculateResult(req, res);

        const dbInsertParams = mockSupabase.insert.mock.calls[0][0];

        // Ensure chem_c remains 0 because it was originally 0
        expect(dbInsertParams.chem_c).toBe(0);

        // Ensure that the total still adds up to 100
        const total = dbInsertParams.chem_a + dbInsertParams.chem_b + dbInsertParams.chem_i + dbInsertParams.chem_c;
        expect(total).toBe(100);
    });
});
