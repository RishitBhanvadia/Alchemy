
const request = require('supertest');

// Set dummy environment variables before requiring the app
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_KEY = 'dummy-key';

const app = require('../server');

describe('Security Headers & Rate Limiting', () => {
    it('should respect X-Forwarded-For headers for rate limiting', async () => {
        // Request 1 from IP A
        const res1 = await request(app)
            .get('/health')
            .set('X-Forwarded-For', '1.2.3.4');

        expect(res1.status).toBe(200);
        // First request should reduce remaining by 1 (100 -> 99)
        expect(res1.headers['ratelimit-remaining']).toBe('99');

        // Request 2 from IP B (different IP)
        const res2 = await request(app)
            .get('/health')
            .set('X-Forwarded-For', '5.6.7.8');

        expect(res2.status).toBe(200);
        // Should also be 99 because it's a NEW bucket (proving trust proxy works)
        expect(res2.headers['ratelimit-remaining']).toBe('99');

        // Request 3 from IP A (same as first)
        const res3 = await request(app)
            .get('/health')
            .set('X-Forwarded-For', '1.2.3.4');

        expect(res3.status).toBe(200);
        // Should be 98 because it's the 2nd request from IP A
        expect(res3.headers['ratelimit-remaining']).toBe('98');
    });
});
