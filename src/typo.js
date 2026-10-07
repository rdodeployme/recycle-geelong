import fs from 'node:fs';
// Build-time typography: keep things together that belong together, so lines
// break where a person would break them.
const NB = ' ';

function glueText(t) {
  return t
    // number + unit: 0.5 m³, 100 L, 9 kg, 20,000 m²
    .replace(/(\d[\d.,]*) (m³|m²|m|L|kg|km|cm|mm|litres?|tonnes?)(?=[\s.,;:)\/]|$)/g, `$1${NB}$2`)
    // "per m³", "per L", "per bag"
    .replace(/ per (m³|L|bag|litre)\b/g, `${NB}per${NB}$1`)
    .replace(/(\$\d+(?:\.\d+)?), (?=[a-z])/g, `$1,${NB}`)
    // phone numbers
    .replace(/\b(0\d{3}) (\d{3}) (\d{3})\b/g, `$1${NB}$2${NB}$3`)
    .replace(/\b(1300) (\d{3}) (\d{3})\b/g, `$1${NB}$2${NB}$3`)
    // time and number ranges with spaced en dash
    .replace(/(\d(?:am|pm)?) – (\d)/g, `$1${NB}–${NB}$2`)
    // "6×4 trailer", "8×5 trailer"
    .replace(/(\d×\d) (trailer)/g, `$1${NB}$2`)
    .replace(/\b(\d+) (days?|weeks?|hours?|minutes?|acres?|items?|streams?)\b/g, `$1${NB}$2`);
}

// Apply glueText to every text segment outside tags, scripts and styles.
function glueAll(html) {
  return html.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g, (m, tag, text) => (tag ? tag : glueText(text)));
}

// Non-breaking space before the last word of short-ending text blocks (no lone last word).
function widows(html) {
  return html.replace(/<(p|li|figcaption|td|h2|h3|h4|dd)(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (m, tag, attrs = '', inner) => {
    if (/class="[^"]*\blines\b/.test(attrs)) return m;
    if (/class="[^"]*\bln\b/.test(inner) || /<(p|li|ul|div|table)\b/.test(inner)) return m;
    const tokens = inner.split(/(<[^>]+>)/);
    const visible = tokens.filter((x) => !x.startsWith('<')).join('').replace(/&nbsp;| /g, ' ').trim();
    const nwords = visible.split(/\s+/).length;
    if (nwords === 2 && visible.length <= 22 && /^(h3|h4|td|p)$/.test(tag)) return `<${tag}${attrs}>${inner.replace(/ (?![^<]*>)/, NB)}</${tag}>`;
    if (nwords < (/^(h2|h3|h4|td)$/.test(tag) ? 3 : 4)) return m;
    for (let i = tokens.length - 1; i >= 0; i--) {
      const tk = tokens[i];
      if (tk.startsWith('<')) continue;
      const k = tk.replace(/\s+$/, '').lastIndexOf(' ');
      if (k === -1) {
        if (tk.trim()) continue; // word with no space in this segment, keep looking left
        continue;
      }
      const tail = tokens.slice(i).filter((x) => !x.startsWith('<')).join('').slice(k + 1).trim();
      if (tail.length > 14) return m;
      tokens[i] = tk.slice(0, k) + NB + tk.slice(k + 1);
      return `<${tag}${attrs}>${tokens.join('')}</${tag}>`;
    }
    return m;
  });
}

const ADV = JSON.parse(fs.readFileSync(new URL('./data/archivo-wide-900.json', import.meta.url), 'utf8'));
const emWidth = (t) => {
  const s = t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').toUpperCase();
  let w = 0;
  for (const ch of s) w += ADV[ch] ?? 0.72;
  return w - 0.012 * Math.max(0, s.length - 1);
};
const textOf = (h) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// Display headings are sized from their own text so they always fit:
// .lines  → each deliberate line on one row; .two → wraps to at most two balanced rows.
function sizeHeadings(html) {
  const fn = (m, tag, attrs = '', inner) => {
    const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1];
    if (/\bsr-only\b/.test(cls)) return m;
    let kind = null, w = 0;
    if (/\blines\b/.test(cls)) {
      const lines = [...inner.matchAll(/<span class="ln">([\s\S]*?)<\/span>(?=<span class="ln">|$)/g)].map((x) => textOf(x[1]));
      if (!lines.length) return m;
      kind = 'fit-lines'; w = Math.max(...lines.map(emWidth));
    } else if ((tag === 'h1' || tag === 'h2') || /\bh2l\b/.test(cls)) {
      if (/<(div|p|ul)\b/.test(inner)) return m;
      kind = 'fit-two';
      // widest line of the best two-line split (non-breaking spaces keep words together)
      const words = textOf(inner).replace(/&nbsp;/g, '\u00a0').split(' ').filter(Boolean);
      w = emWidth(words.join(' '));
      if (words.length > 3) for (let k = 1; k < words.length; k++) w = Math.min(w, Math.max(emWidth(words.slice(0, k).join(' ')), emWidth(words.slice(k).join(' '))));
    } else return m;
    let a = attrs;
    a = /class="/.test(a) ? a.replace(/class="([^"]*)"/, `class="$1 ${kind}"`) : `${a} class="${kind}"`;
    a = /style="/.test(a) ? a.replace(/style="([^"]*)"/, (q, st) => `style="${st};--w:${w.toFixed(2)}"`) : `${a} style="--w:${w.toFixed(2)}"`;
    return `<${tag}${a}>${inner}</${tag}>`;
  };
  return html
    .replace(/<(h1|h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/g, fn)
    .replace(/<(div)(\s[^>]*\bclass="[^"]*\blines\b[^"]*"[^>]*)>([\s\S]*?)<\/div>/g, fn);
}

export function typo(html) {
  const [head, ...rest] = html.split('<body');
  if (!rest.length) return html;
  const body = '<body' + rest.join('<body');
  return head + sizeHeadings(widows(glueAll(body)));
}
