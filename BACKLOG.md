# DANK STREET site backlog

Source of truth for open work on [dankstreetmusic.com](https://dankstreetmusic.com/).
Lives in this repo so every clone and PR sees the same list.

Repo: https://github.com/llawn43/DANKSTREET-website

## How we use this file

```
New finding → add Open row (with Origin) → owner implements or decides
    → PR updates Status → move row to Done (keep the recipe)
Site review pass → walk every section → add anything new before closing
```

**Intake (anyone).** Add a row the same day the issue is seen. Required: Origin, Summary, Owner, Date identified, How to address. If the fix is unknown, write “needs repro / Artist pick” — do not leave How to address blank.

**Origin**

| Value | Use when |
|-------|----------|
| Artist | Dank Street asked for it or supplied the asset |
| Site Dev | Found during build, QA, or a review session |
| Visitors | Inbound from fans, bookers, or live-site feedback |
| Cursor | Suggested by an agent review of the repo or live site |

**Status:** `Open` · `In progress` · `Blocked` · `Done` · `Won't do`

**Priority**

- **P0** — live page is wrong or broken
- **P1** — visitor-facing copy, media, or UX
- **P2** — docs, SEO extras, or nice-to-have

**Owner and dates**

- Default owner: **Site Dev** for code/copy in this repo; **Artist** when a clip, date, or brand choice is required. Put a name next to the role when known.
- Default resolve-by: P0 next working day; P1 within 7 days; P2 next review pass.
- If blocked on Artist input, set Status to `Blocked` and keep the target date. Do not delete the row.

**Closing work**

- One PR can close several items. In that PR: set Status to `Done`, fill the actual resolve date, leave How to address as the recipe that was used.
- Do not delete rows. Move them to [Done / won't do](#done--wont-do) so origin and dates stay auditable.
- If a PR changes behavior that `REVIEW.md` still describes (for example `.ics` text or the promo video), update that doc in the same PR.

**Cadence.** After each local or live review, walk Home → Music → Tour → Media → Socials → Merch → Contact and add anything new before closing the session. Recheck Open + Blocked items at the start of the next Cursor or site session.

**Tour source of truth.** `content.js` `tour[]` / `tourPast[]` is canonical for the live site. `DANK STREET_Tour_Info.xlsx` in the media kit is an export — keep it in sync, but do not treat the spreadsheet as what the site serves.

---

## Open items

| ID | Status | Priority | Origin | Summary | Owner | Identified | Resolve by | How to address |
|----|--------|----------|--------|---------|-------|------------|------------|----------------|
| [DS-005](#ds-005--remove-site-demo-video-add-kit-videos) | Blocked | P1 | Artist | Add 1–3 media-kit videos (site promo already removed) | Artist (pick) + Site Dev (implement) | 2026-08-13 | 2026-08-27 | Promo MP4 is gone. Artist names clips; Site Dev transcodes to `assets/video/`. See below. |
| [DS-008](#ds-008--older-soundcloud-links-go-to-the-profile) | Open | P2 | Cursor | RIDE OUT through PRAY FOR 'EM SoundCloud links are the profile, not the release | Artist | 2026-08-13 | Next review | Swap in per-release SoundCloud URLs in `content.js` when they exist. See below. |
| [DS-009](#ds-009--confirm-missing-socials) | Open | P2 | Cursor | TikTok / YouTube were listed in the launch plan but are not on the site | Artist | 2026-08-13 | Next review | Add `socials[]` rows only if live URLs exist. See below. |

---

## How to address

### DS-001 — Favicon / tab logo

**Origin:** Site Dev (review screenshot of the live tab bar). **Done 2026-08-13.**

Rebuilt `assets/img/favicon.png` (48×48) and added `assets/img/apple-touch-icon.png` (180×180): white DS monogram from `ds-mark.png` on a brand-blue (`#3d6bff`) rounded tile. [`index.html`](index.html) now has `<link rel="icon">` and `<link rel="apple-touch-icon">`.

### DS-002 — Replace `.ics` label with a calendar icon

**Origin:** Site Dev. **Done 2026-08-13.**

[`js/router.js`](js/router.js) `tourRows()` still downloads `.ics` via `icsFor()`. Visible label is an inline calendar SVG with `aria-label="Add to calendar"`. Stroke source also saved as `assets/img/calendar.svg`. `.cal-btn` in [`styles.css`](styles.css).

### DS-003 — Remove media description

**Origin:** Site Dev. **Done 2026-08-13.**

[`content.js`](content.js) `media.blurb` is `""`. `renderMedia()` skips the lead paragraph when empty.

### DS-004 — Elements Festival ticket label

**Origin:** Site Dev. **Done 2026-08-13.**

[`js/router.js`](js/router.js) `tourRows(dates, withIcs, isPast)` shows **N/A** for past dates with no ticket URL and **Soon** for upcoming. Optional `ticketsLabel` on a tour row overrides either.

### DS-005 — Remove site demo video; add kit videos

**Origin:** Artist (content direction) — Site Dev implements after the Artist picks clips.

Promo already removed (2026-08-13): `media.videos` is `[]` and `dank-street-promo-15s.mp4` is deleted. Remaining work is Artist-blocked.

1. Artist chooses 1–3 clips from `0_Input/ArtistMarketing/DANK STREET/DANK MEDIA KIT 2026/VIDEO/`:
   - `BARBARY.mp4`, `BARBARY 2 .mp4`, `BARBARY 3.mp4`, `BARBARY VERTI 070326_00523360 (1).mov`
   - `ELEMENTS 2024.mp4`
   - `SOUND SELECTAS @ BARBARY 070326_01340367.mov`
   - `IMG_0254.MOV`, `3.mp4` — `AVI_2687.MP4` is ~1 GB; skip unless a short cut is made
2. Transcode to web H.264 (720p or 1080p, about 5–20 MB). Do **not** commit the raw 80 MB–1 GB masters.
3. Save under `assets/video/` and point `content.js` `media.videos[]` at those paths with a real title and blurb.
4. Status stays `Blocked` until the Artist names the clips; then Site Dev implements.

### DS-006 — Stale launch / review docs

**Origin:** Cursor. **Done 2026-08-13.**

[`DANK_STREET_Website_Launch_Plan.html`](DANK_STREET_Website_Launch_Plan.html) banner and status now say historical; new work goes in this file. [`REVIEW.md`](REVIEW.md) Tour/Media rows match the calendar icon and removed promo (kit videos still noted as DS-005).

### DS-007 — ICS times are hardcoded 21:00–23:59

**Origin:** Cursor. **Done 2026-08-13.**

[`js/router.js`](js/router.js) `icsStamp()` reads optional `startTime` / `endTime` (`HH:MM`, `HHMM`, or `HHMMSS`). Defaults remain 21:00–23:59. Comment on the tour block in [`content.js`](content.js). No real set times added yet.

### DS-008 — Older SoundCloud links go to the profile

**Origin:** Cursor.

In [`content.js`](content.js) `tracks[]`, EN LA CALLE has a set URL. RIDE OUT, GET DOWN EP, NO DISRESPECT, ATTACK, and PRAY FOR 'EM use `https://soundcloud.com/dankstreet`. Artist supplies per-release URLs; Site Dev drops them into each track’s `links[]`.

### DS-009 — Confirm missing socials

**Origin:** Cursor.

The launch plan listed TikTok / YouTube. [`content.js`](content.js) `socials[]` currently has Instagram, Linktree, Spotify, SoundCloud, Apple Music, Beatport only. Artist confirms live URLs (or “none”). If adding a platform: drop a single-path SVG in `assets/img/social/` and add a `socials[]` row (see [`assets/README.md`](assets/README.md)).

### DS-010 — Tour has two sources of truth

**Origin:** Cursor. **Done 2026-08-13.**

[`assets/README.md`](assets/README.md) and the process note at the top of this file: `content.js` is canonical; the Excel file is the media-kit export.

---

## Done / won't do

| ID | Status | Priority | Origin | Summary | Owner | Identified | Resolved | How to address |
|----|--------|----------|--------|---------|-------|------------|----------|----------------|
| [DS-010](#ds-010--tour-has-two-sources-of-truth) | Done | P2 | Cursor | `content.js` tour arrays and the kit Excel can drift | Site Dev | 2026-08-13 | 2026-08-13 | Documented `content.js` as canonical in `assets/README.md`. |
| [DS-007](#ds-007--ics-times-are-hardcoded-2100–2359) | Done | P2 | Cursor | Calendar downloads always use 9:00–11:59 PM | Site Dev | 2026-08-13 | 2026-08-13 | Optional `startTime` / `endTime` on tour rows; `icsStamp()` in `js/router.js`. |
| [DS-006](#ds-006--stale-launch--review-docs) | Done | P2 | Cursor | Launch plan and REVIEW.md still describe pre-launch / promo-video work | Site Dev | 2026-08-13 | 2026-08-13 | Launch plan marked historical; REVIEW.md Tour/Media rows updated. |
| [DS-002](#ds-002--replace-ics-label-with-a-calendar-icon) | Done | P1 | Site Dev | Tour calendar download shows the text `.ics` | Site Dev | 2026-08-13 | 2026-08-13 | Inline calendar SVG + `aria-label` in `js/router.js`; `.ics` download kept. |
| [DS-001](#ds-001--favicon--tab-logo) | Done | P1 | Site Dev | Tab favicon reads as empty on dark Chrome tabs | Site Dev | 2026-08-13 | 2026-08-13 | White DS on `#3d6bff` tile; `favicon.png` + `apple-touch-icon.png`. |
| [DS-004](#ds-004--elements-festival-ticket-label) | Done | P1 | Site Dev | Elements Festival / Solar Sounds — Vibe Village Stage shows “Soon” | Site Dev | 2026-08-13 | 2026-08-13 | Past empty tickets render N/A; upcoming still Soon. |
| [DS-003](#ds-003--remove-media-description) | Done | P1 | Site Dev | Media section shows “Live stills and set frames from the 2026 media kit.” | Site Dev | 2026-08-13 | 2026-08-13 | Cleared `media.blurb` in `content.js`. |

---

## ID counter

**Next ID to assign:** `DS-011`
