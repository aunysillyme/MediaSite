#!/usr/bin/env node
// Generates static HTML for /singles/ and /singles/<slug>/ from src/data/singles.js + templates/

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SINGLES, COLOR_SERIES, COLOR_SERIES_ORDER, COLOR_TYPE_INFO, colorSeriesMembers } from '../src/data/singles.js';
import { navFor, NAV_CSS, PLAYER_CSS, FOOTER_CSS, FOOTER_HTML, COLOR_CHIPS_CSS, LISTEN_CSS, SERIES_CARD_CSS, SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS, RECENT_STRIP_CSS, playerFor, footerFor, colorChipsFor, recentStripFor, registerColorTypeInfo, singleCoverPath, seriesBadge, singleGenreHead, platformRowFor, platformUrls, coverPicture } from './_lib.mjs';

registerColorTypeInfo(COLOR_TYPE_INFO);

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tpl = (name) => readFileSync(join(root, 'templates', name), 'utf8');

const SINGLE_TPL = tpl('single.html');
const LIST_TPL = tpl('singles-list.html');

// ─── Helpers ────────────────────────────────────────────────────────────────

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escAttr(s) { return escHtml(s); }

function lyricsToStanzas(text, anchor) {
  const stanzas = text.trim().split(/\n\s*\n/).map((stanza) => stanza.split('\n'));
  // mark the anchor line (case-insensitive contains match on a normalized version) with .accent
  const anchorNorm = anchor.replace(/[—–-]/g, '').replace(/\s+/g, ' ').toLowerCase().trim();
  return stanzas.map((lines) => {
    const html = lines.map((line) => {
      const norm = line.replace(/[—–-]/g, '').replace(/\s+/g, ' ').toLowerCase().trim();
      const isAnchor = anchorNorm.length > 6 && norm.includes(anchorNorm.split(' ').slice(0, 5).join(' '));
      const esc = escHtml(line);
      return isAnchor ? `<span class="accent">${esc}</span>` : esc;
    }).join('<br>');
    return `    <p>${html}</p>`;
  }).join('\n');
}

function lyricsToJsonText(text) {
  return JSON.stringify(text);
}

// Per-single background hue rotation off the source PNG (which is already blue-violet)
function bgHueFor(single) {
  if (single.colorSeries === 'member') {
    const map = { black: 200, blue: 200, yellow: 30, red: 340, pink: 320, orange: 20, cyan: 180 };
    return map[single.slug] ?? 200;
  }
  return 200;
}

function heroLabelFor(single) {
  if (single.colorSeries === 'member') {
    const meta = COLOR_SERIES.find((c) => c.slug === single.slug);
    const tag = meta?.type === 'outlier' ? 'outlier' : 'rainbow';
    return `${single.emoji} &nbsp; single · color series · ${tag}`;
  }
  return '✦ &nbsp; single';
}

function seriesBlockFor(single) {
  if (single.colorSeries !== 'member') return '';
  const meta = COLOR_SERIES.find((c) => c.slug === single.slug);
  return colorChipsFor({
    colors: COLOR_SERIES,
    currentSlug: single.slug,
    currentType: meta?.type,
  });
}

function titleHtml(single) {
  // Allow two-line titles for long ones
  if (single.title.length > 14) {
    const words = single.title.split(' ');
    if (words.length >= 2) {
      const mid = Math.ceil(words.length / 2);
      return escHtml(words.slice(0, mid).join(' ')) + '<br>' + escHtml(words.slice(mid).join(' '));
    }
  }
  return escHtml(single.title);
}

// ─── Single page render ─────────────────────────────────────────────────────

function renderSingle(single) {
  const replacements = {
    TITLE: escHtml(single.title),
    TITLE_HTML: titleHtml(single),
    YEAR: String(single.year),
    SLUG: single.slug,
    COVER_EXT: singleCoverPath(single.slug).endsWith('.jpg') ? 'jpg' : 'svg',
    RELEASE_DISPLAY: escHtml(single.releaseDisplay),
    RELEASE_ISO: single.releaseDate,
    GENRE: escHtml(single.genre),
    GENRE_HEAD: escHtml(singleGenreHead(single.genre)),
    HERO_PICTURE: coverPicture({ base: singleCoverPath(single.slug).replace(/\.jpg$/, ''), alt: `${escAttr(single.title)} cover art by Auny`, sizes: '(max-width:760px) 80vw, 420px', eager: true }),
    SPOTIFY_TRACK_ID: single.spotifyTrackId,
    HYPERFOLLOW_SLUG: single.hyperfollowSlug,
    PLATFORM_ROW: platformRowFor(single),
    SAMEAS_JSONLD: JSON.stringify([
      `https://open.spotify.com/track/${single.spotifyTrackId}`,
      ...platformUrls(single),
      `https://distrokid.com/hyperfollow/auny1/${single.hyperfollowSlug}`,
    ]),
    THEMES: escHtml(single.themes),
    ANCHOR_LYRIC: escHtml(single.anchorLyric),
    ACCENT_COLOR: single.accent.color,
    ACCENT_RGB: single.accent.rgb,
    BG_HUE: String(bgHueFor(single)),
    HERO_LABEL: heroLabelFor(single),
    SERIES_BLOCK: seriesBlockFor(single),
    LYRICS_HTML: lyricsToStanzas(single.lyrics, single.anchorLyric),
    LYRICS_JSON: lyricsToJsonText(single.lyrics),
    NAV: navFor('singles'),
    NAV_CSS: NAV_CSS,
    PLAYER_CSS: PLAYER_CSS,
    PLAYER_HTML: playerFor({ kind: 'track', id: single.spotifyTrackId, title: single.title }),
    FOOTER_CSS: FOOTER_CSS,
    FOOTER_HTML: footerFor({ releaseDisplay: single.releaseDisplay }),
    COLOR_CHIPS_CSS: COLOR_CHIPS_CSS,
    LISTEN_CSS: LISTEN_CSS,
    SIGNUP_HTML, SIGNUP_CSS, SIGNUP_JS,
    RECENT_STRIP_CSS,
    RECENT_STRIP_HTML: recentStripFor({ all: SINGLES, currentSlug: single.slug }),
  };
  return Object.entries(replacements).reduce(
    (html, [key, val]) => html.replaceAll(`{{${key}}}`, val),
    SINGLE_TPL
  );
}

// ─── List page render ───────────────────────────────────────────────────────

function cardHtml(single, opts = {}) {
  const hasAccent = single.colorSeries === 'member' || single.slug === 'pink';
  const cls = hasAccent ? 'card series' : 'card';
  const accentStyle = hasAccent ? ` style="--card-accent:${single.accent.color}"` : '';
  const badge = opts.badgeText ? `      ${seriesBadge(opts.badgeText)}\n` : '';
  return `      <a class="${cls}" href="/singles/${single.slug}"${accentStyle}>
${badge}        <div class="cover">${coverPicture({ base: singleCoverPath(single.slug).replace(/\.jpg$/, ''), alt: `${escAttr(single.title)} cover`, sizes: '(max-width:720px) 45vw, 240px' })}</div>
        <div class="body">
          <div class="card-title">${escHtml(single.title)}</div>
          <div class="card-meta">${escHtml(single.releaseDisplay)}</div>
        </div>
      </a>`;
}

function pinkCard() {
  const p = SINGLES.find((s) => s.slug === 'pink');
  if (!p) return '';
  return `      <a class="card series" href="/singles/${p.slug}" style="--card-accent:${p.accent.color}">
        ${seriesBadge(p.emoji)}
        <div class="cover">${coverPicture({ base: singleCoverPath(p.slug).replace(/\.jpg$/, ''), alt: `${escAttr(p.title)} cover`, sizes: '(max-width:720px) 45vw, 240px' })}</div>
        <div class="body">
          <div class="card-title">${escHtml(p.title)}</div>
          <div class="card-meta">${escHtml(p.releaseDisplay)}</div>
        </div>
      </a>`;
}

function renderList() {
  const series = colorSeriesMembers();
  const seriesCards = [
    pinkCard(),
    ...series.filter((s) => s.slug !== 'pink').map((s) => cardHtml(s, { badgeText: s.emoji })),
  ].join('\n');
  const allCards = SINGLES.map((s) => cardHtml(s)).join('\n');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Singles — Auny',
    'url': 'https://www.auny.media/singles',
    'description': `All ${SINGLES.length} vocal singles by Auny.`,
    'isPartOf': { '@id': 'https://www.auny.media/#website' },
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': SINGLES.length,
      'itemListElement': SINGLES.map((s, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'item': {
          '@type': 'MusicRecording',
          'name': s.title,
          'url': `https://www.auny.media/singles/${s.slug}`,
          'image': `https://www.auny.media${singleCoverPath(s.slug)}`,
          'datePublished': s.releaseDate,
          'genre': s.genre,
          'byArtist': { '@type': 'MusicGroup', '@id': 'https://www.auny.media/#artist' },
          'sameAs': s.spotifyTrackId ? `https://open.spotify.com/track/${s.spotifyTrackId}` : undefined,
        },
      })),
    },
  }, null, 2);

  return LIST_TPL
    .replaceAll('{{SERIES_CARDS}}', seriesCards)
    .replaceAll('{{ALL_CARDS}}', allCards)
    .replaceAll('{{TOTAL_SINGLES}}', String(SINGLES.length))
    .replaceAll('{{LIST_JSONLD}}', jsonLd)
    .replaceAll('{{NAV}}', navFor('singles'))
    .replaceAll('{{NAV_CSS}}', NAV_CSS)
    .replaceAll('{{SERIES_CARD_CSS}}', SERIES_CARD_CSS)
    .replaceAll('{{SIGNUP_HTML}}', SIGNUP_HTML)
    .replaceAll('{{SIGNUP_CSS}}', SIGNUP_CSS)
    .replaceAll('{{SIGNUP_JS}}', SIGNUP_JS)
    .replaceAll('{{FOOTER_HTML}}', FOOTER_HTML)
    .replaceAll('{{FOOTER_CSS}}', FOOTER_CSS);
}

// ─── Write files ─────────────────────────────────────────────────────────────

function writeFile(relPath, content) {
  const full = join(root, 'public', relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

let count = 0;
for (const single of SINGLES) {
  writeFile(join('singles', `${single.slug}.html`), renderSingle(single));
  count++;
}
writeFile(join('singles.html'), renderList());

console.log(`✓ generated ${count} single pages → public/singles/*.html + listing → public/singles.html`);
