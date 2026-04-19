# Drive → YouTube

A browser-based tool to transfer videos from Google Drive to YouTube — useful for freeing up Drive storage without losing your content.

Built with React + Vite. No backend required. All OAuth tokens are stored locally in the browser.

![screenshot placeholder](https://placehold.co/720x400/0a0a0a/333333?text=Drive+→+YouTube)

## Features

- **Dual-account OAuth** — connect Drive and YouTube with different Google accounts
- **Bulk selection** — select all, none, or only videos not yet uploaded
- **Duplicate detection** — already-uploaded videos are marked and skipped from "Not uploaded" filter
- **Per-video metadata** — edit title, description and privacy (private / unlisted / public) before uploading
- **Resumable uploads** — progress bar per video, safe against network interruptions
- **Persistent sessions** — tokens and channel selection survive page refresh (1-hour TTL)
- **Bilingual UI** — English and Spanish, toggle in the header

## Prerequisites

1. A [Google Cloud project](https://console.cloud.google.com/) with these APIs enabled:
   - **Google Drive API**
   - **YouTube Data API v3**

2. An **OAuth 2.0 Client ID** (Web application type):
   - Go to *APIs & Services → Credentials → Create credentials → OAuth client ID*
   - Application type: **Web application**
   - Add your local dev origin under *Authorized JavaScript origins* (e.g. `http://localhost:5173`)

3. Node.js 18+ and npm

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173`, paste your Client ID, and connect both accounts.

## Build for production

```bash
npm run build
# Output goes to dist/
```

The built output is a static site — serve it with any web server. Make sure to add the production URL to the *Authorized JavaScript origins* in Google Cloud Console.

## Project structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component — state, OAuth, upload orchestration
├── constants.js          # API scopes, localStorage keys, TTL
├── storage.js            # localStorage helpers
├── styles.js             # Shared inline style objects
├── utils.js              # formatBytes
├── i18n/
│   └── index.js          # Translations (en/es), LangContext, useLang
├── api/
│   ├── drive.js          # Drive API: listVideos, downloadBlob
│   └── youtube.js        # YouTube API: listChannels, initResumableUpload, uploadBlob
├── hooks/
│   ├── useLanguage.js    # Language toggle with localStorage persistence
│   ├── usePersistedToken.js  # OAuth token state + ref + localStorage sync
│   └── useUploadHistory.js   # Upload history state + localStorage sync
├── components/
│   ├── Spinner.jsx
│   ├── ErrorBanner.jsx
│   ├── VideoThumbnail.jsx
│   ├── ChannelAvatar.jsx
│   ├── Stepper.jsx
│   ├── AccountCard.jsx
│   ├── VideoCard.jsx
│   └── UploadItem.jsx
└── screens/
    ├── SetupScreen.jsx   # Step 1: Client ID + account connections
    ├── ChannelScreen.jsx # Step 1b: Channel picker (multi-channel accounts)
    ├── BrowseScreen.jsx  # Step 2: Video list + selection
    └── UploadScreen.jsx  # Step 3: Upload progress
```

## How it works

1. **Auth** — uses Google Identity Services implicit flow (`initTokenClient`). Drive and YouTube each get their own token, so you can use different Google accounts for each.
2. **Browse** — lists all non-trashed video files from Drive using the Files API with pagination.
3. **Upload** — for each selected video:
   - Downloads the blob from Drive using the file's media endpoint
   - Initialises a YouTube resumable upload session (POST → gets a `Location` URL)
   - Uploads the blob via XHR (`PUT`) to track progress
   - Records the Drive file ID → YouTube video ID mapping in localStorage to prevent duplicates

## Notes

- The app must be served over HTTP (not opened as a `file://` URL) because Google OAuth requires a registered origin.
- YouTube's free quota allows ~100 video uploads per day after [account verification](https://youtube.com/verify).
- Video thumbnails are loaded directly from Google's CDN (`lh3.googleusercontent.com`) — no Authorization header is sent, which is required to avoid CORS errors.

## License

MIT
