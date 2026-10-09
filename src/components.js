import { SITE, HOURS, LOADS, WASTE, EXTRAS, POPULAR, FREECYCLE, loadFrom, loadPrice } from './data/site.js';
import { u, img, icon, bay, esc } from './lib.js';

// ---------------------------------------------------------------- finder
export function finder({ id = 'finder', heading = true, n = '01' } = {}) {
  return `<section class="sec on-paper" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    ${bay(n)}
    ${heading ? `<div class="sec-head split">
      <div class="hang"><h2 id="${id}-h">What have you got?</h2></div>
      <p class="lede">Type anything. See if we take it, what it costs and where it goes next.</p>
    </div>` : `<h2 id="${id}-h" class="sr-only">Search what we take</h2>`}
    <div class="finder-box" data-finder>
      <div class="finder-input">
        ${icon('search')}
        <input type="search" placeholder="Try ‘mattress’ or ‘paint’" autocomplete="off" spellcheck="false"
          role="combobox" aria-expanded="false" aria-controls="${id}-list" aria-autocomplete="list" aria-label="Search for an item">
        <ul class="suggest" id="${id}-list" role="listbox" hidden></ul>
      </div>
      <div class="chips" aria-label="Popular items">${POPULAR.map((p) => `<button type="button" class="chip" data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      <div class="result" aria-live="polite" hidden></div>
      <div class="no-match" hidden>
        <p style="margin:0"><b>Not sure about that one.</b> Call us on <a href="${SITE.phoneHref}">${SITE.phone}</a> and we'll tell you before you load up, or see the <a href="${u('what-we-take/')}">full list of what we take</a>.</p>
      </div>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- estimator
export const EST_DEFAULT = { load: 'car', size: 'uteLevel', waste: 0 };
export function estimator({ id = 'cost', n = '02' } = {}) {
  const loads = LOADS.map((l) => `<button type="button" class="load" data-load="${l.id}" aria-pressed="${l.id === EST_DEFAULT.load}">
      ${icon(l.icon)}<span class="n">${l.name}</span><span class="s">${l.sub}</span><span class="v">${l.sizes ? `from $${loadFrom(l)}` : 'Call ahead'}</span>
    </button>`).join('');
  const sizes = LOADS.filter((l) => l.sizes).map((l) => `<div class="sizes" data-sizes="${l.id}" role="group" aria-label="${l.name}: how full?"${l.id === EST_DEFAULT.load ? '' : ' hidden'}>
      ${l.sizes.map((s) => `<button type="button" class="size" data-size="${s.id}" aria-pressed="${l.id === EST_DEFAULT.load && s.id === EST_DEFAULT.size}">${s.name}</button>`).join('')}
    </div>`).join('');
  const waste = WASTE.map((w, i) => `<button type="button" data-waste="${i}" aria-pressed="${i === EST_DEFAULT.waste}">${w.short}</button>`).join('');
  const groups = [...new Set(EXTRAS.map((e) => e.group))];
  const extras = groups.map((g) => EXTRAS.filter((e) => e.group === g).map((e) => `<div class="extra">
      <span>${e.label}<small>$${e.price}</small></span>
      <span class="stepper"><button type="button" data-extra="${e.id}" data-d="-1" aria-label="Remove one ${e.label}">${icon('minus')}</button><output data-extra-count="${e.id}">0</output><button type="button" data-extra="${e.id}" data-d="1" aria-label="Add one ${e.label}">${icon('plus')}</button></span>
    </div>`).join('')).join('');
  return `<section class="sec" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div class="hang"><h2 id="${id}-h">Price your load in <span class="g nw">10 seconds</span></h2></div>
      <p class="lede">As a rule, we're half the price of landfill. Pick your vehicle, how full it is and what's in it. Registered locals save ${SITE.discount.resident}%, trades and businesses ${SITE.discount.trade}%.</p>
    </div>
    <div class="est" data-estimator>
      <div>
        <div class="est-step">
          <div class="lab"><b>A</b> How are you bringing it in?</div>
          <div class="loads">${loads}</div>
          ${sizes}
          <p class="small truck-note" data-truck-note hidden>Vans and trucks are priced at the gate. Call <a href="${SITE.phoneHref}">${SITE.phone}</a> for a price before you come.</p>
        </div>
        <div class="est-step">
          <div class="lab"><b>B</b> What's in it?</div>
          <div class="seg" role="group" aria-label="Type of waste">${waste}</div>
          <p class="small" style="margin-top:10px" data-waste-hint>${WASTE[EST_DEFAULT.waste].hint}</p>
          <p class="small">Everything is unloaded by material at its own bay, and unsorted mixed loads aren't accepted. <a href="${u('unsorted-loads/')}">How to sort your load</a></p>
        </div>
        <div class="est-step">
          <details class="more">
            <summary><span class="lab" style="margin:0"><b>C</b> Mattresses, tyres and more</span>${icon('plus')}</summary>
            <div class="extras">${extras}</div>
          </details>
        </div>
        <div class="est-step">
          <div class="lab"><b>D</b> Registered for a discount?</div>
          <div class="seg" role="group" aria-label="Registered discount">
            <button type="button" data-disc-rate="0" aria-pressed="true">No</button>
            <button type="button" data-disc-rate="${SITE.discount.resident}" aria-pressed="false">Resident ${SITE.discount.resident}%</button>
            <button type="button" data-disc-rate="${SITE.discount.trade}" aria-pressed="false">Trade or partner ${SITE.discount.trade}%</button>
          </div>
          <div class="reg-mini">
            <p><b>Not registered yet?</b> Residents and locals in ${SITE.discountCouncils.slice(0, -1).join(', ')} or ${SITE.discountCouncils.at(-1)} save ${SITE.discount.resident}%. All trades and businesses save ${SITE.discount.trade}% on every waste type, including general and building waste. Register once, save every visit.</p>
            <div class="reg-mini-links">
              <a class="link" href="${SITE.links.registerResident}">Register as a resident${icon('arrow')}</a>
              <a class="link" href="${SITE.links.registerTrade}">Trade or business${icon('arrow')}</a>
            </div>
          </div>
        </div>
      </div>
      <aside class="receipt" aria-live="polite">
        <h3>Your estimate</h3>
        <ul data-lines></ul>
        <div class="tot"><span>Total</span><b data-total>$${loadPrice(EST_DEFAULT.load, EST_DEFAULT.size, EST_DEFAULT.waste)}</b></div>
        <div class="disc" data-disc></div>
        <p class="fine">Estimate only, based on our published prices. Your final price is set at the gate from what you actually bring. Free items like whitegoods, scrap metal and car batteries cost nothing. <a href="${u('price-list/')}">Full price list</a></p>
      </aside>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- free items
export const FREE = [
  ['fridge', 'Whitegoods', 'Fridges, washing machines, ovens and more.'],
  ['heater', 'Hot&nbsp;water services', 'Old units, dropped off free.'],
  ['metal', 'Scrap metal', 'All types, as long as it is clean.'],
  ['can', 'Aluminium', 'Clean and separated from other metals.'],
  ['laptop', 'Computers and iPads', 'Desktops, laptops and iPads.'],
  ['tv', 'TVs and screens', 'TVs and LED screens.'],
  ['phone', 'Mobile phones', 'Old mobiles and smartphones.'],
  ['layers', 'Ink cartridges', 'Printer cartridges, household and office sized.'],
  ['box', 'Cardboard', 'Up to 0.5 m³, clean, dry, no polystyrene.'],
  ['poly', 'Polystyrene', 'Up to 0.5 m³ of clean EPS packaging.'],
  ['paint', 'Paint', 'Up to 100 L of decorative paint, through Paintback.'],
  ['battery', 'Car batteries', 'Straight to the battery station.'],
];

export function freeGrid({ n = '03' } = {}) {
  return `<section class="sec free-sec" aria-labelledby="free-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div class="hang"><h2 id="free-h">Twelve things, free</h2></div>
      <p class="lede">Doing the right thing shouldn't cost you. Bring these on their own or with a paid load.</p>
    </div>
    <div class="free-grid">
      ${FREE.map(([ic, t, d]) => `<div class="free-card rv"><span class="tag">FREE</span>${icon(ic)}<h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- walk the floor
export const FLOOR = [
  // [image, sign, caption, size]  size: 'wide' | 'mid' | ''
  ['car-sedan-bays', 'Car / sedan unloading area', 'Pull into a marked bay. Every drop-off is under cover, on concrete.', 'wide'],
  ['cardboard-cage', 'Cardboard', 'Flattened boxes go in the cages, then to the baler.', ''],
  ['polystyrene-cages', 'Polystyrene', 'Clean foam packaging, kept apart from everything else.', ''],
  ['ewaste-cages', 'E-waste', 'TVs, screens and computers, caged and kept dry.', ''],
  ['whitegoods', 'Whitegoods', 'Fridges, washers and dryers, free.', ''],
  ['metals-area', 'Recycled metals area', 'Scrap steel and car parts each have their own bins.', 'mid'],
  ['mattresses', 'Mattresses', 'Dismantled on site so the steel can be recovered.', ''],
  ['waste-oil-station', 'Waste oil station', 'Engine oil, hydraulic oil and paint, each with its own tank or cage.', 'wide'],
  ['building-materials', 'Building materials', 'Sorted building materials go in their own skips.', 'mid'],
  ['fabric-clothing', 'Fabric and clothing', 'A clothing bin and a fabric cage in the unloading area.', ''],
  ['tyres-bay', 'Tyres', 'Car, motorbike and truck tyres, priced each.', 'wide'],
  ['aerosols-paint', 'Aerosols, paint cans, hazards', 'Paint, aerosol cans and other hazards each go in their own cage.', ''],
  ['gas-cages', 'Gas bottles', 'Gas bottles and canisters are caged apart, away from everything else.', 'mid'],
  ['trailer-area', 'Tipping truck and trailer area', 'Its own lane for commercial vehicles and tipping trailers.', 'mid'],
  ['forklift-cardboard', 'Baled on site', 'Finished cardboard bales are moved out by forklift.', 'wide'],
];

export function floorWalk({ n = '04' } = {}) {
  const video = SITE.tourVideoSrc
    ? `<div class="video-slot"><video src="${SITE.tourVideoSrc}" autoplay muted loop playsinline preload="metadata"></video></div>` : '';
  return `<section class="sec floor" id="tour" aria-labelledby="tour-h" style="padding-bottom:calc(var(--sec) * .7)">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div><span class="kicker">Walk the floor</span><h2 id="tour-h" class="lines" style="margin-top:18px"><span class="ln">20,000&nbsp;m².</span><span class="ln">One roof.</span></h2></div>
      <div>
        <p class="lede">20,000 m² of undercover concrete with a bay for every material. Rain or shine, you never unload in the mud.</p>
        <div class="floor-nav" style="margin-top:20px"><button type="button" data-floor="-1" aria-label="Previous photo">${icon('arrow')}</button><button type="button" data-floor="1" aria-label="Next photo">${icon('arrow')}</button></div>
      </div>
    </div>
  </div>
  ${video}
  <div class="floor-track" tabindex="0" aria-label="Photos of the drop-off areas">
    ${FLOOR.map(([im, t, d, size], i) => `<figure class="floor-card${size ? ' ' + size : ''}">
      <div class="ph">${img(im, { sizes: size === 'wide' ? '(max-width: 700px) 90vw, 52vw' : '(max-width: 700px) 80vw, 34vw' })}<span class="no">${String(i + 1).padStart(2, '0')}</span></div>
      <figcaption><b>${t}</b>${d}</figcaption>
    </figure>`).join('')}
  </div>
</section>`;
}

// ---------------------------------------------------------------- 3D journey
export const JOURNEY = [
  { key: 'mattress', icon: 'mattress', from: 'You drop off a mattress', title: 'It leaves as baled steel',
    text: 'Every mattress is dismantled on site, in about 38 seconds on average. The springs are pulled out, compressed and baled.',
    stat: '99%', statText: 'of the steel recovered. About 30% of a mattress is steel.', photo: 'mattresses' },
  { key: 'poly', icon: 'poly', from: 'You drop off polystyrene', title: 'It leaves as a dense block',
    text: 'Polystyrene is up to 98% air. Our densifier presses it out, so three shipping containers of foam become one block about the size of a washing machine.',
    stat: '98%', statText: 'air, pressed out on site', photo: 'polystyrene-cages' },
  { key: 'cardboard', icon: 'box', from: 'You drop off cardboard', title: 'It leaves as a bale',
    text: 'Clean, dry cardboard is flattened and baled on site, then sent for paper-making.',
    stat: 'Free', statText: 'for up to 0.5 m³ of clean cardboard', photo: 'cardboard-cage' },
  { key: 'sofa', icon: 'sofa', from: 'You drop off a good couch', title: 'It goes to someone who needs it',
    text: 'Furniture in good condition goes to charity and community partners through our Freecycle program, helping people set up a home again.',
    stat: '45+', statText: 'charity and community organisations we supply', photo: 'fabric-clothing' },
  { key: 'residual', icon: 'bin', from: "What can't be saved", title: 'Landfill last',
    text: 'Whatever is left after sorting is shredded to about a quarter of its volume before it goes to landfill. Less space taken, better compaction.',
    stat: '25%', statText: 'of its original volume', photo: 'skips-row' },
];

export function journey({ n = '05', intro = true } = {}) {
  const steps = JOURNEY.map((j, i) => `<div class="jstep" data-step="${i}">
      <div class="from">${icon(j.icon)}${j.from}</div>
      <h3 class="h2l">${j.title}</h3>
      <p>${j.text}</p>
      <div class="stat"><b>${j.stat}</b><span>${j.statText}</span></div>
    </div>`).join('');
  const cards = JOURNEY.map((j) => `<article class="jcard">${img(j.photo, { sizes: '(max-width: 700px) 90vw, 25vw' })}<div><span class="small">${j.from}</span><h3>${j.title}</h3><p>${j.text}</p></div></article>`).join('');
  return `<section class="journey" id="after-you-tip" data-journey data-mode="3d" aria-labelledby="journey-h">
  <div class="journey-pin">
    <canvas aria-hidden="true"></canvas>
    <div class="journey-shade"></div>
    ${intro ? `<div class="journey-intro">
      ${bay(n)}
      <span class="kicker">After you tip</span>
      <h2 id="journey-h" class="lines" style="margin:18px 0 20px"><span class="ln">Landfill buries it.</span><span class="ln"><span class="g">We take it apart.</span></span></h2>
      <p class="lede">Scroll to follow five things that come through the gate every day.</p>
    </div>` : `<h2 id="journey-h" class="sr-only">After you tip</h2>`}
    <div class="journey-steps">${steps}</div>
    <div class="journey-progress" aria-label="Chapters">${JOURNEY.map((j, i) => `<button type="button" data-goto="${i}" aria-label="${esc(j.from)}"></button>`).join('')}</div>
    <div class="journey-label" data-journey-label>Loading 3D…</div>
  </div>
  <div class="journey-scroll" aria-hidden="true"></div>
  <div class="journey-static"><div class="wrap">
    <span class="kicker">After you tip</span><h2 style="margin:18px 0 36px">Where it goes next</h2>
    <div class="jcards">${cards}</div>
  </div></div>
</section>`;
}

// ---------------------------------------------------------------- visit steps
export function visitSteps({ n = '06' } = {}) {
  // [title, text, photo, short silent loop of the same spot (public/video), photo focus to match the loop's framing]
  const S = [
    ['Sort it at home', `Keep green waste, metal, e-waste and general rubbish apart as you load. Everything comes off at its own bay, so you're in and out.`, 'sort-compare', null, '50% 50%'],
    ['Drive in under cover', `Head to ${SITE.address.line1}, behind Coates Hire. Follow the hanging signs to the right bay.`, 'drive-in', 'step-2-drive', '50% 36%'],
    ['Unload by material', 'Each material has its own bay, cage or tank. Not sure where something goes? Ask the team on the floor.', 'unload-car-cardboard', null, '45% 55%'],
    ['We take it from there', `${SITE.facility.streams} material streams, each with somewhere to go that isn't landfill.`, 'forklift-bale', null, '50% 55%'],
  ];
  return `<section class="sec on-paper" aria-labelledby="visit-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div class="hang"><h2 id="visit-h" class="lines"><span class="ln">Four steps.</span><span class="ln">That's it.</span></h2></div>
      <div>
        <p class="lede">Come in any time we're open: ${HOURS.label}. Rain or shine, it's all under cover.</p>
        ${tourLink('Watch the drive-through', 'link')}
      </div>
    </div>
    <div class="steps">
      ${S.map(([t, d, ph, vid, pos], i) => `<div class="step rv"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p><div class="step-photo${ph === 'sort-compare' ? ' sortcmp' : ''}">${img(ph, { sizes: '(max-width: 900px) 90vw, 22vw', style: `object-position:${pos}` })}${ph === 'sort-compare' ? '<span class="sc-tag bad">Unsorted</span><span class="sc-tag good">Sorted</span>' : ''}${vid ? `<video class="step-vid" data-src="${u(`video/${vid}.mp4`)}" muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1"></video>` : ''}</div></div>`).join('')}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- facility tour (plays only when asked)
const TOUR_SECS = 39;
export function tourLink(label = 'Take a look inside', cls = 'hv-tour') {
  // Without JavaScript this is a plain link to the video file.
  return `<a class="${cls}" href="${u('video/tour-16x9.mp4')}" data-tour><span class="tour-play">${icon('play')}</span>${label}<span class="tour-len">${TOUR_SECS} sec</span></a>`;
}
export function tourDialog() {
  return `<dialog class="tour" id="tour" aria-label="A drive through Recycle North Geelong">
  <div class="tour-box">
    <button class="tour-x" type="button" data-tour-close aria-label="Close video">${icon('close')}</button>
    <video class="tour-v" controls playsinline muted preload="none"
      data-wide="${u('video/tour-16x9.mp4')}" data-wide-poster="${u('video/tour-16x9-poster.jpg')}"
      data-tall="${u('video/tour-9x16.mp4')}" data-tall-poster="${u('video/tour-9x16-poster.jpg')}"></video>
    <p class="tour-cap">Every drop-off point in the hall, in ${TOUR_SECS} seconds. No sound.</p>
  </div>
</dialog>`;
}

// ---------------------------------------------------------------- register band
export function registerBand() {
  return `<section class="sec on-green" id="register" aria-labelledby="reg-h">
  <div class="wrap register">
    <div><h2 id="reg-h" class="lines"><span class="ln">Register once.</span><span class="ln">Save every visit.</span></h2></div>
    <div>
      <div class="reg-tiers">
        <div><b class="reg-pc">${SITE.discount.resident}%</b><p><b>Residents and locals</b> in these council areas:</p><div class="councils">${SITE.discountCouncils.map((c) => `<span>${c}</span>`).join('')}</div></div>
        <div><b class="reg-pc">${SITE.discount.trade}%</b><p><b>All trades and businesses</b>, on every waste type, including general and building waste.</p></div>
      </div>
      <div class="btns">
        <a class="btn black" href="${SITE.links.registerResident}">Register as a resident${icon('arrow')}</a>
        <a class="btn ghost" style="--fg:var(--ink);border-color:var(--ink)" href="${SITE.links.registerTrade}">Register a trade or business${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>`;
}

const logoTile = (o) => `<div class="lt${o.logo ? '' : ' txt'}">${o.logo ? `<img src="${u(`partners/${o.logo}.png`)}" alt="${o.n}" loading="lazy">` : `${o.icon ? icon(o.icon) : ''}<b>${o.n}</b>`}</div>`;

export function jimsPanel({ cls = '' } = {}) {
  return `<div class="jims ${cls}">
    <div class="jims-logo"><img src="${u('partners/jims-mowing.png')}" alt="Jim's Mowing" width="420" height="322" loading="lazy"></div>
    <div class="jims-copy">
      <span class="kicker">Exclusive Jim's franchise benefits</span>
      <h3 class="jims-h">Beyond ${SITE.discount.trade}% for Jim's franchisees</h3>
      <p>Participating Jim's Group franchisees get exclusive preferential disposal and recycling rates, arranged directly through Jim's Head Office. Savings go well beyond our standard ${SITE.discount.trade}% trade and service business discount, with a convenient, undercover recycling facility.</p>
    </div>
    <div class="jims-more"><span>Jim's Group services</span><div class="lt-row">${SITE.jims.map(logoTile).join('')}</div></div>
  </div>`;
}

export function tradieTuesday({ cls = '' } = {}) {
  const D = SITE.discount, H = SITE.tradeHours;
  return `<div class="tt ${cls}">
      <div><span class="tt-day">Tradie Tuesdays</span><b class="tt-pc">${D.tradieTuesday}% off</b></div>
      <div>
        <ul class="tt-list"><li>${icon('check')}<span><b>${D.tradieTuesday}% off</b> your load</span></li><li>${icon('check')}<span>We <b>help you unload</b></span></li><li>${icon('check')}<span>A <b>sausage on us</b></span></li></ul>
        <p class="tt-hours">Trades get early access from ${H.early}, six days a week. Late drop-offs by appointment up to ${H.lateBy}, Monday to Saturday.</p>
        <a class="btn" href="${SITE.links.registerTrade}">Register as a tradie${icon('arrow')}</a>
      </div>
    </div>`;
}

export function whyStrip() {
  return `<section class="why" aria-label="Why Recycle North Geelong">
  <div class="wrap why-in">
    <div>${icon('hand')}<b>We help you unload</b><span>Victoria's only transfer station and recycling centre that helps you unload.</span></div>
    <div>${icon('umbrella')}<b>Never closed for weather</b><span>Fully undercover. No rain, no mess, no fuss.</span></div>
    <div>${icon('tag')}<b>Half the price of landfill</b><span>As a rule. Plus 12 things you can drop off free.</span></div>
  </div>
</section>`;
}

export function dealsSection({ n = '07' } = {}) {
  const D = SITE.discount;
  return `<section class="sec on-paper" id="discounts" aria-labelledby="deals-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split"><div class="hang"><h2 id="deals-h" class="lines"><span class="ln">More ways</span><span class="ln">to save.</span></h2></div><p class="lede">As a rule, we're half the price of landfill. These discounts take it further. Ask at the gate; ID may be required.</p></div>
    ${tradieTuesday()}
    <div class="lg">
      <div class="lg-head"><b class="lg-pc">${D.trade}%</b><div><h3>Front line</h3><p>Nurses, police, fire, ambulance and SES.</p></div></div>
      <div class="lt-grid">${SITE.frontline.map(logoTile).join('')}</div>
    </div>
    <div class="lg">
      <div class="lg-head"><b class="lg-pc">${D.trade}%</b><div><h3>Local employers and partners</h3><p>Staff of these Geelong organisations, plus real estate agents.</p></div></div>
      <div class="lt-grid">${SITE.partners.map(logoTile).join('')}</div>
    </div>
  </div>
</section>`;
}

export function sortCompare({ sizes = '100vw', cls = '' } = {}) {
  return `<figure class="sortcmp ${cls}">${img('sort-compare', { sizes })}<span class="sc-tag bad">Unsorted</span><span class="sc-tag good">Sorted</span></figure>`;
}

export function pickupList() {
  return `<div class="pickups">
    <a class="pickup" href="${SITE.links.bookCollection}"><span><b>Rubbish or junk collection</b><span>Our crew does the lifting and loading.</span></span>${icon('arrow')}</a>
  </div>`;
}

export function partnersList() {
  return `<div class="partners">${FREECYCLE.partners.map((p) => `<span>${p}</span>`).join('')}<span>and more</span></div>`;
}

export function pageHero({ crumbs, kicker, title, lede, image, extra = '', band = false }) {
  return `<section class="page-hero${image ? ' has-img' : ''}">
  ${image ? img(image, { eager: true, alt: '' }) : ''}
  <div class="wrap">
    <div class="crumbs"><a href="${u('')}">Home</a><span>/</span><span>${crumbs}</span></div>
    ${kicker ? `<span class="kicker" style="margin-top:28px">${kicker}</span>` : ''}
    <h1>${title}</h1>
    ${lede ? `<p class="lede" style="color:#deded9;max-width:52ch">${lede}</p>` : ''}
    ${extra}
  </div>
</section>
${band ? marquee({ tone: 'green', small: true }) : ''}`;
}

// ================================================================ v2: loud and kinetic

// Full-screen video hero with a kinetic headline.
export function heroVideo() {
  const free = ['Whitegoods', 'Scrap metal', 'Cardboard', 'Polystyrene', 'TVs and screens', 'Paint', 'Car batteries', 'Ink cartridges'];
  return `<section class="hv" aria-labelledby="hero-h">
  ${img('hall-hero', { eager: true, cls: 'hv-vid hv-img', alt: '', sizes: '100vw' })}
  <div class="hv-shade"></div>
  <div class="wrap hv-in">
    <div class="hv-top">
      <span class="status" data-status><i></i><span data-status-text>${HOURS.short}</span></span>
      <span class="hv-where">Drive in, drive out · No mess, no fuss · Fully undercover</span>
    </div>
    <div class="hv-headrow">
      <h1 id="hero-h" class="lines calm"><span class="ln"><span class="w">Drive in.</span></span><span class="ln"><span class="w">Drop off.</span></span><span class="ln"><span class="w g">Drive out.</span></span></h1>
      <div class="assist" role="note"><span class="assist-ic">${icon('hand')}</span><b>Assisted unloading</b><span>Our staff help you unload. Victoria's only transfer station and recycling centre that does.</span></div>
    </div>
    <p class="hv-lede"><span class="nw">Geelong's only undercover transfer station.</span> <span class="nw">Open Monday to Saturday, 7:30am – 4pm.</span></p>
    <div class="hero-ctas">
      <a class="btn" href="#finder">What can I bring?${icon('down')}</a>
      <a class="btn ghost" href="#cost">Price my load</a>
      <a class="btn ghost" href="${SITE.address.directions}" target="_blank" rel="noopener">${icon('pin')}Directions</a>
    </div>
    ${tourLink()}
  </div>
</section>`;
}

// Scrolling banner, like the Love Not Landfill banners that run along the hall.
export function marquee({ tone = 'black', text = ['Love', '<b>not</b>', 'landfill.'], small = false } = {}) {
  const unit = `<span class="mq-unit">${text.join(' ')}</span><span class="mq-dot" aria-hidden="true"></span><span class="mq-unit">Recycle <b>North Geelong</b></span><span class="mq-dot" aria-hidden="true"></span>`;
  return `<div class="mq mq-${tone}${small ? ' mq-sm' : ''}" aria-hidden="true"><div class="mq-track" data-mq><div class="mq-run">${unit.repeat(3)}</div><div class="mq-run">${unit.repeat(3)}</div></div></div>`;
}

// Two rows of real photos sliding past in opposite directions.
export const RUN_A = [
  ['car-sedan-bays', 'Car / sedan unloading'], ['cardboard-cage', 'Cardboard'], ['whitegoods', 'Whitegoods'], ['waste-oil-station', 'Waste oil station'],
  ['polystyrene-cages', 'Polystyrene'], ['tyres-bay', 'Tyres'], ['mattresses', 'Mattresses'], ['forklift-cardboard', 'Baled on site'],
];
export const RUN_B = [
  ['trailer-cardboard', 'Unload by material'], ['metals-area', 'Recycled metals'], ['gas-cages', 'Gas bottles'], ['aerosols-paint', 'Aerosols, paint, hazards'],
  ['furniture-dropoff', 'Furniture drop-off'], ['ewaste-cages', 'E-waste'], ['building-materials', 'Building materials'], ['excavator-bin', 'Hook bins'],
];
const PR_PICK = [
  ['car-sedan-bays', 'Car / sedan unloading'], ['cardboard-cage', 'Cardboard'], ['whitegoods', 'Whitegoods'], ['tyres-bay', 'Tyres'],
  ['polystyrene-cages', 'Polystyrene'], ['metals-area', 'Recycled metals'], ['mattresses', 'Mattresses'], ['furniture-dropoff', 'Furniture drop-off'],
];
export function photoRun({ n = '04' } = {}) {
  const row = (list, dir) => {
    const items = list.map(([im, label]) => `<figure class="pr-item">${img(im, { sizes: '420px', alt: label })}<figcaption><span class="pr-sign">${label}</span></figcaption></figure>`).join('');
    return `<div class="pr-grid">${items}</div>`;
  };
  return `<section class="sec pr" id="tour" aria-labelledby="tour-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div class="hang"><h2 id="tour-h" class="lines"><span class="ln">20,000&nbsp;m².</span><span class="ln">One roof.</span></h2></div>
      <p class="lede">A bay for every material, all on undercover concrete. You never unload in the rain.</p>
    </div>
  </div>
  <div class="wrap">${row(PR_PICK, 'l')}</div>
</section>`;
}

// Big numbers set against things people know.
export function scale({ n = '07' } = {}) {
  const ovals = Array.from({ length: 23 }, (_, i) => `<ellipse cx="200" cy="${178 - i * 5.2}" rx="170" ry="62" />`).join('');
  return `<section class="sec on-paper sc" aria-labelledby="sc-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div class="hang"><h2 id="sc-h" class="lines"><span class="ln">Not a tip.</span><span class="ln">A recovery centre.</span></h2></div>
      <p class="lede" style="color:var(--ink)">The same site recycles mattresses, densifies polystyrene and bales cardboard. Here's the scale.</p>
    </div>
    <div class="sc-grid">
      <article class="sc-card sc-big rv">
        <div class="sc-num" style="--w:6.4"><span data-count="20000">20,000</span><small>m²</small></div>
        <p class="sc-what">under one roof</p>
        <p class="sc-like">About the size of the <b>MCG playing surface</b>, all of it undercover concrete.</p>
        <svg class="sc-mcg" viewBox="0 0 400 240" aria-hidden="true"><ellipse cx="200" cy="120" rx="185" ry="105" /><ellipse cx="200" cy="120" rx="40" ry="14" class="pitch"/></svg>
      </article>
      <article class="sc-card rv">
        <div class="sc-num" style="--w:10.6"><span data-count="12000">12,000</span>–<span data-count="30000">30,000</span></div>
        <p class="sc-what">mattresses recycled by our group every month</p>
        <p class="sc-like">A year's worth would cover the <b>MCG 23&nbsp;to&nbsp;57 times over</b>.</p>
        <svg class="sc-stack" viewBox="0 0 400 260" aria-hidden="true">${ovals}</svg>
      </article>
      <article class="sc-card rv">
        <div class="sc-num" style="--w:9.4"><span data-count="3800">3,800</span>–<span data-count="9600">9,600</span><small>t</small></div>
        <p class="sc-what">of mattress steel recovered a year</p>
        <p class="sc-like">Enough for a new <b>Sydney Harbour Bridge</b> every 6&nbsp;to&nbsp;14&nbsp;years.</p>
      </article>
      <article class="sc-card rv">
        <div class="sc-num" style="--w:3"><span data-count="90">90</span>+</div>
        <p class="sc-what">material streams sorted on site</p>
        <p class="sc-like">Each with somewhere to go that isn't landfill.</p>
      </article>
    </div>
    <div class="accred" style="margin-top:36px">${SITE.accreditations.map((a) => `<div><b>${a.code}</b><span>${a.label}</span></div>`).join('')}</div>
  </div>
</section>`;
}
