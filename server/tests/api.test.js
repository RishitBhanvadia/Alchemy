const request = require('supertest');
const express = require('express');

// We have to mock supabase before requiring the controller
const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation(cb => cb({ data: [{ result_name: 'Test Result' }], error: null }))
};

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => mockSupabase)
    };
});

// Set env vars so supabase createClient doesn't crash if it ever runs
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'test_key';

const { calculateResult } = require('../controllers/resultController');

const app = express();
app.use(express.json());

app.get('/result/:chem_a/:chem_b/:chem_c/:chem_d', calculateResult);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

describe('API Endpoints', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health').expect(200);
            expect(response.body).toHaveProperty('status', 'ok');
        });
    });

    describe('GET /result/:a/:b/:c/:d', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return result for valid parameters', async () => {
            const response = await request(app).get('/result/50/30/20/0').expect(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it('should return 400 for invalid parameters', async () => {
            await request(app).get('/result/abc/30/20/0').expect(400);
        });

        it('should correctly normalize inputs that get stuck below 100 with single if (10, 20, 30, 0)', async () => {
            await request(app).get('/result/10/20/30/0').expect(200);

            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_a', 20);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_b', 30);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_c', 50);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_d', 0);
        });

        it('should correctly normalize inputs rounding issues (33.3, 33.3, 33.4, 0)', async () => {
            await request(app).get('/result/33.3/33.3/33.4/0').expect(200);

            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_a', 40);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_b', 30);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_c', 30);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_d', 0);
        });

        it('should handle all zero concentrations gracefully without NaN', async () => {
            await request(app).get('/result/0/0/0/0').expect(200);

            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_a', 0);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_b', 0);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_c', 0);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_d', 0);
        });

        it('should correctly handle inputs that need multiple loop iterations to fix rounding (33, 33, 33, 0)', async () => {
            await request(app).get('/result/33/33/33/0').expect(200);

            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_a', 40);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_b', 30);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_c', 30);
            expect(mockSupabase.eq).toHaveBeenCalledWith('conc_d', 0);
        });
    });
});
