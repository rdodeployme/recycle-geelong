// Build the static site into dist/.
//   node build.mjs              staging build (noindex)
//   INDEX=1 node build.mjs      production build (indexable)
//   BASE=/repo/ node build.mjs  when served from a sub-path (e.g. GitHub project pages)
import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';
import { layout } from './src/layout.js';
import { home } from './src/pages/home.js';
import { priceList, whatWeTake, unsorted, location, trade, community, about, recyclingMatters, notFound } from './src/pages/inner.js';
import { newsIndex, newsPosts } from './src/pages/news.js';
import { faq, terms, privacy, areasIndex, suburbPages } from './src/pages/extra.js';
import { SITE } from './src/data/site.js';
import { typo } from './src/typo.js';

const OUT = 'dist';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync('public', OUT, { recursive: true });

const pages = [home(), priceList(), whatWeTake(), unsorted(), location(), trade(), community(), about(), recyclingMatters(), faq(), terms(), privacy(), areasIndex(), ...suburbPages(), newsIndex(), ...newsPosts(), notFound()];
for (const p of pages) {
  const file = p.file ? path.join(OUT, p.file) : path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typo(layout(p)));
}

await esbuild.build({
  entryPoints: ['src/js/main.js'],
  bundle: true, splitting: true, format: 'esm', minify: true, target: 'es2020',
  outdir: path.join(OUT, 'assets'), chunkNames: '[name]-[hash]', legalComments: 'none',
});
const css = await esbuild.transform(fs.readFileSync('src/styles/main.css', 'utf8'), { loader: 'css', minify: true });
fs.writeFileSync(path.join(OUT, 'assets', 'main.css'), css.code);

const index = process.env.INDEX === '1';
fs.writeFileSync(path.join(OUT, 'robots.txt'), index ? `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((p) => !p.file).map((p) => `  <url><loc>${SITE.url}/${p.path}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
// Production: drop the staging noindex header from the Netlify config.
if (index && fs.existsSync(path.join(OUT, 'netlify.toml'))) {
  const toml = path.join(OUT, 'netlify.toml');
  fs.writeFileSync(toml, fs.readFileSync(toml, 'utf8').replace(/^\s*X-Robots-Tag = .*\n/m, ''));
}

const size = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((s, e) => s + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
console.log(`built ${pages.length} pages · ${(size(OUT) / 1e6).toFixed(1)} MB`);
