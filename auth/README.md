# Lobang Forever - Backend (TikTok OAuth exchange)

Simple Node/Express backend that exchanges TikTok authorization codes for access tokens and optionally fetches user info.

Environment variables (see `.env.example`):

- `TIKTOK_CLIENT_KEY` - your TikTok client key (client_id)
- `TIKTOK_CLIENT_SECRET` - your TikTok client secret (must remain server-side)
- `PORT` - optional server port (default 3001)

Run locally:

1. cd backend
2. npm install
3. create a `.env` from `.env.example` and fill in credentials
4. npm start

The endpoint `/api/auth/tiktok/exchange` expects POST JSON { code, redirect_uri } and returns the TikTok token response and optional user info.
