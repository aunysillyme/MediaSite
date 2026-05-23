#!/usr/bin/env node
// Generates /albums + /albums/<slug> pages from src/data/albums.js + templates/

import { ALBUMS, ringsFor } from '../src/data/albums.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS } from './_lib.mjs';
import { join } from 'node:path';

const ALBUM_TPL = tpl('album.html');
const LIST_TPL  = tpl('albums-list.html');

function titleHtml(title) {
  if (title.length > 14 && title.includes(' ')) {
    const words = title.split(' ');
    const mid = Math.ceil(words.length / 2);
    return esc(words.slice(0, mid).join(' ')) + '<br>' + esc(words.slice(mid).join(' '));
  }
  return esc(title);
}

function renderAlbum(album) {
  const rings = ringsFor(album.tracks);
  const palette = album.palette || [album.accent.color, album.accent.color, album.accent.color];
  return render(ALBUM_TPL, {
    TITLE: esc(album.title),
    TITLE_HTML: titleHtml(album.title),
    SLUG: album.slug,
    YEAR: String(album.year),
    BLURB: esc(album.blurb),
    GENRE: esc(album.genre),
    RELEASE_DISPLAY: esc(album.releaseDisplay),
    RELEASE_ISO: album.releaseDate,
    SPOTIFY_ALBUM_ID: album.spotifyAlbumId,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    NUM_TRACKS: String(album.tracks.length),
    ACCENT_COLOR: album.accent.color,
    ACCENT_RGB: album.accent.rgb,
    BG_HUE: String(album.bgHue ?? 200),
    BG_COLOR: '#030308',
    RINGS_JSON: JSON.stringify(rings),
    PALETTE_JSON: JSON.stringify(palette),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
  });
}

function cardHtml(album) {
  return `      <a class="album-card" href="/albums/${album.slug}" style="--card-accent:${album.accent.color};--card-accent-rgb:${album.accent.rgb}">
        <div class="cover"><img src="/album-art/${album.slug}.jpg" alt="${esc(album.title)} cover" loading="lazy" width="640" height="640">
          <span class="badge">${album.tracks.length} tracks</span>
        </div>
        <div class="body">
          <div class="album-card-title">${esc(album.title)}</div>
          <div class="album-card-meta">${esc(album.releaseDisplay)} · ${esc(album.genre.split('·')[0].trim())}</div>
          <div class="album-card-blurb">${esc(album.blurb)}</div>
        </div>
      </a>`;
}

function renderList() {
  return render(LIST_TPL, {
    ALBUM_CARDS: ALBUMS.map(cardHtml).join('\n'),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
  });
}

let count = 0;
for (const album of ALBUMS) {
  writeOut(join('albums', `${album.slug}.html`), renderAlbum(album));
  count++;
}
writeOut('albums.html', renderList());

console.log(`✓ generated ${count} album pages → public/albums/*.html + listing → public/albums.html`);
