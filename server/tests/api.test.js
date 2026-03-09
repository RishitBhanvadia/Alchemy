const request = require('supertest');
const express = require('express');

// Create mock variables with "mock" prefix to avoid jest scoping issues
const mockEq = jest.fn();
const mockEqChain = {
    eq: mockEq,
    then: (resolve) => resolve({ data: [{ result_name: 'Test Result' }], error: null })
};
mockEq.mockReturnValue(mockEqChain);

// Mock external dependencies
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: mockEq,
                then: (resolve) => resolve({ data: [{ result_name: 'Test Result' }], error: null })
            }))
        }))
    }))
}));

const { createClient } = require('@supabase/supabase-js');
const resultRoutes = require('../routes/resultRoutes');

// Mock the server setup
const app = express();
app.use(express.json());

// Mount the actual router
app.use('/result', resultRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

describe('API Endpoints', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockEq.mockReturnValue(mockEqChain);

        // Setup mock Supabase client
        const mockFrom = jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue(mockEqChain)
        });

        createClient.mockImplementation(() => ({
            from: mockFrom
        }));
    });

    describe('GET /result/:a/:b/:c/:d', () => {
        it('should return result for valid parameters', async () => {
            const response = await request(app)
                .get('/result/50/30/20/0')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('result_name');
            // Check that eq mock was called with the correct normalized rounding
            expect(mockEq).toHaveBeenCalledWith('conc_a', 50);
            expect(mockEq).toHaveBeenCalledWith('conc_b', 30);
            expect(mockEq).toHaveBeenCalledWith('conc_c', 20);
            expect(mockEq).toHaveBeenCalledWith('conc_d', 0);
        });

        it('should correctly normalize and round concentrations that sum to < 100', async () => {
            await request(app)
                .get('/result/33/33/33/0')
                .expect(200);

            // 33/33/33 -> sum 99. Each becomes 33.33 -> round 30, 30, 30 -> add up 90.
            // Loop adds 10 to max -> 40, 30, 30
            expect(mockEq).toHaveBeenCalledWith('conc_a', 40);
            expect(mockEq).toHaveBeenCalledWith('conc_b', 30);
            expect(mockEq).toHaveBeenCalledWith('conc_c', 30);
            expect(mockEq).toHaveBeenCalledWith('conc_d', 0);
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
            // 0/0/0/0 -> sum 0. division by zero avoided. remains 0, 0, 0, 0.
            expect(mockEq).toHaveBeenCalledWith('conc_a', 0);
            expect(mockEq).toHaveBeenCalledWith('conc_b', 0);
            expect(mockEq).toHaveBeenCalledWith('conc_c', 0);
            expect(mockEq).toHaveBeenCalledWith('conc_d', 0);
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
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
        });
    });
});
