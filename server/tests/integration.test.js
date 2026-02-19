const request = require('supertest');

// Mock Supabase client
const mockChain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    // Default implementation: resolve successfully with sample data
    then: jest.fn((resolve) => resolve({ data: [{ id: 1, result_name: 'Test Result' }], error: null }))
};

const mockSupabase = {
    from: jest.fn(() => mockChain)
};

jest.mock('@supabase/supabase-js', () => ({
    createClient: () => mockSupabase
}));

// Import the app AFTER mocking
const app = require('../server');

describe('Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset default success response
        mockChain.then.mockImplementation((resolve) => resolve({
            data: [{
                id: 1,
                conc_a: 50,
                conc_b: 30,
                conc_c: 20,
                conc_d: 0,
                result_name: 'Test Result'
            }],
            error: null
        }));
    });

    describe('GET /result/:a/:b/:c/:d', () => {
        it('should return 200 and result for valid parameters', async () => {
            const response = await request(app)
                .get('/result/50/30/20/0')
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('result_name', 'Test Result');

            // Verify Supabase was called correctly
            expect(mockSupabase.from).toHaveBeenCalledWith('results');
            expect(mockChain.select).toHaveBeenCalledWith('*');
            expect(mockChain.eq).toHaveBeenCalledTimes(5); // 4 concentrations + 1 reaction_id
        });

        it('should return 400 for non-numeric parameters', async () => {
            await request(app)
                .get('/result/invalid/30/20/0')
                .expect(400);

            expect(mockSupabase.from).not.toHaveBeenCalled();
        });

        it('should return 400 for out-of-range parameters (< 0)', async () => {
            await request(app)
                .get('/result/-10/30/20/0')
                .expect(400);

            expect(mockSupabase.from).not.toHaveBeenCalled();
        });

        it('should return 400 for out-of-range parameters (> 100)', async () => {
            await request(app)
                .get('/result/150/30/20/0')
                .expect(400);

            expect(mockSupabase.from).not.toHaveBeenCalled();
        });

        it('should return 500 if database query fails', async () => {
            // Mock a database error
            mockChain.then.mockImplementation((resolve) => resolve({
                data: null,
                error: { message: 'Database connection failed' }
            }));

            await request(app)
                .get('/result/50/30/20/0')
                .expect(500);
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
        });
    });

    describe('Rate Limiting & Headers', () => {
        it('should have security headers (Helmet)', async () => {
            const response = await request(app).get('/health');
            expect(response.headers).toHaveProperty('content-security-policy');
            expect(response.headers).toHaveProperty('x-dns-prefetch-control');
        });

        // Note: Testing exact rate limiting might be flaky or slow,
        // but we can check if the headers are present if we make a request.
        it('should include rate limit headers', async () => {
            const response = await request(app).get('/health');
            expect(response.headers).toHaveProperty('ratelimit-limit');
            expect(response.headers).toHaveProperty('ratelimit-remaining');
        });
    });
});
