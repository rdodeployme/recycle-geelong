// Recycle North Geelong — site behaviour. No framework; each feature is
// a small function that only runs when its markup is on the page.
import { ITEMS, STREAMS, LOADS, EXTRAS, HOURS, SITE } from '../data/site.js';
import { CAT_ICON } from '../icons.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ic = (n) => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------- open / closed
function geelongNow() {
  const parts = new Intl.DateTimeFormat('en-AU', { timeZone: HOURS.tz, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date()).reduce((o, p) => ((o[p.type] = p.value), o), {});
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  const h = (Number(parts.hour) % 24) + Number(parts.minute) / 60;
  return { dow, h, iso: `${parts.year}-${parts.month}-${parts.day}` };
}
const DAYNAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fmtH = (h) => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); const ap = hh >= 12 ? 'pm' : 'am'; const h12 = ((hh + 11) % 12) + 1; return `${h12}${mm ? ':' + String(mm).padStart(2, '0') : ''}${ap}`; };

function status() {
  const { dow, h, iso } = geelongNow();
  const today = HOURS.days[dow];
  let open = false, short, big, sub;
  if (today && h >= today[0] && h < today[1]) {
    open = true;
    short = `Open now · until ${fmtH(today[1])}`;
    big = 'Open now';
    sub = `Until ${fmtH(today[1])} today. ${today[1] - h < 0.75 ? 'Closing soon.' : ''}`;
  } else if (today && h < today[0]) {
    short = `Opens today ${fmtH(today[0])}`;
    big = 'Opens soon';
    sub = `Today from ${fmtH(today[0])} to ${fmtH(today[1])}.`;
  } else {
    let d = (dow + 1) % 7, n = 1;
    while (!HOURS.days[d] && n < 7) { d = (d + 1) % 7; n++; }
    const when = n === 1 ? 'tomorrow' : DAYNAME[d];
    short = `Closed · opens ${when} ${fmtH(HOURS.days[d][0])}`;
    big = 'Closed now';
    sub = `Opens ${when} at ${fmtH(HOURS.days[d][0])}.`;
  }
  $$('[data-status]').forEach((el) => { el.dataset.open = open ? '1' : '0'; const t = $('[data-status-text]', el); if (t) t.textContent = short; });
  $$('[data-status-big]').forEach((el) => { el.textContent = big; el.dataset.open = open ? '1' : '0'; });
  $$('[data-status-sub]').forEach((el) => { el.textContent = sub.trim(); });
  $$('[data-hours] tr').forEach((tr) => { tr.dataset.today = Number(tr.dataset.day) === dow ? '1' : '0'; });
  $$('.notice-bar').forEach((el) => { el.hidden = !(iso >= el.dataset.from && iso <= el.dataset.to); });
}

// ---------------------------------------------------------------- menu
function menu() {
  const btn = $('.menu-btn'), nav = $('#mobile-nav');
  if (!btn || !nav) return;
  const set = (o) => { nav.dataset.open = String(o); btn.setAttribute('aria-expanded', String(o)); btn.innerHTML = ic(o ? 'close' : 'menu'); document.body.style.overflow = o ? 'hidden' : ''; };
  btn.addEventListener('click', () => set(nav.dataset.open !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.dataset.open === 'true') set(false); });
}

// ---------------------------------------------------------------- hero slideshow
function slides() {
  const box = $('[data-slides]');
  if (!box || reduced) return;
  const figs = $$('figure', box);
  if (figs.length < 2) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    figs[i].classList.remove('on');
    i = (i + 1) % figs.length;
    figs[i].classList.add('on');
  }, 7000);
}

// ---------------------------------------------------------------- item finder
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 &]/g, ' ').replace(/\s+/g, ' ').trim();
const INDEX = ITEMS.map((it) => ({ it, keys: [norm(it.n), ...it.aka.map(norm)] }));

function search(q) {
  q = norm(q);
  if (!q) return [];
  const toks = q.split(' ');
  const scored = [];
  for (const { it, keys } of INDEX) {
    let best = 0;
    keys.forEach((k, ki) => {
      const w = ki === 0 ? 1 : 0.92;
      let s = 0;
      if (k === q) s = 100;
      else if (k.startsWith(q)) s = 80;
      else if (k.split(' ').some((t) => t.startsWith(q))) s = 65;
      else if (k.includes(q)) s = 45;
      else if (toks.every((t) => k.includes(t))) s = 35;
      else if (q.length > 3 && q.endsWith('s') && k.startsWith(q.slice(0, -1))) s = 60;
      best = Math.max(best, s * w);
    });
    if (best) scored.push([best, it]);
  }
  return scored.sort((a, b) => b[0] - a[0]).map(([, it]) => it);
}

const BADGE = { free: ['free', 'Free'], paid: ['paid', 'Charged'], cond: ['cond', 'Check first'], no: ['no', 'Not accepted'] };

function resultHTML(it) {
  const [cls] = BADGE[it.s];
  const label = it.s === 'no' ? 'Not accepted' : it.p;
  const cost = it.s === 'no'
    ? `<h4>Not accepted</h4><p>${esc(it.note || 'We can’t take this one, sorted or not.')}</p>`
    : `<h4>What it costs</h4><p><b>${esc(it.p)}</b>${it.note ? ' · ' + esc(it.note) : ''}</p>`;
  const after = it.s === 'no'
    ? `<h4>Not sure?</h4><p>Call <a href="${SITE.phoneHref}">${SITE.phone}</a> before you load up and we'll point you in the right direction.</p>`
    : `<h4>After you tip</h4><p>${esc(STREAMS[it.st] || '')}</p>`;
  return `<div class="result-top">${ic(CAT_ICON[it.c] || 'box')}<div><div class="cat">${esc(it.c)}</div><h3>${esc(it.n)}</h3></div><span class="badge ${cls}">${it.s === 'no' ? ic('ban') : ''}${esc(label)}</span></div>
    <div class="result-body"><div>${cost}</div><div class="after">${after}</div></div>`;
}

function finder(box) {
  const input = $('input', box), list = $('.suggest', box), result = $('.result', box), none = $('.no-match', box);
  let items = [], active = -1;
  const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; };
  const show = (it) => {
    close();
    none.hidden = true;
    result.innerHTML = resultHTML(it);
    result.hidden = false;
    input.value = it.n;
    $$('.chip', box).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.q === it.n)));
  };
  const render = () => {
    items = search(input.value).slice(0, 7);
    if (!input.value.trim()) { close(); none.hidden = true; return; }
    if (!items.length) { close(); result.hidden = true; none.hidden = false; return; }
    none.hidden = true;
    list.innerHTML = items.map((it, i) => `<li role="option" id="${list.id}-${i}" aria-selected="${i === active}" data-i="${i}">${ic(CAT_ICON[it.c] || 'box')}<span class="nm">${esc(it.n)}</span><span class="pp">${esc(it.s === 'no' ? 'Not accepted' : it.p)}</span></li>`).join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };
  input.addEventListener('input', () => { active = -1; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (list.hidden) render();
      if (!items.length) return;
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      $$('li', list).forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
      input.setAttribute('aria-activedescendant', `${list.id}-${active}`);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = items[active] || search(input.value)[0];
      if (r) show(r); else if (input.value.trim()) { result.hidden = true; none.hidden = false; }
    } else if (e.key === 'Escape') close();
  });
  list.addEventListener('mousedown', (e) => { const li = e.target.closest('li'); if (li) { e.preventDefault(); show(items[Number(li.dataset.i)]); } });
  input.addEventListener('blur', () => setTimeout(close, 120));
  $$('.chip', box).forEach((c) => c.addEventListener('click', () => { const r = search(c.dataset.q)[0]; if (r) show(r); }));
}

// ---------------------------------------------------------------- estimator
const money = (n) => '$' + (Math.round(n * 100) % 100 ? n.toFixed(2) : String(Math.round(n)));

function estimator(root) {
  const st = { load: 'ute', sorted: true, m3: 2, extras: {}, discount: false };
  const L = Object.fromEntries(LOADS.map((l) => [l.id, l]));
  const E = Object.fromEntries(EXTRAS.map((e) => [e.id, e]));
  const lines = $('[data-lines]', root), tot = $('[data-total]', root), disc = $('[data-disc]', root);
  const save = $('[data-save]', root), saveT = $('[data-save-text]', root), m3row = $('.m3-row', root), m3out = $('[data-m3-out]', root);

  function loadPrice(l, sorted) {
    const rate = sorted ? l.sorted : l.unsorted;
    if (rate == null) return null;
    return l.perM3 ? rate * st.m3 : rate;
  }
  function draw() {
    const l = L[st.load];
    const p = loadPrice(l, st.sorted);
    const name = `${st.sorted ? 'Sorted' : 'Unsorted'} · ${l.name}${l.perM3 ? `, ${st.m3}\u00a0m³` : (/heaped/i.test(l.sub) ? ', heaped' : '')}`.replace(/(\d×\d) /, '$1\u00a0').replace(/ (\S+)$/, '\u00a0$1');
    const rows = [[name, p == null ? 'At the gate' : money(p)]];
    let sum = p || 0;
    for (const [id, n] of Object.entries(st.extras)) {
      if (!n) continue;
      rows.push([`${n} × ${E[id].label}`, money(n * E[id].price)]);
      sum += n * E[id].price;
    }
    lines.innerHTML = rows.map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join('');
    const total = st.discount ? sum * 0.9 : sum;
    if (p == null) {
      tot.textContent = 'At the gate';
      tot.classList.add('gate');
      disc.textContent = sum ? `Plus ${money(total)} for the items listed` : '';
    } else {
      tot.textContent = money(total);
      tot.classList.remove('gate');
      disc.textContent = st.discount ? `Includes 10% local discount (−${money(sum * 0.1)})` : `Registered locals pay ${money(sum * 0.9)}`;
    }
    const ps = loadPrice(l, true), pu = loadPrice(l, false);
    if (st.sorted && pu != null) { save.hidden = false; saveT.innerHTML = `Sorting saves you <b>${money(pu - ps)}</b> on this load compared with unsorted.`; }
    else if (!st.sorted && pu != null) { save.hidden = false; saveT.innerHTML = `Sort it at home and this load is <b>${money(ps)}</b> instead of ${money(pu)}.`; }
    else if (!st.sorted && pu == null) { save.hidden = false; saveT.innerHTML = `Unsorted loads this size are priced at the gate. Sorted, it's <b>${money(ps)}</b>.`; }
    else save.hidden = true;
  }
  $$('[data-load]', root).forEach((b) => b.addEventListener('click', () => {
    st.load = b.dataset.load;
    $$('[data-load]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    m3row.hidden = !L[st.load].perM3;
    draw();
  }));
  $$('[data-sort]', root).forEach((b) => b.addEventListener('click', () => {
    st.sorted = b.dataset.sort === 'sorted';
    $$('[data-sort]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  }));
  $$('[data-m3]', root).forEach((b) => b.addEventListener('click', () => {
    st.m3 = Math.min(40, Math.max(0.5, st.m3 + Number(b.dataset.m3)));
    m3out.textContent = st.m3;
    draw();
  }));
  $$('[data-extra]', root).forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.extra;
    st.extras[id] = Math.min(20, Math.max(0, (st.extras[id] || 0) + Number(b.dataset.d)));
    $(`[data-extra-count="${id}"]`, root).textContent = st.extras[id];
    draw();
  }));
  $('[data-discount]', root)?.addEventListener('change', (e) => { st.discount = e.target.checked; draw(); });
  draw();
}

// ---------------------------------------------------------------- photo walk
function floor() {
  const track = $('.floor-track');
  if (!track) return;
  $$('[data-floor]').forEach((b) => b.addEventListener('click', () => {
    const card = $('.floor-card', track);
    track.scrollBy({ left: Number(b.dataset.floor) * (card ? card.offsetWidth + 16 : 400), behavior: reduced ? 'auto' : 'smooth' });
  }));
}

// ---------------------------------------------------------------- A–Z filter
function az() {
  const root = $('[data-az]');
  if (!root) return;
  const q = $('[data-az-q]', root), list = $('[data-az-list]'), empty = $('[data-az-empty]');
  let f = 'all';
  const apply = () => {
    const v = norm(q.value);
    let n = 0;
    $$('.az-item', list).forEach((el) => {
      const ok = (f === 'all' || el.dataset.s === f) && (!v || v.split(' ').every((t) => el.dataset.k.includes(t)));
      el.hidden = !ok;
      if (ok) n++;
    });
    empty.hidden = n > 0;
  };
  q.addEventListener('input', apply);
  $$('[data-az-f]', root).forEach((b) => b.addEventListener('click', () => {
    f = b.dataset.azF;
    $$('[data-az-f]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    apply();
  }));
}

// ---------------------------------------------------------------- enquiry form
function forms() {
  $$('[data-form]').forEach((form) => {
    const out = $('[data-form-status]', form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      out.textContent = 'Sending…';
      try {
        const r = await fetch(form.getAttribute('action') || location.pathname, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        out.textContent = 'Thanks. Our trade team will be in touch.';
      } catch {
        const body = ['name', 'company', 'phone', 'email', 'materials'].map((k) => `${k}: ${data.get(k) || ''}`).join('\n');
        out.innerHTML = `We couldn't send that from here. <a href="mailto:${SITE.email}?subject=${encodeURIComponent('Industry recycling enquiry')}&body=${encodeURIComponent(body)}">Email it to us instead</a> or call ${SITE.trade.phone}.`;
      }
    });
  });
}

// ---------------------------------------------------------------- reveal
function reveal() {
  const els = $$('.rv');
  if (!els.length || reduced || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((e, i) => { e.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(e); });
}

// ---------------------------------------------------------------- 3D journey
function journey() {
  const sec = $('[data-journey]');
  if (!sec) return;
  const canWebGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!canWebGL || reduced || saveData) { sec.dataset.mode = 'static'; return; }
  let started = false;
  const go = () => {
    if (started) return;
    started = true;
    import('./journey.js').then((m) => m.start(sec)).catch((err) => { console.warn('3D journey unavailable', err); sec.dataset.mode = 'static'; });
  };
  const io = new IntersectionObserver((ents) => { if (ents.some((e) => e.isIntersecting)) { go(); io.disconnect(); } }, { rootMargin: '150% 0px' });
  io.observe(sec);
}

function header() {
  const h = $('.site-head');
  if (!h) return;
  const on = () => h.classList.toggle('scrolled', scrollY > 40 || document.body.classList.contains('inner'));
  on();
  addEventListener('scroll', on, { passive: true });
}

status();
setInterval(status, 60000);
header();
menu();
slides();
$$('[data-finder]').forEach(finder);
$$('[data-estimator]').forEach(estimator);
floor();
az();
forms();
reveal();
journey();
