# AgoraXR — BD / Technical + AI-SEO Audit

**Scope:** Discoverability for business development — organic search *and* AI answer engines (ChatGPT, Perplexity, Google AI Overviews, Claude, Gemini).
**Method:** Read `index.html`, `js/app.js`, `js/data.js`; rendered the page with headless Chrome and compared against the raw server-delivered HTML; checked site root for hygiene files.
**Date:** 2026-07-02

---

## Verdict in one line

The content is genuinely strong (deep, sector-specific, entity-clear, accessibility-standards material that AI engines love to cite) — but **it is invisible to the machines that would surface it.** The site is a client-side-rendered SPA on a hash router: it ships one URL with an empty `<main>`, and every "page" (20+ of them) lives behind a `#/...` fragment that search engines and LLMs never see as a distinct address. Right now the ceiling on organic discovery and AI citation is close to zero, regardless of copy quality.

**This is a rendering/architecture problem, not a content problem.** The fixes below are ordered so the highest-leverage, discovery-unblocking work comes first.

---

## Evidence: what a crawler/LLM actually sees

**Raw server-delivered HTML** (`index.html`, what a bot gets before running any JS):

```html
<main id="app" tabindex="-1"></main>
```

Empty. Every headline, every sector page, the entire Attune standards content — none of it is in the served document. It exists only after `js/app.js` executes `app.innerHTML = html` (app.js:629).

**Rendered DOM** (headless Chrome, JS executed): `#app` fills with an `<h1>`, sections, copy. So the content *renders* — but only for a client that runs JS, waits for it, and follows a `#/` fragment.

**Two independent failure modes stack here:**

1. **CSR (client-side rendering):** the HTML is blank until JS runs. Googlebot *can* render JS (second-wave, deferred, best-effort), but ChatGPT/Perplexity/Claude crawlers and many others largely **do not** — they read the raw HTML and see nothing. Bing is unreliable at JS rendering. So even the *one* page you have is thin-to-empty for most non-Google engines.
2. **Hash routing (`#/...`):** this is the harder blocker. **URL fragments are never sent to the server and are not indexed as separate URLs.** `#/solutions/museums`, `#/platform/attune`, `#/solutions/healthcare` all collapse to the single URL `/`. Google deprecated the old `#!` AJAX-crawling scheme in 2015 and does not index hash routes as distinct pages. So there is functionally **one indexable page** for the entire site — and its indexable content is empty.

**Net effect for BD:** ~20 pages of high-intent, sector-targeted content (museums, education, training, enterprise, healthcare, events, travel, Attune, Agora Command, SDK, 4 services, trust, about) are compressed into one blank-on-arrival URL. There is nothing for Google to rank per-sector, and nothing for an LLM to retrieve or cite when a buyer asks "accessible XR platform for museums."

**Full route inventory currently trapped behind `#/`:**
`#/` · `#/solutions` · `#/solutions/{museums,education,training,enterprise,healthcare,events,travel}` · `#/platform` · `#/platform/{agora-command,attune,sdk}` · `#/services` · `#/services/{content,consultancy,workshops,hardware}` · `#/trust` · `#/about` · `#/contact` · `#/legal/{privacy,terms,cookies,gdpr,careers}` — **~26 addressable views, 1 indexable URL.**

---

# CRITICAL — blocks all discovery. Fix before anything else.

## C1. Hash-router CSR SPA → one thin, unindexable page

- **Issue:** No server-rendered content and no real per-route URLs. The whole site is one blank URL behind JS + hash fragments.
- **Evidence:** `index.html` ships `<main id="app"></main>` empty; `app.js` injects content client-side (line 629); router keys off `location.hash` (`parseHash`, app.js:574) so routes are `#/...` fragments the server never receives.
- **BD impact:** No organic entry points for any sector or product query. AI engines that don't execute JS see an empty page and cannot cite you. Buyers researching "run VR at scale for museums" or "EU-compliant XR platform" will find and cite competitors instead. This single issue caps everything else in this report.
- **Fix — pick one path. All keep the site static-hostable, which was the design goal:**

  **Option A (recommended): Static pre-render / static site generation — one real HTML file per route.**
  Generate a physical `.html` for each route at build time, each with the route's content already in the `<main>`, its own `<title>`, meta description, canonical, OG tags, and JSON-LD. Switch the router from hash to History API (`/solutions/museums` instead of `#/solutions/museums`). The existing `js/data.js` content deck and the `PAGES.*` render functions are *already* the perfect source — a small Node build script can call the same render functions per route and write the output to disk. You keep the SPA feel (hydrate/attach JS after load for the Attune demo, nav, forms) but every URL is a real, crawlable, fully-populated document.
  *Tradeoff:* adds a build step (Node script) and static-host rewrite rules (or just emit real files + a 404 fallback). Minimal — you already have the content in a data module and pure render functions. **This is the lowest-friction path given how the code is structured.**

  **Option B: Prerendering service** (Prerender.io, or a headless-Chrome prerender on a cron) that serves rendered HTML to bots.
  *Tradeoff:* bolt-on, no code refactor, but adds a dependency/cost, is a known fragile pattern, and Google discourages "dynamic rendering" as a long-term solution. Fastest to stand up, weakest long-term.

  **Option C: Adopt a meta-framework** (Astro, Eleventy, SvelteKit, Next static export) that does SSG natively.
  *Tradeoff:* biggest rewrite; overkill for a site this size when Option A reuses your existing render code.

  **Minimum viable, if all else is deferred:** at least switch **hash → History API + real files for the top ~10 pages** (home, 7 sectors, Attune, platform). Even without full hydration, real URLs with server-present content unlock indexing and citation.

- **Why this is non-negotiable for BD:** every other recommendation (schema, llms.txt, meta descriptions, internal linking) only pays off once there are real, content-bearing URLs for engines to crawl, rank, and cite. Do C1 first.

## C2. No per-route indexable metadata (title/description/canonical/OG)

- **Issue:** Per-route `<title>` *is* set — but only by JS after render (`document.title = title`, app.js:630; `TITLES` map app.js:604). Description, canonical, and OG tags exist **once, globally** in `index.html` and never change per route. A non-JS crawler sees only the home title/description for all 26 views; there are no canonical tags at all and no per-page OG.
- **Evidence:** `index.html` has a single `<meta name="description">` (line 7) and single OG block (lines 22–25); no `<link rel="canonical">` anywhere; `app.js` updates only `document.title`, not description/canonical/OG.
- **BD impact:** Even if a page gets rendered, every result would share the homepage snippet. No canonical means duplicate-content risk if real URLs are later added with tracking params. Poor/absent OG per page = weak link unfurls when sales shares a sector page in email/LinkedIn/Slack.
- **Fix:** As part of C1's per-route rendering, emit per-page `<title>` (50–60 chars), unique `<meta name="description">` (150–160 chars, pulled from each sector's `sub`/`hook` in data.js — the copy already exists), self-referencing `<link rel="canonical">`, and per-page OG title/description/image. The data is all in `data.js` already; it just needs to land in the `<head>` at build time, not in `document.title` at runtime.

---

# HIGH — do right after Critical; large discovery/citation upside.

## H1. No sitemap.xml, no robots.txt

- **Issue:** Neither file exists in the site root (confirmed: root contains only `index.html`, `index.legacy.html`, `css/`, `js/`, empty `assets/`, plus dev artifacts).
- **BD impact:** No sitemap = no explicit list of URLs for Google/Bing to discover and prioritise (especially important for a JS site). No robots.txt = no sitemap pointer and, critically for AI, **no explicit allow for AI crawlers**. If you want ChatGPT/Perplexity/Claude to cite you, their bots must be welcome.
- **Fix:** After C1 creates real URLs, add:
  - `sitemap.xml` listing all real routes (home, 7 sectors, 3 platform, services + 4, trust, about, contact, legal).
  - `robots.txt` referencing the sitemap and **explicitly allowing** `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`. (Per ai-seo skill: blocking these = those engines literally cannot cite you. Allow the search-and-cite bots; optionally block training-only `CCBot` if you object to training use.)

## H2. No structured data / schema (zero JSON-LD)

- **Issue:** No `application/ld+json` anywhere. AI engines and rich results both lean on schema for entity understanding.
- **BD impact:** Weaker entity recognition ("what *is* AgoraXR?"), no rich results, ~30–40% less AI visibility on non-Google engines (per ai-seo skill). For a new brand with no authority yet, schema is one of the few machine-readable ways to assert the entity graph.
- **Fix (per page, emitted at build time):**
  - **`Organization`** on home/about: name AgoraXR, EU location, logo, `sameAs` (LinkedIn/social), `foundingLocation` EU. Anchors the brand entity.
  - **`SoftwareApplication`** (or `Product`) for Agora Command, Attune, the SDK: `applicationCategory`, `operatingSystem` (device-agnostic XR), `featureList`, `offers`/contact.
  - **`FAQPage`** on Attune, Trust, and each sector page — reuse the "why this matters" + "what you get" content as Q&A pairs. Directly extractable by AI.
  - **`BreadcrumbList`** on sector/service/platform pages (Home › Solutions › Museums) — reinforces the hierarchy that hash routing currently hides.
  - Validate with Google Rich Results Test (renders JS) once live.

## H3. AEO/GEO — the content is citation-gold but structurally unreachable

- **Issue:** `data.js` contains exactly what AI answer engines reward — clear entity definitions, sector-specific problem/solution framing, the 9-category Attune accessibility taxonomy, EU-compliance claims — but it is (a) unreachable (C1) and (b) not yet formatted for extraction.
- **BD impact:** Target buyer queries are answered *by AI*, not by a SERP click, for exactly this audience (institutional buyers researching "accessible XR at scale," "run VR at scale for museums," "EU-compliant XR platform"). If you're not in the model's retrieved sources, you're absent from the buying conversation. This is where a young B2B brand can win citations even without domain authority — *if* the content is reachable and structured.
- **Fix (layered on top of C1's real pages):**
  1. **`/llms.txt`** at root: one-paragraph "AgoraXR is a EU-based B2B XR platform that lets institutions deploy, run, and scale immersive experiences (Agora Command) while making every headset comfortable and accessible for every visitor (Attune)." + linked map of key pages. Cheap, high-leverage for ChatGPT/Perplexity/Claude.
  2. **Entity-clarity opening line on every page**: lead with a self-contained "AgoraXR is…" / "Attune is…" / "Agora Command is…" sentence (40–60 words) that works with zero surrounding context — that's the passage an LLM lifts.
  3. **Q&A framing**: convert each sector's `why` + `gets` into explicit question headings ("How does AgoraXR make museum XR accessible?", "Can XR run offline for remote tourism sites?"). Matches how buyers phrase prompts + feeds FAQ schema (H2).
  4. **Make the accessibility-standards content a citable asset**: the Attune "9 categories · 60+ settings" taxonomy and standards section is a genuinely referenceable resource. Give it stable structure (a named table of the 9 categories with definitions), a "last updated" date, and — where claims are made — cite the underlying standards (WCAG, EN 301 549, EAA). Statistics + citations are the single biggest GEO lever (+37–40% per Princeton GEO study). **Caveat:** the healthcare `legal` note and two `counselNote` strings in data.js are flagged as pending EU counsel sign-off — keep those gated until cleared; don't publish unreviewed compliance claims for the sake of citations.
  5. **Third-party presence** (ai-seo Pillar 3): brands are cited ~6.5x more via third-party sources than their own domain. Get AgoraXR into XR/accessibility industry roundups, a Wikipedia-worthy footprint over time, G2/Capterra profiles, and relevant EU-accessibility discussions. This is a BD/marketing motion, not a code fix, but it's where AI citations actually come from early on.

## H4. `og:image` referenced but missing

- **Issue:** `index.html` line 25 references `assets/og-image.jpg`; the `assets/` directory is **empty** (confirmed). Every social/Slack/email share of the site renders a broken or blank preview.
- **BD impact:** Sales and partners share links constantly; a broken unfurl looks unfinished and kills click-through on outbound. Direct hit to BD outreach quality.
- **Fix:** Add a real 1200×630 OG image to `assets/`, plus per-page OG images (or one strong branded default) as part of C2.

---

# MEDIUM — on-page polish and hygiene; compounding value once the above ships.

## M1. Image alt / media are placeholders, not real assets
- Nearly all "media" are decorative SVGs (`aria-hidden`) or `.ph` placeholder blocks ("Hero demo film", "Partner logo row", "Case study —", throughput stat). Good `role="img"`/`aria-label` usage is present (e.g., the arch diagram, Attune scene), so a11y hygiene is decent — but there are **no real, indexable, alt-bearing images** and no case-study/logo proof yet. **BD impact:** no image-search surface, and empty proof slots weaken E-E-A-T for both buyers and AI. **Fix:** replace placeholders with real captures/case studies as they clear (data.js comments already enforce "real evidence only — never invented," which is the right instinct); give each a descriptive filename + alt.

## M2. Heading structure — verify one H1 per real page post-C1
- Each `PAGES.*` render emits a single `<h1>` (good), but several pages inline `font-size` on the H1 for styling and rely on section `<h2>`s. Once pages are pre-rendered, confirm exactly one H1 per URL and that H1s contain the primary keyword for that route (e.g., sector H1 "Exhibit XR. Welcome everyone." is on-brand but keyword-thin — consider working "accessible museum XR" into the H1 or the first H2). **BD impact:** clearer topical signal per page. **Fix:** keyword-align H1/H2 with the target-query map below.

## M3. Internal linking is good in-app but invisible to crawlers today
- The nav, footer, `crosslinks`, and sibling/related links (app.js sector/service pages) form a genuinely solid internal-link graph — but as `#/` fragments they pass **no crawl equity** and create no discoverable link graph. **Fix:** once History-API URLs exist (C1), this same structure becomes real internal linking — a strength waiting to be switched on. Ensure anchor text stays descriptive (it currently is: "See how Attune fits," "Explore Agora Command").

## M4. Performance / Core Web Vitals
- Render-blocking Google Fonts via `@import`-style `<link>` (2 preconnects help); all content paint waits on `data.js` + `app.js` parse+exec then a synchronous `innerHTML` of the whole page → LCP is gated on JS. External font dependency also means a network round-trip before text. **BD impact:** slow LCP hurts both ranking and the buyer's first impression. **Fix:** after C1, content is in the HTML so LCP improves automatically; additionally self-host fonts (or `font-display:swap`, already set) and defer non-critical JS. Static hosting + real HTML gets you most of the CWV win for free.

## M5. Housekeeping
- Remove/keep-out-of-deploy `index.legacy.html` (134 KB) and `__probe.html` from the production root so they aren't crawled/indexed as stray URLs. Add them to a deploy ignore or delete. **Fix:** ensure only intended files ship; the sitemap (H1) should be the source of truth for indexable URLs.

## M6. `/pricing.md` for agentic buyers (optional, watch-this-space)
- ai-seo skill flags that AI buying-agents skip products whose pricing they can't parse. AgoraXR is "book a demo" / contact-sales (no public pricing), which is normal for institutional B2B — but consider a root `/pricing.md` or `/pricing` page describing the engagement model (pilot → scale, services bundle) even without dollar figures, so agents can represent you in comparisons. Low priority given the sales-led motion, but cheap.

---

# Target-query map (keyword/topic opportunities per sector & product)

Once C1 creates real pages, map one primary intent per URL (avoid cannibalization) and cover the AI "fan-out" siblings on the same page.

| Route (real URL) | Primary target query | Supporting / fan-out queries |
|---|---|---|
| `/` | "XR platform for institutions" | "run XR at scale", "enterprise VR deployment platform EU" |
| `/platform/attune` | "accessible XR platform" | "VR accessibility software", "WCAG / EAA compliant XR", "motion sickness comfort settings VR", "accessible VR for disabilities" |
| `/platform/agora-command` | "manage a fleet of VR headsets" | "control multiple VR headsets one dashboard", "VR kiosk / LBE operations software" |
| `/platform/sdk` | "inclusive XR SDK Unity" | "accessible VR development toolkit", "one-line accessibility Unity XR" |
| `/solutions/museums` | "XR / VR exhibits for museums" | "accessible museum VR", "immersive exhibit platform", "turnkey museum XR" |
| `/solutions/education` | "VR lab for schools / universities" | "manage classroom VR headsets", "accessible XR for students" |
| `/solutions/training` | "immersive training at scale" | "VR training throughput", "job center VR simulation", "scalable VR training platform" |
| `/solutions/enterprise` | "enterprise XR deployment EU data sovereignty" | "on-premise VR deployment", "offline enterprise VR", "GDPR-compliant XR" |
| `/solutions/healthcare` | "immersive training & therapy support XR (non-clinical)" | "VR simulation for care settings", "accessible healthcare XR" *(keep within counsel-approved wording)* |
| `/solutions/events` | "LBE / location-based VR platform" | "VR attraction ticketing throughput", "pop-up XR experience platform" |
| `/solutions/travel` | "offline VR for tourism / on location" | "VR without internet", "laptop-as-server XR", "remote-site immersive experiences" |
| `/services/content` | "custom XR content development" + "XR content network" | "immersive training content", "arts & culture VR content" |
| `/trust` | "EU-compliant XR platform" | "GDPR VR data", "XR accessibility statement", "data sovereignty immersive" |

**Highest-value AEO targets (get cited here):** "accessible XR at scale," "run VR at scale for museums," "EU-compliant XR platform," "accessible VR for institutions," "manage many VR headsets." AgoraXR's differentiated, specific content (Attune's 9 categories, EU hosting, offline-capable, one-operator fleet control) is exactly the kind of concrete detail LLMs prefer to cite over generic "we're the best" pages — *once it's reachable.*

---

# Suggested sequence

1. **C1** — pre-render/SSG per route + History-API URLs (reuse existing `data.js` + `PAGES.*`). Unblocks everything.
2. **C2 + H1** — per-route head metadata (title/description/canonical/OG) + sitemap.xml + robots.txt (allow AI bots).
3. **H2 + H4** — JSON-LD (Organization/SoftwareApplication/FAQ/Breadcrumb) + real OG image.
4. **H3** — llms.txt, entity-clarity opening lines, Q&A framing, cite standards on the Attune asset; begin third-party presence work.
5. **M-series** — real media/proof, heading keyword-alignment, perf, remove legacy/probe files from deploy.

**The design goal of "simple, static-hostable" is fully preserved by Option A** — you end up with a folder of static HTML files that any static host serves, no server runtime required, but now every page is real, populated, crawlable, and citable.
