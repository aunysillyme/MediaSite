#!/usr/bin/env node
// Generates responsive AVIF + WebP variants for every cover, so pages serve
// right-sized modern formats instead of one 640px JPEG into a 220px slot.
//
// For each master JPEG in public/album-art/ (+ /singles), emits alongside it:
//   <name>-320.avif  <name>-320.webp   (grid thumbnails)
//   <name>-640.avif  <name>-640.webp   (detail heroes)
// Master <name>.jpg is left untouched — it stays the <img> fallback + og:image.
// Idempotent: skips a variant when it's newer than its source master.

import sharp from 'sharp';
import { readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['public/album-art', 'public/album-art/singles'];
const WIDTHS = [320, 640];

function fresh(out, src) {
  return existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;
}

let made = 0, skipped = 0;
for (const dir of DIRS) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  // Optimizer only writes .avif / .webp — no extra exclusion needed. The earlier
  // `!/-\d+\.jpg$/` filter (intended to skip generated variants) also excluded
  // legitimate masters whose slug ends in `-<digit>` like feel-again-pt-2.jpg.
  const masters = readdirSync(abs).filter((f) => f.endsWith('.jpg'));
  for (const file of masters) {
    const src = join(abs, file);
    const base = file.replace(/\.jpg$/, '');
    for (const w of WIDTHS) {
      const variants = [
        [`${base}-${w}.avif`, { avif: { quality: 50, effort: 4 } }],
        [`${base}-${w}.webp`, { webp: { quality: 72 } }],
      ];
      for (const [name, opts] of variants) {
        const out = join(abs, name);
        if (fresh(out, src)) { skipped++; continue; }
        let pipe = sharp(src).resize(w, w, { fit: 'cover' });
        if (opts.avif) pipe = pipe.avif(opts.avif);
        else pipe = pipe.webp(opts.webp);
        await pipe.toFile(out);
        made++;
      }
    }
  }
}
console.log(`✓ optimized images → ${made} variant(s) written, ${skipped} up-to-date`);
