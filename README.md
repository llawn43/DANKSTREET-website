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
├── robots.txt
├── sitemap.xml
├── 404.html          # path → hash fallback for GitHub Pages
├── js/
│   ├── router.js     # hash routing + renders sections
│   ├── slab.js       # interactive drag-to-spin hero centerpiece
│   ├── scramble.js   # text scramble/glitch effect
│   ├── hero.js       # photo wash (lazy-loads slides after first)
│   └── audio.js      # release preview playlist + sound toggle
└── assets/
    ├── img/          # logo, covers, og image, favicon, photos, social icons
    ├── audio/        # 30s release previews
    └── README.md     # asset filename reference
```

## Editing content

Everything the site shows comes from **`content.js`** (`window.DANK_STREET`):

- **Identity** — `name`, `tagline`, `bio`, `billing`
- **Music** — `tracks[]` (title, year, `cover`, `links[]`, optional `embed` iframe)
- **Tour** — `tour[]` / `tourPast[]` (`date`, `isoDate`, city, venue, `tickets` URL)
- **Media** — `media.photos[]` / `media.videos[]`
- **Socials** — `socials[]` (label + url + `icon` path to a mark in `assets/img/social/`)
- **Merch** — `merch.status` / `blurb` / `cta`, plus `merch.subscribeUrl` (Feature.fm / audience link)
- **Contact** — `contact.email`, `contact.formEndpoint`, `contact.lines[]`
- **Audio** — `audio.playlist`, optional `audio.hover` / `audio.click`
- **Analytics** — `analytics.plausibleDomain`

Placeholder links use `"#"` and are hidden/greyed automatically until you add
a real URL. Add images/audio to `assets/` (see `assets/README.md`).

## Features

- Immersive full-viewport hero with a **drag-to-spin** 3D slab (momentum + friction, mouse & touch).
- Hero CTAs for Music / Tour / Book; scramble text on section headings.
- **Glass pill navigation** with active-route highlight (blue -> purple gradient).
- **Ambient audio** toggle (autoplay-safe; remembers preference) + optional UI hover/click SFX.
- Hash-routed sections: **Home / Music / Tour / Media / Socials / Merch / Contact** (legacy `#signup` → `#merch`).
- Wheel / touch scroll paging: down advances sections left-to-right; up in the hero band returns Home.
- Tour auto-archives past `isoDate` rows; `.ics` download per upcoming show; JSON-LD events.
- Coming-soon **Merch** page with a CTA to the Feature.fm subscribe page (`merch.subscribeUrl`).
- Contact booking form (FormSubmit) + About/bio from `content.js`.
- Responsive + `prefers-reduced-motion` friendly.

## Run locally

```powershell
cd "C:/Users/lukel/OneDrive/Documents/Automation/1_Output/ArtistOS/draft/dank-street-site"
python -m http.server 8080
# then open http://127.0.0.1:8080
```

## Deploy

It's a static folder — deploy anywhere (Netlify, Vercel, GitHub Pages, S3,
Cloudflare Pages). No server or build required.

## Promote as an approved output

```powershell
python scripts/promote_output.py --capability artist-os --file "C:/Users/lukel/OneDrive/Documents/Automation/1_Output/ArtistOS/draft/dank-street-site" --label dank-street-v1
```
