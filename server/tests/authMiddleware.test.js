const request = require('supertest');
const express = require('express');

// We must mock Supabase createClient before importing authMiddleware
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }),
  };
});

const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient();

const app = express();
app.use(express.json());

app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'Success', user: req.user });
});

app.get('/teacher', requireAuth, requireRole('teacher'), (req, res) => {
  res.json({ message: 'Teacher area', profile: req.profile });
});

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should return 401 if no token provided', async () => {
      const response = await request(app).get('/protected');
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORISED');
    });

    it('should return 401 if token is invalid', async () => {
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('Invalid token') });

      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORISED');
    });

    it('should proceed to next middleware if token is valid', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser }, error: null });

      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Success');
      expect(response.body.user).toEqual(mockUser);
    });
  });

  describe('requireRole', () => {
    const validToken = 'Bearer valid-token';
    const mockUser = { id: 'user-123' };

    beforeEach(() => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    });

    it('should return 403 if profile not found', async () => {
      supabase.single.mockResolvedValueOnce({ data: null, error: null });

      const response = await request(app)
        .get('/teacher')
        .set('Authorization', validToken);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    it('should return 403 if role does not match', async () => {
      supabase.single.mockResolvedValueOnce({ data: { role: 'student' }, error: null });

      const response = await request(app)
        .get('/teacher')
        .set('Authorization', validToken);

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    it('should proceed if role matches', async () => {
      supabase.single.mockResolvedValueOnce({ data: { role: 'teacher' }, error: null });

      const response = await request(app)
        .get('/teacher')
        .set('Authorization', validToken);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Teacher area');
      expect(response.body.profile).toEqual({ role: 'teacher' });
    });
  });
});
