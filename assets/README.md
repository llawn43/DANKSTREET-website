# DANK STREET — assets

Populated from:
- `0_Input/ArtistMarketing/DANK STREET/DANK STREET_Tour_Info.xlsx` (tour)
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
| `favicon.png` | Tab icon (DS symbol inverted → light, 48×48) |
| `ds-mark.png` | Optional DS symbol mark |
| `og-cover.jpg` | Social share preview (1200×630 from press shot) |
| `epk.jpg` | Contact “Download EPK” (`Dank Street EPK (2).png`, compressed) |
| `covers/*.jpg` | Music section release art (800×800) |
| `photos/live-*.jpg` | Hero wash + contact headshot from LIVE PHOTOS (long edge ~2880, q85) |
| `photos/poster-01.jpg` … `poster-04.jpg` | Stills from Barbary media-kit video |
| `social/*.svg` | Socials section brand marks (Simple Icons, 24×24 single-path) |

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

1. Update tour dates in the Excel file, then edit `../content.js` `tour[]`.
2. New releases: add a Spotify album ID + cover under `covers/`, then add a `tracks[]` entry; refresh `audio/previews/` + `audio.playlist` if a 30s preview exists.
3. New live photos: drop into `LIVE PHOTOS`, update `scripts/build_hero_from_live_photos.py`, re-run it (exports ~2880px long-edge, not 1600px).
4. Re-extract posters with ffmpeg from the media kit when needed.
5. New social platform: drop a single-path SVG in `img/social/` and add an `icon`
   path to that `socials[]` entry. The mark is painted via CSS `mask`, so its own
   fill colour is ignored — it always inherits the pill's text colour.
