#!/usr/bin/env node
// Generates /poetry (Night Field collection) + /poetry/<slug> (Theater piece)
// from src/data/poetry.js + templates/poetry-list.html + templates/poetry.html.
//
// HELD: the section is built but not launched — not in the nav, not in the
// sitemap, pages carry noindex. Flip a piece's status to 'live' + set `media`
// to activate its player; reveal the nav + add to sitemap to go public.

import { POETRY } from '../src/data/poetry.js';
import { tpl, navFor, footerFor, render, writeOut, esc, NAV_CSS, FOOTER_CSS, FOOTER_HTML } from './_lib.mjs';
import { join } from 'node:path';

const LIST_TPL = tpl('poetry-list.html');
const PIECE_TPL = tpl('poetry.html');

const kindSuffix = (p) => (p.type === 'video' ? 'video with captions' : 'audio + transcript');
const nodeLine = (p) => {
  const words = p.blurb.split(' ');
  return words.length > 5 ? words.slice(0, 5).join(' ') + '…' : p.blurb;
};

// ─── Collection: Night Field ─────────────────────────────────────────────────
function threadsSvg() {
  // Faint connecting line between each consecutive piece's node position.
  let out = '';
  for (let i = 0; i < POETRY.length - 1; i++) {
    const a = POETRY[i].pos, b = POETRY[i + 1].pos;
    out += `<line x1="${a.left}" y1="${a.top}" x2="${b.left}" y2="${b.top}"/>`;
  }
  return out;
}

function nodesHtml() {
  return POETRY.map((p) => `<a class="node" style="left:${p.pos.left}%;top:${p.pos.top}%;--pa:${p.accent.color};--pa-rgb:${p.accent.rgb}" href="/poetry/${p.slug}">
      <div class="dot"><img src="${p.poster}" alt="${esc(p.title)} still" loading="lazy"></div>
      <div class="t">${esc(p.title)}</div>
      <div class="v">"${esc(nodeLine(p))}"</div>
      <div class="d">${esc(p.duration)} · ${esc(p.type)}</div>
    </a>`).join('\n  ');
}

function renderList() {
  return render(LIST_TPL, {
    NAV: navFor('poetry'),
    NAV_CSS,
    THREADS: threadsSvg(),
    NODES: nodesHtml(),
    FOOTER_CSS,
    FOOTER_HTML: footerFor(),
  });
}

// ─── Piece: Theater ──────────────────────────────────────────────────────────
function screenFor(p) {
  const live = p.status === 'live' && p.media;
  if (!live) {
    return `<div class="screen">
    <img src="${p.poster}" alt="${esc(p.title)} still">
    <div class="play locked" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
    <span class="soon-note">coming soon</span>
  </div>`;
  }
  if (p.type === 'video') {
    return `<div class="screen">
    <video controls preload="none" poster="${p.poster}">
      <source src="${p.media}" type="video/mp4">
      ${p.captions ? `<track kind="captions" src="${p.captions}" srclang="en" label="English" default>` : ''}
    </video>
  </div>`;
  }
  // live audio — poster as the stage, native audio control beneath
  return `<div class="screen">
    <img src="${p.poster}" alt="${esc(p.title)} still">
    <audio controls preload="none" style="position:absolute;left:50%;bottom:14px;transform:translateX(-50%);width:88%;z-index:3"><source src="${p.media}" type="audio/mpeg"></audio>
  </div>`;
}

function captionFor(p) {
  if (!p.lines || !p.lines.length) return esc(p.blurb);
  const head = esc(p.lines[0]);
  const rest = p.lines.slice(1).join(' ');
  return rest ? `${head} <span class="dim">${esc(rest)}</span>` : head;
}

function programFor(current) {
  const items = POETRY.map((p, i) =>
    `<a class="prog" href="/poetry/${p.slug}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(p.title)}</span><span class="d">${esc(p.duration)}</span></a>`
  );
  return `<div class="program"><span class="prog-label">the collection</span>\n    ${items.join('\n    ')}\n  </div>`;
}

function renderPiece(p) {
  return render(PIECE_TPL, {
    TITLE: esc(p.title),
    SLUG: p.slug,
    BLURB: esc(p.blurb),
    POSTER: p.poster,
    ACCENT_COLOR: p.accent.color,
    ACCENT_RGB: p.accent.rgb,
    DURATION: esc(p.duration),
    KIND: 'spoken word',
    META_SUFFIX: kindSuffix(p),
    SCREEN: screenFor(p),
    CAPTION: captionFor(p),
    PROGRAM: programFor(p),
    NAV: navFor('poetry'),
    NAV_CSS,
    FOOTER_CSS,
    FOOTER_HTML: footerFor(),
  });
}

let count = 0;
for (const p of POETRY) {
  writeOut(join('poetry', `${p.slug}.html`), renderPiece(p));
  count++;
}
writeOut('poetry.html', renderList());
console.log(`✓ generated ${count} poetry piece(s) → public/poetry/*.html + collection → public/poetry.html  [HELD: noindex, not in nav/sitemap]`);
