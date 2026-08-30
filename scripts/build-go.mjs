#!/usr/bin/env node
// Generates /go/<slug>/<platform> tracking pages.
//
// WHY THESE EXIST
// Ads that point straight at Apple Music cannot be measured: the X pixel only
// runs on a domain Auny owns, and Apple never reports a sale back to a click.
// These pages put one owned hop in the path so the click is recorded, then hand
// the visitor on. Canon: 📣 Ads/X Ads/auny_own_campaigns/benchmarks_and_learnings.md
// "the pixel problem", Problem 2. Tracked in AUN-721.
//
// APPLE ONLY, ON PURPOSE
// Spotify already reports auny.media referrals in Spotify for Artists, and
// YouTube Studio already reports External traffic per video. Routing those
// through a hop would cost conversions and buy no measurement. AUN-721's own
// rule: route only where no measurement exists.
//
// NOT IN THE SITEMAP, NOT INDEXED
// build-sitemap.mjs reads the albums/singles data, not public/, so these never
// enter it. Each page also carries noindex + a canonical back to the real
// release page, so it cannot outrank the thing it points at.

import { ALBUMS } from '../src/data/albums.js';
import { SINGLES, BRAND_ACCENT } from '../src/data/singles.js';
import { tpl, esc, writeOut, render, safeUrl, singleCoverPath } from './_lib.mjs';
import { join } from 'node:path';

const TEMPLATE = tpl('go.html');

// Only platforms with no reporting of their own belong here.
const PLATFORMS = [
  { key: 'apple', label: 'Apple Music', field: 'appleMusic' },
];

// `accent` is { color, rgb } across both data files, the same shape
// build-albums.mjs reads as album.accent.color. Not a bare string.
function accentColor(r) {
  return (r.accent && r.accent.color) || BRAND_ACCENT.color;
}

function entriesFor(releases, kind) {
  return releases.map((r) => ({
    kind,
    slug: r.slug,
    title: r.title,
    accent: accentColor(r),
    platforms: r.platforms || {},
    cover: kind === 'album' ? `/album-art/${r.slug}.jpg` : singleCoverPath(r.slug),
    canonical: kind === 'album' ? `/albums/${r.slug}` : `/singles/${r.slug}`,
  }));
}

const all = [...entriesFor(ALBUMS, 'album'), ...entriesFor(SINGLES, 'single')];

// A slug collision would make one release silently overwrite the other's page,
// and the loser would keep taking ad spend to the wrong destination. Fail loudly.
const seen = new Map();
for (const r of all) {
  if (seen.has(r.slug)) {
    throw new Error(
      `slug collision: "${r.slug}" exists as both ${seen.get(r.slug)} and ${r.kind}. ` +
      `/go/${r.slug}/… cannot address both. Rename one before building.`
    );
  }
  seen.set(r.slug, r.kind);
}

let written = 0;
const missing = [];

for (const r of all) {
  for (const p of PLATFORMS) {
    const raw = r.platforms[p.field];
    if (!raw) { missing.push(`${r.slug} (${p.label})`); continue; }

    const dest = safeUrl(raw, `${r.slug} ${p.field}`);
    if (!dest) { missing.push(`${r.slug} (${p.label}, rejected by safeUrl)`); continue; }

    const html = render(TEMPLATE, {
      TITLE: esc(r.title),
      SLUG: esc(r.slug),
      PLATFORM_KEY: p.key,
      PLATFORM_LABEL: esc(p.label),
      DEST: esc(dest),
      COVER: esc(r.cover),
      CANONICAL: esc(r.canonical),
      ACCENT: esc(r.accent),
    });

    writeOut(join('go', r.slug, `${p.key}.html`), html);
    written += 1;
  }
}

console.log(`build-go: wrote ${written} tracking page(s) across ${all.length} releases`);

// Silent truncation reads as "covered everything" when it did not.
if (missing.length) {
  console.warn(`build-go: ${missing.length} release/platform pair(s) had no usable URL and were skipped:`);
  for (const m of missing) console.warn(`  - ${m}`);
}
