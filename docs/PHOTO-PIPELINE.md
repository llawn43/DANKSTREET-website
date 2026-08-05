# Hero photo pipeline (LIVE PHOTOS)

## Source of truth

All future Dank Street site photos come from:

`C:\Users\lukel\OneDrive\Documents\Automation\0_Input\ArtistMarketing\DANK STREET\DANK MEDIA KIT 2026\LIVE PHOTOS`

Do not pull hero frames from PRESS SHOTS or video stills unless they are copied into LIVE PHOTOS first.

## Why wide shots looked soft / empty before

1. **Pixelation** — site exports were capped at ~1600px wide. On a 1920–2560px desktop the hero used `background-size: cover`, so the browser *upscaled* and softened the image.
2. **Black / dead areas** — those appear when an image is shown with `contain` (letterboxing) or when a flat backdrop shows through. The hero already uses `cover` (fill + crop). Empty-looking edges were usually the dark overlay, not letterboxing.
3. **`DANK STREET.jpg` is a portrait** — the file is HEIC (mislabeled `.jpg`), **4000×6000**. On a wide desktop, `cover` crops the left/right into a vertical strip. It never “stretches wide”; for full-bleed width you need landscape masters (3:2 / 4:3). The LIVE PHOTOS folder has several **6000×4000** frames for that.

## Approach (implemented)

| Rule | Choice |
|------|--------|
| Fill viewport | `background-size: cover` + center (no letterboxing) |
| Sharpness | Export long edge **2880px**, JPEG q85 progressive (no upscale past source) |
| Hero order | Landscapes first, then optional portraits |
| Rebuild | `scripts/build_hero_from_live_photos.py` |
| HEIC | Decode with ffmpeg when Pillow cannot open |

## Refreshing photos

1. Drop new files into LIVE PHOTOS.
2. Add them to the `HERO` list in `scripts/build_hero_from_live_photos.py`.
3. Run: `python scripts/build_hero_from_live_photos.py`
4. Point `content.js` → `heroPhotos` at the new `assets/img/photos/*.jpg` paths.
5. Commit and push.

Prefer **landscape** (aspect ≥ ~1.3) for any frame that must read as a full-width wash on desktop.
