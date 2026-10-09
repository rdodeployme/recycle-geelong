import { SITE, HOURS, PRICE_GROUPS, ITEMS, STREAMS, VEHICLES, FREECYCLE, LOADS, WASTE } from '../data/site.js';
import { u, img, icon, bay, esc, IMAGES } from '../lib.js';
import { jimsPanel, dealsSection, tradieTuesday, sortCompare } from '../components.js';
import { CAT_ICON } from '../icons.js';
import { finder, estimator, registerBand, pageHero, journey, pickupList, partnersList, JOURNEY, scale, photoRun } from '../components.js';

const BADGE = {
  free: ['free', 'Free'],
  paid: ['paid', 'Charged'],
  cond: ['cond', 'Check first'],
  no: ['no', 'Not accepted'],
};
export const badge = (s, label) => {
  const [cls, def] = BADGE[s];
  return `<span class="badge ${cls}">${s === 'no' ? icon('ban') : ''}${esc(label || def)}</span>`;
};

// ---------------------------------------------------------------- price list
// Price per load: every vehicle and bin size against general, building and green waste.
export function loadTable() {
  const head = `<thead><tr><th scope="col"><span class="sr-only">Load</span></th>${WASTE.map((w) => `<th scope="col" class="w-${w.id}">${w.short}<span> waste</span></th>`).join('')}</tr></thead>`;
  const body = LOADS.map((g) => g.sizes
    ? `<tr class="grp"><th colspan="4" scope="colgroup">${g.name}${g.unit === 'bin' ? '' : `<span>${g.sub}</span>`}</th></tr>`
      + g.sizes.map((z) => `<tr><th scope="row">${z.name}</th>${z.p.map((v) => `<td>$${v}</td>`).join('')}</tr>`).join('')
    : `<tr class="grp"><th colspan="4" scope="colgroup">${g.name}</th></tr><tr><th scope="row">Vans and trucks up to 4,500 kg GVM</th><td colspan="3" class="gate">Priced at the gate. Call ${SITE.phone}</td></tr>`).join('');
  return `<div class="ppl"><table>${head}<tbody>${body}</tbody></table></div>`;
}

export function priceList() {
  const groups = PRICE_GROUPS.map((g) => `<article class="pg ${g.id}${g.id === 'building' ? ' span' : ''}" id="${g.id}">
    <header><h3>${g.title}</h3>${g.note ? `<p>${g.note}</p>` : ''}</header>
    <table><tbody>${g.rows.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td class="d">${esc(b)}</td><td class="p">${esc(c)}</td></tr>`).join('')}</tbody></table>
  </article>`).join('');
  const body = `${pageHero({
    crumbs: 'Prices', kicker: 'Price list', title: 'Know the price before you load up', image: 'skips-row',
    lede: `Every price we charge, in one place. Loads are priced by size and by type of waste. Registered locals save ${SITE.discount.resident}% and trades ${SITE.discount.trade}%.`,
    extra: `<div class="jump"><a href="#loads">Price per load</a>${PRICE_GROUPS.map((g) => `<a href="#${g.id}">${g.title}</a>`).join('')}</div>`,
  })}
<section class="sec on-paper" id="loads" aria-labelledby="loads-h">
  <div class="wrap">
    ${bay('01')}
    <div class="sec-head split"><div class="hang"><h2 id="loads-h">Price per load</h2></div><p class="lede">Find your vehicle and how full it is, then read across to what's in it. Everything is unloaded by material at its own bay, and unsorted mixed loads aren't accepted. <a href="${u('unsorted-loads/')}">How to sort your load</a></p></div>
    ${loadTable()}
  </div>
</section>
${estimator({ id: 'cost', n: '02' })}
<section class="sec on-paper" aria-labelledby="all-h">
  <div class="wrap">
    ${bay('03')}
    <div class="sec-head split"><div class="hang"><h2 id="all-h">Items priced each, and what's free</h2></div><p class="lede">If something isn't listed, call ${SITE.phone} before you come and we'll price it for you.</p></div>
    <div class="price-groups">${groups}</div>
  </div>
</section>
${registerBand()}`;
  return { path: 'price-list/', title: 'Price list', desc: 'Recycle North Geelong prices: free drop-off for whitegoods, scrap metal, cardboard and more; general, building and green waste priced by load from $5; mattresses, tyres and gas bottles priced each.', body, current: 'price-list/' };
}

// ---------------------------------------------------------------- what we take
export function whatWeTake() {
  const items = [...ITEMS].sort((a, b) => a.n.localeCompare(b.n));
  const cards = items.map((it) => `<article class="az-item" data-s="${it.s}" data-k="${esc([it.n, ...it.aka, it.c].join(' ').toLowerCase())}">
      <div class="t">${icon(CAT_ICON[it.c] || 'box')}<h3>${esc(it.n)}</h3>${badge(it.s, it.s === 'no' ? 'No' : it.p)}</div>
      ${it.note ? `<p>${esc(it.note)}</p>` : ''}
      ${it.st && it.st !== 'none' ? `<div class="after"><b>After you tip</b>${esc(STREAMS[it.st])}</div>` : ''}
    </article>`).join('');
  const body = `${pageHero({
    crumbs: 'What we take', kicker: `${SITE.facility.streams} material streams`, title: 'What we take, and what we don’t', image: 'green-bins',
    lede: 'Search the list or filter it. Each item shows what it costs and what happens to it after you drop it off.',
  })}
<section class="sec on-paper" aria-labelledby="az-h">
  <div class="wrap">
    ${bay('01')}
    <h2 id="az-h" class="sr-only">A to Z</h2>
    <div class="wwt-tools" data-az>
      <div class="finder-input">${icon('search')}<input type="search" placeholder="Filter the list" aria-label="Filter the list" data-az-q></div>
      <div class="filters" role="group" aria-label="Show">
        <button type="button" class="chip" data-az-f="all" aria-pressed="true">All</button>
        <button type="button" class="chip" data-az-f="free" aria-pressed="false">Free</button>
        <button type="button" class="chip" data-az-f="paid" aria-pressed="false">Charged</button>
        <button type="button" class="chip" data-az-f="cond" aria-pressed="false">Check first</button>
        <button type="button" class="chip" data-az-f="no" aria-pressed="false">Not accepted</button>
      </div>
    </div>
    <div class="az" data-az-list>${cards}</div>
    <div class="az-empty" data-az-empty hidden><b>Nothing matches that.</b> Call <a href="${SITE.phoneHref}">${SITE.phone}</a> and we'll tell you before you load up.</div>
  </div>
</section>
<section class="sec" aria-labelledby="never-h">
  <div class="wrap">
    ${bay('02')}
    <div class="split">
      <div>
        <div class="hang" style="margin-bottom:22px"><h2 id="never-h">Please leave these at home</h2></div>
        <p class="lede">For the safety of our team and everyone on site, these can't come through the gate, sorted or not.</p>
        <ul class="ticks no" style="margin-top:24px">
          ${['Asbestos or anything that might be asbestos', 'Chemicals, solvents and fuels, including pesticides, herbicides, fertilisers and pool chemicals', 'Unlabelled or unidentified liquids, and drums with hazardous residue', 'Medical and biological waste, including sharps', 'Explosives, flares, firearms and ammunition', 'Soil, including contaminated or untested soil', 'Animal carcasses', 'Radioactive material and mercury switches', 'Electric vehicle batteries', 'Unsorted mixed loads', 'Mixed construction and demolition loads (take these to Sycle at Fyansford)']
            .map((t) => `<li>${icon('ban')}<span>${t}</span></li>`).join('')}
        </ul>
      </div>
      <figure class="ph" style="margin:0">${img('excluded-board', { sizes: '(max-width: 900px) 100vw, 50vw' })}<figcaption>${IMAGES['excluded-board'].alt}.</figcaption></figure>
    </div>
  </div>
</section>
${vehicles('03')}
${registerBand()}`;
  return { path: 'what-we-take/', title: 'What we take', desc: 'Searchable A to Z of what Recycle North Geelong accepts, what is free, what is charged and what is not accepted.', body, current: 'what-we-take/' };
}

function vehicles(n) {
  return `<section class="sec on-ink2" aria-labelledby="veh-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split"><div class="hang"><h2 id="veh-h">What you can drive in</h2></div><p class="lede">Cars, utes, vans, trailers and trucks up to 4,500 kg GVM. Larger trade vehicles can be arranged through our trade service.</p></div>
    <div class="two">
      <div class="box"><h3>Welcome</h3><ul class="ticks">${VEHICLES.yes.map((v) => `<li>${icon('check')}<span>${v}</span></li>`).join('')}</ul></div>
      <div class="box"><h3>Not through the public gate</h3><ul class="ticks no">${VEHICLES.no.map((v) => `<li>${icon('ban')}<span>${v}</span></li>`).join('')}</ul>
        <p class="small" style="margin-top:18px">Bringing in a bigger trade load? <a href="${u('recycle-corporate-services/')}">Talk to our trade team</a>.</p></div>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- sorting your load (old URL /unsorted-loads/ kept)
export function unsorted() {
  const groups = [
    ['leaf', 'Green waste', 'Branches, leaves, clippings and weeds.'],
    ['metal', 'Metal', 'Scrap steel, aluminium, copper and whitegoods. Free.'],
    ['tv', 'E-waste', 'TVs, screens, computers, phones and cables.'],
    ['box', 'Cardboard and polystyrene', 'Flattened, clean and dry, kept apart from each other.'],
    ['mattress', 'Mattresses and tyres', 'Priced each, so keep them separate.'],
    ['bin', 'General rubbish', 'Whatever is left over. Bagged household rubbish counts here.'],
  ];
  const body = `${pageHero({
    crumbs: 'Sorting your load', kicker: 'Before you come', title: 'Sort it as you load', image: 'paint-wide',
    lede: "Everything here is unloaded by material at its own bay, and unsorted mixed loads can't be accepted. Pack it in groups and you're in and out.",
  })}
<section class="sec" aria-labelledby="how-h">
  <div class="wrap">
    ${bay('01')}
    <div class="sec-head split"><div class="hang"><h2 id="how-h" class="lines"><span class="ln">Six piles.</span><span class="ln">That's sorted.</span></h2></div><p class="lede">Load each group together so it comes off in one go at its bay.</p></div>
    ${sortCompare({ sizes: '(max-width: 1340px) 100vw, 1220px', cls: 'sc-big' })}
    <div class="free-grid three" style="margin-top:28px">
      ${groups.map(([ic, t, d], i) => `<div class="free-card" style="background:var(--ink-3);color:var(--white)"><span class="tag">${String(i + 1).padStart(2, '0')}</span>${icon(ic)}<h3>${t}</h3><p style="color:var(--mute)">${d}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="sec on-paper" aria-labelledby="mixed-h">
  <div class="wrap">
    ${bay('02')}
    <div class="split">
      <div>
        <div class="hang" style="margin-bottom:22px"><h2 id="mixed-h">Three rates, by what's in it</h2></div>
        <p class="lede">General, building and green waste each have their own price per load. Free items cost nothing, whatever you bring them in.</p>
        <div class="two" style="margin-top:28px">
          <div class="box"><h3>General waste</h3><p class="small">From $10 for a 30 litre bag. A level ute or small trailer is $99.</p></div>
          <div class="box"><h3>Green waste</h3><p class="small">Clippings, branches, leaves and weeds. From $5 for a 30 litre bag. A level ute or small trailer is $79.</p></div>
          <div class="box"><h3>Building waste</h3><p class="small">Sorted building materials only. From $29 for a 30 litre bin. A level ute is $299 and a small trailer, level, is $399. Mixed C&amp;D loads go to Sycle at Fyansford.</p></div>
          <div class="box"><h3>No time to sort?</h3><p class="small">For a big clean-out or a deceased estate, book a collection and the crew does the lifting.</p></div>
        </div>
        <p style="margin-top:22px"><a class="link" href="${u('price-list/#loads')}">Every load price${icon('arrow')}</a></p>
      </div>
      <div class="ph-stack">
        <figure>${img('building-materials', { sizes: '(max-width: 900px) 50vw, 25vw' })}<figcaption class="cap">${IMAGES['building-materials'].alt}.</figcaption></figure>
        <figure>${img('rubbish-bays-tall', { sizes: '(max-width: 900px) 50vw, 25vw' })}<figcaption class="cap">${IMAGES['rubbish-bays-tall'].alt}.</figcaption></figure>
      </div>
    </div>
  </div>
</section>
${estimator({ id: 'cost', n: '03' })}`;
  return { path: 'unsorted-loads/', title: 'Sorting your load', desc: 'Everything at Recycle North Geelong is unloaded by material at its own bay, and unsorted mixed loads are not accepted. How to sort your load, and what general, building and green waste cost.', body, current: '' };
}

// ---------------------------------------------------------------- location
export function location() {
  const days = [['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6], ['Sunday', 0]];
  const rules = [
    ['clock', 'Shared zone, 5 km/h', 'Pedestrians and vehicles share the floor. Drive slowly and follow the arrows.'],
    ['pin', 'Follow the hanging signs', 'Each material has its own bay, cage or tank. Park in a marked bay to unload.'],
    ['ban', 'No smoking', 'The whole site is no smoking.'],
    ['info', 'Pets stay in the vehicle', 'Keep pets in your vehicle while you unload.'],
  ];
  const body = `${pageHero({
    crumbs: 'Location and hours', kicker: 'Find us', title: '116 Furner Avenue, North Geelong', image: 'hall-hero',
    lede: `${SITE.address.note}. Drive-in drop-off, fully under cover on concrete, six days a week.`,
    extra: `<div class="hero-ctas"><a class="btn" href="${SITE.address.directions}" target="_blank" rel="noopener">${icon('pin')}Get directions</a><a class="btn ghost" href="${SITE.phoneHref}">${icon('call')}${SITE.phone}</a></div>`,
  })}
<section class="sec" aria-labelledby="hrs-h">
  <div class="wrap">
    ${bay('01')}
    <div class="split" style="align-items:start">
      <div>
        <span class="status" data-status style="margin-bottom:18px"><i></i><span data-status-text>${HOURS.short}</span></span>
        <div class="hang" style="margin-bottom:22px"><h2 id="hrs-h">Opening hours</h2></div>
        <table class="hours-table" data-hours><tbody>
          ${days.map(([d, n]) => `<tr data-day="${n}"><td>${d}</td><td>${HOURS.days[n] ? '7:30am – 4:00pm' : 'Closed'}</td></tr>`).join('')}
        </tbody></table>
        <p class="small" style="margin-top:18px">${HOURS.sunday}</p>
        <p class="small">Public holiday hours can change. Check our <a href="${SITE.social.facebook}" target="_blank" rel="noopener">Facebook page</a> or call ${SITE.phone} before you come.</p>
      </div>
      <div>
        <div class="map"><iframe src="${SITE.address.embed}" title="Map showing 116 Furner Avenue, North Geelong" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <p class="small" style="margin-top:12px">${SITE.address.line1}, ${SITE.address.line2}. ${SITE.address.note}.</p>
      </div>
    </div>
  </div>
</section>
<section class="sec on-paper" aria-labelledby="rules-h">
  <div class="wrap">
    ${bay('02')}
    <div class="sec-head split"><div class="hang"><h2 id="rules-h">Before you drive in</h2></div><p class="lede">The signs on the floor and overhead tell you where to go. A few rules keep everyone safe.</p></div>
    <div class="steps">${rules.map(([ic, t, d]) => `<div class="step"><span style="display:block;margin-bottom:16px">${icon(ic, 'ic')}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
    <div class="ph-stack" style="grid-template-columns:repeat(3,1fr);margin-top:40px">
      ${['drive-in', 'gas-cages', 'trailer-area'].map((n) => `<figure>${img(n, { sizes: '33vw' })}<figcaption class="cap">${IMAGES[n].alt}.</figcaption></figure>`).join('')}
    </div>
  </div>
</section>
${vehicles('03')}
${registerBand()}`;
  return { path: 'our-location/', title: 'Location and opening hours', desc: 'Recycle North Geelong is at 116 Furner Avenue, North Geelong, behind Coates Hire. Open Monday to Saturday, 7:30am to 4pm.', body, current: 'our-location/' };
}

// ---------------------------------------------------------------- trade
export function trade() {
  const R = SITE.discount;
  const materials = [
    ['cardboard-cage', 'Cardboard and packaging', 'Including palletised loads'],
    ['ewaste-cage', 'E-waste', 'Computers, printers, monitors, servers and telecommunications equipment'],
    ['mattresses', 'Mattresses and bedding', 'Any quantity'],
    ['polystyrene-cages', 'Plastics and polystyrene', 'Including plastic pellets'],
    ['excavator-bin', 'Timber and building waste', 'Untreated timber, wooden pallets and sorted building materials'],
    ['gas-aerosols', 'Gas bottles', 'Including nitrous oxide canisters'],
    ['metals-area', 'Scrap metal', 'Steel, aluminium, copper, stainless and mixed'],
    ['whitegoods', 'Whitegoods and solar panels', 'Fridges, washers and panels'],
  ];
  const sectors = ['Government and councils', 'Hospitals and healthcare', 'Schools, TAFEs and universities', 'Retail and warehousing', 'Builders and property managers', 'Offices and commercial tenancies', 'Agricultural and industrial sites', 'Waste and rubbish collectors'];
  const body = `${pageHero({
    crumbs: 'Trade and corporate', kicker: 'Recycle Trade Service', title: 'Trade and business recycling', image: 'forklift-cardboard',
    lede: `Scheduled collections, bins on site, or bring it in on a semi or B-double. All trades and businesses save ${R.trade}% on every waste type.`,
    extra: `<div class="hero-ctas"><a class="btn" href="#enquire">Tell us what you've got${icon('arrow')}</a><a class="btn ghost" href="${SITE.links.registerTrade}">Register as a tradie${icon('arrow')}</a><a class="btn ghost" href="${SITE.trade.phoneHref}">${icon('call')}${SITE.trade.contact} · ${SITE.trade.phone}</a></div>`,
  })}
<section class="sec" aria-labelledby="t1-h">
  <div class="wrap">
    ${bay('01')}
    <div class="sec-head split"><div class="hang"><h2 id="t1-h" class="lines"><span class="ln">Two ways</span><span class="ln">to work with us.</span></h2></div><p class="lede">Bring it to us, or we bring the bins to you. Either way it's sorted by material and kept out of landfill.</p></div>
    <div class="ways">
      <div class="door">
        ${img('forklift-bale', { sizes: '(max-width: 900px) 100vw, 50vw' })}
        <span class="kicker">Drop-off</span>
        <h3>Bring it in</h3>
        <p>Room for semi-trailers and B-doubles, with an internal ring road and wide bays. Our crew helps you unload. Never closed for weather.</p>
        <ul><li>Semis and B-doubles</li><li>We help you unload</li><li>Trades from ${SITE.tradeHours.early}</li><li>Late drop-offs to ${SITE.tradeHours.lateBy} by appointment</li></ul>
      </div>
      <div class="door">
        ${img('skips-row', { sizes: '(max-width: 900px) 100vw, 50vw' })}
        <span class="kicker">Collection</span>
        <h3>We collect</h3>
        <p>Sorted, labelled bins on your site for e-waste, paint, cardboard, green waste, plastics and general rubbish, collected daily or weekly.</p>
        <ul><li>240 L</li><li>660 L</li><li>1,100 L</li><li>Skips and hook bins</li></ul>
      </div>
    </div>
  </div>
</section>
<section class="sec on-green" aria-labelledby="t2-h">
  <div class="wrap trade-disc">
    <div>
      <b class="trade-pc" aria-hidden="true">${R.trade}%</b>
      <h2 id="t2-h">Off for every trade and business</h2>
      <p>On every waste type, including general waste and building materials. Register once and it applies every time you come in.</p>
      <div class="btns"><a class="btn black" href="${SITE.links.registerTrade}">Register your business${icon('arrow')}</a></div>
    </div>
    ${tradieTuesday({ cls: 'dark' })}
  </div>
</section>
<section class="sec" aria-labelledby="jims-t-h">
  <div class="wrap">
    <h2 id="jims-t-h" class="sr-only">Jim's franchise benefits</h2>
    ${jimsPanel()}
  </div>
</section>
<section class="sec" aria-labelledby="t3-h">
  <div class="wrap">
    ${bay('02')}
    <div class="sec-head split"><div class="hang"><h2 id="t3-h" class="lines"><span class="ln">One partner.</span><span class="ln">Every stream.</span></h2></div><p class="lede">If it's a hard-to-recycle by-product we haven't listed, ask. We'll come back with options.</p></div>
    <div class="mat-grid">${materials.map(([ph, t, d]) => `<div class="mat rv"><div class="mat-ph">${img(ph, { sizes: '(max-width: 700px) 50vw, 25vw' })}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>
<section class="sec on-paper" aria-labelledby="t4-h">
  <div class="wrap">
    ${bay('03')}
    <div class="split" style="align-items:center">
      <div>
        <div class="hang" style="margin-bottom:22px"><h2 id="t4-h" class="lines"><span class="ln">Compliant, secure,</span><span class="ln">certified.</span></h2></div>
        <p class="lede">Electronic waste is handled to AS/NZS 5377. Hard drives are destroyed or sanitised to NIST 800-88, with certificates of destruction. Full CCTV and vehicle registration recording on site.</p>
        <div class="cert-grid">${SITE.accreditations.map((a) => `<div><b>${a.code}</b><span>${a.label}</span></div>`).join('')}</div>
      </div>
      <figure class="ph cert-ph" style="margin:0">${img('printers-cage', { sizes: '(max-width: 900px) 100vw, 50vw' })}</figure>
    </div>
  </div>
</section>
<section class="sec" aria-labelledby="t5-h">
  <div class="wrap">
    ${bay('04')}
    <div class="sec-head split"><div class="hang"><h2 id="t5-h">Who we work with</h2></div><p class="lede">From a single office to multi-site operations across western Victoria.</p></div>
    <ol class="sector-grid">${sectors.map((x, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${x}</li>`).join('')}</ol>
  </div>
</section>
${dealsSection({ n: '05' })}
<section class="sec on-ink2" id="enquire" aria-labelledby="t6-h">
  <div class="wrap">
    ${bay('06')}
    <div class="split" style="align-items:start">
      <div>
        <div class="hang" style="margin-bottom:22px"><h2 id="t6-h" class="lines"><span class="ln">Tell us</span><span class="ln">what you've got.</span></h2></div>
        <p class="lede">Windscreens, specialty plastics, bulky electronics or anything hard to recycle. Send the materials and rough quantities and our team will come back with a pick-up or drop-off option. No obligation.</p>
        <div class="box" style="margin-top:28px"><h3>${SITE.trade.contact}</h3><p class="small" style="margin:0 0 12px">${SITE.trade.title}</p><p style="margin:0"><a href="${SITE.trade.phoneHref}">${SITE.trade.phone}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p></div>
      </div>
      <form class="form" name="industry-recycling" method="POST" data-netlify="true" netlify-honeypot="company-url" data-form>
        <input type="hidden" name="form-name" value="industry-recycling">
        <p class="sr-only"><label>Leave this empty <input name="company-url"></label></p>
        <div class="row"><label>Name<input name="name" required autocomplete="name"></label><label>Company<input name="company" autocomplete="organization"></label></div>
        <div class="row"><label>Phone<input name="phone" type="tel" required autocomplete="tel"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div>
        <label>Materials and quantities<textarea name="materials" required placeholder="For example: 20 pallets of cardboard a week, 3 m³ of old IT equipment"></textarea></label>
        <button class="btn" type="submit">Send enquiry${icon('arrow')}</button>
        <p class="form-status" data-form-status role="status"></p>
      </form>
    </div>
  </div>
</section>`;
  return { path: 'recycle-corporate-services/', title: 'Trade and corporate recycling', desc: `Recycle Trade Service: scheduled collections, on-site bins and direct delivery for businesses, councils and industry across western Victoria. ${R.trade}% off for registered trades and businesses.`, body, current: 'recycle-corporate-services/' };
}

// ---------------------------------------------------------------- community
export function community() {
  const body = `${pageHero({
    crumbs: 'Community', kicker: 'Freecycle', title: 'If it helps someone, it isn’t waste', image: 'bedding',
    lede: 'Our longest-running program. Good furniture, mattresses and homewares go to people who need them, not to landfill.',
  })}
<section class="sec on-paper" aria-labelledby="c1-h">
  <div class="wrap">
    ${bay('01')}
    <div class="split" style="align-items:start">
      <div>
        <div class="hang" style="margin-bottom:22px"><h2 id="c1-h">How Freecycle works</h2></div>
        <p class="lede">Every week our team picks out furniture, mattresses and homewares that are still in good condition. They go straight to local charities, crisis centres and transitional housing services.</p>
        <p>For someone moving on from family violence, homelessness or hardship, a bed and a table are a fresh start. We supply more than 45 charity and community organisations, large and small.</p>
      </div>
      <div class="give" style="grid-template-columns:1fr;margin:0">
        <div class="ph-stack" style="margin-bottom:8px;border:0;padding:0">
          <figure>${img('furniture-dropoff', { sizes: '25vw' })}<figcaption class="cap">${IMAGES['furniture-dropoff'].alt}.</figcaption></figure>
          <figure>${img('clothing-hub', { sizes: '25vw' })}<figcaption class="cap">${IMAGES['clothing-hub'].alt}.</figcaption></figure>
        </div>
        <div><h3>A home again</h3><p>Furniture, mattresses and homewares for people starting over.</p></div>
        <div><h3>Warmth in winter</h3><p>Free untreated timber pallets for locals to use as kindling and firewood, easing the cost of living in the colder months.</p></div>
        <div><h3>Schools and early learning</h3><p>Offcuts, oddments and salvaged items for craft, learning and upcycling projects.</p></div>
        <div><h3>Aged care</h3><p>Books, puzzles and games for local aged care homes and nursing facilities.</p></div>
      </div>
    </div>
  </div>
</section>
<section class="sec" aria-labelledby="c2-h">
  <div class="wrap">
    ${bay('02')}
    <div class="sec-head split"><div class="hang"><h2 id="c2-h">Who we supply</h2></div><p class="lede">Some of the organisations that receive goods through Freecycle.</p></div>
    <div class="partners" style="margin:0">${FREECYCLE.partners.map((p) => `<span style="background:transparent;border-color:var(--line-2);color:var(--white)">${p}</span>`).join('')}<span style="background:transparent;border-color:var(--line-2);color:var(--white)">and more</span></div>
    <div class="box" style="margin-top:40px;max-width:760px"><h3>Are you a charity or community group?</h3><p>If you support people who need furniture or household goods, we'd like to hear from you.</p><p style="margin:0"><a class="link" href="mailto:${SITE.email}?subject=Freecycle%20partner%20enquiry">Email us${icon('arrow')}</a> <span class="small" style="margin-left:12px">or call ${SITE.phone}</span></p></div>
  </div>
</section>`;
  return { path: 'community/', title: 'Community and Freecycle', desc: 'Through Freecycle, Recycle North Geelong passes good furniture, mattresses and homewares to more than 45 charity and community organisations.', body, current: 'community/' };
}

// ---------------------------------------------------------------- about
export function about() {
  const body = `${pageHero({
    crumbs: 'About', kicker: 'About us', title: 'A recycling centre built for Geelong', image: 'waste-oil-station',
    lede: 'Recycle North Geelong is a public transfer station and resource recovery centre, built to keep as much as possible out of landfill.',
  })}
<section class="sec" aria-labelledby="a1-h">
  <div class="wrap">
    ${bay('01')}
    <div class="split" style="align-items:start">
      <div>
        <div class="hang" style="margin-bottom:22px"><h2 id="a1-h">Why we built it</h2></div>
        <p class="lede">Geelong is Victoria's second-largest city, but for years residents had few places to take rubbish and recycling that were close, open six days a week and affordable.</p>
        <p>When disposal is hard or expensive, more of it ends up dumped on roadsides. Recycle North Geelong opened to fix that: a large, undercover site where households and businesses can drop off almost anything, sorted into ${SITE.facility.streams} material streams so it can be recovered.</p>
        <p>Twelve kinds of recyclables are free to drop off, locals across six council areas get ${SITE.discount.resident}% off everything else, and trades and businesses ${SITE.discount.trade}%.</p>
      </div>
      <div><div class="quote-band lines"><span class="ln">Reuse.</span><span class="ln">Redistribute.</span><span class="ln">Recover.</span><span class="ln">Recycle.</span><span class="ln"><span class="g">Landfill last.</span></span></div></div>
    </div>
  </div>
</section>
<section class="sec on-paper" aria-labelledby="a2-h">
  <div class="wrap">
    ${bay('02')}
    <div class="sec-head split"><div class="hang"><h2 id="a2-h">One group, end to end</h2></div><p class="lede">We collect it, process it and find it somewhere to go. Our target is for 60% of what we collect to be redistributed or recycled.</p></div>
    <div class="give" style="margin-top:0">
      <div><h3>Recycle North Geelong</h3><p>The public transfer station and resource recovery centre at 116 Furner Avenue.</p></div>
      <div><h3>The Mattress Recycling Company</h3><p>Recycles more than half of Victoria's discarded mattresses, dismantling them into steel, foam and fabric.</p></div>
      <div><h3>JUNK and Trash.</h3><p>Collection services that bring rubbish and bulky items in, with the crew doing the lifting.</p></div>
    </div>
  </div>
</section>
${photoRun({ n: '03' })}
${scale({ n: '04' })}
${registerBand()}`;
  return { path: 'about-us/', title: 'About us', desc: 'Recycle North Geelong is a public transfer station and resource recovery centre in North Geelong, part of Recycle Group.', body, current: 'about-us/' };
}

// ---------------------------------------------------------------- after you tip (recycling matters)
export function recyclingMatters() {
  const streams = [
    ['mattress', 'Mattresses'], ['poly', 'Polystyrene'], ['cardboard', 'Cardboard'], ['whitegoods', 'Whitegoods'],
    ['metal', 'Metal'], ['ewaste', 'E-waste'], ['paint', 'Paint'], ['oil', 'Oils'], ['tyres', 'Tyres'],
    ['gas', 'Gas bottles and extinguishers'], ['battery', 'Batteries'], ['textiles', 'Clothing and fabric'],
    ['green', 'Green waste'], ['building', 'Building materials'], ['furniture', 'Furniture'], ['general', 'General rubbish'],
  ];
  const reasons = [
    ['Less goes in the ground', 'Every item recovered is one less in landfill, which extends the life of the sites we have.'],
    ['Fewer raw materials', 'Recovered steel, paper and plastics reduce the need to mine, log and drill for new ones.'],
    ['Lower emissions', 'Organic waste in landfill releases methane. Recycling also generally takes less energy than making from scratch.'],
    ['Local jobs', 'Recycling creates more jobs per tonne than landfill does.'],
    ['Less roadside dumping', 'Affordable, local drop-off gives people a better option than the side of the road.'],
    ['Better for the future', 'Diverting waste today means cleaner air, water and land later.'],
  ];
  const body = `${pageHero({
    crumbs: 'After you tip', kicker: 'Recycling matters', title: 'What happens after you tip',
    lede: 'Landfill transfers the problem. Recycling transforms the outcome. Here is where the things you drop off actually go.',
  })}
${journey({ n: '01', intro: false })}
<section class="sec on-paper" aria-labelledby="r1-h">
  <div class="wrap">
    ${bay('02')}
    <div class="sec-head split"><div class="hang"><h2 id="r1-h">Where it goes</h2></div><p class="lede">${SITE.facility.streams} streams are separated on site. These are the ones people bring in most.</p></div>
    <div class="az">${streams.map(([k, t]) => `<article class="az-item"><div class="t"><h3>${t}</h3></div><p style="color:var(--ink)">${STREAMS[k]}</p></article>`).join('')}</div>
  </div>
</section>
<section class="sec" aria-labelledby="r2-h">
  <div class="wrap">
    ${bay('03')}
    <div class="sec-head"><div class="hang"><h2 id="r2-h">Six reasons for landfill last</h2></div></div>
    <div class="steps" style="border-color:var(--white)">${reasons.map(([t, d], i) => `<div class="step" style="border-color:var(--line)"><span class="num" style="-webkit-text-stroke-color:var(--green)">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p style="color:var(--mute)">${d}</p></div>`).join('')}</div>
    <div class="box" style="margin-top:48px"><h3>Downstream partners</h3><p class="small" style="margin:0">Paintback · Australian Paper Recovery · Apparel Recyclers · Resource (Laverton)</p></div>
  </div>
</section>`;
  return { path: 'recycling-matters/', title: 'What happens after you tip', desc: 'Follow a mattress, polystyrene, cardboard and a couch through Recycle North Geelong in 3D, and see where every stream goes.', body, current: 'recycling-matters/', journey: true };
}

export function notFound() {
  const body = `${pageHero({ crumbs: 'Not found', kicker: '404', title: 'Wrong bay', lede: 'That page has moved or never existed. Try one of these instead.',
    extra: `<div class="hero-ctas"><a class="btn" href="${u('')}">Home${icon('arrow')}</a><a class="btn ghost" href="${u('what-we-take/')}">What we take</a><a class="btn ghost" href="${u('price-list/')}">Prices</a></div>` })}`;
  return { path: '404.html', file: '404.html', title: 'Page not found', desc: 'Page not found.', body, current: '' };
}
