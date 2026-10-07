// Shared helpers for page templates.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { icon } from './icons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const IMAGES = JSON.parse(fs.readFileSync(path.join(here, 'data', 'images.json'), 'utf8'));
export const BASE = (process.env.BASE || '/').replace(/\/?$/, '/');
export const u = (p = '') => BASE + String(p).replace(/^\//, '');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export { icon };

/** Responsive <img> from the processed photo manifest. */
export function img(name, { cls = '', sizes = '100vw', eager = false, alt, style = '' } = {}) {
  const m = IMAGES[name];
  if (!m) throw new Error('missing image ' + name);
  const entries = Object.entries(m.sizes).map(([w, p]) => [Number(w), p]).sort((a, b) => a[0] - b[0]);
  const srcset = entries.map(([w, p]) => `${u(p)} ${w}w`).join(', ');
  const [w0] = entries[entries.length - 1];
  const h0 = Math.round((m.h * w0) / m.w);
  const fallback = u(entries[entries.length - 1][1]);
  return `<img src="${fallback}" srcset="${srcset}" sizes="${sizes}" width="${w0}" height="${h0}" alt="${esc(alt ?? m.alt)}"${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>`;
}
export const alt = (name) => IMAGES[name].alt;

export const bay = (n) => `<div class="bay" aria-hidden="true"><b>${n}</b><span></span></div>`;
export const money = (n) => '$' + (Number.isInteger(n) ? n : n.toFixed(2));
