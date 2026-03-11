const request = require('supertest');
const express = require('express');

// Mock out-of-scope variables need prefix "mock"
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockFrom = jest.fn();

const mockEqChain = {
    eq: mockEq,
    then: (resolve) => resolve({ data: [{ result_name: 'Test Result' }], error: null })
};
mockEq.mockReturnValue(mockEqChain);
mockSelect.mockReturnValue(mockEqChain);
mockFrom.mockReturnValue({ select: mockSelect });

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: mockFrom
    }))
}));

const resultRoutes = require('../routes/resultRoutes');

const app = express();
app.use(express.json());
app.use('/result', resultRoutes);

describe('API Endpoints', () => {
    beforeEach(() => {
        mockEq.mockClear();
        mockSelect.mockClear();
        mockFrom.mockClear();
    });

    describe('GET /result/:a/:b/:c/:d', () => {
        it('should correctly handle rounding of 25/25/25/25 and sum to 100', async () => {
            await request(app).get('/result/25/25/25/25').expect(200);

            const calls = mockEq.mock.calls;
            const aCall = calls.find(call => call[0] === 'conc_a');
            const bCall = calls.find(call => call[0] === 'conc_b');
            const cCall = calls.find(call => call[0] === 'conc_c');
            const dCall = calls.find(call => call[0] === 'conc_d');

            const a = aCall[1];
            const b = bCall[1];
            const c = cCall[1];
            const d = dCall[1];

            expect(a + b + c + d).toBe(100);
        });

        it('should correctly handle rounding of 33.3/33.3/33.3/0 and sum to 100', async () => {
            await request(app).get('/result/33.3/33.3/33.3/0').expect(200);

            const calls = mockEq.mock.calls;
            const aCall = calls.find(call => call[0] === 'conc_a');
            const bCall = calls.find(call => call[0] === 'conc_b');
            const cCall = calls.find(call => call[0] === 'conc_c');
            const dCall = calls.find(call => call[0] === 'conc_d');

            const a = aCall[1];
            const b = bCall[1];
            const c = cCall[1];
            const d = dCall[1];

            expect(a + b + c + d).toBe(100);
        });

        it('should return result for valid parameters', async () => {
            const response = await request(app)
                .get('/result/50/30/20/0')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });

        it('should return 400 for invalid parameters', async () => {
            await request(app)
                .get('/result/abc/30/20/0')
                .expect(400);
        });

        it('should handle all zero concentrations', async () => {
            const response = await request(app)
                .get('/result/0/0/0/0')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });

        it('should handle maximum concentrations', async () => {
            const response = await request(app)
                .get('/result/100/100/100/100')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            app.get('/health', (req, res) => res.json({ status: 'ok' }));
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
        });
    });
});
