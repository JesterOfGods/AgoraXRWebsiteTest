# AgoraXR — Responsive QA Findings

**Method:** Rendered every route via headless Chrome (148) driven over CDP with true
device-metrics emulation (Chrome's `--screenshot` enforces a 500px floor, so
`Emulation.setDeviceMetricsOverride` was used for genuine 360/375). For each
route × width I measured the widest element's right edge, real horizontal
scroll (`window.scrollTo(9999,0)` → `scrollX`), computed `display`/box sizes of
interactive targets, and grid track counts. Screenshots captured for visual
checks (hero whitespace, Attune demo, cookie/totop, arch diagram, 768 header).

Widths: 360, 375, 768, 1024, 1280. Routes: home, /solutions/museums,
/platform/attune, /platform, /services, /contact, /trust.

## Headline pass results (checks that are CLEAN)
- **No horizontal overflow anywhere.** At all 5 widths × 7 routes, real
  horizontal scroll = 0 and no element exceeds the viewport. The arch SVG
  (viewBox 920) scales via `.arch{width:100%;height:auto}`; the `.code-block`
  has `overflow-x:auto`; the Attune demo, wide grids, and long strings all fit.
  The only element geometrically past the edge is the decorative `.hero-aura`,
  which sits inside `.hero{overflow:clip}`, `z-index:-1`, `pointer-events:none`
  — clipped and harmless.
- **Attune demo is fully usable at 375** — scene stacks above controls (single
  column < 860px), 16/11 aspect preserved (314×216), every range/select/toggle
  reachable, no clipping.
- **768–999 header is fine** — desktop nav is intentionally hidden < 1000, so the
  header shows brand + theme toggle + burger with generous space; not cramped.
- **:target scroll-margin (6rem/96px) > sticky header (4.5rem/72px)** — anchored
  targets clear the header. (Hash router rarely uses `:target` anyway.)
- **Body copy ≥ 16px**: `--fs-base` min = 1rem. Lede/sub/prose measures 44–66ch.

---

## P1 — Broken layout / functional break

### P1-1 · Burger button is visible on ALL desktop widths and silently scroll-locks the page
- **Widths:** 1000, 1024, 1280, 1536 (every width ≥ 1000). **Routes:** all.
- **File/selector:** `css/styles.css` — `.burger`.
- **What happens:** The intended hide rule
  `@media (min-width:1000px){ .burger{ display:none } }` is at **line 132**, but
  the base rule `.burger{ … display:inline-grid }` at **line 170** comes *later*
  in the source with equal specificity, so it wins the cascade. Measured
  computed `display:grid`, box 44×44, visible at 1000/1024/1280/1536 — the
  hamburger sits right next to the full desktop nav (confirmed in
  `qa-1024-platform-arch.png`).
- **Why it's P1, not cosmetic:** The desktop `.mobile-nav` is
  `display:none !important` (line 180), but `initMobile` still runs on click and
  sets `document.body.style.overflow='hidden'` (app.js line 675). So a user who
  clicks the stray desktop burger **locks page scrolling with no visible menu**
  and no obvious way to recover (aria-expanded flips true, overlay stays hidden).
- **Fix:** Make the hide win the cascade — either move the base `.burger` block
  (lines 170–172) **above** the `@media (min-width:1000px)` block, or add a
  later rule after line 172:
  `@media (min-width:1000px){ .burger{ display:none } }`
  (or `display:none` → keep, and mark the desktop hide `!important`).

---

## P2 — Poor UX

### P2-1 · Cookie toast covers the back-to-top button on phones
- **Widths:** ≤ ~460px (360, 375 tested). **Routes:** all (once scrolled > 600px
  with the cookie still showing).
- **File/selector:** `css/styles.css` `.cookie` (line 417) vs `.totop` (line 425).
- **What happens:** On mobile `.cookie` becomes a full-width bottom sheet
  (`left/right: space-4`), `z-index: --z-toast (600)`. `.totop` is anchored
  bottom-right (`right/bottom: space-5`), `z-index: --z-sticky (100)`, 46×46. Their
  footprints overlap in the bottom-right corner, and the toast (higher z) renders
  **over** the totop — it's invisible/unclickable while the cookie is up
  (`qa-375-cookie-totop.png`: totop absent behind the sheet).
- **Fix:** Hide/relocate totop while the toast is open —
  `.cookie[data-show="true"] ~ .totop{ display:none }` (needs totop to be a
  sibling after cookie in DOM — it already is), or lift totop above the toast
  (`z-index: var(--z-toast)+1` and `bottom: calc(var(--space-5) + <toast height>)`),
  or stop the toast spanning full width on small screens.

### P2-2 · Excessive hero bottom whitespace on mobile
- **Widths:** 360–767. **Routes:** home (and every page using `.hero` /
  `band--flush-top`).
- **File/selector:** `.hero{ padding-block: var(--space-8) var(--section-gap) }`
  (styles.css line 204); `--section-gap` = 6rem (96px) on mobile.
- **What happens:** Hero bottom pad (96px) + the following `band--tight` top pad
  (48px) leaves ~140px of empty space between the hero media and the next
  section on a 375 phone (`qa-375-home-hero-gap.png`). The Ma spacing that reads
  as elegant on desktop feels like dead space stacked single-column on mobile.
- **Fix:** Trim hero vertical rhythm below ~680px, e.g.
  `@media (max-width:680px){ .hero{ padding-block: var(--space-7) var(--space-6) } .hero-grid{ gap: var(--space-6) } }`.

### P2-3 · Footer bottom-bar links are 21px tall (sub-minimum tap targets)
- **Widths:** all; most acute on touch/mobile. **Routes:** all (footer).
- **File/selector:** `.foot-links a` (styles.css line 411) — measured 134×**21px**.
- **What happens:** "Accessibility statement" / "Report an accessibility barrier"
  have no vertical padding; 21px height is below WCAG 2.2 2.5.8 (24px) and far
  under the 44px comfort target — hard to hit, ironic for the a11y links.
- **Fix:** `.foot-links a{ padding:.5rem 0; display:inline-block }` (and the
  `.footer-grid a` column links, which are ~30px, could get similar).

---

## P3 — Polish

### P3-1 · Theme toggle is 40×40 (under 44px)
- **Widths:** all. **Route:** all (header). `.theme-toggle` (styles.css line 120)
  is 40×40 — meets WCAG 24px but under the 44px comfort target for a persistent
  mobile control. **Fix:** `width/height: 44px` (matches the burger).

### P3-2 · Orphan tile in the sectors grid (7 items)
- **Widths:** 680+ . **Routes:** home §7 "Solutions grid", /solutions.
- `.g3` with 7 sectors → 2-up (680–939) ends in a lone tile; 3-up (≥940) ends
  3+3+**1**. **Fix:** add an 8th tile, center the trailing row, or give the last
  card a `grid-column` span / "see all" CTA card.

### P3-3 · Attune control hit-areas are thin on touch
- **Widths:** < 860 (stacked). **Routes:** attune, sectors, home.
- Measured: range track **16px** tall, `select` 32px, `.toggle` 24px. Usable but
  fiddly with a finger. **Fix:** on coarse pointers increase heights, e.g.
  `@media (pointer:coarse){ .ad-ctl input[type=range]{height:28px} .ad-ctl select{padding:.5rem} }`.

### P3-4 · Footer 2-col (640–979) leaves an orphan 5th column
- **Widths:** 640–979. **Route:** all. The 5-item `.footer-grid` collapses
  1→2→5; at 2-up the "Company/Legal" column sits alone on row 3. Cosmetic.
  **Fix:** consider a 3-col intermediate breakpoint, or reorder so the brand+
  newsletter block spans 2. (At ≥980 the four 137px link columns are tight but OK.)

### P3-5 · Secondary text at 15px / 13px on mobile
- Card bodies & tile/badge/category descriptions use `--fs-sm` (min 15px) and
  `--fs-xs` (min 13px). Fine for meta/secondary, but note several *descriptive*
  card bodies (`.card p`, `.tile p`) sit at 15px on phones — just under the 16px
  "comfortable body" bar. **Fix (optional):** bump `.card p`/`.tile p` to
  `--fs-base` on mobile if they read as primary content.

---

## Counts
- **P1: 1** (desktop burger visible + silent scroll-lock)
- **P2: 3** (cookie covers totop; hero mobile whitespace; 21px footer links)
- **P3: 5** (40px theme toggle; sectors orphan; thin Attune controls; footer
  orphan column; 15/13px secondary text)
- **Total: 9.** No horizontal-overflow defects found at any width/route.
