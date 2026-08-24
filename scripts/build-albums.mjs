#!/usr/bin/env node
// Generates /albums + /albums/<slug> pages from src/data/albums.js + templates/

import { ALBUMS, ringsFor } from '../src/data/albums.js';
import { ALBUM_NOTES } from '../src/data/album-notes.js';
import { tpl, navFor, esc, jsonLd, writeOut, render, NAV_CSS, PLAYER_CSS, FOOTER_CSS, LISTEN_CSS, LISTEN_ROW_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, playerFor, footerFor, albumGenreHead, listenRowFor, platformUrls, coverPicture, todayISO, isUpcoming as isUpcomingFn, isLiveTeaser, pendingIds, safeUrl, CHARACTER_CSS, characterSectionFor, RECENT_STRIP_CSS, recentStripFor , ogImage} from './_lib.mjs';
import { join } from 'node:path';

// "The Making" + enriched tracklist — rendered only for albums with a notes entry.
function makingSectionFor(album) {
  const n = ALBUM_NOTES[album.slug];
  if (!n || !n.making) return '';
  const copy = n.making.map((p) => `<p>${esc(p)}</p>`).join('\n      ');
  const specs = (n.specs || []).map(([k, v]) =>
    `<span class="spec"><span class="sk">${esc(k)}</span><span class="sv">${esc(v)}</span></span>`).join('');
  return `<section class="notes-section" aria-label="How the album was made">
    <p class="notes-label">the making</p>
    <div class="making-copy">
      ${copy}
      ${specs ? `<div class="making-specs">${specs}</div>` : ''}
    </div>
  </section>`;
}

function tracklistSectionFor(album) {
  const n = ALBUM_NOTES[album.slug];
  if (!n || !n.tracks) return '';
  const rows = album.tracks.map((t) => {
    const info = n.tracks[t.name] || {};
    const bpm = info.bpm ? `<span class="trk-bpm">${info.bpm} BPM</span>` : '';
    const desc = info.vibe ? `<span class="trk-desc">${esc(info.vibe)}</span>` : '';
    return `<div class="trk"><span class="trk-n">${String(t.num).padStart(2, '0')}</span><span class="trk-t">${esc(t.name)}</span>${bpm}${desc}</div>`;
  }).join('\n    ');
  return `<section class="notes-section" aria-label="Tracklist">
    <p class="notes-label">tracklist · ${album.tracks.length} tracks</p>
    <div class="tracklist">
    ${rows}
    </div>
  </section>`;
}

// Sibling cross-link between paired releases (e.g. dreaMs vocal ↔ instrumental).
// Renders nothing unless the album declares a `companion`.
function companionBlockFor(album) {
  const c = album.companion;
  if (!c) return '';
  return `<a class="companion-link" href="/albums/${c.slug}">` +
    `<span class="cl-tag">↔ companion</span>` +
    `<span class="cl-body">the ${esc(c.kind)} album · <strong>${esc(c.title)}</strong></span>` +
    `<span class="cl-arrow">→</span></a>`;
}

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
  // Release state comes from _lib's single source of truth. Do not re-derive it
  // here — three surfaces disagreeing on this is exactly what AUN-693 fixed.
  const today = todayISO();
  const upcoming = isUpcomingFn(album, today);
  // Teaser = shows the disabled album player (not a Spotify embed). A teaser may
  // be dateless ("Coming Soon", no CTA) OR dated + submitted, in which case it
  // shows "Coming <date>" and a live pre-save CTA once hyperfollowSlug is set.
  const teaser = isLiveTeaser(album, today);
  // Derived from STATE, not from the date. This label only ever renders on an
  // upcoming page, so it must never say "Out now" — that was reachable when the
  // date had passed but the release was still UNRELEASED (upcoming flag, or an
  // empty tracklist), and it contradicted the rest of the page.
  const comingLabel = album.releaseDate && album.releaseDate > today
    ? `Coming ${esc(album.releaseDisplay)}`
    : 'Coming Soon';
  const kindWord = album.vocal ? 'vocal' : 'instrumental';
  // Pre-order is a PURCHASE, not a pre-save, and it is the only pre-release
  // action that produces revenue. iTunes downloads are the single largest
  // revenue line in the catalogue, and the site had no buy surface at all, so a
  // live pre-order gets its own CTA rather than being folded into the platform
  // pills. Rendered only while upcoming — after release the normal listen/buy
  // row takes over. Data-driven via `preorder: { store, url }` so this is not
  // hardcoded to one shop.
  // Both fields must be present and the URL must be a real http(s) URL. Without
  // this, `{ store: 'iTunes' }` rendered href="undefined" and `{ url }` alone
  // rendered "pre-order on undefined" — a silently broken revenue CTA. Flagged
  // by the codex pass on this change.
  const preorderUrl = album.preorder ? safeUrl(album.preorder.url, `${album.slug} preorder`) : '';
  const preorderStore = album.preorder && typeof album.preorder.store === 'string' ? album.preorder.store : '';
  if (album.preorder && (!preorderUrl || !preorderStore)) {
    console.warn(`⚠ ${album.slug}: preorder is malformed (needs { store, url }), CTA omitted`);
  }
  const preorderCta = preorderUrl && preorderStore
    ? `\n        <a class="hero-accent" href="${esc(preorderUrl)}" target="_blank" rel="noopener">pre-order on ${esc(preorderStore)} <span class="ext">↗</span></a>`
    : '';
  // Order mirrors the released state: the accent CTA leads, the pill sits under
  // it. Pre-order is the accent because it is the only pre-release action that
  // earns anything; pre-save is the secondary pill, exactly as "stream on all
  // platforms" sits under "listen on spotify" after release.
  const presaveCta = album.hyperfollowSlug
    ? `\n        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · follow on all platforms <span class="ext">↗</span></a>`
    : '';
  const heroListenBlock = teaser
    ? (album.hyperfollowSlug || album.preorder
      ? `<div class="hero-listen">${preorderCta}${presaveCta}
      </div>`
      : '')
    : upcoming
    ? `<div class="hero-listen">${preorderCta}
        <a class="all-pill" href="https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}" target="_blank" rel="noopener">pre-save · stream on all platforms <span class="ext">↗</span></a>
      </div>`
    // Released. The Spotify CTA appears only once the album id exists — on
    // release day it often does not yet, and linking to ".../album/" is a dead
    // click. Until then the platform pills and the all-platforms link carry it,
    // so the page still ships and still converts.
    : listenRowFor(album, {
        spotifyUrl: album.spotifyAlbumId ? `https://open.spotify.com/album/${album.spotifyAlbumId}` : '',
        hyperfollowSlug: album.hyperfollowSlug,
      });
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
    // Released. The embed needs a real album id — without one the iframe URL is
    // ".../embed/album/?" and renders a Spotify error inside the page. Show the
    // disabled facade until the id lands, then it becomes a live player on the
    // next build with no template change.
    : `<section class="album-player-section" aria-label="Album preview player">
      <p class="album-player-label">✦ &nbsp; preview the album</p>
      ${playerFor({ kind: 'album', id: album.spotifyAlbumId || '', title: album.title, cover: `/album-art/${album.slug}-640.webp`, disabled: !album.spotifyAlbumId })}
    </section>`;
  const upcomingBanner = upcoming
    ? `<p class="upcoming-banner"><span class="dot"></span> ${comingLabel}</p>`
    : '';
  const heroLabelSuffix = upcoming ? ' · upcoming' : '';
  const notes = ALBUM_NOTES[album.slug];
  const tracksJsonLd = jsonLd({
    '@type': 'ItemList',
    numberOfItems: album.tracks.length,
    itemListElement: album.tracks.map((t, i) => {
      const name = typeof t === 'string' ? t : t.name;
      const item = {
        '@type': 'MusicRecording',
        name,
        byArtist: { '@type': 'MusicGroup', name: 'Auny' },
      };
      // Enrich with per-track description + BPM when notes exist (unique content).
      const info = notes && notes.tracks ? notes.tracks[name] : null;
      if (info && info.vibe) item.description = info.vibe;
      if (info && info.bpm) item.additionalProperty = { '@type': 'PropertyValue', name: 'Tempo', value: `${info.bpm} BPM` };
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
    // "an 11-track" / "an 18-track", "a 19-track" — English takes "an" before a
    // numeral that is *read* vowel-initial (8, 11, 18), not one merely spelled so.
    NUM_TRACKS_ARTICLE: /^(8|11|18)$/.test(String(album.tracks.length)) ? 'an' : 'a',
    ALBUM_KIND: album.vocal ? 'vocal' : 'instrumental',
    TRACKS_JSONLD: tracksJsonLd,
    SAMEAS_JSONLD: jsonLd([
      album.spotifyAlbumId ? `https://open.spotify.com/album/${album.spotifyAlbumId}` : null,
      ...platformUrls(album),
      album.hyperfollowSlug ? `https://distrokid.com/hyperfollow/auny1/${album.hyperfollowSlug}` : null,
    ].filter(Boolean)),
    ACCENT_COLOR: album.accent.color,
    ACCENT_RGB: album.accent.rgb,
    BG_HUE: String(album.bgHue ?? 200),
    BG_COLOR: '#030308',
    RINGS_JSON: jsonLd(rings),
    PALETTE_JSON: jsonLd(palette),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
    PLAYER_CSS: PLAYER_CSS,
    HERO_LISTEN_BLOCK: heroListenBlock,
    COMPANION_BLOCK: companionBlockFor(album),
    PREVIEW_SECTION: previewSection,
    POEM_SECTION: poemSectionFor(album),
    CHARACTER_SECTION: characterSectionFor(album),
    CHARACTER_CSS,
    MAKING_SECTION: makingSectionFor(album),
    TRACKLIST_SECTION: tracklistSectionFor(album),
    RECENT_STRIP_CSS,
    RECENT_STRIP_HTML: recentStripFor({ all: ALBUMS, currentSlug: album.slug, kind: 'album' }),
    UPCOMING_BANNER: upcomingBanner,
    HERO_LABEL_SUFFIX: heroLabelSuffix,
    FOOTER_CSS: FOOTER_CSS,
    FOOTER_HTML: footerFor({ releaseDisplay: album.releaseDisplay }),
    LISTEN_CSS: LISTEN_CSS,
    LISTEN_ROW_CSS: LISTEN_ROW_CSS,
    HYPERFOLLOW_SLUG: album.hyperfollowSlug,
    SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
  });
}

function cardHtml(album) {
  // Same single source as the detail page and the homepage. This card used to
  // key off the date alone, and `isTeaser` had no date guard at all, so its
  // badge would still read as a teaser after the album had shipped.
  const today = todayISO();
  const isUpcoming = isUpcomingFn(album, today);
  const isTeaser = isLiveTeaser(album, today);
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
  return jsonLd({
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
    OG_IMAGE: ogImage('albums'),
    ALBUM_CARDS: ALBUMS.map(cardHtml).join('\n'),
    ALBUM_COUNT: String(ALBUMS.length),
    LIST_JSONLD: listJsonLd(),
    NAV: navFor('albums'),
    NAV_CSS: NAV_CSS,
    SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
    FOOTER_HTML: footerFor(), FOOTER_CSS,
  });
}

// Gate before writing anything: a release whose date has passed with IDs still
// missing has no honest page, so refuse the build rather than emit one. Vercel
// keeps the last good deploy, which is the pre-release page — strictly better
// than shipping "Out now" over dead links.
pendingIds(ALBUMS);

let count = 0;
for (const album of ALBUMS) {
  writeOut(join('albums', `${album.slug}.html`), renderAlbum(album));
  count++;
}
writeOut('albums.html', renderList());

console.log(`✓ generated ${count} album pages → public/albums/*.html + listing → public/albums.html`);
