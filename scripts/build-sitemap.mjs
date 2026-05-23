#!/usr/bin/env node
// Generates public/sitemap.xml from the data files.
// Run as part of the build pipeline so new releases auto-appear in sitemap.

import { ALBUMS } from '../src/data/albums.js';
import { SINGLES } from '../src/data/singles.js';
import { writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://www.auny.media';
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${BASE}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
  { loc: `${BASE}/albums`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
  { loc: `${BASE}/singles`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
  { loc: `${BASE}/links`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
];

for (const a of ALBUMS) {
  urls.push({
    loc: `${BASE}/albums/${a.slug}`,
    lastmod: a.releaseDate ? a.releaseDate.slice(0, 10) : today,
    changefreq: 'monthly',
    priority: '0.8',
  });
}

for (const s of SINGLES) {
  urls.push({
    loc: `${BASE}/singles/${s.slug}`,
    lastmod: s.releaseDate ? s.releaseDate.slice(0, 10) : today,
    changefreq: 'monthly',
    priority: '0.8',
  });
}

const body = urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(join(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`✓ generated sitemap.xml (${urls.length} URLs)`);
