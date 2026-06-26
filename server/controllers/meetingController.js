/**
 * meetingController.js — Handles Zoom & Google Meet meeting creation
 *
 * Endpoints:
 *  - createZoomMeeting:   Server-to-Server OAuth → instant Zoom meeting
 *  - googleAuthRedirect:  Redirects teacher to Google OAuth consent
 *  - googleAuthCallback:  Exchanges auth code for tokens, stores per-user
 *  - createGoogleMeeting: Uses stored tokens to create Calendar event w/ Meet link
 *  - joinMeeting:         Looks up meeting code → returns URL if not expired
 */

const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');
const logger = require('../utils/logger');
const { generateUniqueCode } = require('../utils/codeGenerator');

// ─── Helper: Save meeting session to Supabase ────────────────────────────────

async function saveMeetingSession(code, meetingUrl, platform, teacherId) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

  const { data, error: dbError } = await supabase
    .from('meeting_sessions')
    .insert({
      code,
      meeting_url: meetingUrl,
      platform,
      teacher_id: teacherId,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (dbError) throw dbError;
  return data;
}

// ─── In-memory store for Google OAuth tokens (per teacher) ────────────────────
// In production, store these encrypted in the database.

const googleTokenStore = new Map();

// ─── Zoom: Server-to-Server OAuth Token ──────────────────────────────────────

async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Missing Zoom API credentials. Set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET in .env');
  }

  // Base64 encode client credentials for Basic auth
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: accountId,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error('[Zoom] OAuth token request failed:', body);
    throw new Error(`Zoom OAuth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/meetings/zoom
 * Creates an instant Zoom meeting via Server-to-Server OAuth.
 * Returns the 6-char code and meeting URL.
 */
exports.createZoomMeeting = async (req, res) => {
  try {
    // 1. Get Zoom access token
    const accessToken = await getZoomAccessToken();

    // 2. Create instant meeting
    const meetingRes = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Alchemistry Live Class',
        type: 1, // Instant meeting
        settings: {
          join_before_host: true,
          waiting_room: false,
          meeting_authentication: false,
        },
      }),
    });

    if (!meetingRes.ok) {
      const body = await meetingRes.text();
      logger.error('[Zoom] Create meeting failed:', body);
      throw new Error(`Zoom API error: ${meetingRes.status}`);
    }

    const meeting = await meetingRes.json();
    const meetingUrl = meeting.join_url;

    // 3. Generate unique code and save session
    const code = await generateUniqueCode('meeting_sessions', 'code', 6);
    const session = await saveMeetingSession(code, meetingUrl, 'zoom', req.user.id);

    logger.info(`[Zoom] Meeting created by teacher ${req.user.id}, code: ${code}`);

    return success(res, {
      code: session.code,
      meetingUrl: session.meeting_url,
      platform: 'zoom',
      expiresAt: session.expires_at,
    }, 201);
  } catch (err) {
    logger.error('[createZoomMeeting]', err.message);
    return error(res, 'ZOOM_ERROR', err.message || 'Failed to create Zoom meeting.', 500);
  }
};

/**
 * GET /api/meetings/google/auth?teacherId=xxx
 * Redirects the teacher to Google OAuth consent screen.
 * Note: This is a browser redirect, so no auth middleware — teacherId is passed as query param.
 */
exports.googleAuthRedirect = (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return error(res, 'CONFIG_ERROR', 'Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env', 500);
    }

    const { teacherId } = req.query;
    if (!teacherId) {
      return error(res, 'VALIDATION_ERROR', 'teacherId query parameter is required.', 400);
    }

    // Build the server callback URL dynamically
    const protocol = req.protocol;
    const host = req.get('host');
    const redirectUri = `${protocol}://${host}/api/meetings/google/callback`;

    // Store redirect URI and teacher ID in state for the callback
    const state = Buffer.from(JSON.stringify({
      teacherId,
      redirectUri,
    })).toString('base64');

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar.events');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    return res.redirect(authUrl.toString());
  } catch (err) {
    logger.error('[googleAuthRedirect]', err.message);
    return error(res, 'GOOGLE_AUTH_ERROR', 'Failed to initiate Google auth.', 500);
  }
};

/**
 * GET /api/meetings/google/callback
 * Handles the Google OAuth redirect, exchanges code for tokens.
 * Redirects teacher back to the frontend dashboard.
 */
exports.googleAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return error(res, 'INVALID_CALLBACK', 'Missing authorization code or state.', 400);
    }

    // Decode state to get teacher ID and redirect URI
    const { teacherId, redirectUri } = JSON.parse(Buffer.from(state, 'base64').toString());

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      logger.error('[Google] Token exchange failed:', body);
      throw new Error(`Google token exchange failed: ${tokenRes.status}`);
    }

    const tokens = await tokenRes.json();

    // Store tokens in memory keyed by teacher ID
    googleTokenStore.set(teacherId, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    });

    logger.info(`[Google] OAuth tokens stored for teacher ${teacherId}`);

    // Redirect teacher back to the frontend with a success flag
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/teacher?google_auth=success`);
  } catch (err) {
    logger.error('[googleAuthCallback]', err.message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/teacher?google_auth=error`);
  }
};

/**
 * POST /api/meetings/google
 * Creates a Google Calendar event with auto-generated Meet link.
 * Requires teacher to have completed Google OAuth first.
 */
exports.createGoogleMeeting = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const storedTokens = googleTokenStore.get(teacherId);

    if (!storedTokens) {
      return error(res, 'NO_GOOGLE_AUTH', 'Google not connected. Please authorize Google first.', 401);
    }

    // Check if token is expired, attempt refresh
    let accessToken = storedTokens.accessToken;
    if (Date.now() >= storedTokens.expiresAt && storedTokens.refreshToken) {
      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: storedTokens.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        accessToken = refreshData.access_token;
        storedTokens.accessToken = accessToken;
        storedTokens.expiresAt = Date.now() + (refreshData.expires_in * 1000);
      } else {
        // Token refresh failed — teacher needs to re-auth
        googleTokenStore.delete(teacherId);
        return error(res, 'TOKEN_EXPIRED', 'Google auth expired. Please re-authorize.', 401);
      }
    }

    // Create Calendar event with Meet conference
    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    const calendarRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: 'Alchemistry Live Class',
          start: { dateTime: now.toISOString() },
          end: { dateTime: endTime.toISOString() },
          conferenceData: {
            createRequest: {
              requestId: `alchemistry-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        }),
      }
    );

    if (!calendarRes.ok) {
      const body = await calendarRes.text();
      logger.error('[Google] Calendar event creation failed:', body);
      throw new Error(`Google Calendar API error: ${calendarRes.status}`);
    }

    const event = await calendarRes.json();

    // Extract the Google Meet URL from conference data
    const meetEntry = event.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === 'video'
    );
    const meetingUrl = meetEntry?.uri;

    if (!meetingUrl) {
      throw new Error('Google Meet link not found in calendar event response');
    }

    // Generate unique code and save session
    const code = await generateUniqueCode('meeting_sessions', 'code', 6);
    const session = await saveMeetingSession(code, meetingUrl, 'google', teacherId);

    logger.info(`[Google] Meeting created by teacher ${teacherId}, code: ${code}`);

    return success(res, {
      code: session.code,
      meetingUrl: session.meeting_url,
      platform: 'google',
      expiresAt: session.expires_at,
    }, 201);
  } catch (err) {
    logger.error('[createGoogleMeeting]', err.message);
    return error(res, 'GOOGLE_ERROR', err.message || 'Failed to create Google Meet.', 500);
  }
};

/**
 * GET /api/meetings/join?code=XXXXXX
 * Looks up a meeting code in meeting_sessions.
 * Returns meeting URL if the code is valid and not expired.
 */
exports.joinMeeting = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string' || code.trim().length !== 6) {
      return error(res, 'VALIDATION_ERROR', 'Meeting code must be exactly 6 characters.', 400);
    }

    const upperCode = code.trim().toUpperCase();
    const now = new Date().toISOString();

    // Single indexed query: code + not expired
    const { data: session, error: dbError } = await supabase
      .from('meeting_sessions')
      .select('code, meeting_url, platform, expires_at')
      .eq('code', upperCode)
      .gt('expires_at', now)
      .maybeSingle();

    if (dbError) {
      logger.error('[joinMeeting] DB error:', dbError.message);
      throw dbError;
    }

    if (!session) {
      return error(res, 'NOT_FOUND', 'Invalid or expired code. Ask your teacher for a new one.', 404);
    }

    return success(res, {
      code: session.code,
      meetingUrl: session.meeting_url,
      platform: session.platform,
      expiresAt: session.expires_at,
    });
  } catch (err) {
    logger.error('[joinMeeting]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to look up meeting code.', 500);
  }
};
