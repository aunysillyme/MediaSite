// Shared helpers for build scripts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const tpl = (name) => readFileSync(join(root, 'templates', name), 'utf8');

export const NAV_HTML = tpl('_nav.html');
export const NAV_CSS = tpl('_nav.css');
export const PLAYER_HTML = tpl('_player.html');
export const PLAYER_CSS = tpl('_player.css');
export const FOOTER_HTML = tpl('_footer.html');
export const FOOTER_CSS = tpl('_footer.css');
export const COLOR_CHIPS_HTML = tpl('_color-chips.html');
export const COLOR_CHIPS_CSS = tpl('_color-chips.css');
export const LISTEN_CSS = tpl('_listen.css');
export const RECENT_STRIP_HTML = tpl('_recent-strip.html');
export const RECENT_STRIP_CSS = tpl('_recent-strip.css');

// Renders the "more recent releases →" strip for single pages.
// Picks the N newest singles (by releaseDate desc) excluding currentSlug.
// `all` is the SINGLES array; caller passes it to avoid a circular import.
export function recentStripFor({ all, currentSlug, limit = 4, heading = 'more recent releases →' }) {
  const ordered = [...all]
    .filter((s) => s.slug !== currentSlug)
    .sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1))
    .slice(0, limit);
  const cards = ordered.map((s) => {
    return `    <a class="mini-card" href="/singles/${s.slug}">
      <div class="cover"><img src="${singleCoverPath(s.slug)}" alt="${esc(s.title)} cover" loading="lazy" width="640" height="640"></div>
      <div class="body">
        <div class="mini-card-title">${esc(s.title)}</div>
        <div class="mini-card-meta">${esc(s.releaseDisplay)}</div>
      </div>
    </a>`;
  }).join('\n');
  return render(RECENT_STRIP_HTML, { HEADING: heading, CARDS: cards });
}
// Pull a SEO-meaningful primary genre out of a "·"-separated genre string.
// Singles: first segment is often "Lyrical" (not a search keyword on its own),
//          so combine with the next segment for specificity.
// Albums:  first segment is often "Instrumental" (generic), so skip past it.
export function singleGenreHead(genre) {
  const parts = genre.split('·').map((p) => p.trim());
  if (parts[0] === 'Lyrical' && parts.length > 1) return `Lyrical ${parts[1]}`;
  return parts[0];
}
// Accepts either a genre string OR the full album object (to honor an
// optional `genreHead` override field for SEO-weak auto-extractions).
export function albumGenreHead(genreOrAlbum) {
  if (typeof genreOrAlbum === 'object' && genreOrAlbum?.genreHead) return genreOrAlbum.genreHead;
  const genre = typeof genreOrAlbum === 'string' ? genreOrAlbum : genreOrAlbum.genre;
  const parts = genre.split('·').map((p) => p.trim());
  if (parts[0] === 'Instrumental' && parts.length > 1) return parts[1];
  return parts[0];
}

// ─── "Also on" per-platform direct links (albums + singles) ────────────
// Canonical display order + labels for the platform pills. A release's
// `platforms` map holds confirmed-live URLs; missing keys don't render.
export const PLATFORM_LABELS = [
  ['appleMusic',   'Apple Music'],
  ['youtubeMusic', 'YouTube Music'],
  ['amazonMusic',  'Amazon Music'],
  ['tidal',        'Tidal'],
  ['deezer',       'Deezer'],
  ['pandora',      'Pandora'],
];

export function platformRowFor(release) {
  const p = release.platforms || {};
  const pills = PLATFORM_LABELS
    .filter(([key]) => p[key])
    .map(([key, label]) => `<a class="platform-pill" href="${p[key]}" target="_blank" rel="noopener">${label} <span class="ext">↗</span></a>`);
  if (!pills.length) return '';
  return `<div class="platform-row"><span class="pr-label">also on</span>\n          ${pills.join('\n          ')}\n        </div>`;
}

export function platformUrls(release) {
  const p = release.platforms || {};
  return PLATFORM_LABELS.map(([key]) => p[key]).filter(Boolean);
}

// ─── Responsive cover <picture> ───────────────────────────────────────
// Emits AVIF + WebP sources (320w/640w) with the master JPEG as fallback.
// `base` is the cover path without extension (e.g. "/album-art/singles/cyan").
// `sizes` tells the browser the rendered width so it picks the right variant.
// Grids pass a small fixed size; detail heroes pass eager:true for the LCP.
export function coverPicture({ base, alt, sizes = '240px', eager = false, imgClass = '' }) {
  const cls = imgClass ? ` class="${imgClass}"` : '';
  const loading = eager
    ? ' fetchpriority="high" decoding="async"'
    : ' loading="lazy" decoding="async"';
  return `<picture>` +
    `<source type="image/avif" srcset="${base}-320.avif 320w, ${base}-640.avif 640w" sizes="${sizes}">` +
    `<source type="image/webp" srcset="${base}-320.webp 320w, ${base}-640.webp 640w" sizes="${sizes}">` +
    `<img${cls} src="${base}.jpg" alt="${alt}" width="640" height="640"${loading}></picture>`;
}

export const SERIES_CARD_CSS = tpl('_series-card.css');
export const SIGNUP_HTML = tpl('_signup.html');
export const SIGNUP_CSS = tpl('_signup.css');
export const SIGNUP_JS = tpl('_signup.js');

// Single source of truth for the emoji-badge element used on color-series
// cards across the homepage and /singles list. Renders <span class="badge">.
export function seriesBadge(emoji) {
  return `<span class="badge">${emoji}</span>`;
}

export function colorChipsFor({ colors, currentSlug, currentType }) {
  // Released chips link out; upcoming chips render as static "soon" pills
  // that adopt the upcoming color's accent for the SOON tag.
  const chips = colors.map((c) => {
    if (c.released) {
      const cls = c.slug === currentSlug ? 'chip this' : 'chip';
      return `    <a class="${cls}" href="/singles/${c.slug}">${c.emoji} ${c.label}</a>`;
    }
    const tomorrow = c.releaseNote === 'tomorrow' ? ' tomorrow' : '';
    const accentVar = `--chip-accent-rgb:${c.accent.rgb}`;
    const tag = c.releaseNote === 'tomorrow' ? 'TOMORROW' : 'SOON';
    return `    <span class="chip soon${tomorrow}" style="${accentVar}">${c.emoji} ${c.label} <span class="soon-tag">${tag}</span></span>`;
  }).join('\n');

  const info = (currentType && currentType in COLOR_TYPE_INFO_MAP)
    ? COLOR_TYPE_INFO_MAP[currentType]
    : { label: 'color series', blurb: '12 colors total — 7 rainbow, 5 outliers' };

  return render(COLOR_CHIPS_HTML, {
    CHIPS: chips,
    TYPE_LABEL: info.label,
    TYPE_BLURB: info.blurb,
  });
}

// Populated by build scripts that import COLOR_TYPE_INFO from singles.js
let COLOR_TYPE_INFO_MAP = {};
export function registerColorTypeInfo(info) { COLOR_TYPE_INFO_MAP = info; }

export function playerFor({ kind, id, title }) {
  const wrapClass = kind === 'album' ? 'embed-wrap album' : 'embed-wrap';
  return render(PLAYER_HTML, {
    EMBED_KIND: kind,
    EMBED_ID: id,
    EMBED_TITLE: esc(title),
    WRAP_CLASS: wrapClass,
  });
}

export function footerFor() {
  return FOOTER_HTML;
}

export function navFor(section) {
  // Mark active section in the nav HTML
  if (!section) return NAV_HTML;
  return NAV_HTML.replace(
    new RegExp(`(data-section="${section}"[^>]*class="nav-link")`),
    'data-section="' + section + '" class="nav-link active"'
  );
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Returns "/album-art/singles/<slug>.jpg" if it exists, else falls back
// to ".svg" (for placeholder covers awaiting the real asset).
export function singleCoverPath(slug) {
  const ext = existsSync(join(root, 'public/album-art/singles', `${slug}.jpg`)) ? 'jpg' : 'svg';
  return `/album-art/singles/${slug}.${ext}`;
}

export function writeOut(relPath, content) {
  const full = join(root, 'public', relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

export function render(template, replacements) {
  return Object.entries(replacements).reduce(
    (html, [key, val]) => html.replaceAll(`{{${key}}}`, val ?? ''),
    template
  );
}
