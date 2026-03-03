# MetroCastWebReceiver

A custom Google Cast Web Receiver UI for MetroList, built as a single static app and deployed on Cloudflare.<br>
You can see a functional example at [cast.1cylab.tech](https://cast.1cylab.tech)

It provides a full-screen now-playing experience with:
- album art, title, artist, and playback progress
- previous / play-pause / next transport controls
- optional lyrics panel with smooth line scrolling
- word-by-word lyric highlighting (including overlapping lines and background vocals)

---

## ✨ Highlights

- **Custom Cast receiver overlay** (default CAF UI is hidden)
- **Responsive TV-friendly layout** with large typography and touch-safe controls
- **Lyrics toggle** to switch between compact player and split player + lyrics view
- **LRC-style parsing** with:
	- standard `[mm:ss.xx]` timestamps
	- `{bg}` style metadata for background vocals
	- `<word:start:end|...>` word timing blocks
- **Queue controls** integrated through CAF local media requests
- **Fallback demo lyrics** when no `customData.lyrics` is present

---

## 🧱 Tech Stack

- **HTML + CSS + Vanilla JavaScript** (single-file app in `index.html`)
- **Google Cast CAF Receiver SDK**
- **Cloudflare + Wrangler** static asset deployment (`wrangler.jsonc`)

---

## 📂 Project Structure

```text
.
├── index.html         # Receiver UI + Cast logic + lyrics sync engine
├── wrangler.jsonc     # Cloudflare Wrangler config
├── images/
│   └── placehold.svg  # Default/fallback album art
└── README.md
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- Wrangler CLI

Install Wrangler globally (or use `npx`):

```bash
npm install -g wrangler
```

### Start local dev server

From the repo root:

```bash
wrangler dev
```

Wrangler serves the static assets in this project (`assets.directory = "."`).

---

## ☁️ Deploy

Authenticate and deploy:

```bash
wrangler login
wrangler deploy
```

After deployment, use the hosted HTTPS receiver URL when configuring your Google Cast Custom Receiver app.

---

## 🎵 Expected Media Payload

This receiver reads metadata and optional lyrics from the Cast media payload:

- `metadata.title`
- `metadata.artist`
- `metadata.images[0].url`
- `customData.lyrics` (optional)

If `customData.lyrics` is missing, the UI uses an internal mock lyric block for development.

---

## 📝 Lyrics Format (Supported)

Example:

```text
[00:12.50]Lead vocal line
<Lead:12.500:12.900|vocal:12.900:13.500|line:13.500:14.200>
[00:12.50]{bg}(Background overlap)
<(Background:12.800:13.400|overlap):13.400:14.000>
```

Notes:
- Timestamp format: `[mm:ss]` or `[mm:ss.xxx]`
- Word timing accepts `.` or `,` decimal separators
- Word timing blocks can be placed on the same line or the next line

---

## 🛠️ Configuration

Primary runtime settings are in `wrangler.jsonc`:

- `name`: project name
- `compatibility_date`: Cloudflare runtime compatibility pin
- `assets.directory`: set to `.` for static hosting of this repo

---

## 📌 Notes

- The app intentionally disables/hides default CAF visual components and renders a custom overlay.
- Idle timeout is disabled in receiver options for persistent display behavior.
- Current in-app version tag is shown in the lower-left corner of the UI.

---

## License

No license file is currently included in this repository.
