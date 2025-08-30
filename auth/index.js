const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => res.json({ ok: true }));

/**
 * Exchange TikTok auth code for access token.
 * Expects JSON body: { code, redirect_uri, code_verifier }
 * Returns JSON from TikTok token endpoint or normalized user object.
 */
app.post('/api/auth/tiktok/exchange', async (req, res) => {
  const { code, redirect_uri, code_verifier } = req.body || {};

  if (!code || !redirect_uri) {
    return res.status(400).json({ error: 'Missing code or redirect_uri' });
  }

  const client_key = process.env.TIKTOK_CLIENT_KEY;
  const client_secret = process.env.TIKTOK_CLIENT_SECRET;

  if (!client_key || !client_secret) {
    return res.status(500).json({ error: 'Server misconfigured: missing TikTok client credentials' });
  }

  try {
    // Exchange code for access token
    // TikTok endpoint per Login Kit docs
    const tokenUrl = 'https://open-api.tiktok.com/oauth/access_token/';

    const params = {
      client_key,
      client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri
    };

    if (code_verifier) {
      params.code_verifier = code_verifier;
    }

    const tokenResp = await axios.post(tokenUrl, null, { params });

    const tokenData = tokenResp.data;

    // Optional: fetch user info using returned access token
    // tokenData may contain access_token and open_id depending on TikTok response
    // Example: { data: { access_token, expires_in, refresh_token, open_id } }
    // We'll attempt to fetch basic user info if access_token + open_id present
    let user = null;
    try {
      const access_token = tokenData?.data?.access_token || tokenData?.access_token;
      const open_id = tokenData?.data?.open_id || tokenData?.open_id;
      if (access_token && open_id) {
        const userInfoUrl = 'https://open-api.tiktok.com/oauth/userinfo/';
        const userResp = await axios.get(userInfoUrl, {
          params: {
            access_token,
            open_id
          }
        });
        user = userResp.data;
      }
    } catch (err) {
      // If fetching user info fails, continue and return token response
      console.warn('Failed to fetch TikTok user info', err?.message || err);
    }

    return res.json({ token: tokenData, user });
  } catch (err) {
    console.error('TikTok exchange error', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 500;
    const body = err?.response?.data || { error: err?.message || 'unknown' };
    return res.status(status).json(body);
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
