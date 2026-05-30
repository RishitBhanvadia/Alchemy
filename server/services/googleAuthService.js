const googleTokenStore = new Map();

function getTokens(teacherId) {
    return googleTokenStore.get(teacherId);
}

function setTokens(teacherId, tokens) {
    googleTokenStore.set(teacherId, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + (tokens.expires_in * 1000),
    });
}

function clearTokens(teacherId) {
    googleTokenStore.delete(teacherId);
}

async function exchangeAuthCodeForTokens(code, redirectUri) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

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
        throw new Error(`Google token exchange failed: ${tokenRes.status} - ${body}`);
    }

    return await tokenRes.json();
}

async function refreshAccessToken(refreshToken) {
    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
    });

    if (!refreshRes.ok) {
        throw new Error(`Token refresh failed: ${refreshRes.status}`);
    }

    return await refreshRes.json();
}

module.exports = {
    getTokens,
    setTokens,
    clearTokens,
    exchangeAuthCodeForTokens,
    refreshAccessToken
};
