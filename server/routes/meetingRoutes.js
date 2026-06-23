/**
 * meetingRoutes.js — Routes for meeting session management
 *
 * POST   /zoom            → Create Zoom instant meeting (teacher only)
 * GET    /google/auth     → Redirect to Google OAuth (teacher only)
 * GET    /google/callback → Handle Google OAuth callback (no auth — browser redirect)
 * POST   /google          → Create Google Meet via Calendar API (teacher only)
 * GET    /join?code=XXX   → Look up meeting code (any authenticated user)
 */

const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// ─── Teacher-only routes (require auth + teacher role) ────────────────────────

router.post('/zoom', requireAuth, requireRole('teacher'), meetingController.createZoomMeeting);

// Get Google OAuth URL — authenticated to prevent CSRF/Authorization Bypass
router.get('/google/auth-url', requireAuth, requireRole('teacher'), meetingController.getGoogleAuthUrl);

router.post('/google', requireAuth, requireRole('teacher'), meetingController.createGoogleMeeting);

// ─── Google OAuth callback (no auth middleware — browser redirect from Google) ─
router.get('/google/callback', meetingController.googleAuthCallback);

// ─── Any authenticated user can join a meeting ────────────────────────────────
router.get('/join', requireAuth, meetingController.joinMeeting);

module.exports = router;
