#!/usr/bin/env node
// Generates /albums + /albums/<slug> pages from src/data/albums.js + templates/

import { ALBUMS, ringsFor } from '../src/data/albums.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS, PLAYER_CSS, FOOTER_CSS, LISTEN_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, playerFor, footerFor } from './_lib.mjs';
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
    RELEASE_DISPLAY: esc(album.releaseDisplay),
    RELEASE_ISO: album.releaseDate,
    SPOTIFY_ALBUM_ID: album.spotifyAlbumId,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    NUM_TRACKS: String(album.tracks.length),
    TRACKS_JSONLD: tracksJsonLd,
    ACCENT_COLOR: album.accent.color,
    ACCENT_RGB: album.accent.rgb,
    BG_HUE: String(album.bgHue ?? 200),
    BG_COLOR: '#030308',
    RINGS_JSON: JSON.stringify(rings),
    PALETTE_JSON: JSON.stringify(palette),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
    PLAYER_CSS: PLAYER_CSS,
    PLAYER_HTML: playerFor({ kind: 'album', id: album.spotifyAlbumId, title: album.title }),
    FOOTER_CSS: FOOTER_CSS,
    FOOTER_HTML: footerFor({ releaseDisplay: album.releaseDisplay }),
    LISTEN_CSS: LISTEN_CSS,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
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
