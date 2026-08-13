# DANK STREET — assets

Populated from:
- [`../content.js`](../content.js) `tour[]` / `tourPast[]` — **canonical tour list for the live site**
- `0_Input/ArtistMarketing/DANK STREET/DANK STREET_Tour_Info.xlsx` — media-kit export only; keep in sync, do not treat as what the site serves
- https://linktr.ee/dankstreetmusic (socials + ticket links)
- Spotify / iTunes (release covers + Sound toggle 30s previews)
- **`DANK MEDIA KIT 2026/LIVE PHOTOS`** — sole source for hero + contact photos going forward
- `DANK MEDIA KIT 2026/` — logos, EPK, VIDEO (posters)

Photo rebuild script: `../scripts/build_hero_from_live_photos.py`  
Pipeline notes: `../docs/PHOTO-PIPELINE.md`

## Images (`img/`)

| File | Used for |
|------|----------|
| `logo-hero.png` | Hero white wordmark (`Name Logo_White.png`, web-sized) |
| `icon-logo.png` | 3D hero emblem source (`ICON LOGO.png`, web-sized) |
| `icon-logo-rim.png` | Solid silhouette for extrusion edges |
| `favicon.png` | Tab icon — white DS monogram on brand-blue (`#3d6bff`) rounded tile, 48×48 |
| `apple-touch-icon.png` | iOS home-screen icon, 180×180, same treatment |
| `calendar.svg` | Tour “Add to calendar” mark (stroke icon; live button uses the inline copy in `js/router.js`) |
| `ds-mark.png` | Optional DS symbol mark (source for the favicon monogram) |
| `og-cover.jpg` | Social share preview (1200×630 from press shot) |
| `epk.jpg` | Contact “Download EPK” (`Dank Street EPK (2).png`, compressed) |
| `covers/*.jpg` | Music section release art (800×800) |
| `photos/live-*.jpg` | Hero wash + contact headshot from LIVE PHOTOS (long edge ~2048 / headshot ~1200, q78) |
| `photos/poster-01.jpg` … `poster-04.jpg` | Stills from Barbary media-kit video (Media gallery) |
| `social/*.svg` | Socials section brand marks (Simple Icons, 24×24 single-path; includes Beatport) |

## Audio (`audio/`)

| File | Used for |
|------|----------|
| `previews/en-la-calle.mp3` | Sound toggle — 30s EN LA CALLE preview |
| `previews/ride-out.mp3` | Sound toggle — 30s RIDE OUT preview |
| `previews/get-down.mp3` | Sound toggle — 30s GET DOWN preview |
| `previews/no-disrespect.mp3` | Sound toggle — 30s NO DISRESPECT preview |
| `previews/attack.mp3` | Sound toggle — 30s ATTACK preview |

Previews sourced from Apple Music / iTunes Search API (same Dank Street catalog as the Music page). Playlist order is set in `../content.js` → `audio.playlist`. Pray For 'Em had no public preview and is omitted.

Do not commit raw multi‑hundred‑MB / GB media-kit MP4s into the site folder.
Originals stay in `0_Input/ArtistMarketing/DANK STREET/`.

## Refreshing content

1. Edit tour dates in `../content.js` `tour[]` / `tourPast[]` first (that is what the live site serves). Then refresh the Excel export so the media kit matches. Optional `startTime` / `endTime` (`HH:MM`) go on the `content.js` row.
2. New releases: add a Spotify album ID + cover under `covers/`, then add a `tracks[]` entry; refresh `audio/previews/` + `audio.playlist` if a 30s preview exists.
3. New live photos: drop into `LIVE PHOTOS`, update `scripts/build_hero_from_live_photos.py`, re-run it (exports ~2048px long-edge).
4. Re-extract posters with ffmpeg from the media kit when needed.
5. New social platform: drop a single-path SVG in `img/social/` and add an `icon`
   path to that `socials[]` entry. The mark is painted via CSS `mask`, so its own
   fill colour is ignored — it always inherits the pill's text colour.
