#!/usr/bin/env node
// Generates static HTML for /singles/ and /singles/<slug>/ from src/data/singles.js + templates/

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SINGLES, COLOR_SERIES_ORDER, colorSeriesMembers } from '../src/data/singles.js';
import { navFor, NAV_CSS } from './_lib.mjs';

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
    const map = { black: 200, blue: 200, yellow: 30, red: 340, orange: 20 };
    return map[single.slug] ?? 200;
  }
  if (single.slug === 'pink') return 320;
  if (single.slug === 'cyan') return 180;
  return 200;
}

function heroLabelFor(single) {
  if (single.colorSeries === 'member') {
    const i = COLOR_SERIES_ORDER.findIndex((c) => c.slug === single.slug);
    return `${single.emoji} &nbsp; single · color series · ${i + 1} of 5`;
  }
  if (single.slug === 'pink') return '🩷 &nbsp; single · standalone';
  if (single.slug === 'cyan') return '🩵 &nbsp; single · color series · outlier';
  return '✦ &nbsp; single';
}

function seriesBlockFor(single) {
  if (single.colorSeries === 'member') {
    const chips = COLOR_SERIES_ORDER.map(({ slug, emoji, label }) => {
      const cls = slug === single.slug ? 'chip this' : 'chip';
      return `      <a class="${cls}" href="/singles/${slug}">${emoji} ${label}</a>`;
    }).join('\n');
    return `<p class="series-label">part of the color series →</p>\n    <div class="series-chips">\n${chips}\n    </div>`;
  }
  if (single.slug === 'pink') {
    return `<p class="standalone-note">Standalone single — outside the color series. Every other color was chosen or inhabited; pink was assigned and refused.</p>`;
  }
  if (single.slug === 'cyan') {
    return `<p class="standalone-note">Color series outlier — a color outside the traditional rainbow. The monster of memory, frozen and forgotten; the scar worn proud once the wound has closed.</p>`;
  }
  return '';
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
    RELEASE_DISPLAY: escHtml(single.releaseDisplay),
    RELEASE_ISO: single.releaseDate,
    GENRE: escHtml(single.genre),
    SPOTIFY_TRACK_ID: single.spotifyTrackId,
    HYPERFOLLOW_SLUG: single.hyperfollowSlug,
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
  };
  return Object.entries(replacements).reduce(
    (html, [key, val]) => html.replaceAll(`{{${key}}}`, val),
    SINGLE_TPL
  );
}

// ─── List page render ───────────────────────────────────────────────────────

function cardHtml(single, opts = {}) {
  const isSeries = single.colorSeries === 'member';
  const cls = isSeries ? 'card series' : 'card';
  const accentStyle = isSeries ? ` style="--card-accent:${single.accent.color}"` : '';
  const badge = opts.badgeText ? `      <span class="badge" style="color:${single.accent.color}">${opts.badgeText}</span>\n` : '';
  return `      <a class="${cls}" href="/singles/${single.slug}"${accentStyle}>
${badge}        <div class="cover"><img src="/album-art/singles/${single.slug}.jpg" alt="${escAttr(single.title)} cover" loading="lazy" width="640" height="640"></div>
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
        <div class="cover"><img src="/album-art/singles/${p.slug}.jpg" alt="${escAttr(p.title)} cover" loading="lazy" width="640" height="640"></div>
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
    ...series.map((s, i) => cardHtml(s, { badgeText: `${s.emoji} ${i + 1}/5` })),
  ].join('\n');
  const allCards = SINGLES.map((s) => cardHtml(s)).join('\n');
  return LIST_TPL
    .replaceAll('{{SERIES_CARDS}}', seriesCards)
    .replaceAll('{{ALL_CARDS}}', allCards)
    .replaceAll('{{TOTAL_SINGLES}}', String(SINGLES.length))
    .replaceAll('{{NAV}}', navFor('singles'))
    .replaceAll('{{NAV_CSS}}', NAV_CSS);
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
