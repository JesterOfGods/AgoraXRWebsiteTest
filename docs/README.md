# AgoraXR — rework: reviews & business-development report

This site was reworked from a single 1,820-line `index.html` into a clean, data-driven
multi-file build with a **"Humanist Immersive"** design system (Scandinavian warmth +
Japanese *Ma* restraint; warm clay/sage palette; Fraunces + Hanken Grotesk). It was then
put through **six independent expert reviews** — three technical, three business-development —
run as parallel agents. This folder holds every full report; below is the executive summary.

## File map

```
index.html            shell (head, JSON-LD, header, footer, script includes)
css/tokens.css        design tokens — WCAG-verified light + dark
css/styles.css        component system + the warm CSS-only Attune demo
js/data.js            all content (CONTENT) + PRODUCT / SERVICES / SECTORS
js/app.js             two-spine nav, hash router (+ redirect aliases), page renders, wiring
robots.txt · sitemap.xml · llms.txt   discoverability assets
docs/reviews/         the nine full expert reports (see below)
_backup/              the original index.html (index.legacy.html)
```

Reports in `docs/reviews/`: `ia-spec.md`, `content-rationale.md`, `tokens-rationale.md`
(build specs) · `review-design.md`, `review-a11y.md`, `review-responsive.md` (technical QA) ·
`bd-cro.md`, `bd-seo.md`, `bd-messaging.md` (business development).

---

## What changed structurally (IA/UX)

- **Split the overloaded `Platform` menu** into **Platform** (product: Agora Command · Attune ·
  Developers & SDK) and **Services** (Content · Consultancy · Workshops · Hardware). Renamed
  Sectors → **Solutions**. New nav: `Solutions · Platform · Services · Trust · About · Book a demo`.
- **Rebuilt the home page around the two-layer story** ("one layer runs XR, the other makes sure
  everyone can use it"), killing three sections that duplicated the pillar grid.
- **Fixed CTA dead-ends** — the contact page is now **topic-aware** (spec-sheet / SDK / docs get a
  light email-capture form; services get a "talk to us" framing; demo gets qualification fields),
  instead of every CTA dumping into one demo form.
- **Backward-compatible routes** — old links (`#/sectors/*`, `#/developers`, `#/page/*`) redirect to
  the new scheme, so nothing breaks.

## What was verified & fixed (technical QA)

All three technical reviews were run against the built site and their findings applied:

- **Accessibility (WCAG 2.2):** fixed an invisible focus ring (cascade bug), `--text-faint` contrast
  fails in **both** themes, Attune demo controls with cryptic names, form errors with no
  `aria` association, SPA route-change announcements, dropdown `role="menu"` misuse, mobile
  focus-trap, and more. Every token pair is now AA-verified (script-checked).
- **Design:** fixed an invisible footer wordmark, a clipped architecture diagram, the hero dead-gap,
  orphaned grid cells, and the demo being repeated on every sector page.
- **Responsive:** fixed a desktop burger that showed + silently scroll-locked the page, a cookie
  toast covering the back-to-top button, sub-minimum tap targets, and mobile hero whitespace.
  **No horizontal overflow at any width.**

---

## Business-development findings (the review you asked for)

Three parallel reviews (CRO + marketing-psychology, SEO + AI-SEO, messaging + competitive +
content-strategy). Verdict across all three: **the craft is strong — copy, IA, and the Attune demo
already beat most XR-vendor sites. The gaps are the conversion layer, discoverability, and the
sharpness of the wedge.** Full detail in `docs/reviews/bd-*.md`.

### 🔴 The single biggest BD blocker — discoverability (SEO/AEO)

The site is a **hash-router, client-rendered SPA**: the server delivers one page with an empty
`<main>`, and all ~26 views live behind `#/` fragments that **search engines and LLMs never see as
distinct URLs**. The copy is citation-grade but structurally invisible. *This caps organic discovery
and AI citations near zero until fixed.*

- **Fix (priority #1):** a small Node build step that **pre-renders one real HTML file per route**
  and switches hash → History API (`/solutions/museums`, not `#/...`), reusing the existing
  `data.js` + `PAGES.*`. Keeps the site 100% static-hostable — just crawlable. Everything else
  depends on this. *(Offered as a follow-up; it's a build task, not a copy edit.)*

**Already shipped now (works without the rebuild):** `robots.txt` (explicitly allows GPTBot,
PerplexityBot, ClaudeBot, Google-Extended, Bingbot…), `llms.txt` (a full entity + route map that
LLMs read directly), `sitemap.xml`, **JSON-LD** (Organization, WebSite, two SoftwareApplication),
and **per-route `<title>` + meta description + OG** set on every render. *(Replace the
`agoraxr.example` placeholder host and add the real 1200×630 `assets/og-image.jpg`.)*

### 🟠 Conversion layer (CRO)

- **Shipped:** topic-aware contact page (real low-commitment spec-sheet/SDK/docs capture vs. the
  high-commitment demo); "Watch the 2-minute demo" now points to the film (Trust), not the booking
  form; demo form gained an optional role/scale qualifier and preserves sector context.
- **Roadmap:** build the actual gated assets (accessibility spec sheet PDF, security one-pager,
  compliance checklist) so the low-commitment ladder has something to deliver; add founder/origin
  authority and a "how deployment works" methodology to About (the trust levers that need no
  customers yet); route enterprise/healthcare leads with heavier qualification.

### 🟠 Messaging & positioning

- **Shipped:** fixed the false ROI stat (a `9 · 60+` feature count sat under a "people per hour"
  ROI headline → now an honest operator-leverage line); retired public "spines" jargon.
- **Roadmap:** **lead with the wedge** — promote Attune's "device makers solve accessibility one
  app at a time; we do it per-user, across shared headsets, at scale" from a Trust-page aside to a
  top-three homepage moment. Frame accessibility as **compliance-risk reduction** (loss aversion)
  for public buyers. Add a named **"pilot in one room"** on-ramp with a price band and timeline to
  de-risk the new-category purchase.

### 🟢 Content & competitive layer (net-new pipeline)

- **7 comparison/alternative pages** (SEO capture + sales battle cards): `/compare/xr-fleet-management-tools`,
  vs ArborXR, vs ManageXR, "Meta Quest for Business alternative", DIY-vs-managed, etc.
- **3 content clusters no incumbent owns:** Accessible XR (XAUR / EN 301 549 / EAA), XR ROI/throughput,
  EU XR compliance — plus sector playbooks.
- **First assets to build:** an **XR throughput/ROI calculator** (the #1 lead magnet), the
  accessibility spec sheet, and a procurement checklist.

---

## Honest-content guardrails (kept intact)

The site uses **placeholders, never fabrications** for logos, case studies, and stats. The
healthcare legal note and the two "pending EU counsel review" conformance notes are reproduced
**verbatim** and still need counsel sign-off before publication. The homepage "In deployment
across…" line should be verified true before launch (flagged by CRO).

## ✅ Applied in the second pass (the BD roadmap, built)

The roadmap items above were then implemented and verified:

1. **Pre-render + History-API routing — DONE.** Hash routing is gone; every page is a real,
   crawlable URL (`/platform/attune`, `/solutions/museums`, …). `build.js` runs the site's own
   `data.js` + `app.js` in a Node sandbox (no DOM) and writes **29 fully-populated static HTML
   files** into `dist/` — content, nav, footer, per-route `<title>`, meta description, canonical,
   and OG all present *before any JavaScript runs*. The browser still hydrates for instant SPA nav.
   Old `#/…`, `/sectors/…`, and `/developers` links redirect automatically. `dist/sitemap.xml`
   now lists all 29 URLs; `dist/404.html` is the SPA fallback for host rewrites.
2. **ROI / throughput calculator — DONE** (`/calculator`). A transparent, honest lead magnet:
   10 inputs, 4 live stat tiles (people/hour, people/year, € value/year, operators), every
   assumption user-editable and labelled "your assumption", full "how this is calculated"
   disclosure, and a single CTA. No fabricated benchmarks. Linked from the homepage throughput
   section and the footer.
3. **Homepage wedge + "pilot in one room" on-ramp — DONE.** A "why Attune is different" moment
   now sits between the two-layer section and the Attune showpiece; a low-risk pilot section (scope,
   timeline, placeholder price band) gives not-ready buyers an entry point.
4. **Comparison page + pillar guide — DONE.** `/compare/managed-vs-diy` (build-vs-buy, category-level,
   no competitor named) and `/guides/accessible-xr` (XAUR / EN 301 549 / WCAG / EAA explainer with a
   `FAQPage` JSON-LD block for answer engines). Both linked from the footer.

## Build & run

```
# dev: serve the project root (SPA hydrates; needs a static server, not file://)
python3 -m http.server 8000            # → http://localhost:8000

# production: prerender to dist/, then serve or deploy dist/
node build.js                          # writes dist/ (29 pages + sitemap + 404)
python3 -m http.server 8000 -d dist
```

Deploy `dist/` to any static host. Configure the host to serve `dist/404.html` for unknown paths
so the legacy-link redirects resolve. Before launch: replace the `www.agoraxr.example` host in
`index.html`, `build.js`, `robots.txt`, and `js/app.js`; add a real 1200×630 `assets/og-image.jpg`;
get counsel sign-off on the marked healthcare/conformance wording; and verify the "In deployment
across…" line is true. The `€___` pilot price band is a deliberate placeholder.

## Still open (need your real data / decisions)

- Real gated assets to deliver behind the capture forms (spec-sheet PDF, security one-pager).
- Founder/origin authority + "how deployment works" methodology on About.
- More comparison pages (vs named competitors) and the rest of the content clusters.
