# Mini static code editor — Spotify demo

This is a small static HTML/CSS/JS demo that looks like a source code editor. It detects a specific Python snippet and shows a Spotify embed plus a lyrics popup.

Files:

- `index.html` — main page
- `styles.css` — styles
- `app.js` — logic: detects snippet, shows Spotify iframe and lyrics modal

How it works

- Open `index.html` in a modern browser (Chrome/Edge/Firefox). For best behavior, serve it via a static server (e.g., `npx serve` or VS Code Live Server) to avoid some iframe restrictions.
- The editor contains a default Python snippet. Click Run (or press Ctrl+Enter). If the snippet contains `def play_music(): play(who_i_am)` (or similar), the page will insert a Spotify embed and show a short lyrics excerpt.

Notes about Spotify integration

- This project intentionally uses a client-side Spotify embed iframe as a fallback. Full Spotify Web Playback SDK usage requires registering an app, OAuth (PKCE) and a backend for some flows — that is out of scope for a single static file demo.
- If you want to integrate real Spotify playback (control user's Spotify app), you'll need to create a Spotify app at https://developer.spotify.com/dashboard, implement PKCE and exchange tokens. Keep client secrets off static pages.

Copyright and lyrics

- Only a small excerpt of lyrics is included for demo purposes. To show full lyrics, provide your own licensed copy or obtain a lyrics API.

If you'd like, I can:

- Add an optional PKCE-based client-side example with instructions for creating a Spotify app (still requires redirect URI and registering the app).
- Replace the embedded track with a different Spotify URI you own or prefer.
