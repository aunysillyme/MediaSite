#!/usr/bin/env node
// Generates the homepage at /index.html from src/data/albums.js + src/data/singles.js + templates/home.html

import { ALBUMS } from '../src/data/albums.js';
import { SINGLES, COLOR_SERIES, COLOR_SERIES_ORDER } from '../src/data/singles.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS, LISTEN_CSS, SERIES_CARD_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, FOOTER_HTML, FOOTER_CSS, singleCoverPath, seriesBadge } from './_lib.mjs';
import { writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOME_TPL = tpl('home.html');

// Monthly Spotify listeners — read from src/data/stats.json, which is auto-updated
// weekly by .github/workflows/update-stats.yml (scrapes Spotify's Pathfinder API).
const STATS = JSON.parse(readFileSync(join(root, 'src/data/stats.json'), 'utf8'));
const MONTHLY_LISTENERS = STATS.spotify.monthlyListeners.toLocaleString('en-US');

// Pick the most recent release across albums + singles
const latestAlbum  = ALBUMS[0];
const latestSingle = SINGLES[0];
const latestIsAlbum = latestAlbum.releaseDate >= latestSingle.releaseDate;
const latest = latestIsAlbum ? latestAlbum : latestSingle;
const latestUrl = latestIsAlbum ? `/albums/${latest.slug}` : `/singles/${latest.slug}`;
const latestCover = latestIsAlbum ? `/album-art/${latest.slug}.jpg` : singleCoverPath(latest.slug);
const latestType = latestIsAlbum ? 'Album' : 'Single';
const latestSpotifyUrl = latestIsAlbum
  ? `https://open.spotify.com/album/${latest.spotifyAlbumId}`
  : `https://open.spotify.com/track/${latest.spotifyTrackId}`;
const latestBlurb = latest.blurb || latest.themes || latest.anchorLyric;
// Brand the home with the latest release's accent — fresh look on every drop.
// Falls back to the artist's default brand accent if the release lacks one.
const BRAND_ACCENT = { color: '#1E90FF', rgb: '30,144,255' };
const latestAccent = latest.accent || BRAND_ACCENT;

function miniAlbum(a) {
  return `    <a class="mini-card" href="/albums/${a.slug}">
      <div class="cover"><img src="/album-art/${a.slug}.jpg" alt="${esc(a.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title">${esc(a.title)}</div>
        <div class="mini-card-meta">${esc(a.releaseDisplay)}</div>
      </div>
    </a>`;
}

function miniSingle(s) {
  return `    <a class="mini-card" href="/singles/${s.slug}">
      <div class="cover"><img src="${singleCoverPath(s.slug)}" alt="${esc(s.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title">${esc(s.title)}</div>
        <div class="mini-card-meta">${esc(s.releaseDisplay)}</div>
      </div>
    </a>`;
}

function miniSeries(slug) {
  const s = SINGLES.find((x) => x.slug === slug);
  const order = COLOR_SERIES_ORDER.find((x) => x.slug === slug);
  return `    <a class="mini-card series" href="/singles/${s.slug}" style="--card-accent:${order.accent.color}">
      ${seriesBadge(order.emoji)}
      <div class="cover"><img src="${singleCoverPath(s.slug)}" alt="${esc(s.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title">${esc(s.title)}</div>
        <div class="mini-card-meta">${esc(s.releaseDisplay)}</div>
      </div>
    </a>`;
}

function miniPink() {
  const p = SINGLES.find((x) => x.slug === 'pink');
  return `    <a class="mini-card series" href="/singles/${p.slug}" style="--card-accent:${p.accent.color}">
      ${seriesBadge(p.emoji)}
      <div class="cover"><img src="${singleCoverPath(p.slug)}" alt="${esc(p.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title">${esc(p.title)}</div>
        <div class="mini-card-meta">${esc(p.releaseDisplay)}</div>
      </div>
    </a>`;
}

const html = render(HOME_TPL, {
  LATEST_URL: latestUrl,
  LATEST_COVER: latestCover,
  LATEST_TYPE: latestType,
  LATEST_SPOTIFY_URL: latestSpotifyUrl,
  LATEST_HYPERFOLLOW_SLUG: latest.hyperfollowSlug,
  LATEST_ACCENT_COLOR: latestAccent.color,
  LATEST_ACCENT_RGB: latestAccent.rgb,
  LATEST_TITLE: esc(latest.title),
  LATEST_DATE: esc(latest.releaseDisplay),
  LATEST_BLURB: esc(latestBlurb),
  TOTAL_SINGLES: String(SINGLES.length),
  TOTAL_ALBUMS: String(ALBUMS.length),
  TOTAL_RELEASES: String(SINGLES.length + ALBUMS.length),
  TOTAL_TRACKS: String(SINGLES.length + ALBUMS.reduce((n, a) => n + a.tracks.length, 0)),
  MONTHLY_LISTENERS,
  ALBUM_TILES: ALBUMS.slice(0, 5).map(miniAlbum).join('\n'),
  SINGLE_TILES: SINGLES.slice(0, 5).map(miniSingle).join('\n'),
  SERIES_TILES: [miniPink(), ...COLOR_SERIES_ORDER.filter((c) => c.slug !== 'pink').map((c) => miniSeries(c.slug))].join('\n'),
  SERIES_RELEASED: String(COLOR_SERIES.filter((c) => c.released).length),
  SERIES_TOTAL: String(COLOR_SERIES.length),
  SERIES_CARD_CSS,
  LISTEN_CSS,
  SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
  FOOTER_HTML, FOOTER_CSS,
  NAV: navFor(),
  NAV_CSS: NAV_CSS,
});

// Homepage replaces project-root index.html
writeFileSync(join(root, 'index.html'), html, 'utf8');
console.log('✓ generated homepage → index.html');

// Process /links page (templates/links.html → public/links.html)
const LINKS_TPL = tpl('links.html');
// /links is intentionally self-contained — its orbital surface already
// shows every platform, and adding signup/global-footer breaks the
// centered flex layout. Keep nav only.
const linksHtml = render(LINKS_TPL, {
  NAV: navFor('links'),
  NAV_CSS: NAV_CSS,
});
writeOut('links.html', linksHtml);
console.log('✓ generated /links → public/links.html');
