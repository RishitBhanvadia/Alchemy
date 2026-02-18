const request = require('supertest');

// Set dummy env vars to avoid Supabase client errors during import
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_KEY = 'dummy-key';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
        })),
    })),
}));

const app = require('../server');

describe('Security Hardening', () => {
    it('should have "trust proxy" enabled', () => {
        // trust proxy = 1 means trust the first proxy hop
        expect(app.get('trust proxy')).toBe(1);
    });

    it('should not parse JSON body (body-parser removed)', async () => {
        // Add a temporary route to check req.body
        app.post('/test-body-security', (req, res) => {
            res.json({ body: req.body });
        });

        const res = await request(app)
            .post('/test-body-security')
            .send({ test: 'data' })
            .expect(200);

        // Without body-parser, req.body should be undefined
        expect(res.body.body).toBeUndefined();
    });

    it('should include rate limit headers', async () => {
        const res = await request(app).get('/');
        expect(res.headers).toHaveProperty('ratelimit-limit');
        expect(res.headers).toHaveProperty('ratelimit-remaining');
    });

    it('should set security headers (Helmet)', async () => {
        const res = await request(app).get('/');
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
        expect(res.headers).toHaveProperty('x-frame-options');
        expect(res.headers).toHaveProperty('strict-transport-security');
        expect(res.headers).toHaveProperty('content-security-policy');
    });
});
