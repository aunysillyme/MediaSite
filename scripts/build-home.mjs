#!/usr/bin/env node
// Generates the homepage at /index.html from src/data/albums.js + src/data/singles.js + templates/home.html

import { ALBUMS } from '../src/data/albums.js';
import { SINGLES, COLOR_SERIES, COLOR_SERIES_ORDER } from '../src/data/singles.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS, LISTEN_CSS, SERIES_CARD_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, FOOTER_HTML, FOOTER_CSS, singleCoverPath, seriesBadge, coverPicture } from './_lib.mjs';
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

// Released-only counters: exclude upcoming albums/singles from portfolio stats
// (pre-release tracks shouldn't inflate the "Tracks" count on the homepage).
const TODAY_ISO = (process.env.BUILD_DATE || new Date().toISOString().slice(0, 10));
const isUpcoming = (item) => !!item.upcoming || item.releaseDate > TODAY_ISO;
const RELEASED_ALBUMS  = ALBUMS.filter((a) => !isUpcoming(a));
const RELEASED_SINGLES = SINGLES.filter((s) => !isUpcoming(s));

// Hero pick: promote a pre-release teaser when one exists (an album announced
// but not yet on DistroKid), else feature the most recent RELEASED item. On
// launch the teaser flag drops and the hero auto-reverts to the latest release.
const teaserAlbum = ALBUMS.find((a) => a.teaser);
const relAlbum = RELEASED_ALBUMS[0];
const relSingle = RELEASED_SINGLES[0];
const releasedIsAlbum = relAlbum.releaseDate >= relSingle.releaseDate;
const latest = teaserAlbum || (releasedIsAlbum ? relAlbum : relSingle);
const latestIsAlbum = !!teaserAlbum || releasedIsAlbum;
const latestTeaser = !!latest.teaser;
const latestUrl = latestIsAlbum ? `/albums/${latest.slug}` : `/singles/${latest.slug}`;
const latestCover = latestIsAlbum ? `/album-art/${latest.slug}.jpg` : singleCoverPath(latest.slug);
const latestType = latestIsAlbum ? 'Album' : 'Single';
const latestSpotifyUrl = latestIsAlbum
  ? `https://open.spotify.com/album/${latest.spotifyAlbumId}`
  : `https://open.spotify.com/track/${latest.spotifyTrackId}`;
const latestBlurb = latest.blurb || latest.themes || latest.anchorLyric;
// Brand the home with the featured release's accent — fresh look on every drop.
// Falls back to the artist's default brand accent if the release lacks one.
const BRAND_ACCENT = { color: '#1E90FF', rgb: '30,144,255' };
const latestAccent = latest.accent || BRAND_ACCENT;
const today = (process.env.BUILD_DATE || new Date().toISOString().slice(0, 10));
const latestUpcoming = latestTeaser || !!latest.upcoming || latest.releaseDate > today
  || (latestIsAlbum ? !latest.spotifyAlbumId : !latest.spotifyTrackId);
// Teaser dateless → "Coming Soon" + view-album link. Teaser dated (submitted)
// → "Coming [date]" + pre-save. Non-teaser upcoming → "Coming [date]" + pre-save.
// Released → listen + stream.
const teaserComing = latest.releaseDate ? `Coming ${esc(latest.releaseDisplay)}` : 'Coming Soon';
const latestTagBlock = latestUpcoming
  ? `<p class="featured-tag upcoming"><span class="dot"></span>${teaserComing}</p>`
  : `<p class="featured-tag">${esc(latestType)} · ${esc(latest.releaseDisplay)}</p>`;
const latestListenRow = latestTeaser
  ? (latest.hyperfollowSlug
    ? `<div class="listen-row">
          <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${latest.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · follow on all platforms <span class="ext">↗</span></a>
        </div>`
    : `<div class="listen-row">
          <a class="all-pill" href="${latestUrl}">view album <span class="ext">→</span></a>
        </div>`)
  : latestUpcoming
  ? `<div class="listen-row">
          <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${latest.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · stream on all platforms <span class="ext">↗</span></a>
        </div>`
  : `<div class="listen-row">
          <a class="listen-now" href="${latestSpotifyUrl}" target="_blank" rel="noopener">listen on spotify <span class="arrow">→</span></a>
          <span class="listen-dot"></span>
          <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${latest.hyperfollowSlug}" target="_blank" rel="noopener">stream on all platforms <span class="ext">↗</span></a>
        </div>`;

function miniAlbum(a) {
  return `    <a class="mini-card" href="/albums/${a.slug}">
      <div class="cover">${coverPicture({ base: `/album-art/${a.slug}`, alt: `${esc(a.title)} cover`, sizes: '(max-width:720px) 45vw, 220px' })}</div>
      <div class="body">
        <div class="mini-card-title">${esc(a.title)}</div>
        <div class="mini-card-meta">${esc(a.releaseDisplay)}</div>
      </div>
    </a>`;
}

function miniSingle(s) {
  return `    <a class="mini-card" href="/singles/${s.slug}">
      <div class="cover">${coverPicture({ base: singleCoverPath(s.slug).replace(/\.jpg$/, ''), alt: `${esc(s.title)} cover`, sizes: '(max-width:720px) 45vw, 220px' })}</div>
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
      <div class="cover">${coverPicture({ base: singleCoverPath(s.slug).replace(/\.jpg$/, ''), alt: `${esc(s.title)} cover`, sizes: '(max-width:720px) 45vw, 220px' })}</div>
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
      <div class="cover">${coverPicture({ base: singleCoverPath(p.slug).replace(/\.jpg$/, ''), alt: `${esc(p.title)} cover`, sizes: '(max-width:720px) 45vw, 220px' })}</div>
      <div class="body">
        <div class="mini-card-title">${esc(p.title)}</div>
        <div class="mini-card-meta">${esc(p.releaseDisplay)}</div>
      </div>
    </a>`;
}

const html = render(HOME_TPL, {
  LATEST_URL: latestUrl,
  LATEST_COVER: latestCover,
  LATEST_PICTURE: coverPicture({ base: latestCover.replace(/\.jpg$/, ''), alt: `${esc(latest.title)} cover`, sizes: '(max-width:860px) 90vw, 460px', eager: true }),
  LATEST_TYPE: latestType,
  LATEST_SPOTIFY_URL: latestSpotifyUrl,
  LATEST_HYPERFOLLOW_SLUG: latest.hyperfollowSlug,
  LATEST_ACCENT_COLOR: latestAccent.color,
  LATEST_ACCENT_RGB: latestAccent.rgb,
  LATEST_TITLE: esc(latest.title),
  LATEST_DATE: esc(latest.releaseDisplay),
  LATEST_BLURB: esc(latestBlurb),
  LATEST_FEATURED_LABEL: latestUpcoming ? 'coming soon' : 'latest release',
  LATEST_TAG_BLOCK: latestTagBlock,
  LATEST_LISTEN_ROW: latestListenRow,
  TOTAL_SINGLES: String(RELEASED_SINGLES.length),
  TOTAL_ALBUMS: String(RELEASED_ALBUMS.length),
  TOTAL_RELEASES: String(RELEASED_SINGLES.length + RELEASED_ALBUMS.length),
  TOTAL_TRACKS: String(RELEASED_SINGLES.length + RELEASED_ALBUMS.reduce((n, a) => n + a.tracks.length, 0)),
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
