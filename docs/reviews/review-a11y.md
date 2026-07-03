# AgoraXR — WCAG 2.2 AA Accessibility Audit

Static multi-file SPA (hash router). Files audited: `index.html`, `css/tokens.css`, `css/styles.css`, `js/app.js`, `js/data.js`. Contrast ratios below were computed from the actual token hex values (WCAG relative-luminance formula); see the contrast table.

**Overall:** The build is genuinely strong on fundamentals — `lang`, skip link, per-route `<title>`, single `<h1>` per route, decorative SVGs all `aria-hidden`, icon-only buttons all have `aria-label`, reduced-motion coverage, native `<details>` mobile disclosure, proper `for`/`id` labels on the contact form. But several **AA failures** remain, and because the product's brand *is* accessibility, the marginal/ironic ones matter too. The `tokens.css` blanket claim *"All text/background pairs verified WCAG 2.2 AA"* is **not accurate** — `--text-faint` fails in both themes (see P1-4).

**Counts:** P1 (AA fail) = **5** · P2 (important) = **7** · P3 (enhancement) = **7**

---

## P1 — Fails WCAG 2.2 AA (must fix)

### P1-1 · Focus ring is invisible on primary/secondary buttons & "back to top" (2.4.7 Focus Visible)
The keyboard focus style is defined as a **box-shadow** at zero-ish specificity:
`css/tokens.css:388` — `:where(a, button, input, select, textarea, [tabindex]):focus-visible { box-shadow: var(--shadow-focus); }`. `:where()` contributes 0 specificity, so the selector is only `(0,1,0)`. Component rules that set their **own** `box-shadow` at equal `(0,1,0)` specificity and **later source order** win the cascade and overwrite the ring:
- `css/styles.css:88` `.btn--primary { box-shadow: var(--shadow-sm); }`
- `css/styles.css:90` `.btn--secondary { box-shadow: var(--shadow-sm); }`
- `css/styles.css:427` `.totop { box-shadow: var(--shadow-md); }`

Result: tabbing to **"Book a demo"**, every `.btn--primary`/`.btn--secondary` CTA, all form submit buttons, and the to-top FAB shows only the resting shadow — no perceivable focus change. Ghost buttons/links (no own box-shadow) *do* get the ring, so focus visibility is inconsistent. On an accessibility-brand site this is the highest-impact fail.
**Fix:** Don't rely on box-shadow at `:where()` specificity for the ring. Either add an explicit high-specificity rule (`.btn:focus-visible, .totop:focus-visible { box-shadow: var(--shadow-focus); }`) that also re-applies the component shadow, or switch the focus indicator to `outline: 2px solid var(--focus-ring); outline-offset: 2px;` (outline never conflicts with box-shadow) and keep `outline-offset` clear of the sticky header.

### P1-2 · Form errors are not programmatically associated or announced (3.3.1 / 1.3.1 / 4.1.3)
Contact form markup (`js/app.js:532-538`) renders `<span class="err">…</span>` as a bare sibling with **no `id`**; the input has **no `aria-invalid`** and **no `aria-describedby`**. On submit, `initForms` (`js/app.js:696-715`) only toggles the CSS class `.field.invalid` (which reveals the text via `css/styles.css:383-385`) and calls `firstBad.focus()`. A screen-reader user is thrown to the field with **no announcement of what is wrong** and no described-by text.
**Fix:** Give each `.err` a unique `id`; on validation set `input.setAttribute('aria-invalid','true')` and `input.setAttribute('aria-describedby', errId)`; add `role="alert"` (or an `aria-live` container) to the error so it is spoken; remove `aria-invalid`/clear on successful re-validation. Matches the skill's `references/A11Y-PATTERNS.md#error-handling`.

### P1-3 · Newsletter email error is colour-only and silent (1.4.1 Use of Color / 3.3.1)
The lone footer/contact newsletter email (`index.html:71`, `js/app.js:549`) is validated in `js/app.js:706-707`: on failure it sets **only** `lone.style.borderColor = 'var(--error)'` — no error text, no `aria-invalid`, no announcement. Error is conveyed by colour alone, and nothing at all is exposed to AT.
**Fix:** Wrap the newsletter input in the same `.field` pattern with a real (visually-hidden-ok) error message, set `aria-invalid` + `aria-describedby`, and announce via `role="alert"`.

### P1-4 · `--text-faint` fails minimum contrast in BOTH themes (1.4.3 Contrast Minimum)
`--text-faint` is consumed at `--fs-xs` (13–14px, normal weight → **not** "large text", so the 4.5:1 threshold applies) for informative meta-labels: crosslink kickers (`.xlink .xk`), dropdown headers (`.dd-head`), step/group labels (`.m-group`, `.cat-label`), `.p-name`, `.spine .name`, `.counsel-note`, `.ad-stagelabel`, `.ad-controls .hint`.
- Light `--text-faint` `#93806A` on `--bg` `#FCF9F4` = **3.61:1** (fail); on `--surface-2` `#F1E9DE` = **3.15:1** (fail); on `--surface` = 3.55:1 (fail).
- Dark `--text-faint` `#93806A` on `--bg` `#211D1A` = **4.41:1** (fail); on `--surface-2` `#332C27` = **3.62:1** (fail).

The token comment "meta/labels — large or non-essential" does not hold: these labels carry meaning at small size. This also **falsifies the tokens.css header claim** that all pairs are AA-verified.
**Fix:** Darken light `--text-faint` toward `--clay-600` (`#6E6157`, ≈5.7:1) and lighten dark `--text-faint` toward `--clay-400` (`#B8A48C`, ≈6.95:1) — or restrict `--text-faint` strictly to ≥18px/decorative use and stop using it for `fs-xs` labels.

### P1-5 · Attune demo controls: cryptic/mismatched accessible names (4.1.2 Name,Role,Value / 2.5.3 Label in Name / 3.3.2)
In `js/app.js`, the visible `<label>` produced by `adCtl` (`:38`) is **not associated** with its control (no `for`, not wrapping). The only accessible name comes from `aria-label`, and for the toggle switches (`adToggle`, `:39-42`) that name is the raw fx code:
- "Subtitles & captions" switch → name **"cap"**
- "High-contrast UI" switch → name **"hc"**
- "Comfort vignette" switch → name **"vig"**
- "Static reference point" switch → name **"ref"**

Also (`attuneControls`, `:45-46`) the range labelled "Larger text & UI" has `aria-label="UI scale"` — the **visible text is not contained in the accessible name**, a direct 2.5.3 failure. On the flagship interactive demo, a SR user hears "cap, checkbox, checked" etc.
**Fix:** Give every control an `id` and associate the visible `<label for>` (drop the redundant `aria-label`s), or set each `aria-label` to the full human label (and ensure the visible label string is contained in the name for 2.5.3). Consider `role="switch"` + `aria-checked` for the toggles.

---

## P2 — Important (fix before launch)

### P2-1 · SPA route changes are not announced (4.1.3 Status Messages)
`render()` (`js/app.js:629-635`) swaps `#app.innerHTML`, updates `document.title`, and calls `app.focus({preventScroll:true})`. Moving focus to an unlabeled `<main>` container is not a reliable navigation announcement; title changes are inconsistently spoken by SR on hash routes.
**Fix:** Add a visually-hidden `aria-live="polite"` region and, on each route render, write the new page name into it (e.g. "Attune — page loaded"). Optionally `aria-label` the target region.

### P2-2 · Heading order skips levels (2.4.6 Headings and Labels / 1.3.1)
Verified in the dumped DOM. On `#/platform/attune` the order is `h1` → **`h4` "Try Attune"** (from `attuneControls`, `js/app.js:44`) → `h2` "How Attune works" — i.e. an `h4` appears **before the first `h2`** (h1→h4 skip). The Attune-demo `h4` also nests under section `h2`s elsewhere with no `h3` (h2→h4 skips on home §5, sector page). Footer column titles are `h5` (see P3).
**Fix:** Make the demo's "Try Attune" a non-heading (styled `<p>`/`<div>`) or the correct next level for its context; keep a strict h1→h2→h3 progression per route.

### P2-3 · Attune scene setting-changes are imperceptible to AT (4.1.3 / 1.1.1)
`attuneScene` (`js/app.js:28`) is `role="img"` with a **static** `aria-label`. `applyFx` (`js/app.js:681-687`) toggles classes / CSS vars so captions appear, contrast rises, UI scales, colour-blind filters apply — all **purely visual**. A SR/AT user toggling "Subtitles & captions" gets zero feedback, which is especially ironic for an accessibility demo.
**Fix:** Add an `aria-live="polite"` status paragraph near the demo that reports the active state ("Captions on. High-contrast UI on. UI scale 130%."), or update the scene `aria-label` on each change.

### P2-4 · Desktop dropdowns misuse `role="menu"` (4.1.2 Name,Role,Value)
`buildNav` (`js/app.js:126-128`) marks each dropdown `role="menu"` with a trigger `aria-haspopup="true"`, but the children are ordinary `<a class="dd-link">` navigation links (not `role="menuitem"`), and there is **no menu keyboard model** (no Arrow/Home/End, no roving tabindex) — `initMenus` (`:654-664`) only wires hover, click-toggle, `focusout`, and Escape. Declaring a menu that behaves like a link list is an ARIA contract violation (SRs may enter application mode expecting menuitems). Tab/Enter/Escape *do* work, so it is keyboard-operable — the defect is the role semantics, not operability.
**Fix:** Simplest correct pattern — remove `role="menu"`/`aria-haspopup="true"` and treat it as a **disclosure**: keep the `aria-expanded` button controlling a plain `<ul>` of links (add `aria-controls`). Only keep `role="menu"` if you implement the full APG menu keyboard model with `menuitem` children.

### P2-5 · Mobile overlay has no focus management / trap (2.4.3 Focus Order / 2.1.2)
`initMobile` (`js/app.js:671-678`) opens the fixed full-screen overlay and locks body scroll, but **does not move focus into it, does not trap Tab, and does not restore focus to the burger on close**; the page content behind the overlay remains in the tab order (no `inert`/`aria-modal`). The container is a `<div aria-label="Mobile navigation">`, not a dialog. Escape does close it (`:662`).
**Fix:** On open, move focus to the first item and trap Tab within the overlay (or set the rest of the page `inert`); on close, return focus to `#burger`. Consider `role="dialog" aria-modal="true"`. See `references/A11Y-PATTERNS.md#modal-focus-trap`.

### P2-6 · Form success confirmations are not announced (4.1.3 Status Messages)
`.form-success` elements (`js/app.js:541,551`; `index.html:74`) are shown by toggling `.show` (`css/styles.css:387-389`) with no `role="status"`/`aria-live`. Successful submits are silent to SR users. (Also note: two forms share `data-success="newsletter"`; `initForms` `:710` uses `document.querySelector` and toggles only the **first** match — the footer one — so the contact-page newsletter never shows its adjacent confirmation.)
**Fix:** Add `role="status"` (or `aria-live="polite"`) to `.form-success`, and scope the success lookup to the submitted form (e.g. `form.parentNode.querySelector`) so the right message shows.

### P2-7 · Eyebrow / primary text on `--surface-2` is a marginal contrast fail (1.4.3)
`.eyebrow` (`css/styles.css:61-63`) uses `--primary` at `--fs-xs` and appears on every `.band--surface` section (`--surface-2` background). Light `--primary` `#B14A2C` on `#F1E9DE` = **4.49:1** — below 4.5 (fails at normal size). `--text-muted` on `--surface-2` = 4.97:1 (passes but thin).
**Fix:** Nudge light `--primary` one step (e.g. `--terracotta-600` `#964026`, ≈6.4:1 on surface-2) for small-text/eyebrow use, or lighten `--surface-2` slightly.

---

## P3 — Enhancements / polish

- **P3-1 · Attune HUD white-on-sky (1.4.3, decorative).** `.ad-ui`/`.ad-reticle` render `#fff` text directly over the sky gradient (`css/styles.css:468-493`): white on `#F2C483` = **1.62:1**, over the sun `#FFE6B0` = **1.22:1**, on mid `#E0895A` = 2.66:1. It's inside `role="img"` (not AT-exposed) and simulates an in-headset HUD, but visually it is unreadable text — a poor look on an a11y-brand demo, and the demo even offers a "High-contrast UI" toggle. Consider always giving HUD rows the dark backing chip (the `.k` chip already reaches 6.4:1).
- **P3-2 · Footer column headings are `h5` (2.4.6).** `index.html:80,82` and `js/app.js:160-162` emit `<h5>` for "Company/Legal/Solutions/Platform/Services", skipping h2–h4 from the page h1. Use `h2`/`h3`.
- **P3-3 · Burger label doesn't reflect state (4.1.2).** `#burger` stays `aria-label="Open menu"` when expanded (`index.html:50`). `aria-expanded` toggles, but update the label to "Close menu" when open for clarity.
- **P3-4 · Cookie notice role (4.1.2).** `index.html:93` is `role="dialog"` + `aria-live="polite"` but is a non-modal auto-appearing banner with no focus management. `role="region"` with an `aria-label`, or a status/live region, is more honest.
- **P3-5 · Active page not programmatically indicated (2.4.8 / best practice).** `setActiveNav` (`js/app.js:638-642`) adds a `.active` class only for Trust/About and never sets `aria-current="page"`. Add `aria-current="page"` to the active nav/footer link.
- **P3-6 · Light form-input placeholder colour unspecified.** `.field input` (`css/styles.css:379`) leaves placeholder to the UA default (often ~2.7–3:1). Labels exist so it isn't a name failure, but set an explicit placeholder colour ≥4.5:1 for consistency. (Footer newsletter placeholder `--clay-400` on `--clay-800` = 5.70:1, fine.)
- **P3-7 · Infinite decorative animation (2.2.2).** The "live preview" pulse dot (`@keyframes adpulse`, `css/styles.css:461-462`) loops indefinitely. Low risk (tiny, and the colonnade drift is off by default via the `.ref` class), and reduced-motion neutralises it — but it has no non-preference pause control.

---

## Contrast table (computed from token hex values)

Threshold: normal text 4.5:1, large/UI 3:1. **Bold = fail.**

| Pair (fg on bg) | Hex | Ratio | Need | Token claim |
|---|---|---|---|---|
| **LIGHT** | | | | |
| ink on bg | `#332C27`/`#FCF9F4` | 13.07 | 4.5 | 14.1 (~ok) |
| text-muted on bg | `#6E6157`/`#FCF9F4` | 5.70 | 4.5 | 5.5 ✓ |
| text-muted on surface-2 | `#6E6157`/`#F1E9DE` | 4.97 | 4.5 | — |
| **text-faint on bg** | `#93806A`/`#FCF9F4` | **3.61** | 4.5 | — (P1-4) |
| **text-faint on surface-2** | `#93806A`/`#F1E9DE` | **3.15** | 4.5 | — (P1-4) |
| primary as text/link on bg | `#B14A2C`/`#FCF9F4` | 5.15 | 4.5 | 5.0 ✓ |
| **primary/eyebrow on surface-2** | `#B14A2C`/`#F1E9DE` | **4.49** | 4.5 | — (P2-7) |
| white on primary (button) | `#FFFFFF`/`#B14A2C` | 5.40 | 4.5 | 5.4 ✓ |
| secondary as text on bg | `#3F5F54`/`#FCF9F4` | 6.72 | 4.5 | 6.5 ✓ |
| white on secondary (button) | `#FFFFFF`/`#3F5F54` | 7.06 | 4.5 | 7.1 ✓ |
| tag (text-muted) on surface | `#6E6157`/`#FFFDFA` | 5.89 | 4.5 | — |
| line-strong on bg (UI border) | `#93806A`/`#FCF9F4` | 3.61 | 3.0 | 3.5 ✓ |
| toggle track ON (secondary) on surface-2 | `#3F5F54`/`#F1E9DE` | 5.86 | 3.0 | — |
| **FOOTER (clay ramp)** | | | | |
| f-tag clay-300 on clay-900 | `#D8C7B0`/`#211D1A` | 10.13 | 4.5 | — ✓ |
| h5 clay-400 on clay-900 | `#B8A48C`/`#211D1A` | 6.95 | 4.5 | — ✓ |
| grid link clay-200 on clay-900 | `#E6DBCD`/`#211D1A` | 12.25 | 4.5 | — ✓ |
| foot-links clay-300 on clay-900 | `#D8C7B0`/`#211D1A` | 10.13 | 4.5 | — ✓ |
| newsletter placeholder clay-400 on clay-800 | `#B8A48C`/`#332C27` | 5.70 | 4.5 | — ✓ |
| grid link clay-200 on clay-950 (dark footer) | `#E6DBCD`/`#171310` | 13.52 | 4.5 | — ✓ |
| **DARK** | | | | |
| ink clay-100 on bg | `#F5EEE4`/`#211D1A` | 14.52 | 4.5 | 14.1 ✓ |
| text-muted clay-400 on bg | `#B8A48C`/`#211D1A` | 6.95 | 4.5 | 7.2 (~ok) |
| **text-faint clay-500 on bg** | `#93806A`/`#211D1A` | **4.41** | 4.5 | — (P1-4) |
| **text-faint clay-500 on surface-2** | `#93806A`/`#332C27` | **3.62** | 4.5 | — (P1-4) |
| primary terracotta-300 on bg | `#E39068`/`#211D1A` | 6.74 | 4.5 | 6.8 ✓ |
| dark-ink on primary (button) | `#241511`/`#E39068` | 7.10 | 4.5 | 7.1 ✓ |
| secondary sage-300 on bg | `#8FB6A2`/`#211D1A` | 7.47 | 4.5 | 7.6 (~ok) |
| dark-ink on secondary (button) | `#241511`/`#8FB6A2` | 7.88 | 4.5 | 7.9 ✓ |
| eyebrow primary on surface-2 | `#E39068`/`#332C27` | 5.53 | 4.5 | — ✓ |
| line-strong on bg (UI) | `#857567`/`#211D1A` | 3.77 | 3.0 | 3.8 ✓ |
| caption .spk sage-300 on caption bg | `#8FB6A2`/`~#140E0A` | 8.55 | 4.5 | — ✓ |
| **ATTUNE HUD (inside role=img sim)** | | | | |
| **HUD white on sky lightest** | `#FFFFFF`/`#F2C483` | **1.62** | 4.5 | — (P3-1) |
| **HUD white over sun** | `#FFFFFF`/`#FFE6B0` | **1.22** | 4.5 | — (P3-1) |
| HUD key chip white on rgba(0,0,0,.4)+sky | `#FFFFFF`/`~#865236` | 6.41 | 4.5 | ✓ |
| caption bar white on rgba(20,14,10,.82) | `#FFFFFF`/`~#392418` | 14.59 | 4.5 | ✓ |

Notes on the tokens.css claims: the stated ratios are close and mostly conservative (real values sit within ±0.3 of claims), **except** the header's blanket "all pairs AA-verified" — untrue because `--text-faint` fails at its actual small-text usage, and eyebrow-on-surface-2 lands at 4.49.
