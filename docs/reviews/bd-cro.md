# AgoraXR — BD / CRO Recommendations

Reviewer lens: conversion-rate optimization for a considered, high-ticket, demo-led B2B sale (institutions). Primary conversion actions: **Book a demo**, **Talk to us**, **Get the accessibility spec sheet**. No fabricated proof exists yet — recommendations respect that constraint and build credibility from what is genuinely available (EU compliance, standards alignment, methodology, founder expertise).

Sources reviewed: `js/data.js` (all copy), `js/app.js` (routing, page renders, CTAs, forms), `index.html` (footer/newsletter). Skills grounding: `cro/SKILL.md`, `cro/references/form.md`, `marketing-psychology/SKILL.md`.

**Overall verdict:** The site is unusually disciplined — clear value prop ("Run XR at scale — for everyone"), strong Jobs-to-Be-Done framing ("XR is easy to demo, it's hard to run"), honest placeholders, and a genuinely differentiating interactive Attune demo. The core weakness is the **conversion layer**: two of the three named conversion actions are effectively broken (the spec sheet and the "2-minute demo" both dead-end into the same demo form), there is no low-commitment offer for the long-consideration buyer, no lead qualification to protect BD's time, and the strongest available credibility levers (founder authority, compliance-risk loss-aversion, deployment methodology) are under-built or buried.

---

## QUICK WINS — implement now (hours, high certainty)

### QW1. The "Get the accessibility spec sheet" CTA is broken — it delivers a demo form, not a spec sheet
**Insight.** This is one of the three primary conversion actions and the single best low-commitment micro-conversion on the site — yet it doesn't exist as an asset. It is the clearest message-mismatch violation on the site (CRO SKILL §"message match"; form.md §"Value must exceed effort").
**Evidence.** `closingCTA('spec')` and multiple buttons link to `#/contact?topic=spec-sheet` (`app.js` L88–90, L210, L239, L339). But `PAGES.contact` only special-cases `topic==='barrier'` (`app.js` L519); every other topic renders the demo form with heading **"See AgoraXR running, live."**, note "we'll show you AgoraXR running…", and submit button **"Request my demo."** Confirmed by rendering `#/contact?topic=spec-sheet` — it shows "Book a demo / Request my demo," no mention of a spec sheet. A buyer who wanted a low-commitment PDF is instead asked to book a sales call.
**Recommendation.**
1. Make the contact page topic-aware. Add a `spec-sheet` branch that: swaps the heading, note, submit label, and success message; reduces the form to **email + optional name** (form.md §"Lead Capture — minimum viable fields, often just email"); and on submit delivers/emails the PDF.
   - Heading: *"Get the accessibility spec sheet."*
   - Sub: *"The 9 categories, 60+ settings, and how AgoraXR maps to W3C XAUR, EN 301 549 and WCAG 2.1 AA — one PDF. No call required."*
   - Button: *"Email me the spec sheet"*
   - Success: *"On its way — check your inbox. Want to see it running? Book a demo."* (peak-end + next-step nudge)
2. Produce the actual one-page spec sheet (this is a genuine, buildable authority asset — see Strategic S1).
**Psychology.** Reciprocity (give value first), foot-in-the-door / commitment-and-consistency (email now → demo later), zero-price/low-effort offer for not-ready buyers.

### QW2. "Watch the 2-minute demo" promises a video and delivers a booking form
**Insight.** The secondary hero CTA — the designated escape hatch for the not-ready buyer — is a broken promise, which erodes trust at the top of funnel (Fundamental Attribution Error: buyers who bounce here look "unqualified," but the cause is situational — you promised a video and asked for a meeting).
**Evidence.** Hero secondary CTA "Watch the 2-minute demo" links to `#/contact?topic=demo` (`app.js` L176); same in `closingCTA` (L87, L93), Agora Command (L361), mobile nav (L155). No video route or modal exists. The hero also has a video *placeholder* ("Hero demo film") that isn't wired to the CTA.
**Recommendation.** Either (a) wire it to an actual video (modal or `#/watch` route) even if it's a 90-second silent screen-capture loop for now, or (b) until the film exists, relabel to something the click can honestly fulfil, e.g. **"See how it works"** → the Platform page or the interactive Attune demo anchor. Never send a "watch" click to a form.
**Psychology.** Present bias / hyperbolic discounting — a not-ready buyer wants an immediate, zero-commitment payoff; give it to them and capture them later.

### QW3. Developer CTAs ("Read the docs", "Get the SDK") dead-end into the demo form
**Insight.** Developers are a distinct persona with distinct intent; routing them to "Request my demo" is a message-match failure and a wasted micro-conversion.
**Evidence.** SDK page buttons link to `#/contact?topic=docs` and `#/contact?topic=sdk` (`app.js` L419, L433); both render the demo form (only `barrier` is branched). Rendered result: "See AgoraXR running / Request my demo."
**Recommendation.** Give these topics their own branches: `docs` → a docs landing (or "notify me when docs are live" email capture); `sdk` → "Get early SDK access" email capture. At minimum, change the heading/button so the page matches the click ("Get the SDK," "Notify me").

### QW4. Contact form captures `topic`/`sector` in the URL but never uses `topic` to tailor the page
**Insight.** The routing data is already there; the page just ignores it. Tailoring the demo page per entry point is nearly free and lifts completion (message match + relevance).
**Evidence.** `parseHash` parses `query` and passes it in; `PAGES.contact` reads `topic` and `sector` (`app.js` L518) but only uses `topic` for the barrier fork and `sector` to preselect the dropdown. Topics `services`, `content`, `consultancy`, `workshops`, `hardware` all render the identical generic demo form.
**Recommendation.** Introduce a small topic→copy map (heading, sub, submit, "what happens next" list). E.g. `topic=services`/`consultancy` → heading *"Talk to us about your deployment,"* submit *"Start the conversation."* Reuse the existing form; just vary the framing. This also fixes the consultative sectors (see HI2).

### QW5. Footer newsletter has no value proposition or consent line — the contact-page version does
**Insight.** The site-wide capture point (footer, on every page) is the weakest-framed version; the buried one (contact sidebar) is the well-framed one. Inconsistent, and the higher-traffic instance under-converts.
**Evidence.** Footer form (`index.html` L69–73) is just an email field + "Keep me posted," no value line, no consent. The contact-page newsletter (`data.js` `newsletterForm`) has a strong value prop ("XR at scale, minus the hype") and consent ("We'll only email you about AgoraXR, and you can leave anytime").
**Recommendation.** Port the `newsletterForm.heading`/`note`/`consent` copy into the footer block. Add the one-liner above the field and the consent microcopy below (form.md §"Trust and friction reduction — no spam, unsubscribe anytime").

### QW6. The homepage credibility line risks being an untrue claim
**Insight.** For a just-built site with (presumably) no live deployments, "In deployment across museums, classrooms, and training floors" and "Trusted by the places people already visit" read as social proof that may not be real — the exact fabrication the rest of the site scrupulously avoids. If untrue, it's both an integrity risk and, once noticed, a trust-killer (Pratfall Effect works only when the flaw is honest).
**Evidence.** `data.js` `home.logos` (L328): eyebrow "Trusted by the places people already visit," credibilityLine "In deployment across museums, classrooms, and training floors," over an empty "Partner logo row" placeholder (`app.js` L185–187).
**Recommendation.** If deployments aren't live, swap for honest authority-based credibility that IS true today:
   - Eyebrow: *"Built on the standards that define accessible XR"*
   - Line: *"Designed around W3C XAUR, aligned to EN 301 549 and WCAG 2.1 AA — EU-based and EU-hosted."*
   Keep the logo row placeholder for later. This converts an empty social-proof slot into a live authority signal.

---

## HIGH-IMPACT — prioritize (days; meaningful funnel lift)

### HI1. There is no low-commitment offer for the not-ready buyer — the funnel is "read pages → book a demo"
**Insight.** In a considered, high-ticket sale the buyer needs ~7 touches (Rule of 7) and months of consideration, but the site offers essentially one real conversion (a high-commitment demo) plus a newsletter. The gap between "interested" and "ready to meet sales" is unbridged, so warm-but-early leads leak away uncaptured. The Attune interactive demo already generates engagement — but that engagement is never converted into a contact.
**Evidence.** Every page ends in `closingCTA` pointing at the demo (`app.js` L251, L286, L353, etc.). Spec sheet (broken, QW1) and newsletter are the only sub-demo offers. The rich interactive `attuneDemo` (`app.js` L54–58) has no capture attached after interaction.
**Recommendation.** Build a **laddered offer set** so every intent level has a next step (BJ Fogg: prompt at the moment of motivation):
   - **Compliance self-check** (highest-value magnet — see HI3).
   - **Accessibility spec sheet** (fix QW1).
   - **Recorded 2-minute demo** (fix QW2) — ungated, then retarget.
   - **Buyer's / deployment guide** (see S1).
   - After a user interacts with the Attune demo, surface a contextual inline CTA: *"Like what you configured? Get the full spec sheet →"* (commitment-and-consistency: they've already invested effort — IKEA effect).
**Psychology.** Foot-in-the-door ladder; each rung a smaller ask that pre-commits the next.

### HI2. High-value enterprise & healthcare leads are not qualified or routed differently
**Insight.** For a consultative sale, BD's scarcest resource is time; treating a healthcare system's IT buyer identically to a single-classroom enquiry means no lead prioritization and slow response to the biggest deals. The site currently makes all leads look identical.
**Evidence.** Enterprise and healthcare are flagged `consultative:true` (`data.js` L124, L132) and their closing CTA is `'talk'` → `#/contact?topic=services` (`app.js` L300) — but that route loses the sector and renders the same generic demo form (4 fields, no qualification). The form has **no role/title, no scale (sites/headsets/visitors), no timeline, no phone/preferred-contact** (`app.js` L531–539). Nothing distinguishes a €500k enterprise rollout from a demo-curious student.
**Recommendation.**
   1. Preserve context on consultative routes: link to `#/contact?topic=enterprise&sector=enterprise` so the sector preselects and the copy adapts.
   2. Add **light qualification** without killing completion — 1–2 optional selects placed *after* the easy fields (form.md §"sensitive fields last," progressive commitment):
      - *Role* (optional): Operations / IT & Security / Procurement / Academic / Clinical / Other.
      - *Scale* (optional): "Roughly how many people would use it?" (< 100 / 100–1,000 / 1,000+ / Not sure).
      - *Timeline* (optional): Exploring / This year / This quarter.
   3. For enterprise/healthcare topics, add an optional **phone + preferred contact** and a "priority response" reassurance ("Enterprise enquiries: we reply same business day"). Keep these fields optional so volume leads still convert.
   4. Route on submit (even if just a hidden `lead_tier` field) so BD sees enterprise/healthcare first.
**Psychology.** EAST (Timely) + reduces BD's Fundamental Attribution Error by surfacing situation (scale, timeline) instead of guessing intent.

### HI3. The strongest persuasion lever — accessibility as a compliance/legal *risk* — is buried and never packaged as an offer
**Insight.** Loss aversion is ~2× more motivating than gain (marketing-psych §"Loss Aversion / Prospect Theory"). For institutional buyers, the sharpest loss is regulatory/procurement exposure: an inaccessible XR exhibit is a liability under the Web Accessibility Directive / European Accessibility Act. The site *has* this argument but states it softly and hides it on the Trust page. It should be a headline BD hook and a lead magnet.
**Evidence.** The compliance-risk case lives only in `pages.trust.accessibility.p2` (EAA, Web Accessibility Directive, procurement rules — `data.js` L271) and in the museum `why` ("isn't an exhibit. It's a liability." L100). It appears in no hero, no closing CTA, and no gated asset. The signals/badges frame EAA as "regulatory direction, not a current XR mandate" (L281) — accurate, but it soft-pedals the one thing that creates urgency.
**Recommendation.**
   1. Create a gated **"Is your XR EAA-ready? A 10-point accessibility & compliance checklist"** (or "The institutional buyer's accessibility risk checklist"). This is a real, defensible asset built from standards you already cite — no fabrication needed.
   2. Promote it in sector "why" blocks and as an alternative closing CTA on Trust, Attune, Museums, Education, Healthcare.
   3. Sharpen one line in the hero-adjacent or throughput area toward the loss frame, e.g. *"An exhibit a wheelchair user or low-vision visitor can't experience isn't an exhibit — it's a liability. Attune closes that gap by default."* (Reuse the museum line more widely.)
**Psychology.** Loss aversion + regret aversion + authority (standards citations). Keep it honest — frame as "the duties you already carry, and the ones clearly coming," which the copy already does well.

### HI4. No objection handling: no FAQ, no "how deployment works," no "which is right for me"
**Insight.** Considered buyers de-risk by resolving objections: *Will it work in my space? How hard is implementation? What does a pilot look like? How does pricing work? What about our existing headsets?* The CRO framework flags objection handling and friction as core. Right now these are unanswered, so the buyer must book a call just to ask basic scoping questions — raising the activation energy of every conversion.
**Evidence.** No FAQ section anywhere in `data.js`/`app.js`. No pricing model explainer. The only process transparency is the 3-item "What happens next" list on the contact page (`app.js` L543–547). "Which solution is right for me?" anxiety is unaddressed across 7 sectors + platform + services.
**Recommendation.**
   1. Add an **FAQ** block (Trust page and/or sector pages) answering the top objections: device lock-in (you're device-agnostic — say it louder), offline/data residency, pilot vs. full rollout, "do we need a technician per headset" (no — reinforce the "one operator runs the room" proof), how pricing works (model, not numbers: pilot → scale).
   2. Add a lightweight **"How a deployment works"** methodology (scope → pilot → deploy → scale) — this is buildable now and directly reduces implementation-difficulty and risk objections.
**Psychology.** Reduces activation energy and status-quo bias ("make the transition feel safe"); COM-B "Opportunity" (clear path).

### HI5. Leverage the interactive Attune demo as a conversion event, not just a showpiece
**Insight.** The "Try Attune" live control panel (`app.js` L43–58) is the site's best experiential proof and its only interactive asset — it triggers the endowment/IKEA effect (users configure "their" settings) and pre-empts the "will this actually work?" objection better than any copy. But it currently leads nowhere; the engagement is wasted.
**Evidence.** `attuneDemo` renders on home, sector, and Attune pages with no post-interaction CTA tied to the interaction. The generic closing CTA sits far below.
**Recommendation.** Attach a contextual micro-CTA directly beneath the demo panel: *"That's Attune with seven settings. The full layer has 60+. Get the spec sheet →"* (spec-sheet capture) or *"See it configuring real headsets — book a demo."* Consider a subtle "you changed N settings" acknowledgment to deepen the commitment.

---

## STRATEGIC — bigger bets (weeks; compound value, especially given zero customer proof)

### S1. Build a credibility stack from what's true TODAY: founder authority + methodology + standards, in place of absent social proof
**Insight.** With no logos, testimonials, or case studies, the site must substitute the *other* trust primitives. The CRO/psych playbook offers three that need no customers: **Authority** (standards, credentials, expertise), **Reciprocity** (free useful assets), and **process transparency** (methodology). The site already nails standards-authority; it is missing **founder/team authority** and **methodology** entirely — and those are the two most persuasive levers available to an unproven high-ticket vendor.
**Evidence.** The About page (`data.js` `pages.about`) is all "what we do" — **no named people, no bios, no track record, no XR/museum/accessibility credentials, no XR Access Initiative membership, no published work or talks.** Standards authority is strong (XAUR, EN 301 549, WCAG, EU AA) but concentrated on Attune/Trust. No methodology page exists.
**Recommendation.** Build, in priority order:
   1. **Founder/team section** on About: names, faces, relevant credentials (years in XR, accessibility, museums/institutions), why-we-built-this story. This is the highest-leverage trust asset a pre-revenue B2B company has (Authority + Liking/Similarity + Unity — "built by people who've run rooms like yours").
   2. **Methodology / "How we deploy"** page (scope → pilot → deploy → scale, with what the institution owns at each step) — doubles as objection handling (HI4) and as sales-enablement.
   3. **The standards mapping as a downloadable asset** (the spec sheet, QW1/HI1) — turns your genuine expertise into a reciprocity magnet.
   4. As pilots land, a **"Founding partners / design-partner programme"** framing lets you use early customers as credibility *before* full case studies clear — honest scarcity ("we're taking a limited number of founding deployments in 2026").
**Psychology.** Authority bias, Liking/Similarity, Unity, Reciprocity, and (for founding-partner) honest scarcity + mimetic desire.

### S2. Instrument the funnel — you cannot optimize what you don't measure
**Insight.** Every recommendation above is a hypothesis; a considered B2B funnel with low absolute volume needs event tracking more than A/B tests (traffic will be too thin for significance early). CRO §Measurement and form.md §Measurement both start here.
**Evidence.** No analytics/event hooks in `app.js`; forms just show a success state client-side (L697–715) with no submission handler, no dataLayer, no field-level tracking. `route:rendered` event is dispatched (L635) but unused.
**Recommendation.** Add lightweight event tracking: page/route views, CTA clicks (by label + destination), Attune-demo interactions, form starts, field drop-off, and submissions by topic/sector/lead-tier. Wire the forms to a real backend/CRM. This makes the demo-vs-spec-sheet-vs-newsletter mix, and the enterprise-routing (HI2), measurable and improvable. North Star: qualified demo requests per month.

### S3. Add a mid-funnel nurture path (the sale is months long; one email list isn't a nurture)
**Insight.** Rule of 7 + long consideration means most captured leads won't be sales-ready for weeks. A single "occasional updates" newsletter doesn't move them down-funnel. Compounding/flywheel value comes from a deliberate sequence.
**Evidence.** Only capture-to-nurture asset is the newsletter (`data.js` `newsletterForm`). No content hub, no sequenced follow-up, no retargeting hooks.
**Recommendation.** After the low-commitment magnets exist (HI1/HI3), add a short nurture sequence per persona (museum, enterprise IT, training ops) that delivers the spec sheet/checklist, then the methodology, then a demo invite — matching the AIDA stages. Seed a small resource/insights hub ("XR at scale, minus the hype") to give the newsletter something to point at and to compound SEO/authority over time.

---

## TOP 6 (one line each)
1. **Fix the spec-sheet CTA** — make the contact page topic-aware and deliver a real gated PDF via an email-only form; today it dead-ends into "Request my demo." (QW1)
2. **Fix "Watch the 2-minute demo"** — wire it to an actual video/Platform page, not the booking form; stop breaking the top-of-funnel promise. (QW2)
3. **Add a low-commitment offer ladder** (compliance checklist, spec sheet, recorded demo) so not-ready buyers convert instead of leaking. (HI1/HI3)
4. **Qualify & route enterprise/healthcare leads** — add optional role/scale/timeline fields and preserve sector context, so BD prioritizes the biggest deals. (HI2)
5. **Lead with accessibility-as-compliance-risk** (loss aversion) — surface the EAA/liability frame in heroes and package it as a gated checklist. (HI3)
6. **Build founder authority + a "how deployment works" methodology** to replace absent social proof with the two trust levers available today. (S1)
