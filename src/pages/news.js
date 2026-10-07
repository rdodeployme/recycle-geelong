import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NEWS_DATES } from '../data/site.js';
import { u, icon, esc, bay } from '../lib.js';
import { pageHero } from '../components.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const POSTS = JSON.parse(fs.readFileSync(path.join(here, '..', 'data', 'posts.json'), 'utf8'))
  .map((p) => ({ ...p, date: NEWS_DATES[p.slug] }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
const firstPara = (p) => (p.blocks.find(([t]) => t === 'p') || ['', ''])[1];
const trim = (s, n = 150) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s);

export function newsTeaser() {
  return `<section class="sec" aria-labelledby="news-h">
  <div class="wrap">
    ${bay('10')}
    <div class="sec-head split">
      <div><span class="kicker">From the floor</span><h2 id="news-h" style="margin-top:18px">News</h2></div>
      <p><a class="link" href="${u('news/')}">All news${icon('arrow')}</a></p>
    </div>
    <div class="news">
      ${POSTS.slice(0, 3).map((p) => `<a href="${u(p.slug + '/')}"><time datetime="${p.date}">${fmt(p.date)}</time><h3>${esc(p.title)}</h3><p>${esc(trim(firstPara(p)))}</p></a>`).join('')}
    </div>
  </div>
</section>`;
}

export function newsIndex() {
  const body = `${pageHero({ crumbs: 'News', kicker: 'From the floor', title: 'News', lede: 'What we take, how we recycle it and what is new at North Geelong.' })}
<section class="sec"><div class="wrap"><div class="news">
  ${POSTS.map((p) => `<a href="${u(p.slug + '/')}"><time datetime="${p.date}">${fmt(p.date)}</time><h3>${esc(p.title)}</h3><p>${esc(trim(firstPara(p), 200))}</p></a>`).join('')}
</div></div></section>`;
  return { path: 'news/', title: 'News', desc: 'News from Recycle North Geelong: recycling guides, new streams and what happens to what you drop off.', body, current: '' };
}

export function newsPosts() {
  return POSTS.map((p) => {
    // the first paragraph or two of a post often repeats the title; keep the body as written
    const html = [];
    let inList = false;
    for (const [tag, text] of p.blocks) {
      if (tag === 'li') {
        if (!inList) { html.push('<ul>'); inList = true; }
        html.push(`<li>${esc(text)}</li>`);
        continue;
      }
      if (inList) { html.push('</ul>'); inList = false; }
      if (tag === 'h2' || tag === 'h3' || tag === 'h4') html.push(`<h2>${esc(text)}</h2>`);
      else html.push(`<p>${esc(text)}</p>`);
    }
    if (inList) html.push('</ul>');
    const body = `${pageHero({ crumbs: `<a href="${u('news/')}">News</a>`, kicker: fmt(p.date), title: esc(p.title) })}
<section class="sec" style="padding-top:56px"><div class="wrap"><article class="article">${html.join('\n')}
<p style="margin-top:48px"><a class="link" href="${u('news/')}">${icon('arrow')}All news</a></p></article></div></section>`;
    return { path: p.slug + '/', title: p.title, desc: trim(firstPara(p), 155), body, current: '' };
  });
}
