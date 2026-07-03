/* =============================================================================
   AgoraXR — data & content module
   Plain global (no ES modules) so index.html also works when opened via file://.
   Exposes: window.ICONS, window.ic(), window.CONTENT
   Copy: "Humanist Immersive" deck. Marked legal/counsel wording is verbatim and
   still pending EU counsel sign-off before publication.
   ========================================================================== */
(function (root) {
  "use strict";

  /* ---------- inline SVG icon set (stroke = currentColor) ---------- */
  var I = function (p, vb) {
    return '<svg viewBox="' + (vb || '0 0 24 24') + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  };
  var ICONS = {
    deploy: I('<path d="M4 4h16v5H4zM4 15h16v5H4zM8 6.5h.01M8 17.5h.01"/><path d="M12 9v6"/>'),
    control: I('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/>'),
    fleet: I('<rect x="3" y="4" width="7" height="6" rx="1.2"/><rect x="14" y="4" width="7" height="6" rx="1.2"/><rect x="3" y="14" width="7" height="6" rx="1.2"/><rect x="14" y="14" width="7" height="6" rx="1.2"/>'),
    optimize: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    ticket: I('<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/><path d="M13 6v2M13 16v2"/>'),
    attune: I('<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/><path d="M8 15c2-1.5 6-1.5 8 0M16 9c-2 1.5-6 1.5-8 0"/>'),
    vision: I('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    ear: I('<path d="M6 10a6 6 0 1 1 12 0c0 3-2 3.5-2 6a2.5 2.5 0 0 1-5 0"/><path d="M9 10a3 3 0 0 1 6 0"/>'),
    motor: I('<circle cx="12" cy="5" r="2"/><path d="M12 7v6M8 10l4-1 4 1M9 21l3-8 3 8"/>'),
    brain: I('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8M12 4v14"/>'),
    input: I('<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 11h.01M10 11h.01M14 11h.01M7 14h10"/>'),
    environment: I('<path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-5h6v5"/>'),
    horizon: I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
    shield: I('<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
    eu: I('<circle cx="12" cy="12" r="9"/><path d="M12 6l.7 1.6 1.7.2-1.3 1.2.4 1.7L12 10l-1.5.9.4-1.7L9.6 8l1.7-.2z"/>'),
    check: I('<path d="M20 6 9 17l-5-5"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    play: I('<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>'),
    chev: I('<path d="M6 9l6 6 6-6"/>'),
    people: I('<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>'),
    book: I('<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h12"/>'),
    cube: I('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>'),
    spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
    chat: I('<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>'),
    wifi: I('<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>'),
    building: I('<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M15 9h4a1 1 0 0 1 1 1v11M8 7h3M8 11h3M8 15h3"/>'),
    cap: I('<path d="M22 9 12 5 2 9l10 4 10-4z"/><path d="M6 11v5c0 1 2.5 3 6 3s6-2 6-3v-5"/>'),
    hospital: I('<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 8v6M9 11h6"/>'),
    ferris: I('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.5"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2 2M15.7 15.7l2 2M17.7 6.3l-2 2M8.3 15.7l-2 2"/>'),
    compass: I('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z"/>'),
    server: I('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>'),
    headset: I('<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2" y="13" width="5" height="7" rx="1.5"/><rect x="17" y="13" width="5" height="7" rx="1.5"/>'),
    layers: I('<path d="M12 3 2 8.5 12 14l10-5.5z"/><path d="M2 13.5 12 19l10-5.5"/>'),
    lock: I('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
    handshake: I('<path d="m8 12 2 2 4-4 3 3 3-3M2 9l4-3 4 3M14 8l-2 2"/><path d="M6 6v6l3 3a2 2 0 0 0 3 0"/>'),
    text: I('<path d="M4 7V5h16v2M9 5v14M7 19h4"/>'),
    motion: I('<path d="M3 12h4l2-6 4 12 2-6h6"/>')
  };
  function ic(n) { return ICONS[n] || ICONS.spark; }

  /* sector nav icons (kept from the original mapping) */
  var SECTOR_ICONS = {
    museums: "cap", education: "book", training: "people", enterprise: "building",
    healthcare: "hospital", events: "ferris", travel: "compass"
  };
  var PLATFORM_ICONS = {
    "agora-command": "control", attune: "attune", content: "cube",
    consultancy: "compass", workshops: "cap", hardware: "headset"
  };

  /* =========================================================================
     CONTENT — "Humanist Immersive" copy deck. Facts preserved verbatim;
     healthcare `legal` and the two `counselNote` strings are exact and pending
     EU counsel sign-off before publication.
     ====================================================================== */
  var CONTENT = {
    hero: {
      eyebrow: "XR infrastructure for institutions",
      h1: "Run XR at scale — for {{everyone}}.",
      sub: "One system to deploy, run, and scale immersive experiences across your space. Comfortable and accessible for every visitor. EU-based, EU-compliant.",
      primaryCTA: "Book a demo",
      secondaryCTA: "Watch the 2-minute demo",
      tags: ["EU-based & EU-hosted", "9 categories · 60+ settings", "Works fully offline"]
    },

    pillars: [
      { name: "One system to run it all", h: "One system runs the whole room.",
        body: "Deploy content, control every headset live, and optimise your space for real throughput — from a single operations hub.",
        payoff: "More people per hour. That's utilisation, revenue, and impact.", feature: false },
      { name: "Comfortable for everyone", h: "Comfortable and accessible, by default.",
        body: "Our accessibility & comfort layer spans nine categories of human difference and auto-configures every headset to each user — from vestibular comfort and motor access to vision, hearing, and cognitive load. Built to keep expanding.",
        payoff: "First-timers stay in. People with disabilities are included by design.", feature: true },
      { name: "Yours, under EU rules", h: "Built and hosted under EU rules.",
        body: "EU-based and EU-compliant, end to end. For enterprise: nothing leaves — or enters — without your permission, with full visibility if it does.",
        payoff: "Trust and data sovereignty, by default.", feature: false },
      { name: "One partner, end to end", h: "One partner, from space to scale.",
        body: "Space, system, content, hardware, consultancy, and training — from a single team.",
        payoff: "No stitching together a stack of vendors.", feature: false }
    ],

    sectors: [
      { slug: "museums", nav: "Museums & Culture", eyebrow: "For museums & cultural institutions",
        h1: "Exhibit XR. Welcome everyone.", hook: "Turnkey immersive exhibits — comfortable for every visitor.",
        sub: "A turnkey way to show immersive work — and a comfortable way for every visitor to experience it, first-timer or lifelong gallery-goer.",
        why: "An exhibit that makes visitors queasy, or that a wheelchair user or low-vision guest can't experience, isn't an exhibit. It's a liability. AgoraXR runs the show; Attune makes it work for the whole audience.",
        gets: ["Deploy and rotate exhibits without a technician per headset.", "Comfort settings that keep first-timers immersed, not overwhelmed.", "Access built in: captions, audio description, motor and vision accommodations, applied per visitor."],
        attune: "In a gallery you never meet your audience twice. Each visitor carries their own comfort and access settings into whatever piece they pick up — so the queasy first-timer and the low-vision regular both get an exhibit that works.",
        cta: "See a museum deployment", related: ["content", "consultancy"] },
      { slug: "education", nav: "Education", eyebrow: "For schools & universities",
        h1: "An XR lab that's ready for every student.", hook: "A managed immersive lab, configured for every learner.",
        sub: "Stand up an immersive lab or bring XR into the classroom — managed, safe, and configured for every learner from day one.",
        why: "Institutions carry accessibility duties, and a classroom is the least forgiving place to leave a student out. AgoraXR manages the fleet; Attune makes sure the content meets every student where they are.",
        gets: ["One dashboard deploys lessons and controls every headset in the room.", "Comfort and safety settings suited to young and first-time users.", "Per-student access — motor, vision, hearing, cognitive — applied automatically."],
        attune: "A class is a room of different bodies and minds on shared hardware. Attune configures each headset to the student holding it — so a lesson lands for every learner, without the teacher tuning devices one by one.",
        cta: "See an education deployment", related: ["content", "workshops"] },
      { slug: "training", nav: "Training & Job Centers", eyebrow: "For training providers & job centers",
        h1: "Train more people, faster — and make it pay.", hook: "Immersive simulation at real throughput, including everyone.",
        sub: "Run immersive simulations at real throughput. The operations layer moves learners through efficiently; the access layer includes every one of them.",
        why: "Training only scales if throughput scales. AgoraXR optimises the space and the flow, so you train more people per day. Attune keeps every learner — including those with disabilities — in the simulation.",
        gets: ["Space and session optimisation for maximum learners per hour.", "Repeatable, controllable simulations across every station.", "Inclusion by default — no trainee left on the sidelines."],
        attune: "Job centres serve the widest possible range of people. A trainee's comfort and access needs are handled the moment they put a headset on — so the simulation works for everyone who walks in, not just the median user.",
        cta: "See a training deployment", related: ["workshops", "hardware"] },
      { slug: "enterprise", nav: "Enterprise", eyebrow: "For enterprises",
        h1: "Deploy XR on your infrastructure, your standards.", hook: "XR rollout with data that stays exactly where you say.",
        sub: "Roll out immersive training, simulation, and collaboration — with data that stays exactly where you say, and full visibility if anything moves.",
        why: "For enterprise buyers, control and data sovereignty come first. AgoraXR is EU-based and EU-hosted, runs on your infrastructure if you want, and lets nothing leave or enter without your permission.",
        gets: ["Deploy on your network — local servers, your rules, offline-capable.", "Nothing leaves or enters without approval, with an auditable trail.", "One operations hub for every headset across every site."],
        attune: "A workforce is as varied as the public. Attune folds accessibility and comfort into every deployment by default — so inclusion isn't a separate programme you run. It ships with the rollout.",
        cta: "Talk to us about enterprise", consultative: true, related: ["consultancy", "hardware"] },
      { slug: "healthcare", nav: "Healthcare", eyebrow: "For healthcare providers",
        h1: "Bring immersive care in — comfortably, accessibly, compliantly.", hook: "Managed immersive training, therapy support, and simulation.",
        sub: "Deploy immersive training, therapy, and simulation into care settings — with comfort and access handled for patients and staff alike.",
        why: "In care, comfort and inclusion aren't nice-to-haves. They're the point. AgoraXR runs the deployment; Attune tunes every session to the patient in front of you.",
        gets: ["Managed deployment of training, therapy, and simulation content.", "Comfort settings that keep vulnerable and first-time users at ease.", "Access across motor, vision, hearing, and cognitive needs.", "EU-based data handling suited to sensitive environments."],
        attune: "Patients arrive with a wide span of needs and sensitivities. Attune calibrates each session — movement, vision, hearing, pacing — to the individual, so an experience stays gentle and usable for the person in the chair.",
        legal: "Healthcare wording is limited to training, therapy support, and simulation. AgoraXR does not claim clinical efficacy, medical-device status, or regulatory clearance, and makes no claims of diagnosis or treatment outcomes. This wording is pending EU counsel review before publication.",
        cta: "Talk to us about healthcare", consultative: true, related: ["consultancy", "content"] },
      { slug: "events", nav: "Events & LBE", eyebrow: "For events & LBE venues",
        h1: "Turn any venue into an XR attraction.", hook: "Ticketing, throughput, and content — handled.",
        sub: "Ticketing, throughput, and content — handled. Light up a pop-up, a festival, or a permanent location, and move crowds through smoothly.",
        why: "Attractions live and die on throughput and reliability. AgoraXR handles ticketing, live control, and space optimisation so the line keeps moving. Attune keeps first-timers comfortable enough to come back.",
        gets: ["Ticketing and throughput optimisation built in.", "Live fleet control keeps every headset in the experience.", "Comfort settings that make XR approachable for a general-public crowd."],
        attune: "A queue at an attraction is a queue of first-timers. Attune keeps motion sickness and overwhelm down for a general-public crowd — the difference between one-and-done and coming back.",
        cta: "See an LBE deployment", related: ["content", "hardware"] },
      { slug: "travel", nav: "Travel & Tourism", eyebrow: "For travel & tourism operators",
        h1: "Immersive experiences anywhere — even with no internet.", hook: "XR on location — from a single laptop or phone as the server.",
        sub: "Deliver XR on location — on a boat, up a mountain, or at a remote site — from a single laptop or phone acting as the server.",
        why: "Tourism happens where connectivity often doesn't. AgoraXR runs fully offline from local hardware, so the experience works wherever your visitors are — and stays comfortable for every one of them.",
        gets: ["Fully offline — a laptop or phone can be the server.", "Managed content and live control, no connection required.", "Comfort and access configured per visitor, on the spot."],
        attune: "Your visitors are a cross-section of the travelling public. Attune configures comfort and access on the spot, on local hardware — so an experience up a mountain still works for the person who needs captions or gets motion sick.",
        cta: "See a travel deployment", related: ["hardware", "content"] }
    ],

    /* product spine (software you log into / build on) */
    product: [
      { slug: "agora-command", nav: "Agora Command", ddDesc: "run every headset from one screen", spine: "run",
        eyebrow: "Agora Command · operations hub", h1: "Run every headset from one screen.",
        sub: "Deploy content, control every device live, manage your fleet, and optimise your space for throughput — from a single operations hub.",
        does: [
          ["Deploy", "Push experiences to every headset at once, or update them on the fly.", "deploy"],
          ["Control live", "Start, stop, guide, and reset any session from one dashboard.", "control"],
          ["Manage the fleet", "See the status of every device, everywhere, at a glance.", "fleet"],
          ["Optimise the space", "Turn utilisation into a number you can improve — and move more people through.", "optimize"],
          ["Ticket and measure", "Handle entry and see what's really happening, with built-in analytics.", "ticket"]
        ],
        payoff: "One operator can run a room full of headsets. That's what makes XR affordable to run.",
        media: "Live dashboard capture — many headsets, one controller.", cta: "Book a demo" },
      { slug: "attune", nav: "Attune", ddDesc: "one profile, any headset · 9 categories", flagship: true, spine: "include" },
      { slug: "sdk", nav: "Developers & SDK", ddDesc: "build inclusive, deploy-ready XR", spine: "build" }
    ],

    /* services spine (people you hire) */
    services: [
      { slug: "content", nav: "Content", ddDesc: "we build it & we broker it",
        eyebrow: "Content", h1: "Something to run on day one.",
        sub: "We create immersive content — simulations, training, arts & culture, healthcare — and we broker it, connecting you to our network of XR creators for ready-made experiences.",
        paths: [
          ["We build it.", "Custom simulations, training, cultural, and healthcare experiences — made to run on AgoraXR and inclusive by default.", "cube"],
          ["We source it.", "AgoraXR Creators is a network of XR makers, so you can fill your space with proven content without commissioning from scratch.", "people"]
        ],
        cta: "Talk to us about content", fits: ["agora-command"], sectors: ["museums", "healthcare"] },
      { slug: "consultancy", nav: "Consultancy", ddDesc: "scope & scale",
        eyebrow: "Consultancy", h1: "Get XR right the first time.",
        sub: "Content, deployment, and research support for institutions, universities, researchers, and creators — from a team that does this daily.",
        body: "Scoping a first pilot or scaling across sites? We help you plan the deployment, choose the content, and set up the operation so it works in your actual space.",
        cta: "Talk to us", fits: ["agora-command", "attune"], sectors: ["enterprise", "education"] },
      { slug: "workshops", nav: "Workshops & Training", ddDesc: "own the capability",
        eyebrow: "Workshops & training", h1: "Make XR part of how you already work.",
        sub: "We teach your team to embed XR into the institution — so it becomes a capability you own, not a project you outsource forever.",
        body: "Hands-on workshops for your staff: running the operations hub, deploying content, using Attune, and folding XR into your existing programmes.",
        cta: "Book a workshop", fits: ["agora-command", "attune"], sectors: ["training", "education"] },
      { slug: "hardware", nav: "Hardware", ddDesc: "kit, if you want it",
        eyebrow: "Hardware", h1: "The kit, if you want it.",
        sub: "Headsets, networking, and local servers — supplied and set up, so you don't have to source and integrate a stack yourself.",
        body: "AgoraXR is device-agnostic, so you're never locked in. But if you'd rather not assemble the hardware, we'll provide and configure it — including the local server that lets everything run offline.",
        cta: "Talk to us about hardware", fits: ["agora-command"], sectors: ["travel", "training"] }
    ],

    categories: [
      { title: "Locomotion & vestibular comfort", icon: "motion", body: "Movement options — teleport, smooth, snap-turn, tunnel-vision vignetting, horizon lock — that prevent motion sickness and keep users grounded." },
      { title: "Motor, physical & interaction access", icon: "motor", body: "Seated, standing, and room-scale modes, full remapping, one-handed play, distance grabbing, and tremor smoothing — so any body can interact." },
      { title: "Advanced input methods", icon: "input", body: "Hand tracking, eye and gaze control, head-movement input, voice commands, and adaptive-controller support for users who can't use standard controllers." },
      { title: "Vision calibration & hardware interfacing", icon: "vision", body: "IPD, diopter, per-eye, and eye-dominance settings that tune the optics to each person's actual eyes." },
      { title: "Visual & UI accommodations", icon: "text", body: "UI scaling, high contrast, colourblindness filters, brightness, motion-blur and strobe toggles, and screen-reader support — legible and safe, including for photosensitivity." },
      { title: "Auditory & communication accommodations", icon: "ear", body: "Captions, spatialised subtitles, speaker identification, visual sound cues, independent channel volume, mono audio, and non-verbal communication tools." },
      { title: "Cognitive, pacing & gameplay accommodations", icon: "brain", body: "Assist modes, no-time-limit options, persistent waypoints, on-demand tutorials, pause-anywhere, and a calm reset for overwhelmed users." },
      { title: "Environmental & spatial awareness", icon: "environment", body: "Lying-down mode, instant passthrough, and customisable safety boundaries that bridge the physical and virtual safely." }
    ],
    categoryHorizon: {
      title: "Attune Horizon — next-gen & experimental", label: "CATEGORY 09 · FORWARD TRACK", icon: "horizon",
      body: "An active track for emerging assistive tech — brain-computer interfaces, haptic \"vision substitutes,\" thermal haptics, real-time AI scene description — that keeps closing the remaining gaps."
    },

    pages: {
      platform: {
        eyebrow: "The platform", h1: "Everything you need to run XR — in one system.",
        sub: "A full stack for institutional XR: an operations hub to run it, an accessibility & comfort layer to make it work for everyone, content to fill it, and the people to help you stand it up.",
        sub2: "Most XR \"platforms\" hand you a headset and a demo. AgoraXR hands you the whole operation — deployment, live control, throughput, inclusion, content, and support — from one team, under EU rules.",
        stackEyebrow: "How it fits together", stackHeading: "The AgoraXR stack",
        attuneCard: "Measures each user and auto-configures every headset — nine categories of comfort and access, applied at scale.",
        servicesBridge: "Need help standing it up? Content, consultancy, workshops, and hardware — from the same team."
      },
      attune: {
        eyebrow: "Attune · the accessibility & comfort layer", h1: "Configured once. Comfortable for everyone.",
        sub: "Attune measures each user's comfort and access needs and auto-configures whatever headset they pick up, across any experience you run. It's the difference between XR that works for some people and XR that works for everyone.",
        pillNote: "9 categories · 60+ settings · configured once · applied to any content · always expanding",
        previewNote: "An illustration of the idea — in a real headset these settings tune optics, audio, motion, and UI per user.",
        how: { eyebrow: "How it works", heading: "Set it once. It travels. Every headset adapts.",
          steps: [
            { h: "Set it once.", body: "A user picks their comfort and access needs — movement, vision, hearing, motor, cognitive, and more. Minutes to do, and it's theirs." },
            { h: "It travels.", body: "The profile lives where you choose — on the user's device, your local server, or our EU servers." },
            { h: "Every headset adapts.", body: "Pick up any device, launch any AgoraXR experience, and it's already configured to the person wearing it." }
          ] },
        covers: { eyebrow: "What it covers", heading: "Nine categories of human difference." },
        categoriesNote: { strong: "Nine categories. 60+ individual settings.", body: "Configured once, applied to any content — and always expanding. As XR hardware and assistive technology mature, new capabilities slot in, and Attune Horizon exists to absorb what's next." },
        fixes: { eyebrow: "Two things it fixes at once", heading: "Comfort and access, from one layer.",
          cards: [
            { h: "Comfort → fewer drop-offs", body: "First-timers on shared headsets are where XR loses people. Attune keeps them comfortable and in the experience — which is also throughput." },
            { h: "Access → real inclusion", body: "People with disabilities are configured in from the start, across every experience, without each developer solving it alone." }
          ] },
        standards: { eyebrow: "Standards & credibility", heading: "Designed around the benchmark for accessible XR.",
          body: "Attune is designed around the <strong>W3C XR Accessibility User Requirements (XAUR)</strong> — the benchmark for accessible XR — and aligned to <strong>EN 301 549</strong> and <strong>WCAG 2.1 AA</strong>, building toward <strong>WCAG 2.2</strong> as it becomes the EU baseline. We reference the <strong>XR Access Initiative</strong> and the wider field, because knowing the space is what makes \"we operationalised it at scale\" credible.",
          counselNote: "// conformance wording pending EU accessibility counsel review before go-live",
          primaryCTA: "Get the accessibility spec sheet", secondaryCTA: "Book a demo" }
      },
      developers: {
        eyebrow: "AgoraXR SDK", h1: "Build XR that's deployment-ready and inclusive from line one.",
        sub: "A Unity toolkit for multiplayer, colocated, device-agnostic XR — with one-line integration of the full Attune accessibility & comfort layer. Runs on a local network or online. Anything you build is ready to deploy at scale and inclusive by default. The SDK grows alongside the platform.",
        primaryCTA: "Read the docs", secondaryCTA: "Get the SDK",
        oneLine: { eyebrow: "One line, nine categories", heading: "Stop rebuilding accessibility per app.", body: "Add the full comfort & access layer with a single call. Attune handles the nine categories. You ship the experience." },
        toolkit: { eyebrow: "What's in the SDK", heading: "The toolkit.",
          items: [
            { h: "Multiplayer colocation", body: "Multiple users, one shared physical space, one shared virtual world.", icon: "people" },
            { h: "State machine & sequencer", body: "Structure complex, branching experiences and guided sequences.", icon: "control" },
            { h: "Analytics", body: "Instrument what users do and feed it back to the operations hub.", icon: "optimize" },
            { h: "Attune integration", body: "Add the full accessibility & comfort layer in one line, instead of rebuilding it per app.", icon: "attune", gold: true },
            { h: "Creator tools", body: "The utilities that make building for deployment faster.", icon: "cube" },
            { h: "Device-agnostic runtime", body: "Local network or online — no lock-in to one headset.", icon: "headset" }
          ] },
        why: { eyebrow: "Why build on AgoraXR", heading: "Three reasons, from a developer's side.",
          points: [
            "Accessibility stops being a per-app burden — <strong>Attune handles nine categories for you.</strong>",
            "Your content is <strong>deployment-ready</strong> for institutional operators from day one.",
            "<strong>Local-or-online, device-agnostic</strong> runtime means one build reaches more places."
          ],
          fieldNote: "Fluent in the field: we link to the <strong>W3C XAUR</strong>, the <strong>XR Access Initiative</strong>, and <strong>XR Association</strong> developer resources — because building accessible XR well means knowing the standards.",
          primaryCTA: "Read the docs", secondaryCTA: "Get the SDK" }
      },
      trust: {
        eyebrow: "Trust", h1: "Built to be trusted — with data, with compliance, with every visitor.",
        sub: "EU-based and EU-hosted. Designed for the accessibility duties institutions already carry, and for where EU rules are clearly heading.",
        demo: { eyebrow: "See it running", heading: "The fastest way to understand AgoraXR is to watch it work.", body: "Live control, real content, and Attune configuring headsets on the fly." },
        caseStudies: { eyebrow: "Proof, by sector", heading: "Case studies." },
        accessibility: { eyebrow: "Accessibility", heading: "Ahead of where accessibility is heading.",
          p1: "Accessibility isn't a feature we bolted on — it's the product. Attune is built around the <strong>W3C XR Accessibility User Requirements (XAUR)</strong>, the recognised benchmark for accessible XR, and aligned to <strong>EN 301 549</strong> and <strong>WCAG 2.1 AA</strong>, the standards that define digital accessibility in Europe today. As <strong>WCAG 2.2</strong> becomes the EU baseline, we're building toward it. And as the EU moves to formalise immersive accessibility — the draft <strong>WCAG 3.0</strong> now brings virtual and augmented reality into scope for the first time — AgoraXR is built for that direction of travel.",
          p2: "Public institutions already carry accessibility duties under the <strong>Web Accessibility Directive</strong>, national law, and public-procurement rules. Where XR is wrapped in a covered service — ticketing, e-commerce, a companion app — those parts fall in scope of the <strong>European Accessibility Act</strong>. AgoraXR is designed for the duties you already have, and the ones clearly coming.",
          honestFraming: { strong: "The honest framing.", body: "Device makers solve accessibility one headset, one app at a time. AgoraXR is the layer that configures accessibility and comfort <em>per user, across shared headsets, managed by the operator, at deployment scale</em> — turning it from a per-app developer burden into part of how you run the space." },
          counselNote: "// conformance claimed only where independently verified; all marked wording pending EU accessibility counsel review before go-live",
          barrier: { heading: "Found a barrier? Tell us.", body: "We want AgoraXR to work for everyone. If something doesn't, let us know and we'll fix it.", cta: "Report an accessibility barrier" } },
        signals: { eyebrow: "Compliance & standards", heading: "Trust signals.",
          badges: [
            { t: "EN 301 549 / WCAG 2.1 AA", body: "The European digital-accessibility baseline; building toward WCAG 2.2.", icon: "check" },
            { t: "W3C XAUR", body: "The XR-specific accessibility user requirements Attune is designed around.", icon: "attune" },
            { t: "GDPR", body: "EU data protection, by design.", icon: "lock" },
            { t: "EU-based & EU-hosted", body: "Infrastructure and hosting inside the EU.", icon: "eu" },
            { t: "EU Accessibility Act", body: "Referenced as regulatory direction, not a current XR mandate.", icon: "shield" }
          ],
          aiNote: { strong: "AI features.", body: "Attune Horizon's real-time AI scene description and any other AI features are assistive and human-overseen. Where EU AI Act obligations apply, we follow documented human oversight and quality controls. Scope to be confirmed by counsel before launch." } },
        data: { eyebrow: "Security & data handling", heading: "Your data, where you decide.",
          body: "Comfort and access profiles, and operational data, can live on the user's device, your local server, or our EU servers — your choice. For enterprise, nothing leaves or enters your environment without your permission, with full visibility if it does. Everything is built and hosted under EU rules.",
          checklist: [
            "<strong>Three storage options:</strong> on-device · your local server · AgoraXR EU servers.",
            "<strong>Enterprise control:</strong> approval required for anything in or out, with an auditable trail.",
            "<strong>Offline by design:</strong> runs with no connection at all when you need it to.",
            "<strong>EU throughout:</strong> built and hosted in the EU; GDPR by design."
          ] }
      },
      about: {
        eyebrow: "About AgoraXR", h1: "The system for running XR at scale — for everyone.",
        sub: "AgoraXR is an EU-based XR infrastructure and services company. We make institutional spaces XR-ready and give them one system — Agora Command, our operations hub — to deploy, run, optimise, and scale immersive content, with the throughput to make XR pay off.",
        whatWeDo: { eyebrow: "What we do", heading: "One partner, from space to scale.",
          p1: "Attune, our accessibility & comfort layer, measures each user and auto-configures every headset — so experiences stay comfortable for newcomers and accessible to people with disabilities, at scale and under EU rules. Beyond the platform, we create and source content through our creator network, supply hardware, and offer consultancy and workshops.",
          p2: "For developers, the AgoraXR SDK makes content multiplayer, colocated, device-agnostic, and inclusive by default.",
          badges: [
            { t: "Run", body: "Agora Command — deploy, control, and optimise your fleet.", icon: "control" },
            { t: "Include", body: "Attune — comfort and access for every visitor.", icon: "attune" },
            { t: "Under EU rules", body: "EU-based, EU-hosted, GDPR by design.", icon: "eu" }
          ] },
        values: { eyebrow: "Our values", heading: "What we believe.",
          cards: [
            { h: "Everyone in the square", body: "The agora was where the whole community gathered. XR should include every visitor by design — not as an afterthought.", icon: "people" },
            { h: "Outcomes over hype", body: "We say what the buyer cares about — more people served, more people included — and let the specifics carry the weight.", icon: "optimize" },
            { h: "Yours, and it stays yours", body: "Data sovereignty by default. You decide where profiles and operational data live.", icon: "lock" }
          ] }
      },
      contact: {
        eyebrow: "Book a demo", h1: "See AgoraXR running, live.",
        sub: "Tell us a little about your space, and we'll show you AgoraXR running real content, live control, and Attune configuring headsets on the fly.",
        demoForm: { heading: "Book a demo", note: "We'll be in touch within one business day.", submit: "Request my demo", success: "Thanks — we'll be in touch within one business day to set it up." },
        barrierForm: { heading: "Found a barrier? Tell us.", note: "We want AgoraXR to work for everyone. If something doesn't, let us know and we'll fix it.", submit: "Send report", success: "Thanks — we'll look into it and follow up." },
        newsletterForm: { heading: "XR at scale, minus the hype.", note: "Occasional updates on what we're shipping and what we're learning about running XR in the real world.", consent: "We'll only email you about AgoraXR, and you can leave anytime.", submit: "Keep me posted", success: "Thanks — you're on the list." }
      },
      notfound: { eyebrow: "404", h1: "This page wandered off.", sub: "No harm done. Try the solutions, the platform, or head home.", primaryCTA: "Head home", secondaryCTA: "Explore the platform" }
    },

    closingCTA: {
      eyebrow: "See it for yourself", heading: "See what your space can do.",
      body: "Book a walkthrough. We'll show you AgoraXR running real content, live control, and Attune configuring headsets on the fly.",
      primaryCTA: "Book a demo", secondaryCTA: "Watch the 2-minute demo"
    },

    home: {
      logos: { eyebrow: "Trusted by the places people already visit", credibilityLine: "In deployment across museums, classrooms, and training floors." },
      theJob: { eyebrow: "The real job", heading: "XR is easy to demo. It's hard to run.",
        body: "Most institutions can put a headset on one person. Running it for hundreds — deploying content, controlling every device, keeping first-timers comfortable, including every visitor, all without a technician per headset — is the real job. That's the job AgoraXR does." },
      spines: { eyebrow: "Two layers, one platform", heading: "One layer runs XR. The other makes sure everyone can use it.",
        run: { label: "Run it", name: "Agora Command", body: "Deploy content, control every headset live, and optimise your space for throughput — from a single operations hub.", payoff: "More people per hour.", cta: "Explore Agora Command", icon: "control" },
        include: { label: "Include everyone", name: "Attune", body: "Measures each user and auto-configures every headset — nine categories of comfort and access, applied at scale.", payoff: "First-timers stay in. Everyone's included.", cta: "How Attune works", icon: "attune" } },
      attuneIntro: { eyebrow: "Meet Attune", heading: "Every user is different. Every headset should be too.",
        body: "Attune is our accessibility & comfort layer. A visitor sets their comfort and access needs once — movement, vision, hearing, motor, cognitive, and more — and Attune configures whatever headset they pick up, across whatever you're running. Nine categories. 60+ settings. Configured once, applied everywhere, always expanding.",
        cards: [
          { h: "For first-timers", body: "Less nausea, less overwhelm — more people who finish the experience instead of taking the headset off.", icon: "people" },
          { h: "For inclusion", body: "People with disabilities are designed in from the start. Not retrofitted, not left out.", icon: "handshake" }
        ], primaryCTA: "How Attune works", secondaryCTA: "Get the accessibility spec sheet" },
      throughput: { eyebrow: "Throughput = ROI", heading: "The number that pays for XR: people per hour.",
        body: "AgoraXR optimises your physical space and your operation — not just your content — so more visitors move through in the same day. Utilisation, revenue, and impact, from the space you already have.",
        stat: "1 operator", statLabel: "runs a full room of headsets — the leverage that makes XR pay for itself.", cta: "Explore Agora Command" },
      sectorsIntro: { eyebrow: "Front doors", heading: "Built for the places people walk into." },
      trustStack: { eyebrow: "Trust & delivery", heading: "Yours, under EU rules — and delivered by one team.",
        dataBody: "EU-based and EU-hosted, end to end. Profiles and data can live on the user's device, your local server, or our EU servers — your call. For enterprise, nothing leaves or enters without your permission.",
        stackBody: "Space, system, content, hardware, consultancy, and training — from a single partner. No integrating five vendors to light up one experience.",
        dataCTA: "How we handle data & compliance", servicesCTA: "Explore Services",
        badges: [
          { t: "EU-based & EU-hosted", body: "Infrastructure and hosting inside the EU.", icon: "eu" },
          { t: "GDPR by design", body: "EU data protection, built in from the start.", icon: "lock" },
          { t: "Offline by design", body: "Runs with no connection at all when you need it to.", icon: "wifi" }
        ] },
      developersIntro: { eyebrow: "Building the content", heading: "Ship XR that's inclusive from line one.",
        body: "The AgoraXR SDK gives developers multiplayer colocation, state-machine and sequencer tools, analytics, and one-line integration of the full Attune layer — device-agnostic, local or online.",
        cta: "Explore the SDK" }
    },

    microcopy: {
      nav: { solutions: "Solutions", platform: "Platform", services: "Services", trust: "Trust", about: "About", bookDemo: "Book a demo",
        platformOverview: "Overview", platformOverviewDesc: "Everything you need to run XR, in one system",
        servicesOverview: "Overview", servicesOverviewDesc: "One partner, from space to scale",
        runHead: "Run it — operations", includeHead: "Include everyone — accessibility & comfort", buildHead: "Build on it", seeAllSolutions: "See all solutions" },
      footer: { solutions: "Solutions", platform: "Platform", services: "Services" },
      notFound: "This page wandered off. No harm done — the way back is easy."
    }
  };

  /* ---------- extended content: home wedge + pilot, comparison, guides, calculator ---------- */
  CONTENT.home.wedge = {
    eyebrow: "Why Attune is different",
    heading: "Accessibility, solved for the room — not one app at a time.",
    body: "Device makers solve accessibility one headset, one app at a time, and leave the rest to each developer. AgoraXR does it the other way round: Attune configures comfort and access <strong>per user, across shared headsets, managed by the operator, at deployment scale</strong>. For a public buyer, that's not just inclusion — it's less compliance risk on a duty you already carry.",
    points: [
      "One profile follows the person, not the device — so every headset in the room adapts to whoever picks it up, without a technician tuning each one.",
      "Built around the accessibility duties institutions already have — the Web Accessibility Directive, EN 301 549, and where the European Accessibility Act reaches — so scale doesn't multiply your exposure."
    ]
  };
  CONTENT.home.pilot = {
    eyebrow: "Start small",
    heading: "Pilot AgoraXR in one room.",
    body: "XR at scale is a new kind of purchase, so you shouldn't have to commit to it sight unseen. A pilot puts the whole operation — Agora Command and Attune — into a single space with your content and your visitors, so you can see the throughput and the inclusion for yourself before you scale. Honest scope, a fixed window, and a clear path to expand if it works.",
    includes: [
      "One room, set up with headsets, local server, and networking — offline-capable, configured by our team.",
      "Agora Command running live: deploy content, control every headset, and see utilisation as a number you can read.",
      "Attune configured per user across the shared headsets — comfort and access, on real visitors.",
      "One or two experiences from your programme, or sourced from our creator network.",
      "A hands-on session so your staff can run the room themselves, plus a short readout of what the pilot showed."
    ],
    timeline: "Roughly 4–6 weeks end to end: about a week to scope and configure, 2–4 weeks running live in your space, and a wrap-up session with the results.",
    priceBand: "Fixed pilot fee — from €___ (placeholder; scoped to your room and content). Credited toward a full deployment if you scale.",
    cta: "Start a pilot"
  };

  CONTENT.compare = {
    "managed-vs-diy": {
      eyebrow: "Build vs buy",
      h1: "Managed XR vs DIY: the honest trade-offs for institutions.",
      sub: "Running immersive experiences at scale is less about the headset and more about everything around it — deployment, live control, throughput, accessibility, compliance, and content. Here's what you actually take on when you build it yourself, versus when one platform runs the room.",
      intro: "Most institutions can put a headset on one person. The hard part is running it for hundreds — deploying content, controlling every device, keeping first-timers comfortable, including every visitor, and doing it without a technician standing behind each headset. There are two ways to get there. You can assemble it yourself: buy headsets, add a mobile-device-management layer, stitch together content from different makers, staff the floor, and solve accessibility app by app. Or you can run a managed platform, where one operator runs the whole space, accessibility and comfort are built in per user, and everything is hosted under EU rules. Neither is automatically right. This page lays out the trade-offs dimension by dimension, and is honest about where DIY is the better call.",
      table: {
        cols: ["Dimension", "DIY — build it yourself", "Managed platform (AgoraXR)"],
        rows: [
          ["Deployment", "You source headsets, set up a device-management (MDM) layer, and push builds device by device. Each new experience is another integration and another rollout to test across your fleet.", "One operations hub deploys content to every headset at once, or updates it on the fly. Space, system, hardware, and content from a single team — no vendor stitching."],
          ["Live control", "Whoever is on the floor manages sessions manually, headset by headset. Starting, stopping, guiding, and resetting a room of devices is hands-on and doesn't scale past a handful.", "Start, stop, guide, and reset any session from one dashboard, with the status of every device visible at a glance. Live control is the product, not an afterthought."],
          ["Throughput & staffing", "Realistically you need close to a person per headset to keep sessions moving, handle first-timers, and recover stuck devices. Staffing cost rises in lockstep with capacity.", "One operator can run a full room of headsets. That leverage — people per hour, not people per headset — is what makes XR affordable to run and lets you plan real capacity."],
          ["Accessibility", "Accessibility falls on each content maker to solve, one app at a time. Coverage is uneven, settings don't carry between experiences, and a visitor re-configures from scratch every time — if the option exists at all.", "Attune configures each user across any experience, on whatever headset they pick up. Nine categories and 60+ settings, applied per user, managed by the operator, at deployment scale."],
          ["Compliance & data", "You own the compliance mapping — EN 301 549, WCAG, GDPR, procurement duties — and the data questions of where profiles and session data live, across every tool in your stack.", "EU-based and EU-hosted end to end, GDPR by design. Profiles and operational data can live on-device, on your local server, or on EU servers — your call, with an auditable trail."],
          ["Content", "You commission or license experiences from separate makers and make each one run on your setup. Inconsistent quality, formats, and accessibility, integrated one by one.", "Content is built to run on the platform and inclusive by default, plus a creator network to source proven experiences — so you have something to run on day one."],
          ["Total effort", "You are the integrator and the operator. Multiple vendors, multiple contracts, ongoing device management, and accessibility owned per app — a real internal capability to build and keep staffed.", "One partner, from space to scale. The stitching, the running, and the inclusion are handled, so your team can focus on the programme instead of the plumbing."]
        ]
      },
      whenDiy: {
        heading: "When DIY genuinely makes sense",
        body: "Managed isn't always the answer. Building it yourself can be the right call in a few real situations: a single headset or a one-off pilot for a fixed audience, where the operational overhead a platform removes barely exists yet; a team with strong in-house XR engineering that treats XR operations as a deliberate core capability; a narrow, static use case — one experience, one room, rarely changing; or early exploration, where a small self-built setup is a reasonable, low-commitment way to learn. The honest line: DIY scales with headcount, managed scales with throughput. The moment you need to serve more people than you can staff one-to-one — across changing content, a general-public audience, and real accessibility duties — the trade-offs move decisively toward managed."
      },
      cta: "See what running XR as one system looks like",
      metaDesc: "Managed XR platform vs DIY for institutions: an honest, dimension-by-dimension comparison of deployment, live control, throughput, accessibility, compliance, and content — plus when building it yourself is the right call."
    }
  };

  CONTENT.guides = {
    "accessible-xr": {
      eyebrow: "Pillar guide",
      h1: "What accessible XR at scale actually requires.",
      sub: "A plain-language explainer for procurement teams and accessibility officers: the categories of human difference immersive experiences have to account for, how they map to the standards you already answer to, and what's settled versus still emerging.",
      sections: [
        { h: "What is accessible XR at scale?", body: "Accessible XR at scale means every person who picks up a headset — regardless of vision, hearing, motor ability, cognition, or comfort with immersion — can use the experience, across a shared fleet of devices, without a specialist re-configuring each headset by hand. It is different from making a single app accessible. At scale, the hard requirement is that accommodations follow the <em>person</em>, not the app: a visitor sets their needs once and every experience they touch respects them. AgoraXR is an EU-based XR infrastructure company that runs immersive experiences for institutions; Attune is its accessibility & comfort layer, which measures each user and auto-configures whatever headset they pick up." },
        { h: "Which standards govern accessible XR?", body: "Four reference points matter for procurement. The <strong>W3C XR Accessibility User Requirements (XAUR)</strong> is the field's benchmark for what immersive environments must accommodate. <strong>EN 301 549</strong> is the European standard for ICT accessibility used in public procurement, and it points to <strong>WCAG</strong> for web-facing components. <strong>WCAG 2.1 AA</strong> is today's practical baseline in Europe, with <strong>WCAG 2.2</strong> becoming the baseline and the draft <strong>WCAG 3.0</strong> bringing VR and AR into formal scope for the first time. The <strong>European Accessibility Act</strong> sets obligations for certain products and services; where XR is wrapped in a covered service — ticketing, e-commerce, a companion app — those parts fall in its scope. Attune is designed around XAUR and aligned to EN 301 549 and WCAG. Conformance is claimed only where independently verified." },
        { h: "What does an accessible XR experience have to accommodate?", body: "Immersion touches the whole body and mind, so accessibility in XR is broader than captions and contrast. Attune organises it into nine categories: locomotion & vestibular comfort; motor, physical & interaction access; advanced input methods; vision calibration & hardware interfacing; visual & UI accommodations; auditory & communication accommodations; cognitive, pacing & gameplay accommodations; environmental & spatial awareness; and the forward-looking Attune Horizon. Together they span more than 60 individual settings, configured once and applied to any content." },
        { h: "How do these categories map to the standards?", body: "Different categories answer to different frameworks, which is why a single WCAG checkbox never covered XR. Vestibular comfort, environmental awareness, and advanced input are largely <strong>XAUR</strong> territory — needs the web-era standards never anticipated. Visual and auditory accommodations — contrast, captions, screen-reader support, flashing thresholds — map cleanly onto <strong>WCAG 2.1/2.2</strong> and <strong>EN 301 549</strong>. Motor and cognitive accommodations sit across both. The honest picture: captions and contrast are standardised and testable today, while locomotion comfort, spatial-awareness safety, and advanced input are the emerging frontier the standards are catching up to. Attune covers both." },
        { h: "Why does 'at scale' change the problem?", body: "A gallery, a classroom, or a training floor never meets the same person twice, and the headsets are shared. That breaks the usual model where accessibility lives inside one app on one user's own device. At scale, three things must be true at once: accommodations follow the person across every experience and headset; the operator, not each visitor, manages them for a room; and it all holds up under EU data and accessibility rules. Device makers solve accessibility one headset and one app at a time. Attune configures it <em>per user, across shared headsets, managed by the operator, at deployment scale</em> — turning it from a per-app developer burden into part of how an institution runs its space." }
      ],
      faq: [
        { q: "Is XR covered by the European Accessibility Act?", a: "Not as a blanket XR mandate. The EAA sets obligations for certain products and services. Where an immersive experience is wrapped in a covered service — ticketing, e-commerce, a companion app — those parts fall within its scope. Public institutions also carry existing duties under the Web Accessibility Directive, national law, and procurement rules." },
        { q: "What is the W3C XAUR?", a: "XAUR stands for XR Accessibility User Requirements — a W3C document setting out the accessibility needs specific to virtual and augmented reality, from locomotion comfort and input alternatives to spatial audio and safe boundaries. It is the recognised benchmark for accessible XR, and Attune is designed around it." },
        { q: "Is accessible XR fully standardised yet?", a: "Partly. Visual and auditory accommodations are well standardised under WCAG and EN 301 549. Immersion-specific needs like vestibular comfort, spatial-awareness safety, and advanced input are still emerging: XAUR defines the requirements, and draft WCAG 3.0 brings VR and AR into formal scope for the first time. Attune covers both." },
        { q: "How is accessibility managed across shared headsets?", a: "A user sets their comfort and access needs once, and Attune auto-configures whatever headset they pick up, across any experience the operator runs. The profile can live on the user's device, a local server, or EU-based servers — operator-managed and applied per user at scale, rather than re-configured on each device by hand." }
      ],
      metaDesc: "Accessible XR at scale, explained for procurement and access officers: the nine categories immersive experiences must accommodate, how they map to W3C XAUR, EN 301 549, WCAG, and the European Accessibility Act, and what's standardised versus still emerging."
    }
  };

  CONTENT.calculator = {
    eyebrow: "Throughput = ROI",
    h1: "See what your space could actually move.",
    intro: "XR pays off on one number: people per hour. Set your space below — headsets, hours, session length — and set your own assumptions for what a managed operation changes. Every figure shows its math, and every \"with AgoraXR\" number is yours to edit.",
    banner: "These are your assumptions, not our claims. We ship them conservative — change them to match what you'd actually expect, and watch the numbers move.",
    caveat: "<strong>These are estimates, not promises.</strong> They follow directly from the assumptions above — including the ones you set on the \"With AgoraXR\" side. Real spaces vary: queueing, breaks, peak-hour demand, content length, and how many people actually turn up all move the number. Treat this as a model to argue with, then let us run it against your real data.",
    disclosure: [
      "Cycle time = session length + changeover/onboarding — how long one person occupies a headset, door to door.",
      "Sessions per headset per day = operating minutes ÷ cycle time.",
      "People per day = headsets × sessions per headset per day. On the \"with\" side we also apply your drop-off reduction, because fewer first-timers quitting early means more completed sessions.",
      "People per year = people per day × days open.",
      "Estimated value = people × your value-per-session (a ticket price, or the internal value of one trained learner or one included visitor).",
      "Operators: the baseline assumes ~one operator per headset; the \"with\" side assumes one operator per (headsets-per-operator) devices. Staff-hours saved = operators saved × open hours.",
      "What this ISN'T: a benchmark, a guarantee, or a quote. No invented industry averages — the optimisation numbers are the ones you set."
    ],
    cta: "Get these numbers reviewed with your real data",
    ctaSupport: "We'll pressure-test the assumptions against your space, your content, and your visitor mix — and tell you where the model is too optimistic.",
    secondary: "See how Agora Command runs the room"
  };

  /* ---------- derived: attach icons ---------- */
  CONTENT.sectors.forEach(function (s) { s.icon = SECTOR_ICONS[s.slug]; });
  CONTENT.product.forEach(function (p) { p.icon = PLATFORM_ICONS[p.slug] || "layers"; });
  CONTENT.services.forEach(function (s) { s.icon = PLATFORM_ICONS[s.slug] || "spark"; });

  function bySlug(arr, slug) { for (var i = 0; i < arr.length; i++) { if (arr[i].slug === slug) return arr[i]; } return null; }

  /* ---------- expose ---------- */
  root.ICONS = ICONS;
  root.ic = ic;
  root.CONTENT = CONTENT;
  root.AX = {
    sector: function (slug) { return bySlug(CONTENT.sectors, slug); },
    product: function (slug) { return bySlug(CONTENT.product, slug); },
    service: function (slug) { return bySlug(CONTENT.services, slug); },
    bySlug: bySlug
  };
})(window);
