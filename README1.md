
# CampusMate AI — Prototype (React + Vite + Tailwind)

A student-focused productivity hub with:
- Landing page + Carousel + News
- Schedule, Emails, Tasks, Study Suggestions, About
- Floating AI chat widget (OpenAI-ready)
- Blue gradient theme and responsive UI

## Quick Start
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Environment Variables
Create a `.env` at the project root:

```
VITE_OPENAI_API_KEY=your_openai_key_optional
VITE_NEWS_ENDPOINT=your_news_endpoint_optional
```

- **VITE_OPENAI_API_KEY** — if set, the chat widget calls OpenAI’s Chat Completions API (in-browser, dev-only).  
  *Note:* For production, proxy via your backend to avoid exposing keys.
- **VITE_NEWS_ENDPOINT** — set this to your **daily.dev** proxy endpoint (or any news JSON). The app will fall back to `src/data/news.json` if unavailable.

## Where to add Google integrations
- **Calendar**: `src/pages/Schedule.jsx` — replace local storage with Google Calendar events after OAuth.
- **Gmail**: `src/pages/Emails.jsx` — replace sample JSON with Gmail threads.
- **Tasks**: `src/pages/Tasks.jsx` — swap local storage for Google Tasks API.
- **Chat**: `src/components/ChatWidget.jsx` — currently uses OpenAI if `VITE_OPENAI_API_KEY` is provided.

## Notes
- This is a prototype for demo: minimal error handling, no backend auth.
- Keep keys safe in production by using a server proxy.

## Google APIs Integration (Calendar, Gmail, Tasks)

This project now uses **Google Identity Services (GIS)** for OAuth 2.0 and calls Google REST APIs directly from the frontend.

### 1) Create OAuth Client
- Go to Google Cloud Console → APIs & Services → Credentials.
- Create an **OAuth 2.0 Client ID** (type: Web application).
- Add Authorized JavaScript origins and redirect URIs for your dev and prod URLs.
- Copy the **Client ID**.

### 2) Enable APIs
Enable these APIs in the same project:
- Google Calendar API
- Gmail API
- Google Tasks API

### 3) Configure environment
Create a `.env` in the project root:

```
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### 4) Run
```
npm install
npm run dev
```
> The `index.html` includes the GIS script tag. Use the **Login** page to sign in, then open **Schedule**, **Emails**, or **Tasks** pages.

### Notes
- This frontend-only approach **does not** use refresh tokens. When the token expires, the app will prompt you again via GIS.
- Never expose client secrets in a frontend app.
