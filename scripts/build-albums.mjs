#!/usr/bin/env node
// Generates /albums + /albums/<slug> pages from src/data/albums.js + templates/

import { ALBUMS, ringsFor } from '../src/data/albums.js';
import { tpl, navFor, esc, writeOut, render, NAV_CSS, PLAYER_CSS, FOOTER_CSS, LISTEN_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, playerFor, footerFor, albumGenreHead, platformRowFor, platformUrls, coverPicture } from './_lib.mjs';
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

// Concept-album poem: each track's vocal `line` read in order forms one poem,
// grouped into consecutive `movement` blocks. Renders nothing if no track has a line.
function poemSectionFor(album) {
  const lined = album.tracks.filter((t) => t.line);
  if (!lined.length) return '';
  const groups = [];
  for (const t of lined) {
    const prev = groups[groups.length - 1];
    if (prev && prev.movement === (t.movement || '')) prev.tracks.push(t);
    else groups.push({ movement: t.movement || '', tracks: [t] });
  }
  const body = groups.map((g) => {
    const label = g.movement ? `<p class="movement-label">${esc(g.movement)}</p>\n        ` : '';
    const lines = g.tracks.map((t) =>
      `<div class="poem-line-block">
          <span class="poem-track">${String(t.num).padStart(2, '0')} · ${esc(t.name)}</span>
          <p class="poem-line">${esc(t.line)}</p>
        </div>`).join('\n        ');
    return `<div class="poem-movement">\n        ${label}${lines}\n      </div>`;
  }).join('\n      ');
  return `<section class="poem-section" aria-label="The poem">
      <div class="poem-head">
        <p class="poem-label">✦ &nbsp; the poem</p>
        <h2 class="poem-title">${lined.length} lines, one poem</h2>
        <p class="poem-sub">Every track carries one line. Read top to bottom, they tell one continuous story.</p>
      </div>
      <div class="poem-body">
      ${body}
      </div>
    </section>`;
}

function renderAlbum(album) {
  const rings = ringsFor(album.tracks);
  const palette = album.palette || [album.accent.color, album.accent.color, album.accent.color];
  // Auto-flip from "coming soon" → "released" once the release date passes,
  // so a build after midnight on release day swaps the page treatment.
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = !!album.upcoming || album.releaseDate > today || !album.spotifyAlbumId;
  // Teaser = shows the disabled album player (not a Spotify embed). A teaser may
  // be dateless ("Coming Soon", no CTA) OR dated + submitted, in which case it
  // shows "Coming <date>" and a live pre-save CTA once hyperfollowSlug is set.
  const teaser = !!album.teaser;
  const comingLabel = album.releaseDate ? `Coming ${esc(album.releaseDisplay)}` : esc(album.releaseDisplay);
  const kindWord = album.vocal ? 'vocal' : 'instrumental';
  const heroListenBlock = teaser
    ? (album.hyperfollowSlug
      ? `<div class="hero-listen">
        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · follow on all platforms <span class="ext">↗</span></a>
      </div>`
      : '')
    : upcoming
    ? `<div class="hero-listen">
        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · stream on all platforms <span class="ext">↗</span></a>
      </div>`
    : `<div class="hero-listen">
        <a class="hero-accent" href="https://open.spotify.com/album/${album.spotifyAlbumId}" target="_blank" rel="noopener">listen on spotify <span class="orbit-arrow">→</span></a>
        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">stream on all platforms <span class="ext">↗</span></a>
        ${platformRowFor(album)}
      </div>`;
  const previewSection = teaser
    ? `<section class="album-player-section" aria-label="Album coming soon">
      <p class="album-player-label">✦ &nbsp; coming soon</p>
      ${playerFor({ kind: 'album', id: '', title: album.title, cover: `/album-art/${album.slug}-640.webp`, disabled: true })}
    </section>`
    : upcoming
    ? `<section class="album-player-section" aria-label="Album coming soon">
      <p class="album-player-label">✦ &nbsp; coming soon</p>
      <div class="preview-soon">
        <p class="ps-label">Releases ${esc(album.releaseDisplay)} · 12:00 AM</p>
        <p class="ps-headline">${album.tracks.length}-track ${kindWord} album. Pre-save now — drops on every platform on release day.</p>
        <a class="ps-cta" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · stream on all platforms ↗</a>
      </div>
    </section>`
    : `<section class="album-player-section" aria-label="Album preview player">
      <p class="album-player-label">✦ &nbsp; preview the album</p>
      ${playerFor({ kind: 'album', id: album.spotifyAlbumId, title: album.title, cover: `/album-art/${album.slug}-640.webp` })}
    </section>`;
  const upcomingBanner = upcoming
    ? `<p class="upcoming-banner"><span class="dot"></span> ${comingLabel}</p>`
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
    GENRE_HEAD: esc(albumGenreHead(album)),
    RELEASE_DISPLAY: esc(album.releaseDisplay),
    RELEASE_ISO: album.releaseDate,
    // Omit datePublished entirely for unreleased albums (no valid date yet).
    DATE_PUBLISHED_PROP: album.releaseDate ? `\n  "datePublished": "${album.releaseDate}",` : '',
    SPOTIFY_ALBUM_ID: album.spotifyAlbumId,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    NUM_TRACKS: String(album.tracks.length),
    ALBUM_KIND: album.vocal ? 'vocal' : 'instrumental',
    TRACKS_JSONLD: tracksJsonLd,
    SAMEAS_JSONLD: JSON.stringify([
      album.spotifyAlbumId ? `https://open.spotify.com/album/${album.spotifyAlbumId}` : null,
      ...platformUrls(album),
      album.hyperfollowSlug ? `https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}` : null,
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
    POEM_SECTION: poemSectionFor(album),
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
  const isTeaser = !!album.teaser;
  const badge = isTeaser
    ? `<span class="badge upcoming"><span class="dot"></span>${esc(album.releaseDisplay)}</span>`
    : isUpcoming
    ? `<span class="badge upcoming"><span class="dot"></span>Coming ${esc(album.releaseDisplay)}</span>`
    : `<span class="badge">${album.tracks.length} tracks</span>`;
  const meta = isTeaser
    ? `${esc(album.genre.split('·')[0].trim())} · ${album.tracks.length} tracks`
    : isUpcoming
    ? `Releases ${esc(album.releaseDisplay)} · ${esc(album.genre.split('·')[0].trim())}`
    : `${esc(album.releaseDisplay)} · ${esc(album.genre.split('·')[0].trim())}`;
  return `      <a class="album-card${isUpcoming ? ' is-upcoming' : ''}" href="/albums/${album.slug}" style="--card-accent:${album.accent.color};--card-accent-rgb:${album.accent.rgb}">
        <div class="cover">${coverPicture({ base: `/album-art/${album.slug}`, alt: `${esc(album.title)} cover`, sizes: '(max-width:720px) 45vw, 300px' })}
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
    'description': `All ${ALBUMS.length} albums by Auny — instrumental and vocal.`,
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
          'datePublished': a.releaseDate || undefined,
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
    ALBUM_COUNT: String(ALBUMS.length),
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
