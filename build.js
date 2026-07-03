#!/usr/bin/env node
/* =============================================================================
   AgoraXR — static prerender build.
   Runs js/data.js + js/app.js in a Node sandbox (no DOM → browser init is
   skipped, window.AXR is exposed), then writes one real, fully-populated HTML
   file per route into dist/ so search engines and LLMs see content and distinct
   URLs without executing JavaScript. The browser still hydrates for SPA-speed nav.

   Usage:  node build.js        (outputs to ./dist)
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const HOST = process.env.SITE_HOST || "https://www.agoraxr.example"; // origin only, e.g. https://jesterofgods.github.io
/* Sub-path the site is served under (GitHub Pages project sites live at /<repo>/).
   Leave empty for a root/custom-domain deploy. Normalised to "" or "/foo" (no trailing slash). */
let BASE = process.env.BASE_PATH || "";
if (BASE) BASE = "/" + BASE.replace(/^\/+|\/+$/g, "");

/* ---- run the site's own data + render code in a DOM-less sandbox ---- */
const sandbox = { console };
sandbox.window = sandbox;               // window.X === global X; `typeof document` stays "undefined"
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8"), sandbox, { filename: "js/data.js" });
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8"), sandbox, { filename: "js/app.js" });

const AXR = sandbox.window.AXR;
if (!AXR || typeof AXR.render !== "function") throw new Error("window.AXR not exposed by app.js");
const nav = AXR.nav;

const tpl = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function pageFor(route) {
  const r = AXR.render(route, "");
  const canonical = HOST + BASE + (route === "/" ? "/" : route + "/");
  let out = tpl;
  out = out.replace(/<title>[\s\S]*?<\/title>/, "<title>" + esc(r.title) + "</title>");
  out = out.replace(/(<meta name="description" content=")[^"]*(")/, "$1" + esc(r.desc) + "$2");
  out = out.replace(/(<meta property="og:title" content=")[^"]*(")/, "$1" + esc(r.title) + "$2");
  out = out.replace(/(<meta property="og:description" content=")[^"]*(")/, "$1" + esc(r.desc) + "$2");
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, "$1" + canonical + "$2");
  out = out.replace('<div class="nav-main" id="navMain"></div>', '<div class="nav-main" id="navMain">' + nav.main + "</div>");
  out = out.replace('<div class="mobile-nav" id="mobileNav" aria-label="Mobile navigation"></div>', '<div class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">' + nav.mobile + "</div>");
  out = out.replace('<div id="footSectors"></div>', '<div id="footSectors">' + nav.footSectors + "</div>");
  out = out.replace('<div id="footPlatform"></div>', '<div id="footPlatform">' + nav.footPlatform + "</div>");
  out = out.replace('<div id="footServices"></div>', '<div id="footServices">' + nav.footServices + "</div>");
  out = out.replace('<main id="app" tabindex="-1"></main>', '<main id="app" tabindex="-1">' + r.html + "</main>");
  /* Prefix the shell's own asset URLs (/css, /js) with the deploy sub-path so they
     resolve on GitHub Pages project sites, and expose the base to the runtime router. */
  out = out.replace(/(<link rel="stylesheet" href=")\/css\//g, "$1" + BASE + "/css/");
  out = out.replace('<script src="/js/data.js"></script>',
    '<script>window.__BASE__=' + JSON.stringify(BASE) + ';</script>\n<script src="' + BASE + '/js/data.js"></script>');
  out = out.replace('<script src="/js/app.js"></script>', '<script src="' + BASE + '/js/app.js"></script>');
  return out;
}

/* ---- clean + copy static assets ---- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const d of ["css", "js", "assets"]) {
  const src = path.join(ROOT, d);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(DIST, d), { recursive: true });
}
for (const f of ["robots.txt", "llms.txt"]) {
  if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));
}

/* ---- write one real HTML file per route ---- */
const urls = [];
for (const route of AXR.routes) {
  const html = pageFor(route);
  const dir = route === "/" ? DIST : path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  urls.push(HOST + BASE + (route === "/" ? "/" : route + "/"));
}
/* SPA/host fallback for unknown paths */
fs.writeFileSync(path.join(DIST, "404.html"), pageFor("/__notfound__"));

/* ---- real sitemap listing every crawlable URL ---- */
const sm = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(function (u) { return "  <url><loc>" + u + "</loc></url>"; }).join("\n") +
  "\n</urlset>\n";
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sm);

console.log("Prerendered " + AXR.routes.length + " routes → " + path.relative(ROOT, DIST) + "/ (+ sitemap.xml, 404.html)");
