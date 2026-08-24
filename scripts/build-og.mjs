// Renders the four link-preview (Open Graph) cards to static PNGs.
//
// WHY THIS IS NOT PART OF `npm run build:site`
// It shells out to a headless Chrome, which exists on Auny's machines but not on
// Vercel's builder. The PNGs are committed, exactly like the generated pages in
// public/, so the deploy never needs a browser. Run this by hand — `npm run
// build:og` — whenever the newest releases change or a card's design does, then
// commit the PNGs it writes.
//
// WHY HTML AND NOT sharp/SVG
// The cards use the site's own woff2 faces, its background plate, CSS blur for
// the accent blooms, and per-release rim colours read straight out of the data
// layer. Only a browser renders all of that faithfully. Chrome is a build-time
// tool here, never a runtime dependency, so package.json still declares just
// sharp + vite.
//
// WHAT KEEPS THE CARDS HONEST
//   - Artwork and rim colours come from albums.js / singles.js.
//   - The /links card parses its 14 platforms out of templates/links.html, so
//     adding a platform to that page updates the card on the next run.
//   - The note scatter uses a seeded PRNG, never Math.random, so re-running with
//     an unchanged catalogue produces byte-identical PNGs instead of a diff.

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALBUMS } from '../src/data/albums.js';
import { SINGLES } from '../src/data/singles.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(root, 'public');
const OUT = join(PUBLIC, 'images/og');
const TMP = join(root, '.og-tmp');

const W = 1200;
const H = 630;

// ─── Headless Chrome ──────────────────────────────────────────────────
// Any Chromium works. CHROME_PATH wins so a machine without Chrome in the
// usual place can still run this.
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!hit) {
    throw new Error(
      'No Chrome/Chromium found. This script needs one to render the cards.\n'
      + 'Set CHROME_PATH=/path/to/chrome, or install Chrome. Looked in:\n  '
      + CHROME_CANDIDATES.join('\n  ')
    );
  }
  return hit;
}

// ─── Deterministic scatter ────────────────────────────────────────────
// The same LCG the mocks used. BigInt because s * 1103515245 overflows the
// float53 mantissa, and a silently-truncated multiply would give a different
// scatter than the layout that was signed off.
function rng(seed) {
  let s = BigInt(seed);
  const M = 2147483647n;
  return () => {
    s = (s * 1103515245n + 12345n) & M;
    return Number(s) / 2147483647;
  };
}

// Every accent colour the catalogue actually uses — the notes are tinted from
// this, so the texture is the site's own palette rather than invented colours.
const PALETTE = [...new Set([
  ...ALBUMS.map((a) => a.accent?.color),
  ...SINGLES.map((s) => s.accent?.color),
].filter(Boolean))];

const GLYPHS = ['♪', '♫', '♩', '♬', '♭', '♮'];

// Tiny notes at ~60% opacity, matching the glyph set of the live cursor canvas
// in templates/_nav.html. `avoid` keeps them off the type and the artwork.
function notes(seed, count, avoid = []) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const x = -8 + 1200 * r();
    const y = -8 + 622 * r();
    const size = 9 + 7 * r();
    const op = 0.5 + 0.18 * r();
    const rot = -24 + 48 * r();
    const col = PALETTE[Math.floor(r() * PALETTE.length)];
    if (avoid.some(([ax, ay, bx, by]) => x > ax && x < bx && y > ay && y < by)) continue;
    out.push(
      `<div class="note" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;`
      + `font-size:${size.toFixed(0)}px;color:${col};opacity:${op.toFixed(2)};`
      + `transform:rotate(${rot.toFixed(0)}deg)">${GLYPHS[Math.floor(r() * 6)]}</div>`
    );
  }
  return out.join('');
}

const fileUrl = (rel) => `file://${join(PUBLIC, rel)}`;
const albumArt = (slug) => fileUrl(`album-art/${slug}.jpg`);
const singleArt = (slug) => fileUrl(`album-art/singles/${slug}.jpg`);

const BLOOM =
  '<div class="bloom" style="left:700px;top:130px;width:330px;height:330px;background:rgba(34,228,255,.19)"></div>'
  + '<div class="bloom" style="left:890px;top:330px;width:300px;height:300px;background:rgba(255,140,66,.17)"></div>';

const CSS = readFileSync(join(root, 'scripts/og/card.css'), 'utf8')
  .replaceAll('__ROOT__', `file://${PUBLIC}`);

function shell(body, seed, avoid) {
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>
<div class="bg"></div>${BLOOM}<div class="floor"></div>
${notes(seed, 58, avoid)}
${body}`;
}

function copyBlock({ eyebrow, wordmark, size, kicker, sub, top = 186, width = 500 }) {
  return `<div style="position:absolute;left:76px;top:${top}px;width:${width}px">
 <div class="eyebrow">${eyebrow}</div>
 <div class="wordmark" style="font-size:${size}px;margin:16px 0 18px">${wordmark}</div>
 <div class="rule" style="width:220px;margin-bottom:24px;background:linear-gradient(90deg,#22E4FF,rgba(34,228,255,0))"></div>
 <div class="kicker">${kicker}</div>
 <div class="sub" style="margin-top:12px">${sub}</div>
</div>`;
}

// A cover tile: the rim is the release's own accent, which is what separates
// near-black artwork from a near-black canvas. Glow alone does not.
function cover({ src, color, rgb, x, y, w, rot, z }) {
  return `<div class="cover" style="left:${x}px;top:${y}px;width:${w}px;height:${w}px;`
    + `transform:rotate(${rot}deg);z-index:${z};background:${color};`
    + `box-shadow:0 26px 54px rgba(0,0,0,.92), 0 0 30px rgba(${rgb},.55)">`
    + `<div class="in"><img src="${src}"></div></div>`;
}

const bySlug = (list, slug) => {
  const hit = list.find((r) => r.slug === slug);
  if (!hit) throw new Error(`OG card references "${slug}", which is not in the data layer`);
  return hit;
};
const albumRef = (slug) => {
  const a = bySlug(ALBUMS, slug);
  return { src: albumArt(slug), color: a.accent.color, rgb: a.accent.rgb };
};
const singleRef = (slug) => {
  const s = bySlug(SINGLES, slug);
  return { src: singleArt(slug), color: s.accent.color, rgb: s.accent.rgb };
};

// ─── / ────────────────────────────────────────────────────────────────
// An orbit rather than a stack: the site is albums AND singles AND lyrics AND
// platforms, and a pile of album covers only says the first of those.
function homeCard() {
  const CX = 872, CY = 312, IR = 130, OR = 248, SEC = 52, ART = 72;

  const outer = [
    albumRef('dreams-instrumental'), singleRef('pink'),
    albumRef('flatline'), singleRef('yellow'),
    albumRef('midnight-glitch'), singleRef('cyan'),
    albumRef('afterglow'), singleRef('mechanical-screen'),
  ];
  const sections = [
    ['A', 'albums', '#A17BE0'],
    ['S', 'singles', '#E91E63'],
    ['L', 'lyrics', '#F5C518'],
    ['P', 'platforms', '#22E4FF'],
  ];

  let body =
    `<div class="ring" style="left:${CX - IR}px;top:${CY - IR}px;width:${IR * 2}px;height:${IR * 2}px;border:1.5px solid rgba(34,228,255,.30)"></div>`
    + `<div class="ring" style="left:${CX - OR}px;top:${CY - OR}px;width:${OR * 2}px;height:${OR * 2}px;border:1.5px solid rgba(255,107,26,.26)"></div>`;

  // Outer ring sits on the half-steps so it never hides behind the cardinals.
  outer.forEach((ref, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / outer.length + Math.PI / 8;
    const x = CX + OR * Math.cos(a);
    const y = CY + OR * Math.sin(a);
    body += `<div class="node" style="left:${(x - ART / 2).toFixed(0)}px;top:${(y - ART / 2).toFixed(0)}px;`
      + `width:${ART}px;height:${ART}px;border:2px solid ${ref.color};`
      + `box-shadow:0 0 18px ${ref.color}70, 0 10px 26px rgba(0,0,0,.85);z-index:6">`
      + `<img src="${ref.src}"></div>`;
  });

  // Inner ring on the cardinals: top, right, bottom, left.
  sections.forEach(([letter, label, c], i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    const x = CX + IR * Math.cos(a);
    const y = CY + IR * Math.sin(a);
    body += `<div class="sec" style="left:${(x - 46).toFixed(0)}px;top:${(y - SEC / 2).toFixed(0)}px;width:92px">`
      + `<div class="sec-dot" style="width:${SEC}px;height:${SEC}px;border:1.5px solid ${c};color:${c};`
      + `font-size:21px;box-shadow:0 0 14px ${c}55, inset 0 0 20px ${c}28">${letter}</div>`
      + `<div class="sec-lbl" style="color:${c}">${label}</div></div>`;
  });

  // The favicon already IS the vinyl-and-portrait circle used at the centre of
  // the live /links orbit, so it drops straight in with no compositing.
  const CEN = 142;
  body += `<div style="position:absolute;left:${CX - CEN / 2}px;top:${CY - CEN / 2}px;width:${CEN}px;height:${CEN}px;`
    + `border-radius:50%;overflow:hidden;z-index:9;box-shadow:0 0 34px rgba(255,107,26,.45), 0 14px 40px rgba(0,0,0,.9)">`
    + `<img src="${fileUrl('images/favicon-512.png')}" style="width:100%;height:100%;object-fit:cover;display:block"></div>`;

  body += copyBlock({
    eyebrow: 'auny.media', wordmark: 'AUNY', size: 118,
    kicker: 'My music portfolio',
    sub: 'Albums, singles, lyrics<br>and every platform.',
    top: 196, width: 450,
  });

  return shell(body, 59, [[56, 180, 560, 520], [560, 20, 1200, 610]]);
}

// ─── /albums ──────────────────────────────────────────────────────────
// Deliberately NOT the four albums on the home card, so the two previews never
// look like the same image reused.
function albumsCard() {
  const refs = ['graveyard-echoes', 'afterglow', 'blue-lightning', 'focus-with-me'].map(albumRef);
  const row = [508, 668, 828, 988];
  const body = refs
    .map((ref, i) => cover({ ...ref, x: row[i], y: 182, w: 236, rot: -7, z: i }))
    .join('')
    + copyBlock({
      eyebrow: 'auny · albums', wordmark: 'ALBUMS', size: 94,
      kicker: 'Instrumental · Full-length',
      sub: 'Dark EDM, lo-fi and ambient albums.',
    });
  return shell(body, 71, [[56, 160, 600, 530], [470, 20, 1200, 600]]);
}

// ─── /singles ─────────────────────────────────────────────────────────
function singlesCard() {
  const refs = ['mechanical-screen', 'cyan', 'let-go', 'pink'].map(singleRef);
  const fan = [[486, 150, 220, -19, 1], [628, 104, 234, -6, 2], [772, 116, 234, 8, 3], [916, 158, 220, 19, 4]];
  const body = refs
    .map((ref, i) => cover({ ...ref, x: fan[i][0], y: fan[i][1], w: fan[i][2], rot: fan[i][3], z: fan[i][4] }))
    .join('')
    + copyBlock({
      eyebrow: 'auny · singles', wordmark: 'SINGLES', size: 94,
      kicker: 'Vocal · The Color Series',
      sub: 'Lyrics, stories and standalone tracks.',
    });
  return shell(body, 97, [[56, 160, 600, 530], [460, 60, 1200, 530]]);
}

// ─── /links ───────────────────────────────────────────────────────────
// The platforms are PARSED out of templates/links.html rather than copied here.
// Add a platform to that page and this card picks it up on the next run; keep a
// second copy and the two drift apart silently, which is the whole failure this
// avoids.
function readPlanets() {
  const src = readFileSync(join(root, 'templates/links.html'), 'utf8');
  const grab = (name) => {
    const block = new RegExp(`var ${name} = \\[([\\s\\S]*?)\\n  \\];`).exec(src);
    if (!block) throw new Error(`Could not find "var ${name} = [...]" in templates/links.html`);
    const out = [];
    const re = /n:\s*'([^']*)'[\s\S]*?c:\s*'([^']*)'[\s\S]*?svg:\s*'([\s\S]*?)'\s*\n?\s*\}/g;
    let m;
    while ((m = re.exec(block[1])) !== null) out.push({ n: m[1], c: m[2], svg: m[3] });
    if (!out.length) throw new Error(`Parsed 0 entries out of ${name} in templates/links.html`);
    return out;
  };
  return { socials: grab('SOCIALS'), streaming: grab('STREAMING') };
}

const VINYL = '<svg viewBox="0 0 100 100" width="112" height="112">'
  + '<circle cx="50" cy="50" r="49" fill="#0a0a10"/><circle cx="50" cy="50" r="46" fill="none" stroke="#161620" stroke-width="1.5"/>'
  + '<circle cx="50" cy="50" r="42" fill="none" stroke="#111118" stroke-width="1"/><circle cx="50" cy="50" r="38" fill="none" stroke="#161620" stroke-width="1.5"/>'
  + '<circle cx="50" cy="50" r="34" fill="none" stroke="#111118" stroke-width="1"/><circle cx="50" cy="50" r="30" fill="none" stroke="#161620" stroke-width="1"/>'
  + '<circle cx="50" cy="50" r="25" fill="none" stroke="#FF6B1A" stroke-width="0.8" opacity="0.32"/>'
  + '<circle cx="50" cy="50" r="21" fill="#0a0a10"/><circle cx="50" cy="50" r="18" fill="none" stroke="#FF6B1A" stroke-width="1.5" opacity="0.7"/></svg>';

function linksCard() {
  const { socials, streaming } = readPlanets();
  const CX = 872, CY = 314, IR = 132, OR = 246, ICON = 56;

  const planet = (p, x, y) =>
    `<a class="planet" style="left:${(x - ICON / 2).toFixed(0)}px;top:${(y - ICON / 2).toFixed(0)}px">`
    + `<div class="planet-icon" style="width:${ICON}px;height:${ICON}px;border:1.5px solid ${p.c};`
    + `box-shadow:0 0 14px ${p.c}60, inset 0 0 22px ${p.c}35">${p.svg}</div>`
    + `<span class="planet-name" style="color:${p.c}">${p.n}</span></a>`;

  let body =
    `<div class="ring" style="left:${CX - IR}px;top:${CY - IR}px;width:${IR * 2}px;height:${IR * 2}px;border:1.5px solid rgba(0,229,255,.34)"></div>`
    + `<div class="ring" style="left:${CX - OR}px;top:${CY - OR}px;width:${OR * 2}px;height:${OR * 2}px;border:1.5px solid rgba(255,107,26,.30)"></div>`
    + `<div style="position:absolute;left:${CX - 56}px;top:${CY - 56}px;z-index:4">${VINYL}</div>`
    + `<div style="position:absolute;left:${CX - 19}px;top:${CY - 19}px;width:38px;height:38px;border-radius:50%;`
    + `overflow:hidden;z-index:8;background:#1a0a00 url('${fileUrl('images/auny-pfp-5.png')}') center top/cover"></div>`;

  socials.forEach((p, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / socials.length + 0.36;
    body += planet(p, CX + IR * Math.cos(a), CY + IR * Math.sin(a));
  });
  streaming.forEach((p, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / streaming.length + Math.PI / 8;
    body += planet(p, CX + OR * Math.cos(a), CY + OR * Math.sin(a));
  });

  body += copyBlock({
    eyebrow: 'auny · aunysillyme', wordmark: 'LINKS', size: 94,
    kicker: 'Streaming · Socials · Everything',
    sub: 'Every platform and profile, on one page.',
    top: 186, width: 470,
  });

  // The links card fills its right half with the orbit, so the platform strip
  // the other three carry would collide. It is omitted here on purpose.
  return shell(body, 113, [[56, 160, 600, 530], [590, 30, 1180, 600]]);
}

// ─── Render ───────────────────────────────────────────────────────────
const CARDS = [
  ['home', homeCard],
  ['albums', albumsCard],
  ['singles', singlesCard],
  ['links', linksCard],
];

const chrome = findChrome();
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const manifest = {};
for (const [name, build] of CARDS) {
  const htmlPath = join(TMP, `${name}.html`);
  const pngPath = join(OUT, `${name}.png`);
  writeFileSync(htmlPath, build(), 'utf8');
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    `--screenshot=${pngPath}`,
    `--window-size=${W},${H}`,
    '--force-device-scale-factor=1',
    '--virtual-time-budget=5000',
    `file://${htmlPath}`,
  ], { stdio: 'ignore' });

  if (!existsSync(pngPath)) throw new Error(`Chrome produced no PNG for the ${name} card`);
  const bytes = readFileSync(pngPath);
  // Short content hash → the ?v= on the meta tags, so a redesign forces every
  // scraper to re-fetch instead of serving the card it cached months ago.
  manifest[name] = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  console.log(`  ✓ /images/og/${name}.png  ${(bytes.length / 1024).toFixed(0)} KB  v=${manifest[name]}`);
}

writeFileSync(join(root, 'src/data/og-cards.js'),
  '// GENERATED by scripts/build-og.mjs — do not edit.\n'
  + '// Content hashes of the link-preview PNGs, used as the ?v= cache buster so a\n'
  + '// redesign is re-fetched by scrapers rather than served from their cache.\n'
  + `export const OG_CARDS = ${JSON.stringify(manifest, null, 2)};\n`, 'utf8');

rmSync(TMP, { recursive: true, force: true });
console.log(`✓ generated ${CARDS.length} link-preview cards → public/images/og/ + src/data/og-cards.js`);
