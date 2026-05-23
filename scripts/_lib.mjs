// Shared helpers for build scripts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const tpl = (name) => readFileSync(join(root, 'templates', name), 'utf8');

export const NAV_HTML = tpl('_nav.html');
export const NAV_CSS = tpl('_nav.css');

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
