/* =============================================================================
   AgoraXR — application (router, page renders, wiring)
   Depends on js/data.js (window.CONTENT, window.ic, window.AX). No ES modules /
   no fetch, so it also runs when index.html is opened directly via file://.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.CONTENT, ic = window.ic, AX = window.AX;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- helpers */
  function eyebrow(text, variant) {
    return '<span class="eyebrow' + (variant ? ' eyebrow--' + variant : '') + '">' + text + '</span>';
  }
  function btn(label, href, cls, icon) {
    cls = cls || 'btn--primary';
    var arrow = (icon === false) ? '' : ic(icon || 'arrow');
    return '<a class="btn ' + cls + '" href="' + href + '">' + label + (arrow ? ' ' + arrow : '') + '</a>';
  }
  function heroEm(h1) { return h1.replace(/\{\{(.+?)\}\}/g, '<em>$1</em>'); }
  var chev = function () { return ic('chev').replace('<svg', '<svg class="chev"'); };

  /* ------------------------------------------------------- Attune demo markup */
  function attuneScene(id) {
    var cols = ''; for (var i = 0; i < 5; i++) cols += '<div class="ad-col"></div>';
    return '<div class="ad-scene ref" id="' + id + '" data-cb="none" role="img" aria-label="Simulated XR gallery view that reconfigures as the comfort and access settings change">' +
      '<div class="ad-sky"></div><div class="ad-sun"></div>' +
      '<div class="ad-cols">' + cols + '</div>' +
      '<div class="ad-figure"></div><div class="ad-figure f2"></div>' +
      '<div class="ad-ground"></div>' +
      '<div class="ad-ui"><div class="row"><span class="k">GALLERY</span> Room 3 · The Aegean</div><div class="row"><span class="k">NEXT</span> Colonnade walk</div></div>' +
      '<div class="ad-reticle"></div><div class="ad-vignette"></div>' +
      '<div class="ad-cap"><span class="spk">Guide:</span> Ahead of you, the marble colonnade once framed the marketplace.</div>' +
      '</div>';
  }
  function adCtl(ctlId, label, icon, input) {
    return '<div class="ad-ctl"><label for="' + ctlId + '">' + ic(icon) + label + '</label>' + input + '</div>';
  }
  function adToggle(id, fx, checked, ctlId) {
    return '<span class="toggle"><input id="' + ctlId + '" type="checkbox" role="switch" data-scene="' + id + '" data-fx="' + fx + '" ' + (checked ? 'checked' : '') +
      '><span class="track"><span class="knob"></span></span></span>';
  }
  function attuneControls(id) {
    var cid = function (fx) { return id + '-' + fx; };
    return '<div class="ad-controls"><p class="ad-ctl-title">Try Attune</p><p class="hint">// change the settings — the view adapts</p>' +
      adCtl(cid('scale'), 'Larger text & UI', 'text', '<input id="' + cid('scale') + '" type="range" min="1" max="1.6" step="0.05" value="1" data-scene="' + id + '" data-fx="scale">') +
      adCtl(cid('bright'), 'Brightness', 'spark', '<input id="' + cid('bright') + '" type="range" min="0.6" max="1.25" step="0.05" value="1" data-scene="' + id + '" data-fx="bright">') +
      adCtl(cid('cap'), 'Subtitles & captions', 'ear', adToggle(id, 'cap', false, cid('cap'))) +
      adCtl(cid('hc'), 'High-contrast UI', 'vision', adToggle(id, 'hc', false, cid('hc'))) +
      adCtl(cid('cb'), 'Colourblindness filter', 'vision', '<select id="' + cid('cb') + '" data-scene="' + id + '" data-fx="cb"><option value="none">Off</option><option value="prot">Protanopia</option><option value="deut">Deuteranopia</option><option value="trit">Tritanopia</option></select>') +
      adCtl(cid('vig'), 'Comfort vignette', 'motion', adToggle(id, 'vig', false, cid('vig'))) +
      adCtl(cid('ref'), 'Static reference point', 'compass', adToggle(id, 'ref', true, cid('ref'))) +
      '<p class="sr-only" aria-live="polite" id="' + id + '-status"></p>' +
      '</div>';
  }
  function attuneDemo(id) {
    return '<div class="attune-demo reveal"><div class="attune-demo-grid">' +
      '<div class="ad-stage-wrap"><div class="ad-stagelabel"><span class="live">live preview</span> · one profile, any headset</div>' +
      attuneScene(id) + '</div>' + attuneControls(id) + '</div></div>';
  }

  /* ---------------------------------------------------------- arch diagram */
  function archDiagram() {
    return '<svg class="arch" viewBox="0 0 1000 350" role="img" aria-label="AgoraXR stack: an operator uses Agora Command; content built on the SDK with Attune embedded runs across XR devices; profiles and data live on device, a local server, or EU servers.">' +
      '<text class="cap" x="20" y="26">OPERATOR</text>' +
      '<rect class="box-a" x="20" y="38" width="180" height="70" rx="10"/><text class="lbl" x="38" y="72">Agora Command</text><text class="cap" x="38" y="92">operations hub · command centre</text>' +
      '<path class="flow-a" d="M200 73 H300"/>' +
      '<text class="cap" x="300" y="26">CONTENT LAYER</text>' +
      '<rect class="box" x="300" y="38" width="260" height="150" rx="10"/><text class="lbl" x="320" y="70">AgoraXR SDK</text><text class="cap" x="320" y="90">multiplayer · colocation · sequencer</text>' +
      '<rect class="box-g" x="320" y="104" width="220" height="64" rx="8"/><text class="lbl" x="336" y="132" style="fill:var(--secondary)">Attune</text><text class="cap" x="336" y="152">accessibility & comfort layer</text>' +
      '<path class="flow" d="M430 188 V230"/>' +
      '<text class="cap" x="300" y="256">XR DEVICES (device-agnostic)</text>' +
      '<rect class="box" x="300" y="266" width="80" height="60" rx="8"/><rect class="box" x="392" y="266" width="80" height="60" rx="8"/><rect class="box" x="484" y="266" width="76" height="60" rx="8"/>' +
      '<text class="cap" x="320" y="300">Headset</text><text class="cap" x="412" y="300">Headset</text><text class="cap" x="500" y="300">Headset</text>' +
      '<path class="flow-a" d="M560 130 H660"/>' +
      '<text class="cap" x="660" y="26">STORAGE — YOUR CHOICE</text>' +
      '<rect class="box" x="660" y="38" width="300" height="52" rx="8"/><text class="lbl" x="676" y="70">On the user device</text>' +
      '<rect class="box" x="660" y="100" width="300" height="52" rx="8"/><text class="lbl" x="676" y="132">Your local server (offline-capable)</text>' +
      '<rect class="box" x="660" y="162" width="300" height="52" rx="8"/><text class="lbl" x="676" y="194">AgoraXR EU servers</text>' +
      '<text class="cap" x="660" y="238">Nothing moves without your permission.</text>' +
      '</svg>';
  }

  /* ---------------------------------------------------------- closing CTA */
  function closingCTA(kind) {
    var c = C.closingCTA, primary, secondary;
    if (kind === 'talk') {
      primary = btn('Talk to us', '/contact?topic=services', 'btn--primary btn--lg');
      secondary = btn(c.secondaryCTA, '/trust', 'btn--ghost btn--lg', 'play');
    } else if (kind === 'spec') {
      primary = btn('Get the accessibility spec sheet', '/contact?topic=spec-sheet', 'btn--secondary btn--lg');
      secondary = btn(c.primaryCTA, '/contact?topic=demo', 'btn--ghost btn--lg', false);
    } else {
      primary = btn(c.primaryCTA, '/contact?topic=demo', 'btn--primary btn--lg');
      secondary = btn(c.secondaryCTA, '/trust', 'btn--ghost btn--lg', 'play');
    }
    return '<section class="band band--surface"><div class="wrap"><div class="split" style="align-items:center">' +
      '<div>' + eyebrow(c.eyebrow) + '<h2 style="margin-top:.6rem">' + c.heading + '</h2>' +
      '<p class="lede" style="margin-top:1rem">' + c.body + '</p></div>' +
      '<div class="btnrow" style="justify-content:flex-start">' + primary + secondary + '</div>' +
      '</div></div></section>';
  }

  /* ============================================================ NAV / FOOTER
     navParts() is PURE (returns strings) so the Node prerender can inject the
     nav/footer server-side; buildNav() (browser) hydrates the containers. */
  function navParts() {
    var mc = C.microcopy.nav, fm = C.microcopy.footer;
    var solDD = C.sectors.map(function (s) {
      return '<a class="dd-link" href="/solutions/' + s.slug + '"><span class="t"><span class="ic">' + ic(s.icon) + '</span>' + s.nav + '</span><span class="d">' + s.hook + '</span></a>';
    }).join('') + '<div class="dd-foot"><a href="/solutions">' + mc.seeAllSolutions + ' ' + ic('arrow') + '</a></div>';

    var cmd = AX.product('agora-command'), att = AX.product('attune'), sdk = AX.product('sdk');
    var platDD =
      '<a class="dd-link dd-full" href="/platform"><span class="t"><span class="ic">' + ic('layers') + '</span>' + mc.platformOverview + '</span><span class="d">' + mc.platformOverviewDesc + '</span></a>' +
      '<div class="dd-head" style="grid-column:1">' + mc.runHead + '</div>' +
      '<div class="dd-head" style="grid-column:2">' + mc.includeHead + '</div>' +
      '<a class="dd-link" href="/platform/agora-command"><span class="t"><span class="ic">' + ic(cmd.icon) + '</span>' + cmd.nav + '</span><span class="d">' + cmd.ddDesc + '</span></a>' +
      '<a class="dd-link gold" href="/platform/attune"><span class="t"><span class="ic">' + ic(att.icon) + '</span>' + att.nav + '</span><span class="d">' + att.ddDesc + '</span></a>' +
      '<a class="dd-link dd-full" href="/platform/sdk"><span class="t"><span class="ic">' + ic('cube') + '</span>' + sdk.nav + '</span><span class="d">' + sdk.ddDesc + '</span></a>';

    var svcDD =
      '<a class="dd-link" href="/services"><span class="t"><span class="ic">' + ic('handshake') + '</span>' + mc.servicesOverview + '</span><span class="d">' + mc.servicesOverviewDesc + '</span></a>' +
      C.services.map(function (s) {
        return '<a class="dd-link" href="/services/' + s.slug + '"><span class="t"><span class="ic">' + ic(s.icon) + '</span>' + s.nav + '</span><span class="d">' + s.ddDesc + '</span></a>';
      }).join('');

    var main =
      '<div class="nav-item" data-menu="solutions"><button class="nav-link" aria-expanded="false" aria-controls="dd-solutions">' + mc.solutions + ' ' + chev() + '</button><div class="dropdown dropdown--wide" id="dd-solutions">' + solDD + '</div></div>' +
      '<div class="nav-item" data-menu="platform"><button class="nav-link" aria-expanded="false" aria-controls="dd-platform">' + mc.platform + ' ' + chev() + '</button><div class="dropdown dropdown--wide dropdown--mega" id="dd-platform">' + platDD + '</div></div>' +
      '<div class="nav-item" data-menu="services"><button class="nav-link" aria-expanded="false" aria-controls="dd-services">' + mc.services + ' ' + chev() + '</button><div class="dropdown" id="dd-services">' + svcDD + '</div></div>' +
      '<a class="nav-link" href="/trust">' + mc.trust + '</a><a class="nav-link" href="/about">' + mc.about + '</a>';

    var mSol = '<div class="m-sub">' + C.sectors.map(function (s) {
      return '<a href="/solutions/' + s.slug + '"><b>' + s.nav + '</b><span>' + s.hook + '</span></a>';
    }).join('') + '<a href="/solutions"><b>' + mc.seeAllSolutions + ' →</b></a></div>';
    var mPlat = '<div class="m-sub">' +
      '<a href="/platform"><b>' + mc.platformOverview + '</b><span>' + mc.platformOverviewDesc + '</span></a>' +
      '<div class="m-group">' + mc.runHead + '</div>' +
      '<a href="/platform/agora-command"><b>' + cmd.nav + '</b><span>' + cmd.ddDesc + '</span></a>' +
      '<div class="m-group">' + mc.includeHead + '</div>' +
      '<a href="/platform/attune"><b>' + att.nav + '</b><span>' + att.ddDesc + '</span></a>' +
      '<div class="m-group">' + mc.buildHead + '</div>' +
      '<a href="/platform/sdk"><b>' + sdk.nav + '</b><span>' + sdk.ddDesc + '</span></a></div>';
    var mSvc = '<div class="m-sub">' +
      '<a href="/services"><b>' + mc.servicesOverview + '</b><span>' + mc.servicesOverviewDesc + '</span></a>' +
      C.services.map(function (s) { return '<a href="/services/' + s.slug + '"><b>' + s.nav + '</b><span>' + s.ddDesc + '</span></a>'; }).join('') + '</div>';

    var mobile =
      '<div class="m-scroll">' +
      '<details><summary>' + mc.solutions + ' ' + chev() + '</summary>' + mSol + '</details>' +
      '<details><summary>' + mc.platform + ' ' + chev() + '</summary>' + mPlat + '</details>' +
      '<details><summary>' + mc.services + ' ' + chev() + '</summary>' + mSvc + '</details>' +
      '<a class="m-top" href="/trust">' + mc.trust + '</a>' +
      '<a class="m-top" href="/about">' + mc.about + '</a>' +
      '</div>' +
      '<div class="m-foot"><div class="m-util"><a href="/contact?topic=demo">' + C.hero.secondaryCTA + '</a></div>' +
      btn(mc.bookDemo, '/contact?topic=demo', 'btn--primary btn--lg', false) + '</div>';

    return {
      main: main, mobile: mobile,
      footSectors: '<h2 class="foot-h">' + fm.solutions + '</h2>' + C.sectors.map(function (s) { return '<a href="/solutions/' + s.slug + '">' + s.nav + '</a>'; }).join(''),
      footPlatform: '<h2 class="foot-h">' + fm.platform + '</h2><a href="/platform">Overview</a>' + C.product.map(function (p) { return '<a href="/platform/' + p.slug + '">' + p.nav + '</a>'; }).join(''),
      footServices: '<h2 class="foot-h">' + fm.services + '</h2>' + C.services.map(function (s) { return '<a href="/services/' + s.slug + '">' + s.nav + '</a>'; }).join('')
    };
  }
  function buildNav() {
    var n = navParts();
    $('#navMain').innerHTML = n.main;
    $('#mobileNav').innerHTML = n.mobile;
    $('#footSectors').innerHTML = n.footSectors;
    $('#footPlatform').innerHTML = n.footPlatform;
    $('#footServices').innerHTML = n.footServices;
  }

  /* =================================================================== PAGES */
  var PAGES = {};

  PAGES.home = function () {
    var h = C.home, hero = C.hero;
    return (
      /* 1 · HERO */
      '<section class="hero"><div class="hero-aura"></div><div class="wrap"><div class="hero-grid">' +
        '<div class="reveal in">' + eyebrow(hero.eyebrow) +
          '<h1>' + heroEm(hero.h1) + '</h1>' +
          '<p class="sub">' + hero.sub + '</p>' +
          '<div class="btnrow">' + btn(hero.primaryCTA, '/contact?topic=demo', 'btn--primary btn--lg') + btn(hero.secondaryCTA, '/trust', 'btn--ghost btn--lg', 'play') + '</div>' +
          '<div class="trust-tags">' + hero.tags.map(function (t, i) { return '<span class="tag' + (i === 1 ? ' g' : '') + '"><span class="dot"></span>' + t + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="reveal in"><div class="ph ph--video" role="img" aria-label="Placeholder for the hero demo film showing AgoraXR running live">' +
          '<div class="ph-play">' + ic('play') + '</div><span class="ph-t">Hero demo film</span>' +
          '<span class="ph-d">Replace with your muted autoplay loop. Captions on by default; provide a transcript.</span><span class="ph-cc">CC · ON</span></div></div>' +
      '</div></div></section>' +

      /* 2 · CREDIBILITY */
      '<section class="band band--tight"><div class="wrap center">' + eyebrow(h.logos.eyebrow, 'plain') +
        '<div class="ph ph--wide reveal" style="margin-top:1rem" role="img" aria-label="Placeholder for a cleared partner-logo row"><span class="ph-t">Partner logo row</span><span class="ph-d">Drop cleared logos here. If none are cleared yet, keep the line below. Never fabricate logos.</span></div>' +
        '<p class="muted" style="margin-top:1rem;font-size:var(--fs-sm)">' + h.logos.credibilityLine + '</p>' +
      '</div></section>' +

      /* 3 · THE REAL JOB */
      '<section class="band"><div class="wrap split split--wide-left">' +
        '<div>' + eyebrow(h.theJob.eyebrow) + '<h2 style="margin-top:.6rem">' + h.theJob.heading + '</h2></div>' +
        '<div><p class="lede">' + h.theJob.body + '</p></div>' +
      '</div></section>' +

      /* 4 · TWO SPINES */
      '<section class="band band--surface"><div class="wrap">' +
        '<div class="sec-head">' + eyebrow(h.spines.eyebrow) + '<h2>' + h.spines.heading + '</h2></div>' +
        '<div class="spines reveal">' + spineCard('run', h.spines.run) + spineCard('include', h.spines.include) + '</div>' +
      '</div></section>' +

      /* 4b · WEDGE — the differentiator, stated early */
      '<section class="band"><div class="wrap wrap--content">' + eyebrow(h.wedge.eyebrow, 'include') + '<h2 style="margin-top:.6rem">' + h.wedge.heading + '</h2>' +
        '<p class="lede" style="margin-top:1rem">' + h.wedge.body + '</p>' +
        '<ul class="checklist" style="margin-top:1.2rem">' + h.wedge.points.map(function (p) { return '<li>' + ic('check') + '<span>' + p + '</span></li>'; }).join('') + '</ul></div></section>' +

      /* 5 · ATTUNE SHOWPIECE */
      '<section class="band"><div class="wrap">' +
        '<div class="sec-head">' + eyebrow(h.attuneIntro.eyebrow, 'include') + '<h2>' + h.attuneIntro.heading + '</h2>' +
          '<p class="lede" style="margin-top:1rem">' + h.attuneIntro.body + '</p></div>' +
        attuneDemo('homeScene') +
        '<div class="grid g2" style="margin-top:2rem">' + h.attuneIntro.cards.map(function (c) {
          return '<article class="card include"><div class="c-ic">' + ic(c.icon) + '</div><h4>' + c.h + '</h4><p>' + c.body + '</p></article>';
        }).join('') + '</div>' +
        '<div class="btnrow" style="margin-top:1.6rem">' + btn(h.attuneIntro.primaryCTA, '/platform/attune', 'btn--secondary') + btn(h.attuneIntro.secondaryCTA, '/contact?topic=spec-sheet', 'btn--ghost', false) + '</div>' +
      '</div></section>' +

      /* 6 · THROUGHPUT */
      '<section class="band band--surface"><div class="wrap split">' +
        '<div>' + eyebrow(h.throughput.eyebrow) + '<h2 style="margin-top:.6rem">' + h.throughput.heading + '</h2>' +
          '<p class="lede" style="margin-top:1rem">' + h.throughput.body + '</p>' +
          '<div class="btnrow" style="margin-top:1.4rem">' + btn('Try the ROI calculator', '/calculator', 'btn--secondary') + btn(h.throughput.cta, '/platform/agora-command', 'btn--ghost') + '</div></div>' +
        '<div><div class="ph" role="img" aria-label="Placeholder for a verified throughput statistic"><span class="ph-t">Throughput stat</span><span class="ph-d">e.g. "X% more visitors per hour." Real evidence only — never invented.</span></div>' +
          '<div class="stat" style="margin-top:1.5rem"><div class="n">' + h.throughput.stat + '</div><div class="l">' + h.throughput.statLabel + '</div></div></div>' +
      '</div></section>' +

      /* 6b · PILOT — low-risk on-ramp */
      '<section class="band"><div class="wrap"><div class="split" style="align-items:start">' +
        '<div>' + eyebrow(h.pilot.eyebrow) + '<h2 style="margin-top:.6rem">' + h.pilot.heading + '</h2>' +
          '<p class="lede" style="margin-top:1rem">' + h.pilot.body + '</p>' +
          '<p class="muted" style="margin-top:1.2rem"><strong>Timeline.</strong> ' + h.pilot.timeline + '</p>' +
          '<p class="counsel-note" style="margin-top:.8rem">' + h.pilot.priceBand + '</p>' +
          '<div class="btnrow" style="margin-top:1.4rem">' + btn(h.pilot.cta, '/contact?topic=demo', 'btn--primary') + '</div></div>' +
        '<div class="card"><h4>What a pilot includes</h4><ul class="checklist" style="margin-top:1rem">' +
          h.pilot.includes.map(function (x) { return '<li>' + ic('check') + '<span>' + x + '</span></li>'; }).join('') + '</ul></div>' +
      '</div></div></section>' +

      /* 7 · SOLUTIONS GRID */
      '<section class="band"><div class="wrap">' +
        '<div class="sec-head">' + eyebrow(h.sectorsIntro.eyebrow) + '<h2>' + h.sectorsIntro.heading + '</h2></div>' +
        '<div class="grid g3">' + C.sectors.map(function (s) {
          return '<a class="tile reveal" href="/solutions/' + s.slug + '"><span class="t-ic">' + ic(s.icon) + '</span><h4>' + s.nav + '</h4><p>' + s.hook + '</p><span class="go">Explore ' + ic('arrow') + '</span></a>';
        }).join('') + '</div>' +
        '<div class="btnrow" style="margin-top:1.6rem;justify-content:center">' + btn(C.microcopy.nav.seeAllSolutions, '/solutions', 'btn--ghost') + '</div>' +
      '</div></section>' +

      /* 8 · TRUST + FULL STACK */
      '<section class="band band--surface"><div class="wrap">' +
        '<div class="sec-head">' + eyebrow(h.trustStack.eyebrow) + '<h2>' + h.trustStack.heading + '</h2></div>' +
        '<div class="split">' +
          '<div><p class="lede">' + h.trustStack.dataBody + '</p>' +
            '<div class="badgewall" style="margin-top:1.4rem">' + h.trustStack.badges.map(badge).join('') + '</div>' +
            '<div class="btnrow" style="margin-top:1.4rem">' + btn(h.trustStack.dataCTA, '/trust', 'btn--ghost') + '</div></div>' +
          '<div><p class="lede">' + h.trustStack.stackBody + '</p>' +
            '<div class="btnrow" style="margin-top:1.4rem">' + btn(h.trustStack.servicesCTA, '/services', 'btn--ghost') + '</div></div>' +
        '</div>' +
      '</div></section>' +

      /* 9 · DEVELOPERS */
      '<section class="band"><div class="wrap split">' +
        '<div>' + eyebrow(h.developersIntro.eyebrow) + '<h2 style="margin-top:.6rem">' + h.developersIntro.heading + '</h2>' +
          '<p class="lede" style="margin-top:1rem">' + h.developersIntro.body + '</p>' +
          '<div class="btnrow" style="margin-top:1.4rem">' + btn(h.developersIntro.cta, '/platform/sdk', 'btn--primary') + '</div></div>' +
        '<div>' + sdkCode() + '</div>' +
      '</div></section>' +

      closingCTA('demo')
    );
  };

  function spineCard(kind, d) {
    var cls = kind === 'run' ? 'spine--run' : 'spine--include';
    var href = kind === 'run' ? '/platform/agora-command' : '/platform/attune';
    var lcls = kind === 'run' ? 'btn--primary' : 'btn--secondary';
    return '<div class="spine ' + cls + '"><span class="spine-label">' + d.label + '</span>' +
      '<span class="spine-ic">' + ic(d.icon) + '</span>' +
      '<h3>' + d.name + '</h3><p class="spine-body">' + d.body + '</p>' +
      '<p class="payoff-line">' + d.payoff + '</p>' +
      '<div class="btnrow">' + btn(d.cta, href, lcls) + '</div></div>';
  }
  function badge(b) {
    return '<div class="badge"><span class="b-ic">' + ic(b.icon) + '</span><div><b>' + b.t + '</b><p>' + b.body + '</p></div></div>';
  }
  function sdkCode() {
    return '<div class="code-block" aria-label="Example: one-line Attune integration">' +
      '<span class="c">// deploy-ready + inclusive, from line one</span><br>' +
      '<span class="k">using</span> AgoraXR.Attune;<br><br>' +
      'Attune.<span class="s">Enable</span>(profile);  <span class="c">// 9 categories, one call</span><br>' +
      'Command.<span class="s">Deploy</span>(experience);<br>' +
      '</div>';
  }

  /* ---------------------------------------------------------- SOLUTIONS index */
  PAGES.solutionsIndex = function () {
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow('Solutions') + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">Built for the places people walk into.</h1>' +
        '<p class="lede" style="margin-top:1rem">Whatever your space — a gallery, a classroom, a training floor, a clinic — AgoraXR runs the room and Attune makes it work for every visitor.</p></div></section>' +
      '<section class="band band--flush-top"><div class="wrap"><div class="grid g3">' +
        C.sectors.map(function (s) {
          return '<a class="tile reveal" href="/solutions/' + s.slug + '"><span class="t-ic">' + ic(s.icon) + '</span><h4>' + s.nav + '</h4><p>' + s.hook + '</p><span class="go">Explore ' + ic('arrow') + '</span></a>';
        }).join('') +
      '</div></div></section>' + closingCTA('demo');
  };

  /* ---------------------------------------------------------- SECTOR page */
  PAGES.sector = function (slug) {
    var s = AX.sector(slug); if (!s) return PAGES.notfound();
    var getsCols = s.gets.length >= 4 ? 'g2' : 'g3';
    var related = (s.related || []).map(function (svc) {
      var x = AX.service(svc); if (!x) return '';
      return '<a class="xlink" href="/services/' + x.slug + '"><span class="xk">Service</span><b>' + ic(x.icon) + x.nav + '</b></a>';
    }).join('');
    var siblings = C.sectors.filter(function (o) { return o.slug !== slug; }).slice(0, 2).map(function (o) {
      return '<a class="xlink" href="/solutions/' + o.slug + '"><span class="xk">Solution</span><b>' + ic(o.icon) + o.nav + '</b></a>';
    }).join('');
    var closing = s.consultative ? 'talk' : 'demo';

    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap"><div class="hero-grid">' +
        '<div>' + eyebrow(s.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + s.h1 + '</h1>' +
          '<p class="sub">' + s.sub + '</p>' +
          '<div class="btnrow">' + btn(s.cta, '/contact?sector=' + s.slug, 'btn--primary btn--lg') + btn('See how Attune fits', '/platform/attune', 'btn--ghost btn--lg', false) + '</div></div>' +
        '<div><div class="ph ph--video" role="img" aria-label="Placeholder for a ' + s.nav + ' deployment film"><div class="ph-play">' + ic('play') + '</div><span class="ph-t">' + s.nav + ' deployment</span><span class="ph-d">Replace with real footage from a live deployment.</span><span class="ph-cc">CC · ON</span></div></div>' +
      '</div></div></section>' +

      '<section class="band band--surface"><div class="wrap wrap--content">' + eyebrow('The real problem') + '<h2 style="margin-top:.6rem">Why this matters here.</h2><p class="lede" style="margin-top:1rem">' + s.why + '</p></div></section>' +

      '<section class="band"><div class="wrap"><div class="sec-head">' + eyebrow('What you get') + '<h2>What ' + s.nav + ' gets from AgoraXR.</h2></div>' +
        '<div class="grid ' + getsCols + '">' + s.gets.map(function (g, i) {
          return '<article class="card reveal"><div class="p-name">0' + (i + 1) + '</div><p style="color:var(--ink);font-size:var(--fs-base)">' + g + '</p></article>';
        }).join('') + '</div></div></section>' +

      /* two spines in context + live Attune */
      '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow('How it works here', 'include') + '<h2>One layer runs it. The other includes everyone.</h2></div>' +
        '<div class="split" style="align-items:start;margin-bottom:2rem">' +
          '<div class="card"><div class="c-ic">' + ic('control') + '</div><h4>Run it — Agora Command</h4><p>Deploy, control every headset live, and optimise the space for throughput — from one operations hub.</p><div class="btnrow" style="margin-top:1rem">' + btn('Explore Agora Command', '/platform/agora-command', 'btn--ghost', false) + '</div></div>' +
          '<div class="card include"><div class="c-ic">' + ic('attune') + '</div><h4>Include everyone — Attune</h4><p>' + s.attune + '</p><div class="btnrow" style="margin-top:1rem">' + btn('See the live Attune demo', '/platform/attune', 'btn--ghost', false) + '</div></div>' +
        '</div></div></section>' +

      /* proof */
      '<section class="band"><div class="wrap"><div class="sec-head">' + eyebrow('Proof') + '<h2>How it plays out on the floor.</h2></div>' +
        '<div class="ph" role="img" aria-label="Placeholder for a ' + s.nav + ' case study"><span class="ph-t">Case study — ' + s.nav + '</span><span class="ph-d">Real deployment evidence only. Case studies collect here as they clear.</span></div></div></section>' +

      (s.legal ? '<section class="band band--tight"><div class="wrap wrap--content"><div class="legalnote">' + ic('shield') + '<div><strong>Legal note (healthcare).</strong> ' + s.legal + '</div></div></div></section>' : '') +

      '<section class="band band--surface band--tight"><div class="wrap"><div class="sec-head" style="margin-bottom:1.2rem">' + eyebrow('Also relevant', 'plain') + '</div><div class="crosslinks">' + siblings + related + '</div></div></section>' +

      closingCTA(closing);
  };

  /* ---------------------------------------------------------- PLATFORM overview */
  PAGES.platform = function () {
    var p = C.pages.platform, cmd = AX.product('agora-command'), att = AX.product('attune'), sdk = AX.product('sdk');
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(p.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + p.h1 + '</h1>' +
        '<p class="lede" style="margin-top:1rem">' + p.sub + '</p><p class="muted" style="margin-top:1rem">' + p.sub2 + '</p></div></section>' +

      '<section class="band band--flush-top"><div class="wrap"><div class="sec-head center">' + eyebrow(p.stackEyebrow) + '<h2>' + p.stackHeading + '</h2></div>' +
        '<div class="card" style="padding:2rem">' + archDiagram() + '</div></div></section>' +

      '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow('Two layers') + '<h2>One runs XR. One includes everyone.</h2></div>' +
        '<div class="spines">' +
          spineCard('run', { icon: 'control', label: 'Run it', name: cmd.nav, body: cmd.sub, payoff: cmd.payoff, cta: 'Explore Agora Command' }) +
          spineCard('include', { icon: 'attune', label: 'Include everyone', name: att.nav, body: p.attuneCard, payoff: 'Configured once, applied everywhere.', cta: 'How Attune works' }) +
        '</div></div></section>' +

      '<section class="band"><div class="wrap split">' +
        '<div>' + eyebrow('Build on it') + '<h2 style="margin-top:.6rem">' + sdk.nav + '</h2><p class="lede" style="margin-top:1rem">' + sdk.ddDesc + ' — a Unity toolkit with one-line Attune integration, device-agnostic and deploy-ready.</p><div class="btnrow" style="margin-top:1.4rem">' + btn('Explore the SDK', '/platform/sdk', 'btn--ghost') + '</div></div>' +
        '<div class="card include" style="align-self:center"><div class="c-ic">' + ic('handshake') + '</div><h4>Need help standing it up?</h4><p>' + p.servicesBridge + '</p><div class="btnrow" style="margin-top:1rem">' + btn('Explore Services', '/services', 'btn--ghost', false) + '</div></div>' +
      '</div></section>' + closingCTA('demo');
  };

  /* ---------------------------------------------------------- AGORA COMMAND */
  PAGES.command = function () {
    var c = AX.product('agora-command');
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap"><div class="hero-grid">' +
        '<div>' + eyebrow(c.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + c.h1 + '</h1><p class="sub">' + c.sub + '</p>' +
          '<div class="btnrow">' + btn('Book a demo', '/contact?topic=demo', 'btn--primary btn--lg') + btn('Watch the 2-minute demo', '/trust', 'btn--ghost btn--lg', 'play') + '</div></div>' +
        '<div><div class="ph ph--video" role="img" aria-label="Placeholder for a live dashboard capture"><div class="ph-play">' + ic('play') + '</div><span class="ph-t">' + c.media + '</span><span class="ph-d">Replace with a real Agora Command capture.</span></div></div>' +
      '</div></div></section>' +

      '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow('What it does') + '<h2>Run the room from one place.</h2></div>' +
        '<div class="grid g-fluid">' + c.does.map(function (d) {
          return '<article class="card reveal"><div class="c-ic">' + ic(d[2]) + '</div><h4>' + d[0] + '</h4><p>' + d[1] + '</p></article>';
        }).join('') + '</div>' +
        '<div class="card include" style="margin-top:1.6rem;text-align:center"><p style="color:var(--ink);font-size:var(--fs-md);font-family:var(--font-display)">' + c.payoff + '</p></div></div></section>' +

      '<section class="band band--tight"><div class="wrap"><div class="sec-head" style="margin-bottom:1.2rem">' + eyebrow('How it connects') + '<h2>Better with the rest of the stack.</h2></div><div class="crosslinks">' +
        '<a class="xlink" href="/platform/attune"><span class="xk">Comfort keeps users in</span><b>' + ic('attune') + 'Attune</b></a>' +
        '<a class="xlink" href="/platform/sdk"><span class="xk">Build for it</span><b>' + ic('cube') + 'Developers & SDK</b></a>' +
        '<a class="xlink" href="/solutions/training"><span class="xk">Where it is used</span><b>' + ic('people') + 'Training & Job Centers</b></a>' +
      '</div></div></section>' + closingCTA('demo');
  };

  /* ---------------------------------------------------------- ATTUNE page */
  PAGES.attune = function () {
    var a = C.pages.attune;
    var cats = C.categories.map(function (c, i) {
      return '<article class="cat reveal"><div class="cat-h"><span class="cat-ic">' + ic(c.icon) + '</span><h4>' + c.title + '</h4></div><p>' + c.body + '</p></article>';
    }).join('');
    var hz = C.categoryHorizon;
    cats += '<article class="cat cat--horizon reveal"><span class="cat-label">' + hz.label + '</span><div class="cat-h" style="margin-top:.4rem"><span class="cat-ic">' + ic(hz.icon) + '</span><h4>' + hz.title + '</h4></div><p>' + hz.body + '</p></article>';

    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(a.eyebrow, 'include') + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + a.h1 + '</h1>' +
        '<p class="lede" style="margin-top:1rem">' + a.sub + '</p>' +
        '<p class="tag g" style="display:inline-flex;margin-top:1.2rem"><span class="dot"></span>' + a.pillNote + '</p></div></section>' +

      '<section class="band band--flush-top"><div class="wrap">' + attuneDemo('attuneScene') + '<p class="muted" style="margin-top:.8rem;font-size:var(--fs-xs);text-align:center">' + a.previewNote + '</p></div></section>' +

      '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow(a.how.eyebrow) + '<h2>' + a.how.heading + '</h2></div>' +
        '<div class="steps">' + a.how.steps.map(function (st) { return '<div class="step"><h4>' + st.h + '</h4><p>' + st.body + '</p></div>'; }).join('') + '</div></div></section>' +

      '<section class="band"><div class="wrap"><div class="sec-head">' + eyebrow(a.covers.eyebrow, 'include') + '<h2>' + a.covers.heading + '</h2></div>' +
        '<div class="cat-grid">' + cats + '</div>' +
        '<div class="card include" style="margin-top:1.6rem"><p><strong>' + a.categoriesNote.strong + '</strong> ' + a.categoriesNote.body + '</p></div></div></section>' +

      '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow(a.fixes.eyebrow) + '<h2>' + a.fixes.heading + '</h2></div>' +
        '<div class="grid g2">' + a.fixes.cards.map(function (c) { return '<article class="card"><h4>' + c.h + '</h4><p>' + c.body + '</p></article>'; }).join('') + '</div></div></section>' +

      '<section class="band"><div class="wrap wrap--content">' + eyebrow(a.standards.eyebrow) + '<h2 style="margin-top:.6rem">' + a.standards.heading + '</h2>' +
        '<p class="lede" style="margin-top:1rem">' + a.standards.body + '</p>' +
        '<p class="counsel-note">' + a.standards.counselNote + '</p>' +
        '<div class="btnrow" style="margin-top:1.6rem">' + btn(a.standards.primaryCTA, '/contact?topic=spec-sheet', 'btn--secondary') + btn(a.standards.secondaryCTA, '/contact?topic=demo', 'btn--ghost', false) + '</div></div></section>' +

      '<section class="band band--surface band--tight"><div class="wrap"><div class="sec-head" style="margin-bottom:1.2rem">' + eyebrow('For your sector', 'plain') + '</div><div class="crosslinks">' +
        C.sectors.slice(0, 3).map(function (s) { return '<a class="xlink" href="/solutions/' + s.slug + '"><span class="xk">Solution</span><b>' + ic(s.icon) + s.nav + '</b></a>'; }).join('') +
      '</div></div></section>' + closingCTA('spec');
  };

  /* ---------------------------------------------------------- SDK / developers */
  PAGES.sdk = function () {
    var d = C.pages.developers;
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap"><div class="hero-grid">' +
        '<div>' + eyebrow(d.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + d.h1 + '</h1><p class="sub">' + d.sub + '</p>' +
          '<div class="btnrow">' + btn(d.primaryCTA, '/contact?topic=docs', 'btn--primary btn--lg', false) + btn(d.secondaryCTA, '/contact?topic=sdk', 'btn--ghost btn--lg', false) + '</div></div>' +
        '<div>' + sdkCode() + '</div>' +
      '</div></div></section>' +

      '<section class="band band--surface"><div class="wrap wrap--content">' + eyebrow(d.oneLine.eyebrow, 'include') + '<h2 style="margin-top:.6rem">' + d.oneLine.heading + '</h2><p class="lede" style="margin-top:1rem">' + d.oneLine.body + '</p></div></section>' +

      '<section class="band"><div class="wrap"><div class="sec-head">' + eyebrow(d.toolkit.eyebrow) + '<h2>' + d.toolkit.heading + '</h2></div>' +
        '<div class="grid g3">' + d.toolkit.items.map(function (it) {
          return '<article class="card' + (it.gold ? ' include' : '') + ' reveal"><div class="c-ic">' + ic(it.icon) + '</div><h4>' + it.h + '</h4><p>' + it.body + '</p></article>';
        }).join('') + '</div></div></section>' +

      '<section class="band band--surface"><div class="wrap wrap--content">' + eyebrow(d.why.eyebrow) + '<h2 style="margin-top:.6rem">' + d.why.heading + '</h2>' +
        '<ul class="checklist" style="margin-top:1.4rem">' + d.why.points.map(function (p) { return '<li>' + ic('check') + '<span>' + p + '</span></li>'; }).join('') + '</ul>' +
        '<p class="muted" style="margin-top:1.4rem;font-size:var(--fs-sm)">' + d.why.fieldNote + '</p>' +
        '<div class="btnrow" style="margin-top:1.6rem">' + btn(d.why.primaryCTA, '/contact?topic=docs', 'btn--primary', false) + btn(d.why.secondaryCTA, '/contact?topic=sdk', 'btn--ghost', false) + '</div></div></section>' +
      closingCTA('demo');
  };

  /* ---------------------------------------------------------- SERVICES index */
  PAGES.servicesIndex = function () {
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow('Services') + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">One partner, from space to scale.</h1>' +
        '<p class="lede" style="margin-top:1rem">The software runs your XR. Our people help you fill it, scope it, own it, and equip it — so you\'re not stitching together five vendors to light up one experience.</p></div></section>' +
      '<section class="band band--flush-top"><div class="wrap"><div class="grid g2">' +
        C.services.map(function (s) {
          return '<a class="tile reveal" href="/services/' + s.slug + '"><span class="t-ic">' + ic(s.icon) + '</span><h4>' + s.nav + '</h4><p>' + s.sub + '</p><span class="go">' + s.cta + ' ' + ic('arrow') + '</span></a>';
        }).join('') +
      '</div></div></section>' + closingCTA('talk');
  };

  /* ---------------------------------------------------------- SERVICE detail */
  PAGES.service = function (slug) {
    var s = AX.service(slug); if (!s) return PAGES.notfound();
    var mid;
    if (s.paths) {
      mid = '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow('Two ways in') + '<h2>We build it, or we source it.</h2></div><div class="grid g2">' +
        s.paths.map(function (p) { return '<article class="card"><div class="c-ic">' + ic(p[2]) + '</div><h4>' + p[0] + '</h4><p>' + p[1] + '</p></article>'; }).join('') + '</div></div></section>';
    } else {
      mid = '<section class="band band--surface"><div class="wrap wrap--content"><p class="lede">' + s.body + '</p></div></section>';
    }
    var fits = (s.fits || []).map(function (pr) {
      var x = AX.product(pr); if (!x) return '';
      return '<a class="xlink" href="/platform/' + x.slug + '"><span class="xk">Product</span><b>' + ic(x.icon) + x.nav + '</b></a>';
    }).join('');
    var secs = (s.sectors || []).map(function (se) {
      var x = AX.sector(se); if (!x) return '';
      return '<a class="xlink" href="/solutions/' + x.slug + '"><span class="xk">Solution</span><b>' + ic(x.icon) + x.nav + '</b></a>';
    }).join('');

    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(s.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + s.h1 + '</h1><p class="lede" style="margin-top:1rem">' + s.sub + '</p>' +
        '<div class="btnrow" style="margin-top:1.6rem">' + btn(s.cta, '/contact?topic=' + s.slug, 'btn--primary btn--lg') + btn('Book a demo', '/contact?topic=demo', 'btn--ghost btn--lg', false) + '</div></div></section>' +
      mid +
      '<section class="band band--tight"><div class="wrap"><div class="sec-head" style="margin-bottom:1.2rem">' + eyebrow('Fits with', 'plain') + '</div><div class="crosslinks">' + fits + secs + '</div></div></section>' +
      closingCTA('talk');
  };

  /* ---------------------------------------------------------- TRUST */
  PAGES.trust = function () {
    var t = C.pages.trust;
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(t.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + t.h1 + '</h1><p class="lede" style="margin-top:1rem">' + t.sub + '</p></div></section>' +

      '<section class="band band--flush-top"><div class="wrap split">' +
        '<div>' + eyebrow(t.demo.eyebrow) + '<h2 style="margin-top:.6rem">' + t.demo.heading + '</h2><p class="lede" style="margin-top:1rem">' + t.demo.body + '</p></div>' +
        '<div><div class="ph ph--video" role="img" aria-label="Placeholder for the product demo film"><div class="ph-play">' + ic('play') + '</div><span class="ph-t">2-minute demo</span><span class="ph-d">Replace with the real film. Captions on; provide a transcript.</span><span class="ph-cc">CC · ON</span></div></div>' +
      '</div></section>' +

      '<section class="band band--surface"><div class="wrap wrap--content">' + eyebrow(t.accessibility.eyebrow, 'include') + '<h2 style="margin-top:.6rem">' + t.accessibility.heading + '</h2>' +
        '<div class="prose" style="margin-top:1.2rem"><p class="lede">' + t.accessibility.p1 + '</p><p class="lede">' + t.accessibility.p2 + '</p></div>' +
        '<div class="card include" style="margin-top:1.6rem"><p><strong>' + t.accessibility.honestFraming.strong + '</strong> ' + t.accessibility.honestFraming.body + '</p></div>' +
        '<p class="counsel-note">' + t.accessibility.counselNote + '</p>' +
        '<div class="card" style="margin-top:1.6rem"><h4>' + t.accessibility.barrier.heading + '</h4><p style="margin-top:.4rem">' + t.accessibility.barrier.body + '</p><div class="btnrow" style="margin-top:1rem">' + btn(t.accessibility.barrier.cta, '/contact?topic=barrier', 'btn--primary') + '</div></div></div></section>' +

      '<section class="band"><div class="wrap"><div class="sec-head">' + eyebrow(t.signals.eyebrow) + '<h2>' + t.signals.heading + '</h2></div>' +
        '<div class="badgewall">' + t.signals.badges.map(badge).join('') + '</div>' +
        '<div class="legalnote" style="margin-top:1.4rem">' + ic('shield') + '<div><strong>' + t.signals.aiNote.strong + '</strong> ' + t.signals.aiNote.body + '</div></div></div></section>' +

      '<section class="band band--surface"><div class="wrap wrap--content">' + eyebrow(t.data.eyebrow) + '<h2 style="margin-top:.6rem">' + t.data.heading + '</h2>' +
        '<p class="lede" style="margin-top:1rem">' + t.data.body + '</p>' +
        '<ul class="checklist">' + t.data.checklist.map(function (c) { return '<li>' + ic('check') + '<span>' + c + '</span></li>'; }).join('') + '</ul></div></section>' +
      closingCTA('demo');
  };

  /* ---------------------------------------------------------- ABOUT */
  PAGES.about = function () {
    var a = C.pages.about;
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(a.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + a.h1 + '</h1><p class="lede" style="margin-top:1rem">' + a.sub + '</p></div></section>' +
      '<section class="band band--flush-top"><div class="wrap wrap--content">' + eyebrow(a.whatWeDo.eyebrow) + '<h2 style="margin-top:.6rem">' + a.whatWeDo.heading + '</h2>' +
        '<div class="prose" style="margin-top:1.2rem"><p class="lede">' + a.whatWeDo.p1 + '</p><p class="lede">' + a.whatWeDo.p2 + '</p></div>' +
        '<div class="badgewall three" style="margin-top:1.6rem">' + a.whatWeDo.badges.map(badge).join('') + '</div></div></section>' +
      '<section class="band band--surface"><div class="wrap"><div class="sec-head">' + eyebrow(a.values.eyebrow) + '<h2>' + a.values.heading + '</h2></div>' +
        '<div class="grid g3">' + a.values.cards.map(function (c) { return '<article class="card"><div class="c-ic">' + ic(c.icon) + '</div><h4>' + c.h + '</h4><p>' + c.body + '</p></article>'; }).join('') + '</div></div></section>' +
      closingCTA('demo');
  };

  /* ---------------------------------------------------------- CONTACT */
  PAGES.contact = function (query) {
    var c = C.pages.contact, topic = query.topic || 'demo', sector = query.sector || '';
    if (['services', 'content', 'consultancy', 'workshops', 'hardware'].indexOf(topic) > -1) topic = 'services';
    var T = {
      demo: { h: c.h1, sub: c.sub, submit: c.demoForm.submit, note: c.demoForm.note, success: c.demoForm.success, mode: 'demo', key: 'demo' },
      'spec-sheet': { h: 'Get the accessibility spec sheet', sub: 'Tell us where to send it — a plain-language overview of Attune’s nine categories and how they map to XAUR, EN 301 549, and WCAG. No demo required.', submit: 'Email me the spec sheet', note: 'A PDF, straight to your inbox. We only follow up if you ask us to.', success: 'On its way — check your inbox.', mode: 'lite', key: 'spec' },
      docs: { h: 'Get the developer docs', sub: 'Where should we send your access link to the AgoraXR SDK documentation?', submit: 'Send me the docs', note: 'A link to the docs, straight to your inbox.', success: 'On its way — check your inbox.', mode: 'lite', key: 'docs' },
      sdk: { h: 'Get the SDK', sub: 'Where should we send your SDK download and getting-started guide?', submit: 'Send me the SDK', note: 'The SDK and a getting-started guide, to your inbox.', success: 'On its way — check your inbox.', mode: 'lite', key: 'sdk' },
      services: { h: 'Talk to us', sub: 'Tell us about your space and where you’re headed — we’ll come back with how we can help.', submit: 'Start the conversation', note: 'We’ll be in touch within one business day.', success: c.demoForm.success, mode: 'talk', key: 'talk' },
      barrier: { h: c.barrierForm.heading, sub: c.barrierForm.note, submit: c.barrierForm.submit, note: c.barrierForm.note, success: c.barrierForm.success, mode: 'barrier', key: 'barrier' }
    };
    var t = T[topic] || T.demo;
    var sectorOpts = '<option value="">Select…</option>' + C.sectors.map(function (s) {
      return '<option value="' + s.slug + '"' + (s.slug === sector ? ' selected' : '') + '>' + s.nav + '</option>';
    }).join('');
    function field(id, label, type, req, errmsg) {
      var desc = req ? ' aria-describedby="err-' + id + '"' : '';
      var input = type === 'textarea'
        ? '<textarea id="cf-' + id + '" name="' + id + '"' + (req ? ' required' : '') + desc + '></textarea>'
        : '<input id="cf-' + id + '" name="' + id + '" type="' + (type || 'text') + '"' + (req ? ' required' : '') + desc + '>';
      return '<div class="field"><label for="cf-' + id + '">' + label + '</label>' + input +
        (req ? '<span class="err" id="err-' + id + '" role="alert">' + errmsg + '</span>' : '') + '</div>';
    }
    var sectorField = '<div class="field"><label for="cf-sector">Your space</label><select id="cf-sector" name="sector">' + sectorOpts + '</select></div>';
    var nameF = field('name', 'Name', 'text', true, 'Please enter your name.');
    var emailF = field('email', 'Work email', 'email', true, 'Please enter a valid email.');
    var fields;
    if (t.mode === 'lite') fields = nameF + emailF + field('org', 'Organisation (optional)', 'text', false);
    else if (t.mode === 'barrier') fields = nameF + emailF + field('message', 'What happened?', 'textarea', true, 'Please describe the barrier.');
    else if (t.mode === 'talk') fields = nameF + emailF + field('org', 'Organisation', 'text', false) + sectorField + field('message', 'What are you trying to do? (optional)', 'textarea', false);
    else fields = nameF + emailF + field('org', 'Organisation', 'text', false) + sectorField +
      '<div class="field"><label for="cf-role">Role &amp; scale (optional)</label><input id="cf-role" name="role" placeholder="e.g. Head of Digital · 8 sites"></div>' +
      field('message', 'Anything we should know? (optional)', 'textarea', false);

    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(c.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + t.h + '</h1><p class="lede" style="margin-top:1rem">' + t.sub + '</p></div></section>' +

      '<section class="band band--flush-top"><div class="wrap split" style="align-items:start">' +
        '<div class="form-card"><form data-form="' + t.key + '" novalidate>' + fields +
          '<button class="btn btn--primary btn--lg" type="submit" style="width:100%">' + t.submit + '</button>' +
          '<p class="form-note">' + t.note + '</p>' +
          '<p class="form-success" role="status" data-success="' + t.key + '">' + ic('check') + t.success + '</p>' +
        '</form></div>' +
        '<div><div class="card"><h4>What happens next</h4><ul class="checklist" style="margin-top:1rem">' +
          '<li>' + ic('check') + '<span>We reply within one business day.</span></li>' +
          '<li>' + ic('check') + '<span>A short call to understand your space.</span></li>' +
          '<li>' + ic('check') + '<span>A live walkthrough — real content, live control, Attune configuring headsets.</span></li>' +
        '</ul></div>' +
        '<div class="card include" style="margin-top:1.5rem"><h4>' + c.newsletterForm.heading + '</h4><p style="margin-top:.4rem">' + c.newsletterForm.note + '</p>' +
          '<form class="newsletter" data-form="newsletter" novalidate><label for="nl2" class="sr-only">Your email</label><input id="nl2" type="email" name="email" placeholder="Your email" required aria-describedby="nl2-err"><button class="btn btn--secondary" type="submit">' + c.newsletterForm.submit + '</button><span class="err nl-err" id="nl2-err" role="alert">Enter a valid email address.</span></form>' +
          '<p class="form-note">' + c.newsletterForm.consent + '</p>' +
          '<p class="form-success" role="status" data-success="newsletter">' + ic('check') + c.newsletterForm.success + '</p></div>' +
        '</div>' +
      '</div></section>';
  };

  /* ---------------------------------------------------------- STUB / 404 */
  PAGES.stub = function (key) {
    var titles = { privacy: 'Privacy', terms: 'Terms', cookies: 'Cookie settings', gdpr: 'Data & GDPR', careers: 'Careers' };
    var title = titles[key] || 'Page';
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(title) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + title + '</h1>' +
        '<p class="lede" style="margin-top:1rem">This page is a placeholder in the rework. Drop your ' + title.toLowerCase() + ' content here.</p>' +
        '<div class="btnrow" style="margin-top:1.6rem">' + btn('Back home', '/', 'btn--ghost', false) + '</div></div></section>';
  };
  PAGES.notfound = function () {
    var n = C.pages.notfound;
    return '<section class="hero" style="min-height:60vh;display:flex;align-items:center"><div class="hero-aura"></div><div class="wrap wrap--content center">' +
        eyebrow(n.eyebrow, 'plain') + '<h1 style="font-size:var(--fs-3xl);margin-top:.6rem">' + n.h1 + '</h1>' +
        '<p class="lede" style="margin:1rem auto 0">' + C.microcopy.notFound + '</p>' +
        '<div class="btnrow" style="margin-top:1.6rem;justify-content:center">' + btn(n.primaryCTA, '/', 'btn--primary btn--lg', false) + btn(n.secondaryCTA, '/platform', 'btn--ghost btn--lg', false) + '</div></div></section>';
  };

  /* ---------------------------------------------------------- COMPARISON */
  PAGES.compare = function (slug) {
    var c = C.compare && C.compare[slug]; if (!c) return PAGES.notfound();
    var rows = c.table.rows.map(function (r) {
      return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td><td class="td-managed">' + r[2] + '</td></tr>';
    }).join('');
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(c.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + c.h1 + '</h1><p class="lede" style="margin-top:1rem">' + c.sub + '</p></div></section>' +
      '<section class="band band--flush-top"><div class="wrap wrap--content"><p class="lede">' + c.intro + '</p></div></section>' +
      '<section class="band band--surface"><div class="wrap"><div class="cmp-wrap"><table class="cmp-table">' +
        '<thead><tr><th scope="col">' + c.table.cols[0] + '</th><th scope="col">' + c.table.cols[1] + '</th><th scope="col" class="td-managed">' + c.table.cols[2] + '</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div></section>' +
      '<section class="band"><div class="wrap wrap--content">' + eyebrow(c.whenDiy.heading, 'plain') + '<h2 style="margin-top:.6rem">' + c.whenDiy.heading + '</h2><p class="lede" style="margin-top:1rem">' + c.whenDiy.body + '</p>' +
        '<div class="btnrow" style="margin-top:1.6rem">' + btn(c.cta, '/contact?topic=demo', 'btn--primary btn--lg') + btn('Compare the two layers', '/platform', 'btn--ghost btn--lg', false) + '</div></div></section>' +
      closingCTA('demo');
  };

  /* ---------------------------------------------------------- PILLAR GUIDE */
  function faqJsonLd(faq) {
    var items = faq.map(function (f) {
      return '{"@type":"Question","name":' + JSON.stringify(stripTags(f.q)) + ',"acceptedAnswer":{"@type":"Answer","text":' + JSON.stringify(stripTags(f.a)) + '}}';
    }).join(',');
    return '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[' + items + ']}<\/script>';
  }
  PAGES.guide = function (slug) {
    var g = C.guides && C.guides[slug]; if (!g) return PAGES.notfound();
    var secs = g.sections.map(function (s) {
      return '<section class="band band--tight"><div class="wrap wrap--content"><h2>' + s.h + '</h2><p class="lede" style="margin-top:.8rem">' + s.body + '</p></div></section>';
    }).join('');
    var faq = '<section class="band band--surface"><div class="wrap wrap--content"><div class="sec-head">' + eyebrow('FAQ') + '<h2>Common questions.</h2></div>' +
      g.faq.map(function (f) { return '<details class="faq-item"><summary>' + f.q + '</summary><p>' + f.a + '</p></details>'; }).join('') + '</div></section>';
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(g.eyebrow, 'include') + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + g.h1 + '</h1><p class="lede" style="margin-top:1rem">' + g.sub + '</p></div></section>' +
      secs + faq + faqJsonLd(g.faq) + closingCTA('spec');
  };

  /* ---------------------------------------------------------- CALCULATOR */
  var CALC_INPUTS = [
    { group: 'Your space', items: [
      { id: 'headsets', label: 'Number of headsets', def: 10, min: 1, max: 200, step: 1, unit: 'headsets', help: 'How many devices run at once in the room.' },
      { id: 'hoursPerDay', label: 'Operating hours per day', def: 6, min: 0.5, max: 16, step: 0.5, unit: 'hours/day', help: 'Hours the space actually runs sessions.' },
      { id: 'daysPerYear', label: 'Days open per year', def: 250, min: 1, max: 365, step: 1, unit: 'days/year', help: 'Trading, teaching, or exhibit days per year.' },
      { id: 'sessionMin', label: 'Average session length', def: 15, min: 1, max: 120, step: 1, unit: 'minutes', help: 'Time one visitor spends inside the experience.' },
      { id: 'valuePerSession', label: 'Ticket price or value per session', def: 12, min: 0, max: 500, step: 0.5, unit: '€', help: 'A ticket price, or your internal value of one completed session. Set to 0 to see people only.' }
    ] },
    { group: 'Without AgoraXR', items: [
      { id: 'changeoverBase', label: 'Changeover + onboarding per session', def: 8, min: 0, max: 60, step: 0.5, unit: 'minutes', help: 'Fit the headset, brief a first-timer, reset between people — baseline, unoptimised.' },
      { id: 'opsPerHeadsetBase', label: 'Operators needed per headset', def: 1, min: 0.1, max: 1, step: 0.1, unit: 'ops/headset', help: 'The unmanaged case: roughly one staff member per device.' }
    ] },
    { group: 'With AgoraXR', banner: true, items: [
      { id: 'changeoverWith', label: 'Changeover + onboarding (optimised)', def: 5, min: 0, max: 60, step: 0.5, unit: 'minutes', assumption: true, help: 'Your estimate with faster onboarding and Attune keeping first-timers comfortable.' },
      { id: 'dropoffReductionPct', label: 'Drop-off reduction', def: 10, min: 0, max: 60, step: 1, unit: '%', assumption: true, help: 'Your estimate of how many sessions you save because fewer first-timers quit early.' },
      { id: 'headsetsPerOp', label: 'Headsets per operator', def: 10, min: 1, max: 100, step: 1, unit: 'headsets/op', assumption: true, help: 'How many devices one operator can run from a single hub.' }
    ] }
  ];
  function calcField(it) {
    return '<div class="calc-field"><label for="calc-' + it.id + '">' + it.label + (it.assumption ? ' <span class="assume-pill">your assumption</span>' : '') + '</label>' +
      '<div class="calc-controls">' +
        '<input type="range" data-calc="' + it.id + '" min="' + it.min + '" max="' + it.max + '" step="' + it.step + '" value="' + it.def + '" aria-label="' + it.label + '" aria-describedby="help-' + it.id + '">' +
        '<span class="calc-num-wrap"><input type="number" inputmode="decimal" id="calc-' + it.id + '" data-calc="' + it.id + '" min="' + it.min + '" max="' + it.max + '" step="' + it.step + '" value="' + it.def + '" aria-describedby="help-' + it.id + '"><span class="calc-unit">' + it.unit + '</span></span>' +
      '</div><p class="calc-help" id="help-' + it.id + '">' + it.help + '</p></div>';
  }
  function calcTile(label, id) {
    return '<div class="calc-tile"><div class="calc-n" id="res-' + id + '">—</div><div class="calc-l">' + label + '</div><div class="calc-sub" id="res-' + id + '-sub"></div></div>';
  }
  PAGES.calculator = function () {
    var k = C.calculator;
    var fs = CALC_INPUTS.map(function (g) {
      return '<fieldset class="calc-group"><legend>' + g.group + '</legend>' +
        (g.banner ? '<p class="calc-banner">' + k.banner + '</p>' : '') +
        g.items.map(calcField).join('') + '</fieldset>';
    }).join('');
    return '<section class="hero band--flush-top"><div class="hero-aura"></div><div class="wrap wrap--content">' +
        eyebrow(k.eyebrow) + '<h1 style="font-size:var(--fs-2xl);margin-top:.6rem">' + k.h1 + '</h1><p class="lede" style="margin-top:1rem">' + k.intro + '</p></div></section>' +
      '<section class="band band--flush-top"><div class="wrap"><div class="calc"><div class="calc-grid">' +
        '<form class="calc-form" novalidate>' + fs + '<button type="button" class="btn btn--ghost calc-reset">Reset to defaults</button></form>' +
        '<div class="calc-out">' +
          '<div class="calc-results" aria-live="polite">' +
            calcTile('People per hour', 'peopleHour') + calcTile('People per year', 'peopleYear') +
            calcTile('Estimated value / year', 'valueYear') + calcTile('Operators to run the room', 'operators') +
          '</div>' +
          '<p class="calc-caveat">' + k.caveat + '</p>' +
          '<details class="calc-disclosure"><summary>How this is calculated →</summary><ul class="checklist" style="margin-top:1rem">' +
            k.disclosure.map(function (d) { return '<li>' + ic('check') + '<span>' + d + '</span></li>'; }).join('') + '</ul></details>' +
          '<div class="card" style="margin-top:1.6rem"><div class="btnrow">' + btn(k.cta, '/contact?topic=demo', 'btn--primary btn--lg') + '</div>' +
            '<p class="form-note" style="margin-top:.8rem">' + k.ctaSupport + '</p>' +
            '<p style="margin-top:.6rem">' + btn(k.secondary, '/platform/agora-command', 'link-arrow', false).replace('class="btn link-arrow"', 'class="link-arrow"') + '</p></div>' +
        '</div>' +
      '</div></div></div></section>';
  };
  function calcCompute(s) {
    var headsets = Math.max(0, Math.round(s.headsets));
    var sessionMin = Math.max(0, s.sessionMin), hoursPerDay = Math.max(0, s.hoursPerDay);
    var daysPerYear = Math.min(365, Math.max(0, s.daysPerYear)), valuePerSession = Math.max(0, s.valuePerSession);
    var cycleBase = sessionMin + Math.max(0, s.changeoverBase), cycleWith = sessionMin + Math.max(0, s.changeoverWith);
    var mpd = hoursPerDay * 60;
    var sphBase = cycleBase > 0 ? mpd / cycleBase : 0, sphWith = cycleWith > 0 ? mpd / cycleWith : 0;
    var peopleDayBase = headsets * sphBase, peopleDayWith = headsets * sphWith * (1 + Math.max(0, s.dropoffReductionPct) / 100);
    var peopleHourBase = hoursPerDay > 0 ? peopleDayBase / hoursPerDay : 0, peopleHourWith = hoursPerDay > 0 ? peopleDayWith / hoursPerDay : 0;
    var peopleYearBase = peopleDayBase * daysPerYear, peopleYearWith = peopleDayWith * daysPerYear;
    var valueYearBase = peopleYearBase * valuePerSession, valueYearWith = peopleYearWith * valuePerSession;
    var operatorsBase = Math.ceil(headsets * Math.max(0, Math.min(1, s.opsPerHeadsetBase)));
    var operatorsWith = s.headsetsPerOp > 0 ? Math.ceil(headsets / s.headsetsPerOp) : operatorsBase;
    var operatorsSaved = Math.max(0, operatorsBase - operatorsWith);
    return {
      peopleHourBase: peopleHourBase, peopleHourWith: peopleHourWith,
      peopleYearWith: peopleYearWith, extraPeopleYear: peopleYearWith - peopleYearBase,
      valueYearWith: valueYearWith, extraValueYear: valueYearWith - valueYearBase,
      operatorsBase: operatorsBase, operatorsWith: operatorsWith, operatorsSaved: operatorsSaved,
      staffHoursSavedYear: operatorsSaved * hoursPerDay * daysPerYear,
      peopleUpliftPct: peopleYearBase > 0 ? (peopleYearWith - peopleYearBase) / peopleYearBase * 100 : NaN,
      valuePerSession: valuePerSession
    };
  }
  function calcRender(root) {
    var s = {};
    CALC_INPUTS.forEach(function (g) { g.items.forEach(function (it) { var el = document.getElementById('calc-' + it.id); var v = el ? parseFloat(el.value) : it.def; s[it.id] = isFinite(v) ? v : it.def; }); });
    var o = calcCompute(s);
    function n0(x) { return isFinite(x) ? Math.round(x).toLocaleString() : '—'; }
    function n1(x) { return isFinite(x) ? x.toFixed(1) : '—'; }
    function eur(x) { if (!isFinite(x)) return '—'; try { return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(x); } catch (e) { return '€' + n0(x); } }
    function set(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }
    set('res-peopleHour', n1(o.peopleHourWith));
    set('res-peopleHour-sub', 'vs ' + n1(o.peopleHourBase) + ' without' + (isFinite(o.peopleUpliftPct) ? ' · +' + Math.round(o.peopleUpliftPct) + '%' : ''));
    set('res-peopleYear', n0(o.peopleYearWith));
    set('res-peopleYear-sub', '+' + n0(o.extraPeopleYear) + ' more than baseline');
    if (o.valuePerSession > 0) { set('res-valueYear', eur(o.valueYearWith)); set('res-valueYear-sub', '+' + eur(o.extraValueYear) + ' vs baseline'); }
    else { set('res-valueYear', '—'); set('res-valueYear-sub', 'Set a value or ticket price to estimate €.'); }
    set('res-operators', n0(o.operatorsWith));
    set('res-operators-sub', 'vs ' + n0(o.operatorsBase) + ' one-per-headset' + (o.operatorsSaved > 0 ? ' · saves ' + n0(o.staffHoursSavedYear) + ' staff-hrs/yr' : ' · no operator saving at these settings'));
  }
  function initCalculator() {
    document.addEventListener('input', function (e) {
      var t = e.target, id = t && t.getAttribute && t.getAttribute('data-calc'); if (!id) return;
      var root = document.querySelector('.calc'); if (!root) return;
      $$('[data-calc="' + id + '"]', root).forEach(function (o) { if (o !== t) o.value = t.value; });
      calcRender(root);
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.calc-reset'); if (!b) return;
      var root = document.querySelector('.calc'); if (!root) return;
      CALC_INPUTS.forEach(function (g) { g.items.forEach(function (it) { $$('[data-calc="' + it.id + '"]', root).forEach(function (o) { o.value = it.def; }); }); });
      calcRender(root);
    });
    document.addEventListener('route:rendered', function () { var root = document.querySelector('.calc'); if (root) calcRender(root); });
  }

  /* =================================================================== ROUTER
     Path-based (History API). Old #/… and /sectors/… links still resolve. */
  /* Deploy sub-path (e.g. "/AgoraXRWebsiteTest" on GitHub Pages project sites).
     Empty on a root/custom-domain deploy. Set by the prerender build via window.__BASE__. */
  var BASE = (typeof window !== 'undefined' && window.__BASE__) ? String(window.__BASE__).replace(/\/+$/, '') : '';
  function normalizePath(path) {
    path = (path || '/').split('#')[0].split('?')[0];
    path = path.replace(/index\.html?$/i, '');
    if (BASE && (path === BASE || path.indexOf(BASE + '/') === 0)) path = path.slice(BASE.length);  // strip deploy sub-path
    if (path.length > 1) path = path.replace(/\/+$/, '');
    return path || '/';
  }
  function parseQuery(search) {
    var query = {};
    (search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
      if (!kv) return; var p = kv.split('=');
      query[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' '));
    });
    return query;
  }
  var SVC_SLUGS = ['content', 'consultancy', 'workshops', 'hardware'];
  function parseRoute(path, search) {
    var query = parseQuery(search);
    var parts = normalizePath(path).split('/').filter(Boolean);
    var p0 = parts[0], p1 = parts[1];

    /* backward-compatible aliases (old → new) */
    if (p0 === 'sectors' && p1) return { name: 'sector', slug: p1, query: query };
    if (p0 === 'developers') return { name: 'sdk', query: query };
    if (p0 === 'page' && p1) return { name: 'stub', key: p1, query: query };
    if (p0 === 'platform' && p1 && SVC_SLUGS.indexOf(p1) > -1) return { name: 'service', slug: p1, query: query };

    if (!p0) return { name: 'home', query: query };
    if (p0 === 'solutions') return p1 ? { name: 'sector', slug: p1, query: query } : { name: 'solutionsIndex', query: query };
    if (p0 === 'platform') {
      if (!p1) return { name: 'platform', query: query };
      if (p1 === 'attune') return { name: 'attune', query: query };
      if (p1 === 'sdk') return { name: 'sdk', query: query };
      if (p1 === 'agora-command') return { name: 'command', query: query };
      return { name: 'notfound', query: query };
    }
    if (p0 === 'services') return p1 ? { name: 'service', slug: p1, query: query } : { name: 'servicesIndex', query: query };
    if (p0 === 'calculator') return { name: 'calculator', query: query };
    if (p0 === 'compare' && p1) return { name: 'compare', slug: p1, query: query };
    if (p0 === 'guides' && p1) return { name: 'guide', slug: p1, query: query };
    if (p0 === 'trust') return { name: 'trust', query: query };
    if (p0 === 'about') return { name: 'about', query: query };
    if (p0 === 'contact') return { name: 'contact', query: query };
    if (p0 === 'legal' && p1) return { name: 'stub', key: p1, query: query };
    return { name: 'notfound', query: query };
  }

  var TITLES = { home: 'AgoraXR — Run XR at scale, for everyone', solutionsIndex: 'Solutions — AgoraXR',
    platform: 'Platform — AgoraXR', command: 'Agora Command — AgoraXR', attune: 'Attune — AgoraXR',
    sdk: 'Developers & SDK — AgoraXR', servicesIndex: 'Services — AgoraXR', trust: 'Trust — AgoraXR',
    about: 'About — AgoraXR', contact: 'Book a demo — AgoraXR', notfound: 'Not found — AgoraXR' };

  function metaDesc(r) {
    try {
      switch (r.name) {
        case 'sector': var s = AX.sector(r.slug); return s ? s.sub : C.hero.sub;
        case 'service': var v = AX.service(r.slug); return v ? v.sub : C.hero.sub;
        case 'platform': return C.pages.platform.sub;
        case 'command': return AX.product('agora-command').sub;
        case 'attune': return C.pages.attune.sub;
        case 'sdk': return C.pages.developers.sub;
        case 'trust': return C.pages.trust.sub;
        case 'about': return C.pages.about.sub;
        case 'contact': return C.pages.contact.sub;
        case 'solutionsIndex': return 'AgoraXR solutions by sector — museums, education, training, enterprise, healthcare, events, and travel. Run XR at scale, comfortable and accessible for every visitor.';
        case 'servicesIndex': return 'AgoraXR services — content, consultancy, workshops, and hardware. One partner, from empty room to full house.';
        case 'calculator': return 'Estimate XR throughput and value for your space — people per hour, per year, and operator leverage. A transparent, adjustable calculator; estimates, not promises.';
        case 'compare': return (C.compare && C.compare[r.slug]) ? C.compare[r.slug].metaDesc : C.hero.sub;
        case 'guide': return (C.guides && C.guides[r.slug]) ? C.guides[r.slug].metaDesc : C.hero.sub;
        default: return C.hero.sub;
      }
    } catch (e) { return C.hero.sub; }
  }

  /* map a parsed route → HTML (pure; used by browser + Node prerender) */
  function routeHtml(r) {
    switch (r.name) {
      case 'solutionsIndex': return PAGES.solutionsIndex();
      case 'sector': return PAGES.sector(r.slug);
      case 'platform': return PAGES.platform();
      case 'command': return PAGES.command();
      case 'attune': return PAGES.attune();
      case 'sdk': return PAGES.sdk();
      case 'servicesIndex': return PAGES.servicesIndex();
      case 'service': return PAGES.service(r.slug);
      case 'calculator': return PAGES.calculator ? PAGES.calculator() : PAGES.notfound();
      case 'compare': return PAGES.compare ? PAGES.compare(r.slug) : PAGES.notfound();
      case 'guide': return PAGES.guide ? PAGES.guide(r.slug) : PAGES.notfound();
      case 'trust': return PAGES.trust();
      case 'about': return PAGES.about();
      case 'contact': return PAGES.contact(r.query || {});
      case 'stub': return PAGES.stub(r.key);
      case 'notfound': return PAGES.notfound();
      default: return PAGES.home();
    }
  }
  function titleFor(r) {
    if (r.name === 'sector') { var s = AX.sector(r.slug); return s ? s.nav + ' — AgoraXR' : TITLES.notfound; }
    if (r.name === 'service') { var v = AX.service(r.slug); return v ? v.nav + ' — AgoraXR' : TITLES.notfound; }
    if (r.name === 'calculator') return 'XR throughput & ROI calculator — AgoraXR';
    if (r.name === 'compare') return (C.compare && C.compare[r.slug] ? stripTags(C.compare[r.slug].h1) : 'Compare') + ' — AgoraXR';
    if (r.name === 'guide') return (C.guides && C.guides[r.slug] ? stripTags(C.guides[r.slug].h1) : 'Guide') + ' — AgoraXR';
    if (r.name === 'stub') return 'AgoraXR';
    return TITLES[r.name] || TITLES.home;
  }
  function stripTags(s) { return String(s).replace(/<[^>]+>/g, ''); }

  function currentRoute() {
    var h = location.hash;
    if (h && h.charAt(0) === '#' && h.charAt(1) === '/') {   // old hash bookmark → real path
      var hp = h.slice(1), hqi = hp.indexOf('?');
      var path = hqi > -1 ? hp.slice(0, hqi) : hp, search = hqi > -1 ? hp.slice(hqi) : '';
      if (history.replaceState) history.replaceState(null, '', BASE + path + search);
      return parseRoute(path, search);
    }
    return parseRoute(location.pathname, location.search);
  }
  function navigate(href) {
    /* authored links are root-absolute ("/contact"); prefix the deploy sub-path for the real URL */
    var url = (BASE && href.charAt(0) === '/') ? BASE + href : href;
    if (history.pushState) history.pushState(null, '', url);
    render();
  }

  function render() {
    closeAllMenus(); closeMobile();
    var r = currentRoute();
    var html = routeHtml(r), title = titleFor(r), desc = metaDesc(r);
    var app = document.getElementById('app');
    app.innerHTML = html;
    document.title = title;
    var rs = document.getElementById('route-status');
    if (rs) rs.textContent = title.split(' — ')[0] + ' — page loaded';
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', desc);
    var ogt = document.querySelector('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', title);
    var ogd = document.querySelector('meta[property="og:description"]'); if (ogd) ogd.setAttribute('content', desc);
    var np = normalizePath(location.pathname);
    var canon = document.querySelector('link[rel="canonical"]'); if (canon) canon.setAttribute('href', 'https://www.agoraxr.example' + (np === '/' ? '/' : np + '/'));
    setActiveNav(r);
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
    observeReveals();
    document.dispatchEvent(new CustomEvent('route:rendered', { detail: r }));
  }

  function setActiveNav(r) {
    $$('.nav-link').forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    var fam = { solutionsIndex: 'solutions', sector: 'solutions', platform: 'platform', command: 'platform', attune: 'platform', sdk: 'platform', servicesIndex: 'services', service: 'services' }[r.name];
    if (fam) { var t = document.querySelector('.nav-item[data-menu="' + fam + '"] > button.nav-link'); if (t) { t.classList.add('active'); t.setAttribute('aria-current', 'page'); } }
    var linkMap = { trust: '/trust', about: '/about' };
    if (linkMap[r.name]) { var l = document.querySelector('.nav-link[href="' + linkMap[r.name] + '"]'); if (l) { l.classList.add('active'); l.setAttribute('aria-current', 'page'); } }
  }

  /* ---------------------------------------------------------- desktop menus */
  function closeAllMenus() {
    $$('.nav-item[data-menu] > button.nav-link').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    $$('.dropdown').forEach(function (d) { d.setAttribute('data-open', 'false'); });
  }
  function openMenu(item) {
    closeAllMenus();
    var btnEl = item.querySelector('button.nav-link'), dd = item.querySelector('.dropdown');
    if (btnEl) btnEl.setAttribute('aria-expanded', 'true'); if (dd) dd.setAttribute('data-open', 'true');
  }
  function initMenus() {
    $$('.nav-item[data-menu]').forEach(function (item) {
      var btnEl = item.querySelector('button.nav-link');
      item.addEventListener('mouseenter', function () { openMenu(item); });
      item.addEventListener('mouseleave', function () { closeAllMenus(); });
      if (btnEl) btnEl.addEventListener('click', function (e) { e.preventDefault(); var open = btnEl.getAttribute('aria-expanded') === 'true'; if (open) closeAllMenus(); else openMenu(item); });
      item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) closeAllMenus(); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAllMenus(); closeMobile(); } });
    document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeAllMenus(); });
  }

  /* ---------------------------------------------------------- mobile nav */
  function closeMobile() {
    var m = document.getElementById('mobileNav'), b = document.getElementById('burger');
    if (m) m.setAttribute('data-open', 'false');
    if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Open menu'); }
    document.body.style.overflow = '';
  }
  function mobileFocusables(m) {
    return $$('a[href], button:not([disabled]), input, select, summary, [tabindex]:not([tabindex="-1"])', m)
      .filter(function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement; });
  }
  function initMobile() {
    var b = document.getElementById('burger'), m = document.getElementById('mobileNav');
    b.addEventListener('click', function () {
      var open = m.getAttribute('data-open') === 'true';
      if (open) { closeMobile(); b.focus(); return; }
      m.setAttribute('data-open', 'true'); b.setAttribute('aria-expanded', 'true'); b.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      var f = mobileFocusables(m); if (f[0]) f[0].focus();
    });
    m.addEventListener('click', function (e) { if (e.target.closest('a')) closeMobile(); });
    m.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = mobileFocusables(m); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------------------------------------------------- Attune fx */
  function applyFx(el, fx, target) {
    if (!el) return;
    if (fx === 'scale') el.style.setProperty('--ui-scale', target.value);
    else if (fx === 'bright') el.style.setProperty('--scene-bright', target.value);
    else if (fx === 'cb') el.setAttribute('data-cb', target.value);
    else el.classList.toggle(fx, target.checked);
    announceScene(el);
  }
  function announceScene(el) {
    var status = document.getElementById(el.id + '-status'); if (!status) return;
    var parts = [
      'Captions ' + (el.classList.contains('cap') ? 'on' : 'off'),
      'high-contrast UI ' + (el.classList.contains('hc') ? 'on' : 'off'),
      'comfort vignette ' + (el.classList.contains('vig') ? 'on' : 'off'),
      'reference point ' + (el.classList.contains('ref') ? 'on' : 'off')
    ];
    var scale = parseFloat(el.style.getPropertyValue('--ui-scale') || '1');
    parts.push('UI scale ' + Math.round(scale * 100) + '%');
    var cb = el.getAttribute('data-cb'); if (cb && cb !== 'none') parts.push(cb + ' colour filter');
    status.textContent = parts.join(', ') + '.';
  }
  function initAttune() {
    function handle(e) { var t = e.target; if (t && t.getAttribute && t.getAttribute('data-scene')) applyFx(document.getElementById(t.getAttribute('data-scene')), t.getAttribute('data-fx'), t); }
    document.addEventListener('input', handle);
    document.addEventListener('change', handle);
  }

  /* ---------------------------------------------------------- forms */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function initForms() {
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('form[data-form]'); if (!form) return;
      e.preventDefault();
      var ok = true;
      $$('.field', form).forEach(function (f) { f.classList.remove('invalid'); });
      $$('[required]', form).forEach(function (inp) {
        var bad = !inp.value.trim() || (inp.type === 'email' && !isEmail(inp.value));
        var field = inp.closest('.field');
        if (bad) { ok = false; if (field) field.classList.add('invalid'); inp.setAttribute('aria-invalid', 'true'); }
        else { inp.removeAttribute('aria-invalid'); }
      });
      if (!ok) { var firstBad = form.querySelector('[aria-invalid="true"]'); if (firstBad) firstBad.focus(); return; }
      var key = form.getAttribute('data-form');
      var success = form.querySelector('[data-success="' + key + '"]') || (form.parentNode && form.parentNode.querySelector('[data-success="' + key + '"]'));
      if (success) success.classList.add('show');
      form.reset();
      $$('[aria-invalid]', form).forEach(function (i) { i.removeAttribute('aria-invalid'); });
      $$('.field', form).forEach(function (f) { f.classList.remove('invalid'); });
    });
  }

  /* ---------------------------------------------------------- reveal */
  var revObserver;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); return; }
    if (!revObserver) revObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); revObserver.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.reveal:not(.in)').forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------------------------------------------------------- chrome */
  function initChrome() {
    var header = document.getElementById('siteheader'), totop = document.getElementById('totop');
    window.addEventListener('scroll', function () {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle('scrolled', y > 10);
      totop.setAttribute('data-show', y > 600 ? 'true' : 'false');
    }, { passive: true });
    totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
    var cookie = document.getElementById('cookie'), dismissed = false;
    setTimeout(function () { if (!dismissed) cookie.setAttribute('data-show', 'true'); }, 1400);
    document.getElementById('cookieAccept').addEventListener('click', function () { dismissed = true; cookie.setAttribute('data-show', 'false'); });
    document.getElementById('cookieManage').addEventListener('click', function () { dismissed = true; cookie.setAttribute('data-show', 'false'); navigate('/legal/cookies'); });
  }

  /* ---------------------------------------------------------- theme */
  function initTheme() {
    var btnEl = document.getElementById('themeToggle'); if (!btnEl) return;
    btnEl.addEventListener('click', function () {
      var d = document.documentElement;
      var cur = d.getAttribute('data-theme');
      if (!cur) cur = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      var next = cur === 'light' ? 'dark' : 'light';
      d.setAttribute('data-theme', next);
      try { localStorage.setItem('axr-theme', next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]:not([media])') || document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#FCF9F4' : '#211D1A');
    });
  }

  /* ---------------------------------------------------------- route list + prerender API */
  var ROUTES = ['/', '/solutions', '/platform', '/services', '/trust', '/about', '/contact',
    '/platform/agora-command', '/platform/attune', '/platform/sdk']
    .concat(PAGES.calculator ? ['/calculator'] : [])
    .concat(C.compare ? Object.keys(C.compare).map(function (k) { return '/compare/' + k; }) : [])
    .concat(C.guides ? Object.keys(C.guides).map(function (k) { return '/guides/' + k; }) : [])
    .concat(C.sectors.map(function (s) { return '/solutions/' + s.slug; }))
    .concat(C.services.map(function (s) { return '/services/' + s.slug; }))
    .concat(['/legal/privacy', '/legal/terms', '/legal/cookies', '/legal/gdpr', '/legal/careers']);

  window.AXR = {
    routes: ROUTES,
    nav: navParts(),
    render: function (path, search) {
      var r = parseRoute(path, search || '');
      return { name: r.name, html: routeHtml(r), title: titleFor(r), desc: metaDesc(r) };
    }
  };

  /* ---------------------------------------------------------- init (browser only) */
  if (typeof document !== 'undefined' && document.getElementById && document.getElementById('app')) {
    document.getElementById('year').textContent = new Date().getFullYear();
    initTheme();
    buildNav();
    initMenus();
    initMobile();
    initForms();
    initAttune();
    initCalculator();
    initChrome();
    /* intercept internal links → SPA nav (real URLs, History API) */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a'); if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '/') return;                 // only internal absolute paths
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      if (normalizePath(href) === normalizePath(location.pathname) && href.indexOf('?') === -1) { window.scrollTo(0, 0); return; }
      navigate(href);
    });
    window.addEventListener('popstate', render);
    render();
  }
})();
