# DANK STREET — assets

Populated from:
- `0_Input/ArtistMarketing/DANK STREET/DANK STREET_Tour_Info.xlsx` (tour)
- https://linktr.ee/dankstreetmusic (socials + ticket links)
- Spotify / iTunes (release covers + Sound toggle 30s previews)
- `DANK MEDIA KIT 2026/` — logos, EPK, LIVE PHOTOS, PRESS SHOTS, VIDEO
- Barbary video stills for posters

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
| `photos/live-01-headshot.jpg` | Contact headshot |
| `photos/live-02` … `live-06` | Hero photo wash (Otherworld, Barbary, EPK shot, press) |
| `photos/live-07-pro-pic.jpg` | Hero photo wash (`PRESS SHOTS/PRO PIC.png`, 1004×1528 native) |
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
3. New brand kit: re-optimize logos/photos/EPK with Pillow into `img/` (logos ≤~900px wide; photos ≤~1600px JPEG q82).
4. Re-extract posters with ffmpeg from the media kit when needed.
5. New social platform: drop a single-path SVG in `img/social/` and add an `icon`
   path to that `socials[]` entry. The mark is painted via CSS `mask`, so its own
   fill colour is ignored — it always inherits the pill's text colour.
