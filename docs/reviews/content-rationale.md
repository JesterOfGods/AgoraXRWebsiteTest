# AgoraXR content rationale — "Humanist Immersive" rework

**Goal:** keep every substantive point and factual specific, but cut density —
the #1 complaint. Warmer, calmer, plainer. Short sentences. Point-first blocks.

## What I tightened and why

**Hero.** The old sub packed two ideas into one long sentence ("makes your space
XR-ready and gives you one system to deploy, run, and scale…"). Split into three
short statements so the value prop lands before the reader tires. Emphasis moved
to the human word — *everyone* — matching the tone. Kept EU-based/EU-compliant
and all three trust tags verbatim.

**Pillars.** Bodies cut to 1–2 sentences each. Pillar 1's heading was a mouthful
("XR-ready spaces, one system to run them") → "One system runs the whole room."
Payoffs shortened to fragments that read like takeaways, not clauses. Attune
(the featured pillar) keeps its full 9-category detail but in a tighter frame.

**Sectors.** Every `sub`, `why`, and `attune` paragraph was front-loaded so the
first sentence is the point and the rest is support. `gets` bullets stripped of
lead-in filler ("A turnkey way to deploy and rotate XR exhibits — no technician
per headset" → "Deploy and rotate exhibits without a technician per headset").
Meaning and specifics unchanged. **Healthcare `legal` is the exact original
string** — untouched, per instruction.

**Platform.** Subs trimmed; `does`/`paths`/`body` micro-copy tightened
(e.g. Consultancy body opens with the reader's situation: "Scoping a first pilot
or scaling across sites?"). All structure — does[], paths[], payoff, media —
preserved so existing render functions still map cleanly.

**Categories.** All 8 kept plus Horizon (cat 09) as a distinct object. Bodies
lightly compressed; dashes replace some commas for scan-ability. Every setting
name retained (IPD, diopter, tremor smoothing, spatialised subtitles, etc.).

**Pages.** Developers/Trust/About/Contact broken into named sub-objects
(headings, bodies, bullets, CTAs) instead of one HTML blob, so copy is editable
without touching markup. The two **"pending EU counsel review" mono notes** are
preserved verbatim as `counselNote`. All standards references (XAUR, EN 301 549,
WCAG 2.1 AA / 2.2 / 3.0, EAA, Web Accessibility Directive, EU AI Act) kept intact
with their `<strong>` emphasis.

## Messaging improvements

- **Clearer value prop up front:** hero and each sector now state the outcome in
  sentence one; supporting detail follows. Less to read before the payoff.
- **Consistent human verbs:** "welcome," "include," "keep them in the experience"
  — warmth without hype. Removed hedge/filler words ("actually," "the whole").
- **Scannability:** bullets are now parallel imperatives; long compound sentences
  split; em-dash asides reduced. Density drops without losing a single fact.
- **Warmer 404 + edge copy:** "No harm done — the way back is easy."
- **Structured for reuse:** a single `CONTENT` object with `closingCTA`, `home`,
  and `microcopy` extracted so repeated strings live in one place.

All facts preserved: nine categories · 60+ settings, EU-based/EU-hosted,
offline-from-a-laptop/phone, device-agnostic, three storage options, one-line
Attune integration, auditable trail, GDPR by design.
