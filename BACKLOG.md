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
| [DS-001](#ds-001--favicon--tab-logo) | Open | P1 | Site Dev | Tab favicon reads as empty on dark Chrome tabs | Site Dev | 2026-08-13 | 2026-08-20 | Rebuild `assets/img/favicon.png` from kit logos on a colored/light tile; add apple-touch-icon. See below. |
| [DS-002](#ds-002--replace-ics-label-with-a-calendar-icon) | Open | P1 | Site Dev | Tour calendar download shows the text `.ics` | Site Dev | 2026-08-13 | 2026-08-20 | Keep the download; swap the visible label for a calendar icon in `js/router.js`. See below. |
| [DS-003](#ds-003--remove-media-description) | Open | P1 | Site Dev | Media section shows “Live stills and set frames from the 2026 media kit.” | Site Dev | 2026-08-13 | 2026-08-16 | Clear `media.blurb` in `content.js`. See below. |
| [DS-004](#ds-004--elements-festival-ticket-label) | Open | P1 | Site Dev | Elements Festival / Solar Sounds — Vibe Village Stage shows “Soon” | Site Dev | 2026-08-13 | 2026-08-16 | Past dates with no ticket URL should render N/A, not Soon. See below. |
| [DS-005](#ds-005--remove-site-demo-video-add-kit-videos) | Open | P1 | Artist | Remove site demo video; add clips from the 2026 media kit | Artist (pick) + Site Dev (implement) | 2026-08-13 | 2026-08-27 | Delete promo MP4; Artist picks 1–3 kit clips; transcode to `assets/video/`. See below. |
| [DS-006](#ds-006--stale-launch--review-docs) | Open | P2 | Cursor | Launch plan and REVIEW.md still describe pre-launch / promo-video work | Site Dev | 2026-08-13 | 2026-08-27 | Archive or mark the launch plan historical; fix REVIEW.md when related items close. See below. |
| [DS-007](#ds-007--ics-times-are-hardcoded-2100–2359) | Open | P2 | Cursor | Calendar downloads always use 9:00–11:59 PM | Site Dev | 2026-08-13 | Next review | Optional `startTime` / `endTime` on tour rows. See below. |
| [DS-008](#ds-008--older-soundcloud-links-go-to-the-profile) | Open | P2 | Cursor | RIDE OUT through PRAY FOR 'EM SoundCloud links are the profile, not the release | Artist | 2026-08-13 | Next review | Swap in per-release SoundCloud URLs in `content.js` when they exist. See below. |
| [DS-009](#ds-009--confirm-missing-socials) | Open | P2 | Cursor | TikTok / YouTube were listed in the launch plan but are not on the site | Artist | 2026-08-13 | Next review | Add `socials[]` rows only if live URLs exist. See below. |
| [DS-010](#ds-010--tour-has-two-sources-of-truth) | Open | P2 | Cursor | `content.js` tour arrays and the kit Excel can drift | Site Dev | 2026-08-13 | Next review | Document that `content.js` is canonical; keep the Excel as a kit export. See below. |

---

## How to address

### DS-001 — Favicon / tab logo

**Origin:** Site Dev (review screenshot of the live tab bar).

The boxed tab icon looks empty because `assets/img/favicon.png` is a white DS monogram on a **black square**. On Chrome’s dark tab bar that square disappears.

1. Rebuild from the 2026 kit logos under `0_Input/ArtistMarketing/DANK STREET/DANK MEDIA KIT 2026/DANK LOGOS-VISUALS/` (`ICON LOGO.png`, `Name Logo_White.png`) and `DANK Logo Assests/DS_Logo Symbol Black.png`.
2. Prefer the **white DS monogram** (current `favicon.png` / inverted `icon-logo.png`) on a **brand-colored or light tile** so it reads at 16px.
3. Do **not** use `ICON LOGO.png` or `DS_Logo Symbol Black.png` as-is (black-on-black / black mark).
4. Write the new file to `assets/img/favicon.png` and add an `apple-touch-icon` (180px).
5. Keep [`index.html`](index.html) `<link rel="icon" href="assets/img/favicon.png" />` pointed at the new file; add a `<link rel="apple-touch-icon">` if one is not already there.
6. Update [`assets/README.md`](assets/README.md) so the favicon row matches the new treatment.

### DS-002 — Replace `.ics` label with a calendar icon

**Origin:** Site Dev.

1. In [`js/router.js`](js/router.js) `tourRows()`, the download link text is currently `.ics` (around the `download="dank-street-….ics"` anchor).
2. Keep the `.ics` file download and `href` from `icsFor()`.
3. Change the visible label to a calendar SVG — new `assets/img/calendar.svg` or an inline icon — with `aria-label="Add to calendar"`.
4. When this ships, update [`REVIEW.md`](REVIEW.md) (it still tells reviewers to look for `.ics`).

### DS-003 — Remove media description

**Origin:** Site Dev.

1. In [`content.js`](content.js) → `media.blurb`, delete `Live stills and set frames from the 2026 media kit.`
2. Set `blurb` to `""` or remove the key. [`js/router.js`](js/router.js) `renderMedia()` already skips the lead paragraph when blurb is empty.

### DS-004 — Elements Festival ticket label

**Origin:** Site Dev.

The past row in [`content.js`](content.js) `tourPast` is Elements Festival / Solar Sounds — Vibe Village Stage with `tickets: ""`. [`js/router.js`](js/router.js) `tourRows()` renders **Soon** for any empty ticket URL.

1. For **past** dates with no ticket URL, render **N/A** instead of Soon.
2. Keep **Soon** only for upcoming dates still waiting on a link.
3. Optional later: a per-row `ticketsLabel` on tour objects if a show needs custom text.

### DS-005 — Remove site demo video; add kit videos

**Origin:** Artist (content direction) — Site Dev implements after the Artist picks clips.

1. Remove `media.videos[0]` (title “Site promo”) from [`content.js`](content.js).
2. Delete `dank-street-promo-15s.mp4` from the repo root.
3. Artist chooses 1–3 clips from `0_Input/ArtistMarketing/DANK STREET/DANK MEDIA KIT 2026/VIDEO/`:
   - `BARBARY.mp4`, `BARBARY 2 .mp4`, `BARBARY 3.mp4`, `BARBARY VERTI 070326_00523360 (1).mov`
   - `ELEMENTS 2024.mp4`
   - `SOUND SELECTAS @ BARBARY 070326_01340367.mov`
   - `IMG_0254.MOV`, `3.mp4` — `AVI_2687.MP4` is ~1 GB; skip unless a short cut is made
4. Transcode to web H.264 (720p or 1080p, about 5–20 MB). Do **not** commit the raw 80 MB–1 GB masters.
5. Save under `assets/video/` and point `content.js` `media.videos[]` at those paths with a real title and blurb.
6. Status stays `Blocked` until the Artist names the clips; then Site Dev implements.

### DS-006 — Stale launch / review docs

**Origin:** Cursor.

1. [`DANK_STREET_Website_Launch_Plan.html`](DANK_STREET_Website_Launch_Plan.html) still asks for a content pack and domain. Archive it or add a banner that it is historical and must not drive new work.
2. [`REVIEW.md`](REVIEW.md) still lists `.ics` and “promo video”. Update those lines when DS-002 and DS-005 close (same PR is fine).

### DS-007 — ICS times are hardcoded 21:00–23:59

**Origin:** Cursor.

[`js/router.js`](js/router.js) `icsFor()` always writes `T210000` / `T235900`. Fine as a placeholder. Add optional `startTime` / `endTime` on `tour[]` / `tourPast[]` rows in [`content.js`](content.js) when real set times exist, and read them in `icsFor()`.

### DS-008 — Older SoundCloud links go to the profile

**Origin:** Cursor.

In [`content.js`](content.js) `tracks[]`, EN LA CALLE has a set URL. RIDE OUT, GET DOWN EP, NO DISRESPECT, ATTACK, and PRAY FOR 'EM use `https://soundcloud.com/dankstreet`. Artist supplies per-release URLs; Site Dev drops them into each track’s `links[]`.

### DS-009 — Confirm missing socials

**Origin:** Cursor.

The launch plan listed TikTok / YouTube. [`content.js`](content.js) `socials[]` currently has Instagram, Linktree, Spotify, SoundCloud, Apple Music, Beatport only. Artist confirms live URLs (or “none”). If adding a platform: drop a single-path SVG in `assets/img/social/` and add a `socials[]` row (see [`assets/README.md`](assets/README.md)).

### DS-010 — Tour has two sources of truth

**Origin:** Cursor.

1. Treat [`content.js`](content.js) `tour[]` / `tourPast[]` as what the live site serves.
2. Treat `0_Input/ArtistMarketing/DANK STREET/DANK STREET_Tour_Info.xlsx` as the media-kit export.
3. Spell that out in [`assets/README.md`](assets/README.md) (refreshing-content step 1 already says to update both — make canonical vs export explicit).

---

## Done / won't do

| ID | Status | Priority | Origin | Summary | Owner | Identified | Resolved | How to address |
|----|--------|----------|--------|---------|-------|------------|----------|----------------|
| — | — | — | — | *None yet. Move closed rows here, newest first. Do not delete.* | — | — | — | — |

---

## ID counter

**Next ID to assign:** `DS-011`
