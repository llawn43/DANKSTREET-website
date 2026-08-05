# DANK STREET — official site

A self-contained, dependency-free static website for the artist **DANK STREET**
(Philly / NYC — bass · house · garage). Styled after the immersive moodygood.com
aesthetic with a **blues / black / purples / whites** palette.

**Live content sources:** tour Excel + Linktree + Spotify + 2026 media kit videos
under `0_Input/ArtistMarketing/DANK STREET/`. Edit `content.js` to refresh.

No build step, no frameworks. Just HTML/CSS/vanilla JS.

## Structure

```
dank-street-site/
├── index.html        # shell: glass nav, hero canvas, audio elements
├── styles.css        # theme tokens + layout + glassmorphism + responsive
├── content.js        # << EDIT THIS: all site content + asset paths
├── js/
│   ├── router.js     # hash routing + renders sections + merch list form
│   ├── slab.js       # interactive drag-to-spin hero centerpiece
│   ├── scramble.js   # text scramble/glitch effect
│   └── audio.js      # ambient loop + UI SFX + sound toggle
└── assets/
    ├── img/          # logo, covers, og image, favicon
    ├── audio/        # ambient loop + optional UI SFX
    └── README.md     # asset filename reference
```

## Editing content

Everything the site shows comes from **`content.js`** (`window.DANK_STREET`):

- **Identity** — `name`, `tagline`, `bio`
- **Music** — `tracks[]` (title, year, `cover`, `links[]`, optional `embed` iframe)
- **Tour** — `tour[]` (date, city, venue, `tickets` URL)
- **Socials** — `socials[]` (label + url + `icon` path to a mark in `assets/img/social/`)
- **Merch** — `merch.status` / `blurb` / `cta`, plus `merch.endpoint` (Mailchimp/Formspree POST URL; empty = mailto fallback)
- **Contact** — `contact.email` + `contact.lines[]`
- **Audio** — `audio.ambient`, optional `audio.hover` / `audio.click`

Placeholder links use `"#"` and are hidden/greyed automatically until you add
a real URL. Add images/audio to `assets/` (see `assets/README.md`).

## Run locally

Open `index.html` directly, or serve it (recommended, so audio/embeds behave):

```powershell
cd "C:/Users/lukel/OneDrive/Documents/Automation/1_Output/ArtistOS/draft/dank-street-site"
python -m http.server 8080
# then open http://127.0.0.1:8080
```

## Features

- Immersive full-viewport hero with a **drag-to-spin** 3D slab (momentum + friction, mouse & touch).
- **Scramble** text reveal on the title and every section heading.
- **Glass pill navigation** with active-route highlight (blue -> purple gradient).
- **Ambient audio** toggle (autoplay-safe; remembers preference) + optional UI hover/click SFX.
- Hash-routed sections: **Home / Music / Tour / Socials / Merch / Contact** (legacy `#signup` redirects to `#merch`).
- Coming-soon **Merch** page with a drop-notification email form: validation, endpoint POST, and mailto fallback.
- Responsive + `prefers-reduced-motion` friendly.

## Deploy

It's a static folder — deploy anywhere (Netlify, Vercel, GitHub Pages, S3,
Cloudflare Pages). No server or build required.

## Promote as an approved output

```powershell
python scripts/promote_output.py --capability artist-os --file "C:/Users/lukel/OneDrive/Documents/Automation/1_Output/ArtistOS/draft/dank-street-site" --label dank-street-v1
```
