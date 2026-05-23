#!/usr/bin/env node
// Generates the homepage at /index.html from src/data/albums.js + src/data/singles.js + templates/home.html

import { ALBUMS } from '../src/data/albums.js';
import { SINGLES, COLOR_SERIES_ORDER } from '../src/data/singles.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS } from './_lib.mjs';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOME_TPL = tpl('home.html');

const latest = ALBUMS[0];

function miniAlbum(a) {
  return `    <a class="mini-card" href="/albums/${a.slug}">
      <div class="cover"><img src="/album-art/${a.slug}.jpg" alt="${esc(a.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title">${esc(a.title)}</div>
        <div class="mini-card-meta">${esc(a.releaseDisplay)}</div>
      </div>
    </a>`;
}

function miniSeries(slug) {
  const s = SINGLES.find((x) => x.slug === slug);
  const order = COLOR_SERIES_ORDER.find((x) => x.slug === slug);
  return `    <a class="mini-card" href="/singles/${s.slug}" style="--card-accent:${order.accent.color}">
      <div class="cover"><img src="/album-art/singles/${s.slug}.jpg" alt="${esc(s.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title" style="color:${order.accent.color}">${order.emoji} ${esc(s.title)}</div>
        <div class="mini-card-meta">${esc(s.releaseDisplay)}</div>
      </div>
    </a>`;
}

const html = render(HOME_TPL, {
  LATEST_SLUG: latest.slug,
  LATEST_TITLE: esc(latest.title),
  LATEST_DATE: esc(latest.releaseDisplay),
  LATEST_BLURB: esc(latest.blurb),
  ALBUM_TILES: ALBUMS.slice(0, 5).map(miniAlbum).join('\n'),
  SERIES_TILES: COLOR_SERIES_ORDER.map((c) => miniSeries(c.slug)).join('\n'),
  NAV: navFor(),
  NAV_CSS: NAV_CSS,
});

// Homepage replaces project-root index.html
writeFileSync(join(root, 'index.html'), html, 'utf8');
console.log('✓ generated homepage → index.html');

// Process /links page (templates/links.html → public/links.html)
const LINKS_TPL = tpl('links.html');
const linksHtml = render(LINKS_TPL, {
  NAV: navFor('links'),
  NAV_CSS: NAV_CSS,
});
writeOut('links.html', linksHtml);
console.log('✓ generated /links → public/links.html');
