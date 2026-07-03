# AgoraXR — BD Positioning & Messaging Review

**Reviewer lens:** B2B positioning + messaging strategist, reviewing the built site for business development.
**Scope:** All copy in `js/data.js`; staging/flow in `js/app.js`. Recommendations only — no files edited.

**One-line verdict:** The writing quality is genuinely strong — specific, confident, benefit-led, low on buzzwords. The site already out-executes 90% of XR vendor sites. The gap is not craft; it's **strategic sharpness of the wedge**. Attune (accessibility-as-operational-layer + compliance-risk-reducer) is your only defensible differentiator, and the site treats it as co-equal to the ops hub rather than as the spearhead. The biggest BD wins are (a) leading harder with the wedge, (b) making the economic argument *quantified and buyer-specific*, and (c) building the competitive/comparison and standards content that captures the buyers already searching.

Recommendations are ordered by BD impact (pipeline + conversion), highest first.

---

## 1. Lead with the wedge, not the category — Attune is under-weaponised as the reason to buy
**Priority: HIGHEST**

**Insight.** Your defensible moat is one sentence, and it's buried on the Trust page: *"Device makers solve accessibility one headset, one app at a time. AgoraXR is the layer that configures accessibility and comfort per user, across shared headsets, managed by the operator, at deployment scale."* That is the single most differentiated, hardest-to-copy claim on the entire site — and it appears near the bottom of a secondary page under the label "The honest framing." The homepage hero leads with "Run XR at scale — for everyone," where "everyone" (the wedge) is a subordinate clause, and the two spines are framed as **co-equal** ("Two layers, one platform"). Agora Command (an operations/MDM-shaped capability many vendors can approximate) gets equal billing with Attune (the thing nobody else does).

**On-site evidence.**
- `hero.h1`: `"Run XR at scale — for {{everyone}}."` — "everyone" italicised but grammatically secondary.
- `home.spines.heading`: "One layer runs XR. The other makes sure everyone can use it." — parallel, co-equal framing.
- `pages.trust.accessibility.honestFraming` — the sharpest differentiator statement, positioned as a footnote-style aside on the Trust page.
- `pillars[1].feature: true` — Attune *is* flagged as the feature pillar in data, but the home flow (app.js `PAGES.home`) still renders Run and Include as a symmetric two-up.

**Why it matters for BD.** In a new category, buyers don't remember four things. They remember the one thing you do that no one else can. If a cold institutional buyer leaves the page able to repeat only "they run XR at scale," you've lost — because so does every competitor's pitch deck. If they leave able to repeat "they're the ones who make a shared headset reconfigure per-person for accessibility and comfort," you own a category of one.

**Recommendation.** Elevate the "honest framing" from a Trust-page aside to a **top-three homepage moment**, and sharpen the hero to make accessibility-at-scale the noun, not the adverb.

- Hero H1 options (test):
  - A — wedge-forward: **"The only way to run XR for everyone — at scale."** Sub: "One operator runs the whole room. Every headset reconfigures to the person wearing it — comfort and accessibility, per user, across shared devices. EU-based, EU-compliant."
  - B — problem-forward: **"XR that reconfigures to every person who picks up a headset."** Sub: "Run immersive experiences across your whole space from one hub — and make every one of them comfortable and accessible, per visitor, at scale."
  - C — keep current H1 but promote the differentiator into the sub and kill the throwaway tag: current sub is fine; add a fourth trust-tag: "Per-user accessibility across shared headsets — nobody else does this."
- Add a dedicated homepage band (right after "The real job"): a "**Nobody else does this**" / "The category nobody else operates" moment built on the honest-framing copy, with the device-maker contrast made visual (their model: 1 app / 1 headset at a time → your model: any app / any headset / per user / operator-managed / at scale).
- Keep the two-spine story, but subordinate Run to Include on the homepage: Run is *table stakes that makes XR affordable*; Include is *the reason to choose AgoraXR over anyone else*. Framing: "Anyone can help you run headsets. We're the only one who makes them work for every body and mind that picks one up."

---

## 2. The economic argument is asserted, not proven — no numbers, no calculator, no buyer-specific ROI
**Priority: HIGHEST**

**Insight.** Every sector page and the throughput section make the right *argument* (throughput = ROI, more people per hour, inclusion is a duty) but land it with **zero quantification**. The one "stat" on the homepage is `"9 · 60+"` (categories · settings) — a *feature count dressed as an ROI stat*, sitting directly under the heading "The number that pays for XR: people per hour." That's a bait-and-switch a sharp buyer will notice: you promised the number that pays for XR and delivered a settings count.

**On-site evidence.**
- `home.throughput.heading`: "The number that pays for XR: people per hour." → `home.throughput.stat: "9 · 60+"`, `statLabel: "Categories · settings · always expanding"`. The stat contradicts the heading.
- Sector "gets" are all qualitative: "Space and session optimisation for maximum learners per hour" (training) — no baseline, no delta, no example.
- app.js throughput section (line ~218) already has a placeholder: *"e.g. 'X% more visitors per hour.' Real evidence only — never invented."* — the team knows the number is missing.
- No pricing page, no ROI/throughput calculator, no cost-of-exclusion framing anywhere.

**Why it matters for BD.** Institutional buyers (museums, job centres, universities, enterprise procurement) build business cases. "More people per hour" without a number is not a business case — it's a hope. The buyer has to do your quantification for you, and most won't. Meanwhile the *compliance* economic argument (cost/risk of an accessibility complaint, procurement disqualification under EN 301 549 / EAA) is even more powerful for public buyers and is barely monetised in the copy.

**Recommendation.**
- **Fix the false stat immediately.** Until you have a real throughput figure, don't put a fake-looking number under an ROI heading. Either use a real pilot metric (even "1 operator : N headsets" is a real, defensible ratio you already claim in `command.payoff`) or reframe the stat as the operator-leverage ratio: e.g. big number = **"1 : 20+"**, label = "One operator, a room full of headsets." That *is* the number that pays for XR and you already assert it.
- **Build a Throughput / ROI calculator** (lead-gen asset). Inputs: visitors/day, session length, headset count, ticket price or cost-per-learner. Output: people/hour, utilisation %, revenue or cost-per-head, and the operator-cost saving of 1:many vs 1:1 staffing. This is the single highest-intent BD asset you can build — it gates a demo and hands the buyer their own business case.
- **Add a compliance-risk / cost-of-exclusion frame** for public-sector sectors: quantify the downside (procurement disqualification, WAD/EAA exposure, re-commissioning inaccessible content). "An exhibit a wheelchair user can't experience isn't an exhibit, it's a liability" (museums `why`) is excellent — extend that logic with the *procurement* consequence for education/training/healthcare.
- Where you have any real deployment data, put **one specific number** per sector into the "gets" list. Specificity converts.

---

## 3. Two-spine story is clear to *you*; a cold buyer meets it half-explained
**Priority: HIGH**

**Insight.** The two-spine architecture (Agora Command = Run, Attune = Include) is coherent and well-diagrammed (the `archDiagram` in app.js is good). But a cold buyer hits three different metaphors for the same structure — "two spines," "two layers," "Run / Include" — and the naming "Agora Command" + "Attune" are abstract brand names that carry no meaning on first contact. The homepage does define them, but the platform nav dropdown labels ("run every headset from one screen," "one profile, any headset · 9 categories") are stronger, plainer descriptors than the branded page titles.

**On-site evidence.**
- Three labels for one concept: `pillars[0].name` "One system to run it all" vs `home.spines` "Two layers, one platform" vs `pages.platform` "The two spines" vs about `badges` "Run / Include / Under EU rules."
- Brand names lead on their own pages: `command.h1` "Run every headset from one screen." is great; but the nav shows "Agora Command" with the plain-English descriptor hidden as sub-text.
- Attune's product entry (`product[1]`) has almost no standalone copy in the product array — it's `flagship: true` but its page pulls from `pages.attune`. Fine functionally, but signals Attune is treated as a feature page rather than the hero product.

**Why it matters for BD.** Consistency of language is what makes a message *stick and get repeated* by a champion selling internally. If your own site uses three names for the structure, your champion will use five.

**Recommendation.**
- **Pick one canonical two-part framing and use it everywhere:** recommend **"Run it / Include everyone"** (verb-led, plain, already in `home.spines` labels). Retire "spines" from buyer-facing copy (keep it internal); "spine" is jargon a museum director won't parse.
- Always pair the brand name with its plain descriptor on first use in any context: "**Agora Command** — run every headset from one screen" and "**Attune** — one profile, any headset." Never let "Attune" appear cold without "the accessibility & comfort layer" nearby.
- On the homepage, name the outcome of the pairing explicitly once: "Two jobs, one system: **run the room** (Agora Command) and **include every person in it** (Attune)."

---

## 4. Competitive positioning is implicit — no "vs" or "alternative" surface at all
**Priority: HIGH**

**Insight.** The site never names what it replaces. The only competitive statement is oblique: "Most XR 'platforms' hand you a headset and a demo" (platform `sub2`) and the device-maker contrast on Trust. There are **no comparison pages, no "alternative to" pages, no category-vs-category framing** — which means you capture zero of the consideration-stage search traffic and hand your sales team no battle cards. Per the competitors skill, this is the highest-ROI SEO+sales-enablement gap.

**Who AgoraXR actually competes with (implicit today):**
1. **Device makers' native fleet/accessibility tooling** (Meta Quest for Business / Meta Horizon Managed Solutions, Pico Business, HTC) — the "1 app / 1 headset at a time" accessibility model. *Your sharpest contrast; already written on Trust.*
2. **Generic XR MDM / kiosk / fleet tools** (ArborXR, ManageXR, Meta's device management, generic MDM) — they manage devices but **do nothing for per-user comfort/accessibility or throughput/ROI**. This is your most direct "category-adjacent" competitor set and the clearest "we do the thing they can't."
3. **LBE / attraction operating systems** (SpringboardVR, Ctrl V-style platforms) — throughput/ticketing overlap for events/LBE, but no accessibility layer and not institution/EU-compliance shaped.
4. **XR content studios / bespoke agencies** — the "we'll just commission a bespoke experience" alternative. Your counter: they give you one experience; you give you an *operation* + inclusion by default + no per-app accessibility rebuild.
5. **DIY / status quo** — internal AV team + a shelf of headsets + a spreadsheet. Your biggest *actual* competitor for first-time institutional buyers. "The real job" section already targets this well.
6. **Generic accessibility/compliance consultancies** — for the compliance buyer; they audit, they don't operationalise.

**Why it matters for BD.** Buyers evaluating XR at scale are already Googling "ArborXR vs ManageXR," "Meta Quest for Business accessibility," "manage VR headsets at scale." You are invisible in that consideration set. Comparison pages are the single best-converting SEO asset for B2B because they capture high-intent, bottom-funnel searchers — and they double as sales battle cards.

**Recommendation — competitor-comparison page set (priority order):**

| # | Page | Format (per skill) | URL | Angle |
|---|------|-------------------|-----|-------|
| 1 | **XR headset management tools — and what they miss** | Plural alternatives | `/compare/xr-fleet-management-tools` | Framework: managing devices ≠ running an operation ≠ including every user. List ArborXR, ManageXR, native tools honestly; position AgoraXR as the only one with the accessibility + throughput layer. Highest-volume consideration keyword. |
| 2 | **AgoraXR vs ArborXR** | You vs competitor | `/compare/agoraxr-vs-arborxr` | ArborXR = best-in-class MDM for headsets. Honest: they win on pure fleet MDM breadth/maturity. You win on per-user accessibility, throughput/space optimisation, content+services, EU-first. "MDM manages devices; AgoraXR runs the experience for every person." |
| 3 | **AgoraXR vs ManageXR** | You vs competitor | `/compare/agoraxr-vs-managexr` | Same shape as #2; capture the second-biggest branded MDM search. |
| 4 | **Meta Quest for Business alternative (EU / accessibility)** | Singular alternative | `/alternatives/meta-quest-for-business` | For buyers who assumed the device maker's own tooling is enough. Angle: data sovereignty (EU vs US-hosted), device-agnostic (no lock-in), and the per-user accessibility model they structurally can't offer. |
| 5 | **ArborXR vs ManageXR** | Competitor vs competitor | `/compare/arborxr-vs-managexr` | Pure traffic play + authority. Genuinely helpful comparison of the two MDM leaders, then introduce AgoraXR as "the third option if you also need accessibility + throughput + content." Ranks for terms you'd never rank for otherwise. |
| 6 | **Building XR in-house vs a managed platform** | Alternatives (status quo) | `/compare/diy-xr-vs-managed-platform` | Targets the DIY buyer — your real #1 competitor. Total-cost-of-ownership framing: technician-per-headset staffing, per-app accessibility rebuilds, compliance risk. Pairs with the ROI calculator. |
| 7 | **XR content studio vs XR platform** | Alternatives | `/compare/xr-studio-vs-platform` | For the buyer about to commission a one-off bespoke experience. "One experience vs an operation you can run and scale." |

**Supporting infrastructure (per competitors skill):** build a centralised `/compare` hub page; keep a single YAML source of truth per competitor (positioning, honest strengths, where you win, migration notes); add FAQ schema ("What's the best alternative to [X]?"). **Honesty is non-negotiable** — concede where ArborXR/ManageXR are genuinely more mature at pure MDM; it's what makes the accessibility/throughput win believable and it's what ranks.

---

## 5. Content strategy — own three clusters no XR vendor owns: Accessible XR, XR ROI/Throughput, EU XR Compliance
**Priority: HIGH**

**Insight.** The site has no blog/resources/guides layer at all (router in app.js has no `/blog`, `/guides`, or `/resources` route). For a new-category product, content is how you *create* the demand that doesn't yet exist in search — and how LLMs learn to recommend you. Your three natural pillars map exactly to your three differentiators, and each is a topic **no incumbent owns** because MDM vendors don't care about accessibility and studios don't care about compliance.

**Proposed content pillars & clusters (hub-and-spoke):**

**Pillar A — Accessible XR at scale** *(your wedge; own this outright — searchable + shareable)*
- Hub: `/guides/accessible-xr` — "The complete guide to accessible XR for institutions."
- Spokes: What is XAUR (W3C XR Accessibility User Requirements) explained · EN 301 549 and XR: what's in scope · WCAG 2.1/2.2/3.0 and immersive media · Motion sickness / vestibular comfort in shared-headset deployments · Per-user vs per-app accessibility: why the app-by-app model fails at scale · Accessibility checklist for XR procurement · Captions, audio description & spatial subtitles in XR.
- *Why:* you already reference XAUR / EN 301 549 / XR Access on-site; you're one of very few vendors who can write authoritatively here. This is the cluster that gets you cited by LLMs and by the XR-accessibility community.

**Pillar B — XR ROI & throughput** *(the economic buyer; searchable + sales-enabling)*
- Hub: `/guides/xr-roi` — "How to make XR pay: throughput, utilisation, and cost-per-visitor."
- Spokes: The people-per-hour metric explained · Operator-to-headset ratio and why it decides your unit economics · Reducing first-timer drop-off (comfort = throughput) · Free ROI/throughput calculator (asset from #2) · Cost of a technician-per-headset model · LBE/attraction throughput benchmarks.

**Pillar C — EU XR compliance & data sovereignty** *(the risk/procurement buyer; searchable)*
- Hub: `/guides/eu-xr-compliance` — "XR compliance in the EU: accessibility, GDPR, and the EAA."
- Spokes: European Accessibility Act and XR: what public bodies must know · Web Accessibility Directive & XR · GDPR for immersive/biometric-adjacent data (eye/hand tracking, IPD) · EU AI Act and assistive AI features in XR · Data residency for institutional XR · Public-procurement accessibility requirements checklist.

**Pillar D — Sector playbooks** *(consideration + implementation; use-case content)*
- One playbook per sector, formula `[sector] + XR deployment`: "Deploying XR in museums: a practical playbook," "Standing up a university XR lab," "XR simulation in job centres," etc. These are searchable long-tail, map 1:1 to your existing sector pages, and are natural case-study containers.

**Priority BD assets to build first (pipeline-weighted):**
1. **ROI / throughput calculator** (Pillar B) — highest-intent, gates demos, arms sales. *Build first.*
2. **"Accessibility spec sheet"** — you already CTA to it (`Get the accessibility spec sheet`) but it doesn't exist as content; make it a real gated PDF mapping Attune's 9 categories to XAUR / EN 301 549 clauses. Doubles as procurement collateral.
3. **XR accessibility procurement checklist** (Pillar A/C) — gets you into RFPs; a buyer who downloads your checklist writes your criteria into their tender.
4. **Sector case-study template** — every sector page has a case-study placeholder (app.js `Case study — [sector]`). Ship a repeatable Challenge → Solution → Results (with the number) → Learnings template so studies drop in the moment a pilot clears.
5. **EAA / EN 301 549 "is your XR in scope?" explainer** (Pillar C) — shareable, fear-and-duty driven, positions you as the informed guide.

---

## 6. Objection handling & risk reversal — strong on data/compliance, weak on category, procurement, and price
**Priority: MEDIUM-HIGH**

**Insight.** The copy handles the *data sovereignty* and *EU compliance* objections very well (three storage options, offline, auditable trail, "nothing leaves or enters without permission" — repeated consistently and convincingly). It handles the *vendor-sprawl* objection well ("no stitching together five vendors"). But three of the four biggest objections for a **new-category, high-consideration purchase** are barely addressed:

- **"This is a new, unproven category — is it real?"** — Only social-proof placeholders exist (logo row, case studies "collect here as they clear"). The `home.logos.credibilityLine` even *claims* "In deployment across museums, classrooms, and training floors" while every case study is a placeholder — a risky honesty gap if untrue. No founder story, no named pilots, no proof-of-existence beyond the interactive Attune demo (which is good but is a toy, labelled "an illustration of the idea").
- **"How hard is procurement / rollout? What's the commitment?"** — No pilot offer, no phased on-ramp, no "start with one room" framing surfaced (Consultancy hints at "scoping a first pilot" but it's buried in a service page). No implementation timeline, no migration path.
- **"What does it cost?"** — No pricing page and no pricing philosophy at all. Institutional buyers need at least a *shape* (pilot pricing, per-site, per-headset, subscription vs capex) to size a business case and get budget approval.

**On-site evidence.**
- `pages.trust.data.*` and `home.trustStack.*` — excellent, thorough risk reversal on data/compliance.
- Every proof surface is a placeholder: app.js sector "Case study" `ph`, homepage "Partner logo row" `ph`, "Throughput stat" `ph`.
- `home.logos.credibilityLine`: "In deployment across museums, classrooms, and training floors." — asserts traction the placeholders contradict.
- No `/pricing` route in the router; no pilot/guarantee/trial language anywhere.

**Why it matters for BD.** For a new category the dominant buyer emotion is *risk of looking foolish for backing something unproven*. You must de-risk the first step, not just the data handling.

**Recommendation.**
- **Add a low-commitment on-ramp as an explicit offer:** a named **"Pilot in one room / one gallery"** package — fixed scope, fixed price band, clear timeline (e.g. "live in X weeks"), success criteria defined up front. Surface it on the homepage and every sector page, not just Consultancy. This is the single strongest risk-reversal move for a new category.
- **Add founder/origin credibility** (an About "why we exist" story is thin — the "agora" value is nice but abstract). Who built this, what they saw, why now. Named humans reduce category risk.
- **Fix the traction-claim honesty gap:** if you don't yet have live deployments, change `credibilityLine` to a forward/honest frame ("Built for museums, classrooms, and training floors") until real logos clear. The rest of the site is scrupulously honest (counsel notes, "never fabricate logos" placeholders) — this one line breaks that discipline and is a legal/credibility risk.
- **Add pricing signalling** even without a full pricing page: a "How pricing works" band (pilot → per-site/per-headset → scale; capex vs subscription; hardware optional because device-agnostic). Removing the "I can't even size this" objection unblocks budget conversations.
- **Add an FAQ / objections section** (also feeds FAQ schema for SEO) covering: is this a real product / who's using it, what does a pilot cost, how long to deploy, does it work with our existing headsets (device-agnostic — a strength you under-sell as an objection-killer), what about our IT/security review, do we need our own content.

---

## 7. Naming & category — "XR infrastructure for institutions" is good but generic; consider owning the wedge in the category name
**Priority: MEDIUM**

**Insight.** The hero eyebrow claims the category: **"XR infrastructure for institutions."** It's a defensible, ownable frame — "infrastructure" signals seriousness and scale, "institutions" signals the ICP. But it's *category-generic*: it describes the ops-hub half and says nothing about the wedge. An MDM vendor could use the identical line. A category name is a positioning asset; yours currently names the table-stakes half of your product, not the differentiated half.

**On-site evidence.**
- `hero.eyebrow`: "XR infrastructure for institutions."
- `pages.about.sub`: "AgoraXR is an EU-based XR infrastructure and services company."
- The differentiator (per-user accessibility at scale) never appears in the category label.

**Why it matters for BD.** The category you name is the category you get compared in. If you claim "XR infrastructure," you get benchmarked against ArborXR/ManageXR on MDM features — a fight where you're less mature. If you name a category that centres accessibility-at-scale, you define the comparison on the axis where you're uncontested.

**Recommendation.** Keep "XR infrastructure for institutions" as the *plain-English what-it-is* (it aids comprehension and SEO), but layer a **wedge-owning category line** as the positioning statement:
- Options to test:
  - **"The accessible-XR platform for institutions"** / "Accessible XR at scale." — centres the wedge; hard for anyone to co-opt.
  - **"XR infrastructure that includes everyone."** — keeps infrastructure, adds the wedge.
  - **"Run XR at scale — for every body and mind."** — sharper "everyone."
  - Category coinage (bolder, shareable): **"the inclusion layer for XR at scale"** or position AgoraXR as owning **"operational accessibility"** for XR — a phrase you can define and own the way "observability" or "headless" were coined. The Trust page already does the conceptual work ("turning it from a per-app developer burden into part of how you run the space") — name it.
- Whatever you pick, make the category name carry the wedge. Let comparison pages (#4) and the ops-hub content satisfy the "is it also real infrastructure?" check.

---

## Appendix A — Competitor comparison page set (build order)
1. `/compare/xr-fleet-management-tools` — plural alternatives (framework + honest list) — **build first, highest volume**
2. `/compare/agoraxr-vs-arborxr` — you vs competitor
3. `/compare/agoraxr-vs-managexr` — you vs competitor
4. `/alternatives/meta-quest-for-business` — singular alternative (EU + accessibility angle)
5. `/compare/arborxr-vs-managexr` — competitor vs competitor (traffic + authority)
6. `/compare/diy-xr-vs-managed-platform` — status-quo alternative (pairs with ROI calculator)
7. `/compare/xr-studio-vs-platform` — studio alternative
+ `/compare` hub, centralised per-competitor YAML, FAQ schema. Honesty throughout.

## Appendix B — Content-cluster map
```
A. Accessible XR at scale            [WEDGE — own outright]
   hub: /guides/accessible-xr
   ├─ XAUR explained
   ├─ EN 301 549 & XR scope
   ├─ WCAG 2.1/2.2/3.0 & immersive media
   ├─ Per-user vs per-app accessibility (why app-by-app fails)
   ├─ Vestibular comfort on shared headsets
   ├─ Captions / audio description / spatial subtitles in XR
   └─ XR accessibility procurement checklist  ★ gated asset

B. XR ROI & throughput               [economic buyer]
   hub: /guides/xr-roi
   ├─ People-per-hour metric
   ├─ Operator-to-headset ratio & unit economics
   ├─ First-timer drop-off = lost throughput
   ├─ Cost of technician-per-headset
   └─ ROI / throughput calculator  ★ build FIRST

C. EU XR compliance & sovereignty    [risk/procurement buyer]
   hub: /guides/eu-xr-compliance
   ├─ EAA & XR: what public bodies must know
   ├─ Web Accessibility Directive & XR
   ├─ GDPR for eye/hand-tracking data
   ├─ EU AI Act & assistive AI in XR
   └─ Data residency for institutional XR

D. Sector playbooks                  [use-case, 1:1 with sector pages]
   museums · education · training/job-centres · enterprise · healthcare · events/LBE · travel
   + repeatable case-study template ★

Cross-links: every cluster → relevant comparison page (Appendix A) → demo / calculator / spec-sheet CTA.
```

## Appendix C — Quick copy fixes (low effort, do now)
- Kill the false ROI stat: replace `"9 · 60+"` under "the number that pays for XR" with the operator-leverage ratio (`1 : 20+`, "one operator, a room full of headsets").
- Fix `home.logos.credibilityLine` traction claim if deployments aren't live yet (honesty discipline).
- Make "Get the accessibility spec sheet" CTA point to a spec sheet that exists.
- Standardise the two-part framing to "Run it / Include everyone"; retire "spines" from buyer-facing copy.
- Never let "Attune" appear without "the accessibility & comfort layer" on first use in a context.
