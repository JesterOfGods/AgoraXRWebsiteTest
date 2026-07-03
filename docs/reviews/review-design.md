# AgoraXR — Design Review ("Humanist Immersive")

Reviewed against the brief: Scandinavian warmth + Japanese Ma restraint, warm clay/sage palette,
Fraunces + Hanken Grotesk, generous whitespace, soft depth, gentle motion.

Method: source read (index.html, tokens.css, styles.css, app.js, data.js) + headless Chrome renders of
every route at 1280px (light + dark) and home at 375px. Web fonts DID load in headless, so type is judged
as intended. Screenshots in this scratchpad: `rev-*.png` (light), `rev-*-dark.png` (dark), `rev-home-mobile.png`.

## Verdict
It genuinely reads as "Humanist Immersive," not generic: Fraunces display, warm clay/sage system, soft
shadows, the two-hue run/include logic, and the golden-hour Attune demo are distinctive and on-brand. Dark
mode is a real, warm re-theme (not an inversion) and is a strength. What undercuts the premium feel is
whitespace that reads as *accidental* rather than composed (hero dead-gap, marooned narrow text columns),
orphaned grid cells, one clipped diagram, an invisible footer logo, and a showpiece demo repeated verbatim.
Fix the P1/P2 items and it lands as premium.

---

## P1 — Blockers (visible defects, fix before release)

### P1-1 · Footer brand wordmark "Agora" is nearly invisible in light mode (every page)
- **Problem:** In the dark footer, the logo reads as just a terracotta square + faint "XR"; the word
  "Agora" is dark-on-dark. Cause: `strong, b { color: var(--ink) }` (styles.css:24) directly targets the
  `<b>Agora</b>` inside the footer brand and beats the *inherited* `.footer .brand { color: var(--clay-50) }`
  (styles.css:397). In light mode `--ink` = `--clay-800` (near-black) sitting on the always-dark footer
  (`--bg-inverse` / `--clay-950`). Only the "XR" span survives because it has an inline terracotta-300 colour.
- **Route:** all pages (footer). Clearest in `rev-services.png`, `rev-command.png` bottom-left.
- **File:** index.html:64-67 (footer `.brand`), styles.css:24 (`strong, b`), styles.css:397 (`.footer .brand`).
- **Fix:** add `.footer .brand b { color: inherit; }` (or `.footer .brand strong { color: var(--clay-50); }`).
  The header brand is fine because there `--ink` is dark on a light bg.

### P1-2 · Architecture diagram clips its own text on the Platform page
- **Problem:** The flagship "How it fits together" SVG (`viewBox 0 0 920 430`) overflows on the right. The
  storage caption "Nothing leaves or enters without permission." renders as "…without permis" (clipped at the
  viewBox edge), and the Attune box label "accessibility & comfort · 9 categories" spills past its box border
  into the flow line. On the page that's supposed to make the product legible, it looks broken.
- **Route:** `#/platform` (`rev-platform.png`, the stack card).
- **File:** app.js:61-79 `archDiagram()` — caption at `x="660" y="238"` (app.js:78); box label `x="336"`
  inside `box-g` that ends at x=540 (app.js:67-68).
- **Fix:** widen the `viewBox` width to ~1000 (and the storage column), or shorten the strings ("Nothing moves
  without permission." / "accessibility & comfort · 9 areas"), or drop the caption font-size. Also add a large
  bottom margin removal — the card (`padding:2rem`, app.js:342) leaves a big empty well below the diagram.

---

## P2 — Should-fix (hurt the composition / consistency)

### P2-1 · Hero has a large dead gap below the content (the brief flagged this — confirmed)
- **Problem:** `.hero` reserves `padding-block: var(--space-8) var(--section-gap)` (64px / 96–128px, styles.css:204)
  and `.hero-grid` is `align-items:center`, but both columns are short (content ends ~350px). The result is a
  tall empty band between the trust-tags/video and the "TRUSTED BY" row with nothing to anchor it — it reads as
  leftover space, not Ma. Ma works when the void frames something; here it frames nothing.
- **Route:** home (`rev-home.png`), and repeated on every inner hero.
- **File:** styles.css:204 (`.hero` padding), styles.css:210-211 (`.hero-grid`); app.js:170-182.
- **Fix:** cut the hero bottom padding to ~`--space-7`, and/or give the void a job — a thin baseline rule, a
  scroll cue, or let the credibility band's top edge sit closer. Balance the two column heights so the video
  placeholder and text end near the same baseline.

### P2-2 · `wrap--content` text sections float as marooned, off-balance columns
- **Problem:** Text-forward sections use `.wrap--content` (max 48rem, centered) with **left-aligned** text, so a
  heading starts ~180px from the left with a big empty left gutter and an equally empty right void. It reads as
  accidental indentation, not composed negative space — most jarring on the surface bands where the block looks
  stranded (sector "Why this matters here", sdk "Stop rebuilding accessibility per app", trust "Ahead of where
  accessibility is heading"). It also recurs on platform/attune/about/services/contact heroes.
- **Route:** `#/solutions/museums`, `#/platform/sdk`, `#/trust`, `#/about`, `#/services`, `#/contact`.
- **File:** styles.css:37 (`.wrap--content`); used throughout app.js (e.g. 309, 404-407, 423, 430, 487-499, 508-509).
- **Fix:** pick one intent and apply it consistently: either (a) left-align these blocks to the *page* wrap so
  the heading shares the nav/hero left baseline, or (b) `center` the narrow column's text, or (c) anchor the
  left margin with a section index / hairline / eyebrow so the whitespace looks authored. Right now it's neither.

### P2-3 · Odd-count grids leave orphaned empty cells (looks unfinished)
- **Problem:** Several grids don't fill their columns, leaving a visible hole:
  - Attune "Nine categories" — **8** category cards in a 3-col grid = empty cell at row 3 / col 3, then a
    full-width horizon card below (data.js has 8 `categories` + 1 `categoryHorizon`). `rev-attune.png`.
  - Agora Command "What it does" — **5** cards in `g3` = empty cell row 2 / col 3. `rev-command.png`.
  - Trust "Trust signals" — **5** badges in a 2-col `badgewall` = orphan on the last row. `rev-trust.png`.
- **Route:** `#/platform/attune`, `#/platform/agora-command`, `#/trust`.
- **File:** app.js:381-385 (cats), app.js:366 (`c.does`), app.js:494 + styles.css:306-308 (badgewall).
- **Fix:** balance the counts to the column count (e.g. let "Attune Horizon" occupy the 9th grid cell for a clean
  3×3 rather than spanning full width; drop Command to 3 or 6; make Trust signals a 3-col or even count), or
  center the final short row.

### P2-4 · The Attune demo is repeated verbatim on 3+ surfaces
- **Problem:** `attuneDemo()` renders the identical golden-hour "Room 3 · The Aegean" gallery + identical control
  panel on the home page, on **every** sector page, and on the Attune page. On non-museum sectors (training,
  healthcare) the gallery scene doesn't fit the context, and seeing the same widget repeatedly dilutes its
  showpiece impact and inflates page length.
- **Route:** home, all `#/solutions/*`, `#/platform/attune`.
- **File:** app.js:54-58 `attuneDemo()`, called at app.js:206, 321, 392.
- **Fix:** make the demo the hero once (Attune page), and elsewhere show a lighter/static teaser or vary the
  scene + HUD copy per sector (classroom, clinic, training floor) so it earns its place.

### P2-5 · "Connector" sections are under-filled and float in oversized padding
- **Problem:** Agora Command's "HOW IT CONNECTS" is an eyebrow (no h2) + three small xlink chips surrounded by
  huge vertical whitespace, so the band looks empty (`rev-command.png`). The SDK page leaves ~200px of dead space
  between the "Read the docs / Get the SDK" buttons and the closing CTA (`rev-sdk.png`). These are Ma gaps with
  nothing to frame.
- **Route:** `#/platform/agora-command`, `#/platform/sdk`.
- **File:** app.js:371-375 (crosslinks band, no heading), app.js:430-434 (band bottom padding); `.band` padding
  styles.css:40.
- **Fix:** give connector bands a real heading and use `.band--tight`, or tighten section padding so the sparse
  content isn't stranded.

---

## P3 — Polish

### P3-1 · Spine-card hierarchy is inverted
The descriptive sentence is rendered as `<h3>` (the largest text in the card) while the actual product name
("AGORA COMMAND") is tiny mono and the payoff is small — the eye lands on the sentence, not the product.
`app.js:259-263` (`spineCard`), styles.css:293-296. Consider promoting the product name and setting the body at
body weight. (Home / platform / sector two-spine sections.)

### P3-2 · Dark-mode card separation is faint
Card surfaces (`#292420`) on the page ground (`--clay-900`) with `--line #3C342D` borders barely separate —
the Attune category cards in dark almost merge with the background (`rev-attune-dark.png`). tokens.css:250-259.
Nudge the surface lighter or strengthen the hairline in dark.

### P3-3 · Placeholder scaffolding dominates several above-the-folds
Large dashed `.ph` boxes (hero film, partner-logo row, throughput stat, per-sector deployment films, case
studies) are honest but heavy — every sector hero leads with an "under construction" dashed film box
(app.js:306). styles.css:224-237. Consider a softer, less dashed placeholder so pre-content pages still look
finished.

### P3-4 · Eyebrow drumbeat
Almost every section opens with a mono uppercase eyebrow → h2 (8–9 times on the home page alone). It's on-brand
but monotonous over a long scroll. `eyebrow()` app.js:14-16 used pervasively. Vary a few section intros (drop
the eyebrow, or use a number/rule) to create rhythm.

### P3-5 · Mobile hero eyebrow wraps awkwardly
"XR INFRASTRUCTURE FOR INSTITUTIONS" wraps to two lines with wide letter-spacing at 375px (`rev-home-mobile.png`).
styles.css:61-64 / hero. Shorten the eyebrow or reduce its tracking on small screens.

### P3-6 · Minor state gaps
Forms validate inline (good) but have no submitting/loading state and the success message never clears after a
later edit (app.js:696-715). The cookie banner + to-top + theme toggle are all wired and consistent. Low impact.

---

## What works (keep)
- **Two-spine system** (run = terracotta, include = sage) is clear, consistent across home/platform/sector, and
  is the strongest expression of the brief's two-hue intent.
- **Dark mode** is a genuine warm re-theme with sensible accent lightening and deeper shadows — not an inversion.
- **The Attune demo** itself (golden-hour scene + live controls: scale, brightness, captions, high-contrast,
  colourblind sim, vignette, static reference) is distinctive, tactile, and squarely "Humanist Immersive."
- **Typography**: Fraunces display vs Hanken body, balanced headings, comfortable measures — premium and legible.
- **Accessibility posture**: skip link, focus-visible ring tokens, reduced-motion handling, labelled controls,
  honest "conformance only where verified" counsel notes — rare and credible.
