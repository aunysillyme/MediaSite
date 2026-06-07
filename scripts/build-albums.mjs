#!/usr/bin/env node
// Generates /albums + /albums/<slug> pages from src/data/albums.js + templates/

import { ALBUMS, ringsFor } from '../src/data/albums.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS, PLAYER_CSS, FOOTER_CSS, LISTEN_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, playerFor, footerFor, albumGenreHead } from './_lib.mjs';
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
  // Auto-flip from "coming soon" → "released" once the release date passes,
  // so a build after midnight on release day swaps the page treatment.
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = !!album.upcoming || album.releaseDate > today || !album.spotifyAlbumId;
  const heroListenBlock = upcoming
    ? `<div class="hero-listen">
        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · stream on all platforms <span class="ext">↗</span></a>
      </div>`
    : `<div class="hero-listen">
        <a class="hero-accent" href="https://open.spotify.com/album/${album.spotifyAlbumId}" target="_blank" rel="noopener">listen on spotify <span class="orbit-arrow">→</span></a>
        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">stream on all platforms <span class="ext">↗</span></a>
      </div>`;
  const previewSection = upcoming
    ? `<section class="album-player-section" aria-label="Album coming soon">
      <p class="album-player-label">✦ &nbsp; coming soon</p>
      <div class="preview-soon">
        <p class="ps-label">Releases ${esc(album.releaseDisplay)} · 12:00 AM</p>
        <p class="ps-headline">${album.tracks.length}-track instrumental album. Pre-save now — drops on every platform on release day.</p>
        <a class="ps-cta" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · stream on all platforms ↗</a>
      </div>
    </section>`
    : `<section class="album-player-section" aria-label="Album preview player">
      <p class="album-player-label">✦ &nbsp; preview the album</p>
      ${playerFor({ kind: 'album', id: album.spotifyAlbumId, title: album.title })}
    </section>`;
  const upcomingBanner = upcoming
    ? `<p class="upcoming-banner"><span class="dot"></span> Coming ${esc(album.releaseDisplay)}</p>`
    : '';
  const heroLabelSuffix = upcoming ? ' · upcoming' : '';
  const tracksJsonLd = JSON.stringify({
    '@type': 'ItemList',
    numberOfItems: album.tracks.length,
    itemListElement: album.tracks.map((t, i) => {
      const item = {
        '@type': 'MusicRecording',
        name: typeof t === 'string' ? t : t.name,
        byArtist: { '@type': 'MusicGroup', name: 'Auny' },
      };
      if (t && t.id) item.sameAs = `https://open.spotify.com/track/${t.id}`;
      return { '@type': 'ListItem', position: i + 1, item };
    }),
  });
  return render(ALBUM_TPL, {
    TITLE: esc(album.title),
    TITLE_HTML: titleHtml(album.title),
    SLUG: album.slug,
    YEAR: String(album.year),
    BLURB: esc(album.blurb),
    GENRE: esc(album.genre),
    GENRE_HEAD: esc(albumGenreHead(album.genre)),
    RELEASE_DISPLAY: esc(album.releaseDisplay),
    RELEASE_ISO: album.releaseDate,
    SPOTIFY_ALBUM_ID: album.spotifyAlbumId,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    NUM_TRACKS: String(album.tracks.length),
    TRACKS_JSONLD: tracksJsonLd,
    SAMEAS_JSONLD: JSON.stringify([
      album.spotifyAlbumId ? `https://open.spotify.com/album/${album.spotifyAlbumId}` : null,
      `https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}`,
    ].filter(Boolean)),
    ACCENT_COLOR: album.accent.color,
    ACCENT_RGB: album.accent.rgb,
    BG_HUE: String(album.bgHue ?? 200),
    BG_COLOR: '#030308',
    RINGS_JSON: JSON.stringify(rings),
    PALETTE_JSON: JSON.stringify(palette),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
    PLAYER_CSS: PLAYER_CSS,
    HERO_LISTEN_BLOCK: heroListenBlock,
    PREVIEW_SECTION: previewSection,
    UPCOMING_BANNER: upcomingBanner,
    HERO_LABEL_SUFFIX: heroLabelSuffix,
    FOOTER_CSS: FOOTER_CSS,
    FOOTER_HTML: footerFor({ releaseDisplay: album.releaseDisplay }),
    LISTEN_CSS: LISTEN_CSS,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
  });
}

function cardHtml(album) {
  const today = new Date().toISOString().slice(0, 10);
  const isUpcoming = !!album.upcoming || album.releaseDate > today;
  const badge = isUpcoming
    ? `<span class="badge upcoming"><span class="dot"></span>Coming ${esc(album.releaseDisplay)}</span>`
    : `<span class="badge">${album.tracks.length} tracks</span>`;
  const meta = isUpcoming
    ? `Releases ${esc(album.releaseDisplay)} · ${esc(album.genre.split('·')[0].trim())}`
    : `${esc(album.releaseDisplay)} · ${esc(album.genre.split('·')[0].trim())}`;
  return `      <a class="album-card${isUpcoming ? ' is-upcoming' : ''}" href="/albums/${album.slug}" style="--card-accent:${album.accent.color};--card-accent-rgb:${album.accent.rgb}">
        <div class="cover"><img src="/album-art/${album.slug}.jpg" alt="${esc(album.title)} cover" loading="lazy" width="640" height="640">
          ${badge}
        </div>
        <div class="body">
          <div class="album-card-title">${esc(album.title)}</div>
          <div class="album-card-meta">${meta}</div>
          <div class="album-card-blurb">${esc(album.blurb)}</div>
        </div>
      </a>`;
}

function listJsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Albums — Auny',
    'url': 'https://www.auny.media/albums',
    'description': `All ${ALBUMS.length} albums by Auny — instrumental atmospheric music.`,
    'isPartOf': { '@id': 'https://www.auny.media/#website' },
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': ALBUMS.length,
      'itemListElement': ALBUMS.map((a, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'item': {
          '@type': 'MusicAlbum',
          'name': a.title,
          'url': `https://www.auny.media/albums/${a.slug}`,
          'image': `https://www.auny.media/album-art/${a.slug}.jpg`,
          'datePublished': a.releaseDate,
          'numTracks': a.tracks.length,
          'byArtist': { '@type': 'MusicGroup', '@id': 'https://www.auny.media/#artist' },
          'sameAs': a.spotifyAlbumId ? `https://open.spotify.com/album/${a.spotifyAlbumId}` : undefined,
        },
      })),
    },
  }, null, 2);
}

function renderList() {
  return render(LIST_TPL, {
    ALBUM_CARDS: ALBUMS.map(cardHtml).join('\n'),
    LIST_JSONLD: listJsonLd(),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
    SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
    FOOTER_HTML: footerFor(), FOOTER_CSS,
  });
}

let count = 0;
for (const album of ALBUMS) {
  writeOut(join('albums', `${album.slug}.html`), renderAlbum(album));
  count++;
}
writeOut('albums.html', renderList());

console.log(`✓ generated ${count} album pages → public/albums/*.html + listing → public/albums.html`);
