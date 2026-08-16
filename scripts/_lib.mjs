// Shared helpers for build scripts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHARACTERS } from '../src/data/characters.js';
import { PLATFORM_ICONS, DISTROKID_GLYPH } from '../src/data/platform-icons.js';

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
export const LISTEN_ROW_CSS = tpl('_listen-row.css');
export const RECENT_STRIP_HTML = tpl('_recent-strip.html');
export const RECENT_STRIP_CSS = tpl('_recent-strip.css');

// ---------------------------------------------------------------------------
// RELEASE STATE — the single source of truth. Do not re-derive this inline.
//
// Before 2026-08-08 three builders each computed "upcoming" their own way, and
// they disagreed precisely on release day: the homepage and the /albums card
// keyed off the date alone, while the album page also required a Spotify ID. On
// a release day with the ID not yet pasted in, the homepage counted the album as
// released and could print "Out now" beside a pre-save button while the album's
// own page still said coming soon.
//
// That is not hypothetical. `flatline` shipped 2026-06-05 with all 19 track IDs
// still placeholders, every track link dead, and stayed broken for two days
// until a listener reported it (commit e20b207). See AUN-693 and
// `📐 Claude Protocols/15_music_site_release_protocol.md`.
//
// Three states, and only three:
//   UNRELEASED — flagged upcoming, or dated in the future, or undated.
//                Renders the pre-release treatment.
//   RELEASED   — dated in the past. The page ships.
//
// Missing Spotify IDs do NOT hold a release back. Shipping the page on release
// day is the point; the IDs arrive when they arrive and get filled in after.
// The dead-link problem flatline had is solved where it actually lives — at the
// render — by never emitting a link for an empty id (see album.html makePlanet,
// and the CTA guards in build-albums). A missing id costs you a link, not a
// launch. `pendingIds` reports what is still outstanding as a build warning.
// ---------------------------------------------------------------------------

export const todayISO = () => process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

// Returns the URL only if it is a well-formed http(s) URL, else ''. `esc()`
// prevents attribute breakout but says nothing about the SCHEME, so a
// `javascript:` value would render an executable href, and a missing field
// renders the string "undefined". Both are authoring mistakes rather than
// attacks — Auny writes this data — but they ship silently, which is the part
// worth removing. A bad URL costs the link and logs, it never blocks the build.
export function safeUrl(value, context = 'link') {
  if (typeof value !== 'string' || !value) {
    console.warn(`⚠ ${context}: missing or non-string URL, link omitted`);
    return '';
  }
  let u;
  try { u = new URL(value); } catch {
    console.warn(`⚠ ${context}: unparseable URL ${JSON.stringify(value)}, link omitted`);
    return '';
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    console.warn(`⚠ ${context}: refusing ${u.protocol} URL, link omitted`);
    return '';
  }
  return value;
}

export function releaseStatus(release, today = todayISO()) {
  if (release.upcoming) return 'UNRELEASED';
  if (!release.releaseDate) return 'UNRELEASED';
  if (release.releaseDate > today) return 'UNRELEASED';
  // CONTENT vs LINKS. These are different things and they get opposite answers:
  //
  //   Missing LINKS  (Spotify ids)  -> still RELEASED. Ship the page, omit the
  //                                    links. A link is not the release.
  //   Missing CONTENT (no tracks)   -> UNRELEASED. There is nothing to release,
  //                                    so the page must not claim it is out.
  //
  // An album whose tracklist has not been filled in yet is a work in progress,
  // and "Out now" over an empty tracklist is a lie the visitor can see. It reads
  // as coming soon until the tracks exist.
  if (Array.isArray(release.tracks) && release.tracks.length === 0) return 'UNRELEASED';
  return 'RELEASED';
}

export const isUpcoming = (release, today) => releaseStatus(release, today) !== 'RELEASED';
export const isReleased = (release, today) => releaseStatus(release, today) === 'RELEASED';

// A teaser only holds the hero while the release is genuinely still ahead of us.
// Without this a stale flag outranks everything forever and keeps advertising a
// released album as "Coming <date in the past>" with a dead pre-save CTA.
export const isLiveTeaser = (release, today = todayISO()) =>
  !!release.teaser && releaseStatus(release, today) === 'UNRELEASED';

// Reports released items still missing Spotify IDs. WARNS, never throws — a
// missing id must never block a launch. The links simply do not render until
// the ids are filled in, so this is a to-do list, not a gate.
export function pendingIds(releases, today = todayISO()) {
  const pending = [];
  for (const r of releases) {
    if (releaseStatus(r, today) !== 'RELEASED') continue;
    const isAlbum = Array.isArray(r.tracks);
    const noTop = isAlbum ? !r.spotifyAlbumId : !r.spotifyTrackId;
    const missingTracks = isAlbum ? r.tracks.filter((t) => !t.id).length : 0;
    if (noTop || missingTracks) {
      pending.push(`  - ${r.slug}: `
        + [noTop && `${isAlbum ? 'spotifyAlbumId' : 'spotifyTrackId'} empty`,
           missingTracks && `${missingTracks} track link(s) pending`]
          .filter(Boolean).join(', '));
    }
  }
  if (pending.length) {
    console.warn(`\n⚠ Spotify IDs still pending on ${pending.length} released item(s):\n`
      + `${pending.join('\n')}\n`
      + `  Those links are omitted, not broken. Fill them in when they exist.\n`);
  }
  return pending;
}

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
    .map(([key, label]) => `<a class="platform-pill" href="${esc(p[key])}" target="_blank" rel="noopener">${label} <span class="ext">↗</span></a>`);
  if (!pills.length) return '';
  return `<div class="platform-row"><span class="pr-label">also on</span>\n          ${pills.join('\n          ')}\n        </div>`;
}

// ─── "listen on:" row (albums + singles) ──────────────────────────────
// One chip per platform that has a URL, then a DistroKid catch-all. The
// lineup is DATA-DRIVEN on purpose: most singles only carry Apple and
// Tidal, and a fixed Spotify/Apple/YouTube/Amazon row would render dead
// icons on them. Spotify is not in `platforms` — it comes from the album
// or track id, and is omitted when that id does not exist yet, which is
// the normal state on release day.
//
// `spotifyUrl` is passed in rather than derived here because albums key
// off spotifyAlbumId and singles off spotifyTrackId.
export function listenRowFor(release, { spotifyUrl = '', hyperfollowSlug = '' } = {}) {
  const p = { ...(release.platforms || {}) };
  if (spotifyUrl) p.spotify = spotifyUrl;

  // iTunes is not a separate URL anywhere — not in the vault, not in the
  // data. Apple's own convention is the same album page with ?app=itunes,
  // which opens the iTunes Store rather than Apple Music, so it is derived
  // rather than stored. Set `itunes` explicitly on a release to override.
  if (p.appleMusic && !p.itunes) {
    p.itunes = p.appleMusic + (p.appleMusic.includes('?') ? '&' : '?') + 'app=itunes';
  }

  // Author-supplied URLs go through safeUrl(), http(s) only — esc() stops an
  // attribute breakout but happily renders `javascript:`. The old platformRowFor
  // used esc() alone; that gap was carried into this renderer and closed on
  // 2026-08-16 rather than inherited further. A rejected URL warns and drops the
  // chip, matching the preorder CTA's behaviour.
  const chips = PLATFORM_ICONS
    .map((icon) => ({ icon, url: p[icon.key] ? safeUrl(p[icon.key], `${release.slug} ${icon.key}`) : '' }))
    .filter(({ url }) => url)
    .map(({ icon, url }) => {
      // iTunes' mark already contains a ring; a chip border would draw a
      // second one concentric with it. See _listen-row.css.
      const ringless = icon.key === 'itunes' ? ' lo-ringless' : '';
      return `<a class="lo-chip${ringless}" href="${esc(url)}" target="_blank" rel="noopener" style="--brand:${icon.colour}">`
        + `<span class="lo-glyph">${icon.svg}</span>`
        + `<span class="lo-cap">${esc(icon.label)}</span></a>`;
    });

  // Nothing to link to at all — render nothing rather than an empty heading.
  if (!chips.length && !hyperfollowSlug) return '';

  const row2 = hyperfollowSlug
    ? `\n      <div class="lo-row2">
        <span class="lo-row2-label">all other platforms</span>
        <span class="lo-row2-arrow">&rarr;</span>
        <a class="lo-chip lo-dk" href="https://distrokid.com/hyperfollow/auny1/${esc(hyperfollowSlug)}" target="_blank" rel="noopener">
          <span class="lo-glyph">${DISTROKID_GLYPH}</span>
          <span class="lo-cap">DistroKid</span>
        </a>
      </div>`
    : '';

  return `<div class="listen-on">
      <p class="listen-on-label">listen on:</p>
      <div class="lo-row">
        ${chips.join('\n        ')}
      </div>${row2}
    </div>`;
}

// Pre-release counterpart to listenRowFor: there are no store links yet, so
// the DistroKid chip is the whole control. Same chip, same hover, so a page
// does not change shape when the release lands — the row just fills in.
export function presaveRowFor(hyperfollowSlug, { label = 'pre-save here' } = {}) {
  if (!hyperfollowSlug) return '';
  return `<div class="listen-on">
      <div class="lo-row2 lo-row2-solo">
        <span class="lo-row2-label">${esc(label)}</span>
        <span class="lo-row2-arrow">&rarr;</span>
        <a class="lo-chip lo-dk" href="https://distrokid.com/hyperfollow/auny1/${esc(hyperfollowSlug)}" target="_blank" rel="noopener">
          <span class="lo-glyph">${DISTROKID_GLYPH}</span>
          <span class="lo-cap">DistroKid</span>
        </a>
      </div>
    </div>`;
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
export const CHARACTER_CSS = tpl('_character.css');

// The character block, shared by album and single pages.
//
// A release opts in with `character: '<Name>'`; anything without one renders
// nothing, so this stays additive. Both page types call this same function so
// the two cannot drift apart the way the three release-state predicates did.
export function characterSectionFor(release) {
  const c = release.character ? CHARACTERS[release.character] : null;
  if (!c) {
    if (release.character) {
      console.warn(`⚠ ${release.slug}: unknown character "${release.character}", block omitted`);
    }
    return '';
  }
  const copy = (c.story || []).map((p) => `<p>${esc(p)}</p>`).join('\n      ');
  const arc = c.arc
    ? `<div class="char-arc"><span class="sk">Arc</span><span class="sv">${esc(c.arc)}</span></div>`
    : '';
  return `<section class="char-section" aria-label="The character behind this release">
    <p class="char-label">the character</p>
    <p class="char-name">${esc(c.name)}</p>
    ${c.role ? `<p class="char-role">${esc(c.role)}</p>` : ''}
    <div class="char-copy">
      ${copy}
      ${arc}
    </div>
  </section>`;
}
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

export function playerFor({ kind, id, title, cover = '', disabled = false }) {
  const wrapClass = kind === 'album' ? 'embed-wrap album' : 'embed-wrap';
  // Pre-release: same cover + player chrome, but inert — no embed, no click.
  if (disabled) {
    return `<div class="${wrapClass}">
  <div class="cassette-strip disabled">
    <span class="left">Coming Soon</span>
    <div class="reels"><span class="reel"></span><span class="reel"></span></div>
  </div>
  <div class="spotify-facade ${kind} disabled" style="background-image:url('${cover}')" aria-disabled="true" role="img" aria-label="${esc(title)} — coming soon">
    <span class="facade-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
    <span class="facade-label">Player unlocks on release day</span>
  </div>
  <p class="embed-note">coming soon · preview disabled</p>
</div>`;
  }
  return render(PLAYER_HTML, {
    EMBED_KIND: kind,
    EMBED_ID: id,
    EMBED_TITLE: esc(title),
    EMBED_COVER: cover,
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

// HTML-escape for text nodes and attribute values. Escapes the single quote too,
// because some templates use single-quoted attribute syntax (e.g. the player
// facade's style="background-image:url('...')").
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Serialize a value for embedding inside a <script type="application/ld+json">
// block. Plain JSON.stringify is NOT safe here: it leaves `<` untouched, so any
// string containing "</script>" closes the element early and everything after it
// is parsed as HTML. It also leaves U+2028/U+2029 raw, which are literal line
// terminators to a JS parser.
//
// The < form is still valid JSON and still parses back to the same string,
// so structured-data consumers see the original text.
export function jsonLd(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
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
