# Information Architecture Spec — AgoraXR

**Aesthetic:** Humanist Immersive (Scandinavian warmth + Japanese Ma restraint).
**Mandate:** Restructure, don't discard. All existing copy substance is kept; this spec reorganizes where it lives, what it's called, and how a buyer travels through it.
**Scope of build:** hash-router SPA in a single `index.html`. Data arrays (`SECTORS`, `PLATFORM`, `PILLARS`, `CATEGORIES`) + `buildNav()` + `PAGES.*` render fns + `parseHash()` router. Every recommendation below maps onto those structures.

---

## 1. Diagnosis — what's structurally wrong today

The site is well-written and visually coherent, but the IA has seven concrete problems.

### 1.1 The nav buries the product's whole thesis
The pitch is a **two-spine** story: **Agora Command** (run it) + **Attune** (include everyone). Yet in the nav both spines are hidden as items 2 and 3 inside a single `Platform ▾` dropdown, sitting as equal peers next to Content, Consultancy, Workshops, and Hardware. A first-time visitor scanning the top bar sees `Sectors · Platform · Developers · Trust · About` and cannot tell what AgoraXR *is*. The single most differentiating asset — Attune, an accessibility layer no competitor operationalizes at scale — is a second-row dropdown link with a three-word description ("accessibility & comfort").

### 1.2 "Platform" conflates a product with a services menu
`PLATFORM[]` mixes two fundamentally different things:
- **Product** (software you log into / build on): Agora Command, Attune, Content-as-tech, the SDK.
- **Services** (people you hire): Consultancy, Workshops & Training, Hardware supply, and Content-as-a-commission.

Bundling them means the dropdown reads as a flat list of six unrelated tiles with no hierarchy. A buyer evaluating the *platform* is forced to wade past "Hardware" and "Workshops"; a buyer looking for *help standing it up* has no "Services" heading to look under. The architecture diagram on `/platform` reinforces that Command + Attune + SDK are the product — but the nav doesn't match that model.

### 1.3 Sectors vs Platform: two parallel front doors with no stated relationship
`Sectors ▾` (who you are) and `Platform ▾` (what we make) are two independent entry systems. There's no connective tissue telling a museum curator "start in Sectors, then Attune answers your accessibility duty." Each sector page *does* cross-link to Attune (good), but the reverse — Attune/Command pages pointing back to relevant sectors — is missing, so the two systems never close the loop.

### 1.4 The home page has no single job — and it repeats itself
Eleven sections, several redundant:
- **Throughput** is Pillar 1 *and* its own dedicated band ("people per hour").
- **Data sovereignty** is Pillar 3 *and* its own dedicated band ("Yours, and it stays yours").
- **Full-stack/one-team** is Pillar 4 *and* its own dedicated band ("empty room to full house").

So the "Four things it gets right" grid and three later bands say the same things twice. The page tries to fully brief all 7 audiences, both spines, trust, services, and developers — and as a result leads with none of them decisively. The two-spine story is present but diffused across pillars rather than *staged*.

### 1.5 CTA strategy is monotonous and full of dead ends
`closingCTA()` appends the identical "Book a demo / Watch the 2-minute demo" band to nearly every page. More importantly, **almost every secondary CTA routes to `#/contact`** regardless of label: "Get the accessibility spec sheet", "Read the docs", "Get the SDK", "Talk to us about hardware", "Report an accessibility barrier" all dump the user on the same demo form. The labels promise a document, a doc site, an SDK download, a targeted conversation — and deliver a generic demo request. That erodes trust and wastes the differentiated intent the copy worked to create.

### 1.6 Trust is overloaded; proof has no home
`/trust` is doing five jobs: hosting the full demo video, three case-study placeholders, the accessibility/standards argument, the compliance badge wall, and the security/data-handling model. Meanwhile "proof" is *also* scattered: every sector page has its own case-study placeholder, and the home page has a partner-logo strip and a throughput-stat placeholder. There is no single "Customers / Case studies" location, so social proof can never accumulate as content grows.

### 1.7 Mobile nav loses the information scent
`#mobileNav` collapses the rich, described dropdowns into two bare accordions of plain text links (`Sectors`, `Platform`) plus flat links. The hooks and descriptions that make the desktop dropdowns legible are dropped. The header's ghost "Watch demo" button is `display:none` on mobile, so mobile users get only "Book a demo." The theme toggle's mobile placement and the two-spine framing are absent.

---

## 2. Recommended navigation model

Reframe around the two-spine product story and cleanly separate **Product** from **Services**.

### 2.1 Primary nav — exact top-level labels (5 + CTA)

```
[ Solutions ▾ ]  [ Platform ▾ ]  [ Services ▾ ]  [ Trust ]  [ About ]        [ Book a demo ]
```

Rationale for each:
- **Solutions** (rename from "Sectors"). A curator doesn't self-identify as "a sector"; they look for their situation. Keeps all 7 audiences. Route base stays `sectors`-compatible via alias (see §8).
- **Platform** = the *software product only*, structured to make the two spines legible in the dropdown itself.
- **Services** = the *people you hire*: Content, Consultancy, Workshops, Hardware. New top-level slot — this is the single most important structural change.
- **Trust** stays a top-level single link. EU-compliance and accessibility duty are primary purchase drivers for institutional/enterprise buyers; it earns prominence, not a dropdown.
- **About** stays a single link. Company story + values + team.
- **Book a demo** — persistent primary CTA (violet), right-aligned, on every viewport.

### 2.2 Dropdown contents (exact)

**Solutions ▾** — mega dropdown, 2 columns, one card per sector (keep icon + hook description). Order by buying-signal strength / breadth:
- Museums & Culture
- Education
- Training & Job Centers
- Enterprise
- Healthcare
- Events & LBE
- Travel & Tourism
- Footer row of the dropdown: **"See all solutions →"** → `#/solutions` (new index page)

**Platform ▾** — mega dropdown, framed as the two spines so the thesis is visible in the nav. Column headers are load-bearing:
- **Overview** → `#/platform` (spans the top, full width, "Everything to run XR, in one system")
- Column A header **RUN IT — operations**
  - **Agora Command** — run every headset from one screen → `#/platform/agora-command`
- Column B header **INCLUDE EVERYONE — accessibility & comfort**
  - **Attune** *(flagship, gold styling)* — one profile, any headset, 9 categories → `#/platform/attune`
- Full-width footer row: **Developers & SDK** — build inclusive, deploy-ready XR → `#/platform/sdk`

(Attune keeps its gold `thread` treatment and is visually the hero of this menu — it is the differentiator and must read as such.)

**Services ▾** — simple dropdown, 4 items + overview:
- **Overview** → `#/services`
- **Content** — we build it & we broker it → `#/services/content`
- **Consultancy** — scope & scale → `#/services/consultancy`
- **Workshops & Training** — own the capability → `#/services/workshops`
- **Hardware** — kit, if you want it → `#/services/hardware`

**Trust** — single link → `#/trust`
**About** — single link → `#/about`

### 2.3 What moved and why
| Item | From | To | Why |
|------|------|-----|-----|
| Agora Command | Platform (peer of 6) | Platform → spine A | Elevated as one of two thesis pillars |
| Attune | Platform (peer of 6) | Platform → spine B, flagship | The differentiator gets hero position |
| Developers | Top-level link | Platform → "Developers & SDK" | It's the build layer of the product; unifies the product story and frees a top-level slot |
| Content | Platform | **Services** | It's a commission/brokerage service, not login-software |
| Consultancy | Platform | **Services** | People you hire |
| Workshops & Training | Platform | **Services** | People you hire |
| Hardware | Platform | **Services** | Procurement/supply service |

Net: `PLATFORM[]` splits into `PRODUCT[]` (agora-command, attune, sdk) and `SERVICES[]` (content, consultancy, workshops, hardware). `buildNav()` renders three dropdowns from these arrays instead of one.

### 2.4 Utility & footer nav
- **Header utility (right):** theme toggle, Book a demo. (Optionally a low-key "Talk to us" text link before the demo button on ≥1200px.)
- **Footer columns:** Solutions · Platform (Command / Attune / SDK) · Services · Company (About / Trust / Careers / Contact) · Legal (Privacy / Terms / Cookies / Data & GDPR) + newsletter + EU badge. Footer is the safety net that exposes every leaf the streamlined header hides.

---

## 3. Home page — ordered section outline

**The home page's one job:** land the two-spine promise in the first two screens, prove it once with the Attune showpiece and the throughput argument, then route the 7 audiences onward. No section may repeat what a pillar already said. Target ~9 sections (down from 11), no duplicated arguments.

| # | Section | What it does | Headline intent | Primary CTA | Secondary |
|---|---------|--------------|-----------------|-------------|-----------|
| 1 | **Hero** | State the two-spine promise in one breath. | "Run every headset from one screen — comfortable for every person in it." (keep existing sub, keep trust tags: EU-hosted · 9 categories/60+ settings · works offline) | Book a demo | Watch the 2-min demo *(→ real video/modal, not the contact form)* |
| 2 | **Credibility strip** | Immediate reassurance. | "In deployment across museums, classrooms, and training floors." (logos when cleared; never fabricated) | — | — |
| 3 | **The tension** *(keep "The real job")* | Frame the problem AgoraXR exists to solve. | "XR is easy to demo. It's hard to run." | — | — |
| 4 | **The two spines** *(replaces the 4-pillar grid as the page's spine)* | The core section: two side-by-side panels — **Run it (Agora Command)** and **Include everyone (Attune)** — each with its payoff line and a link. This is where the thesis becomes concrete. | "Two layers. One is how you run XR. The other is how everyone gets to use it." | — | Explore Agora Command → · How Attune works → |
| 5 | **Attune showpiece** *(keep interactive demo)* | Prove the accessibility spine live — the single best asset on the site. Keep the interactive scene + the two audience cards (first-timers / inclusion). | "Every user is different. Every headset should be too." | Get the accessibility spec sheet *(real PDF/lead-gen, prefilled topic)* | How Attune works → |
| 6 | **Throughput = ROI** *(keep, now the Command spine's proof)* | Prove the operations spine with the people-per-hour argument + one real stat when available. | "The number that pays for XR: people per hour." | Explore Agora Command → | — |
| 7 | **Solutions grid** *(keep 7 tiles)* | Route all 7 audiences from one place. This is how home serves everyone without seven hero variants. | "Built for the places people walk into." | (each tile → its solution page) | See all solutions → |
| 8 | **Trust + full-stack strip** *(merge the two redundant bands)* | One combined band: left = EU/data-sovereignty (3 badges, absorbs old Pillar 3 + data band); right = "one team, space to scale" (absorbs old Pillar 4 + full-stack band). Kills the duplication in §1.4. | "Yours, under EU rules — and delivered by one team." | How we handle data → (Trust) | Explore Services → |
| 9 | **Developer teaser** *(keep code block)* | Hand the SDK audience a fast lane. | "Ship XR that's inclusive from line one." | Explore the SDK → *(→ `#/platform/sdk`)* | — |
| — | **Closing CTA** | Convert. | "See what your space can do." | Book a demo | Watch the 2-min demo |

**Removed from home:** the standalone 4-pillar grid (its content is redistributed into §4 spines + §8 strip), the duplicate throughput band header, and the duplicate full-stack band. Pillars data can still power a compact "at a glance" list inside §4 if wanted, but not as a fourth repetition.

---

## 4. Solution (sector) page template

Works for all 7 sectors from the existing `SECTORS[]` fields (`eyebrow, h1, sub, why, gets, attune, legal, cta`). Ordered structure:

1. **Hero** — `eyebrow` + `h1` + `sub`. Primary CTA = `s.cta` (sector-specific, e.g. "See a museum deployment"). Secondary = "See how Attune fits" → Attune. *(as today)*
2. **The real problem** — `why`. The stakes for this specific audience. *(keep)*
3. **What you get** — `gets[]` as outcome cards. *(keep; 2- or 3-col by count)*
4. **The two spines, in this context** — NEW light band making the thesis local: one line on how *Agora Command* serves this sector's operations, one on how *Attune* (`s.attune`) serves its people. Keep the live Attune preview here. Cross-links to both `#/platform/agora-command` and `#/platform/attune`. *(upgrades today's Attune-only band so both spines close the loop — fixes §1.3)*
5. **Proof, for this sector** — case-study placeholder, but now also *pulls from* the shared Customers pool filtered by sector (see §7 content growth). *(keep placeholder discipline: real evidence only)*
6. **Legal note** — render only if `s.legal` (healthcare). *(keep)*
7. **Related** — NEW small row: "Also relevant" → 2 sibling sectors + relevant Service (e.g. Museums → Content, Consultancy). Improves lateral findability.
8. **Closing CTA** — sector-flavored: primary `Talk to us about {sector}` for consultative sectors (enterprise, healthcare), `Book a demo` for the rest.

---

## 5. Product & Services page templates

### 5.1 Platform overview (`#/platform`)
1. **Hero** — "Everything you need to run XR — in one system." *(keep both lede paragraphs)*
2. **The stack diagram** — `archDiagram()` — the canonical "how it fits" visual. *(keep)*
3. **The two spines** — two large cards (Agora Command / Attune) instead of a flat 6-card grid; Attune gold-flagged. *(reflects the new PRODUCT split)*
4. **Developers & SDK** — one card/band → `#/platform/sdk`.
5. **Services pointer** — one band: "Need help standing it up? → Services." *(bridges Product↔Services)*
6. **Closing CTA.**

### 5.2 Product detail — Agora Command (`#/platform/agora-command`)
1. **Hero** — `h1` + `sub`, primary CTA. *(keep)*
2. **What it does** — `does[]` cards + `payoff` stat row + dashboard media placeholder. *(keep)*
3. **Throughput/ROI** — the people-per-hour argument lives natively here (home only teases it).
4. **How it connects** — one line each to Attune (comfort keeps users in the session) and the SDK.
5. **Where it's used** — 2–3 relevant solution links.
6. **Closing CTA** — Book a demo / Watch the 2-min demo.

### 5.3 Product detail — Attune (`#/platform/attune`)
Keep the existing rich page — it is the strongest page on the site. Confirmed order:
1. Hero + pill-note (9 categories · 60+ settings). 2. **Interactive demo.** 3. How it works (3 steps). 4. Nine categories grid (incl. Horizon). 5. "Two things it fixes" (comfort + access). 6. Standards & credibility (XAUR / EN 301 549 / WCAG). 7. **Closing CTA** with the *real spec-sheet download* as secondary.
- **Add:** a "For your sector" cross-link row (Attune → the 7 solutions) to close the loop noted in §1.3.

### 5.4 Product detail — Developers & SDK (`#/platform/sdk`)
Keep current `developers` page. 1. Hero (docs / get SDK). 2. One-line integration code. 3. Toolkit grid. 4. Why build on AgoraXR + standards. 5. Closing CTA.
- **Fix routes:** "Read the docs" → real docs URL; "Get the SDK" → real download/gated form — not `#/contact`.

### 5.5 Services detail template (Content, Consultancy, Workshops, Hardware)
Uniform structure driven by `SERVICES[]` (`eyebrow, h1, sub, body|paths, cta`):
1. **Hero** — `h1` + `sub`. Primary CTA = **"Talk to us"** (consultative, not "Book a demo").
2. **What it is** — `body`, or `paths[]` cards for Content ("we build it / we source it").
3. **How we work / what's included** — bullet list (from body or new field).
4. **Fits with** — cross-links to the relevant Product page(s) and 1–2 sectors.
5. **Closing CTA** — "Talk to us" + optional "Book a demo."

### 5.6 Services overview (`#/services`, NEW)
Simple index: intro line ("One partner, from space to scale") + 4 service cards + CTA. Mirrors `#/platform` but for the human offerings. Absorbs the home page's old "full stack, one team" argument as its hero.

---

## 6. User flows (3 personas)

Notation: **entry → path → conversion**; cross-links each persona needs.

### 6.1 Museum curator — "Can I show immersive art without a technician per headset, and will disabled visitors be able to use it?"
1. **Entry:** organic search / referral → likely lands on **Home** or directly **Solutions → Museums & Culture**.
2. **Path:** Museums page (`why` = liability framing lands) → clicks **"See how Attune fits"** → **Attune** page, plays the interactive demo (the "aha") → returns via Attune's new "For your sector" row, or jumps to **Services → Content** ("we build/broker it — I don't have to commission from scratch") → **Consultancy** ("help me scope a pilot").
3. **Conversion:** **"Talk to us about content"** or **Book a demo** (prefilled `sector=Museums`). Low-friction alt: **Get the accessibility spec sheet** (forwardable to their access officer).
4. **Cross-links required:** Museums ⇄ Attune (both directions), Museums → Content, Museums → Consultancy, Attune → spec sheet.

### 6.2 Enterprise IT buyer — "Where does the data live, is it EU-compliant, and can it run on our infrastructure?"
1. **Entry:** vendor evaluation → **Solutions → Enterprise** or straight to **Trust** (searching "AgoraXR GDPR / EU hosting").
2. **Path:** Enterprise page (`why` = data sovereignty) → **Trust** (storage options, "nothing leaves without permission", EU-hosting badges, EU AI Act note) → **Platform overview** (architecture diagram → offline/local-server capability) → **Agora Command** (fleet control, audit trail) → optionally **Attune** (inclusion ships by default, satisfies workforce-accessibility duty).
3. **Conversion:** **Talk to us about enterprise** (consultative, not self-serve demo) + **download the security/compliance one-pager** (a real asset, prefilled `topic=security`).
4. **Cross-links required:** Enterprise ⇄ Trust, Trust → Platform architecture, Platform → Agora Command, Enterprise → Attune (accessibility-as-compliance), Trust → contact with topic routing.

### 6.3 Training-provider ops lead — "Can I push more learners through per day, and include everyone, cost-effectively?"
1. **Entry:** **Solutions → Training & Job Centers** (from nav or home solutions grid).
2. **Path:** Training page (`why` = throughput scales the economics; `gets` = learners/hour) → **Agora Command** (deploy across stations, optimize the space, throughput = ROI section) → **Attune** ("job centers serve the widest range of people" — inclusion by default) → **Services → Workshops & Training** ("own the capability, don't outsource forever") → **Hardware** (kit + local server if they lack IT).
3. **Conversion:** **Book a demo** (prefilled `sector=Training`) or **Book a workshop**.
4. **Cross-links required:** Training ⇄ Agora Command, Training ⇄ Attune, Training → Workshops, Training → Hardware, Command → throughput proof.

**Common thread:** every persona needs the sector page to fan out to (a) the relevant **spine**, (b) a relevant **service**, and (c) a **proof** point — which is exactly the §4 template's steps 4, 7, and 5.

---

## 7. CTA & conversion strategy

### 7.1 Three distinct conversion actions (stop collapsing them into one form)
| Action | Intent | Visual | Where it leads |
|--------|--------|--------|----------------|
| **Book a demo** | High-intent, sales-ready | Primary, violet (`btn--primary`) | `#/contact` demo form, prefilled `?sector=` / `?topic=` |
| **Talk to us** | Consultative / services / enterprise (not ready for a scripted demo) | Primary or ghost | `#/contact` with a *conversation* framing (different form heading), prefilled topic |
| **Download the spec sheet / one-pager** | Low-friction lead capture, forwardable to a colleague | Gold or ghost secondary | Lightweight email-gate → **real PDF** (accessibility spec, security one-pager, SDK overview). **Must not be the demo form.** |

### 7.2 Primary vs secondary CTA per page type
| Page type | Primary | Secondary |
|-----------|---------|-----------|
| Home | Book a demo | Watch the 2-min demo (video/modal) |
| Solution (sector) | `s.cta` (sector-specific; "Talk to us…" for enterprise/healthcare, "Book a demo/See deployment" for the rest) | See how Attune fits |
| Platform overview | Book a demo | Explore each spine |
| Agora Command | Book a demo | Watch the 2-min demo |
| Attune | Get the accessibility spec sheet *(real download)* | Book a demo |
| Developers & SDK | Get the SDK *(real download/gated)* | Read the docs *(real docs URL)* |
| Services (all) | **Talk to us** | Book a demo |
| Trust | Download the security/compliance one-pager | Report an accessibility barrier |
| About | Book a demo | See the platform |

### 7.3 Fix the dead ends (from §1.5)
- Replace every "secondary → `#/contact`" that *promises a document or tool* with the real asset or a topic-routed form. Concretely: spec sheet, SDK, docs, security one-pager become distinct destinations; "Report a barrier" keeps its dedicated form (already exists on `/contact`).
- **Prefill the demo form** from context: `#/contact?sector=Museums`, `#/contact?topic=spec-sheet`, `#/contact?topic=enterprise-security`. The existing form already has a sector `<select>` — read the query param and preselect it.
- **Vary the closing band** by page family instead of one global `closingCTA()`: product pages → "Book a demo"; services pages → "Talk to us"; Attune → spec sheet. Keep it one function, parameterized by page type.

---

## 8. URL / route scheme (hash SPA)

Clean, human-readable, and matched to the new nav. Rename where labels changed; keep old routes as **redirect aliases** so no link breaks.

```
#/                                  Home
#/solutions                         Solutions index            (NEW)
#/solutions/museums                 Sector page
#/solutions/education
#/solutions/training
#/solutions/enterprise
#/solutions/healthcare
#/solutions/events
#/solutions/travel
#/platform                          Platform overview (two spines)
#/platform/agora-command            Product — operations spine
#/platform/attune                   Product — accessibility spine (flagship)
#/platform/sdk                      Product — Developers & SDK   (was #/developers)
#/services                          Services index             (NEW)
#/services/content
#/services/consultancy
#/services/workshops
#/services/hardware
#/trust                             Trust
#/about                             About
#/contact                           Book a demo / Talk to us   (accepts ?sector= &?topic=)
#/customers                         Case studies index         (NEW, see §content growth)
#/customers/{slug}                  Individual case study      (future)
#/careers                           Careers
#/legal/privacy                     (was #/page/privacy)
#/legal/terms
#/legal/cookies
#/legal/gdpr
                                    404 → PAGES.notfound
```

**Redirect aliases** to add in `parseHash()` (old → new): `#/sectors/{slug}` → `#/solutions/{slug}`; `#/developers` → `#/platform/sdk`; `#/platform/consultancy|workshops|hardware|content` → `#/services/{slug}`; `#/page/{key}` → `#/legal/{key}`.

**Rules:**
- Pattern: `#/section/subsection/item-slug`, lowercase, hyphenated.
- Dynamic segments: only the trailing `{slug}` (sector, product, service, customer).
- Query params: `?sector=` and `?topic=` on `#/contact` for form prefill; reserved `?filter=` on `#/customers` for sector filtering.
- One canonical route per page; everything else is a redirect, never a duplicate render.

---

## 9. Mobile navigation pattern

**Recommendation: full-height overlay panel with grouped accordions that preserve the information scent, plus a pinned CTA.** Extend the existing `details/summary` pattern — don't replace it.

Structure (top to bottom inside `#mobileNav`):
1. **Four accordions** mirroring the four dropdowns: **Solutions**, **Platform**, **Services**, and the single links **Trust / About** as plain rows.
2. **Keep the descriptions.** Under each accordion, render the same `.d` hook/description text used on desktop (sector hooks, product one-liners). Losing them on mobile — as today — strips the scent. Use a compact two-line item: bold label + muted description.
3. **Surface the two spines** inside the Platform accordion with the same RUN IT / INCLUDE EVERYONE sub-labels, so the thesis survives on mobile.
4. **Utility row:** theme toggle + a text "Talk to us" link.
5. **Pinned primary CTA:** "Book a demo" fixed to the bottom of the panel (sticky footer within the overlay), always reachable without scrolling past the whole menu.
6. **Also expose "Watch the 2-min demo"** on mobile (currently hidden) — as a secondary row near the CTA, since video is the fastest comprehension path for a mobile first-timer.

Behavior: opening the menu locks body scroll; `Esc` and the burger both close; focus trap inside the panel; each accordion is a native `<details>` for zero-JS resilience and correct semantics. Respect `prefers-reduced-motion` (already handled globally).

---

## 10. Build-mapping notes (so this drops onto the existing code)

- **Split `PLATFORM[]`** into `PRODUCT[]` (`agora-command`, `attune`, `sdk`) and `SERVICES[]` (`content`, `consultancy`, `workshops`, `hardware`). Move the `developers` page content into a `sdk` product entry.
- **`buildNav()`** now renders **three** dropdowns (Solutions, Platform, Services) + two single links (Trust, About). Platform dropdown gets the two-spine column layout; Attune keeps `thread:'gold'` flagship styling.
- **`parseHash()`** gains `solutions`, `services`, `sdk`, `legal`, `customers` branches + the redirect alias map in §8.
- **`closingCTA()`** takes a `pageType` arg to vary primary CTA (demo vs talk-to-us vs spec-sheet).
- **`PAGES.contact`** reads `location.hash` query for `?sector=`/`?topic=` and preselects the sector `<select>` / swaps the form heading.
- **New pages:** `PAGES.solutionsIndex`, `PAGES.services`, `PAGES.customers` (index). Sector/product/service detail templates already exist and only need the cross-link "Related / Fits with" rows added (§4.7, §5.2–5.5).
- **Naming glossary (use consistently):** "Solutions" (not Sectors) in UI; "Platform" = product; "Services" = hire-us; "spine" is internal language, surface it as "RUN IT / INCLUDE EVERYONE"; "Attune" always paired with "accessibility & comfort layer"; "Agora Command" always "operations hub."

---

### Content growth plan (brief)
- **Customers/case studies** is the section that grows. Give it one home (`#/customers`) with sector filtering; sector pages *pull* matching studies rather than each holding an orphan placeholder. This fixes the scattered-proof problem (§1.6) and lets social proof accumulate.
- **Attune categories** (currently 8 + Horizon) grow over time — the grid already accommodates additions via the `CATEGORIES[]` array; keep Horizon as the "what's next" slot.
- **Services** may add offerings — the `SERVICES[]` array + `#/services` index absorb new cards without nav changes.
