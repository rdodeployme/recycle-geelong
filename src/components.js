import { SITE, HOURS, LOADS, EXTRAS, POPULAR, FREECYCLE } from './data/site.js';
import { u, img, icon, bay, esc } from './lib.js';

// ---------------------------------------------------------------- finder
export function finder({ id = 'finder', heading = true, n = '01' } = {}) {
  return `<section class="sec on-paper" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    ${bay(n)}
    ${heading ? `<div class="sec-head split">
      <div><span class="kicker">Can I bring it?</span><h2 id="${id}-h" style="margin-top:18px">What have you got?</h2></div>
      <p class="lede">Type anything: a couch, a fridge, paint, tyres. You'll see if we take it, what it costs and what happens to it after you drop it off.</p>
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
export function estimator({ id = 'cost', n = '02' } = {}) {
  const loads = LOADS.map((l, i) => `<button type="button" class="load" data-load="${l.id}" aria-pressed="${i === 4}">
      ${icon(l.icon)}<span class="n">${l.name}</span><span class="s">${l.sub}</span><span class="v">${l.m3 ? `${l.m3} m³ · from $${l.sorted}` : `$${l.sorted} per m³ sorted`}</span>
    </button>`).join('');
  const groups = [...new Set(EXTRAS.map((e) => e.group))];
  const extras = groups.map((g) => EXTRAS.filter((e) => e.group === g).map((e) => `<div class="extra">
      <span>${e.label}<small>$${e.price}</small></span>
      <span class="stepper"><button type="button" data-extra="${e.id}" data-d="-1" aria-label="Remove one ${e.label}">${icon('minus')}</button><output data-extra-count="${e.id}">0</output><button type="button" data-extra="${e.id}" data-d="1" aria-label="Add one ${e.label}">${icon('plus')}</button></span>
    </div>`).join('')).join('');
  return `<section class="sec" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div><span class="kicker">What will it cost?</span><h2 id="${id}-h" style="margin-top:18px">Price your load in <span class="g nw">10 seconds</span></h2></div>
      <p class="lede">Pick how you're bringing it in. Sorting your load at home halves the rate, and locals who register get 10% off.</p>
    </div>
    <div class="est" data-estimator>
      <div>
        <div class="est-step">
          <div class="lab"><b>A</b> How are you bringing it in?</div>
          <div class="loads">${loads}</div>
          <div class="m3-row" hidden>
            <span class="small">How many cubic metres?</span>
            <span class="stepper"><button type="button" data-m3="-0.5" aria-label="Less">${icon('minus')}</button><output data-m3-out>2</output><button type="button" data-m3="0.5" aria-label="More">${icon('plus')}</button></span>
            <span class="small">m³</span>
          </div>
        </div>
        <div class="est-step">
          <div class="lab"><b>B</b> Is it sorted?</div>
          <div class="seg" role="group" aria-label="Sorted or unsorted">
            <button type="button" data-sort="sorted" aria-pressed="true">Sorted</button>
            <button type="button" data-sort="unsorted" aria-pressed="false">Mixed / unsorted</button>
          </div>
          <p class="small" style="margin-top:10px">Sorted means grouped by material before you arrive: green waste, metal, e-waste and general rubbish kept apart. <a href="${u('unsorted-loads/')}">How to sort</a></p>
        </div>
        <div class="est-step">
          <details class="more">
            <summary><span class="lab" style="margin:0"><b>C</b> Mattresses, tyres and more</span>${icon('plus')}</summary>
            <div class="extras">${extras}</div>
          </details>
        </div>
        <div class="est-step">
          <label class="toggle"><input type="checkbox" data-discount><span class="sw"></span><span>I'm registered for the <b>10% local discount</b></span></label>
        </div>
      </div>
      <aside class="receipt" aria-live="polite">
        <h3>Your estimate</h3>
        <ul data-lines></ul>
        <div class="tot"><span>Total</span><b data-total>$99</b></div>
        <div class="disc" data-disc></div>
        <div class="save" data-save hidden>${icon('sort')}<span data-save-text></span></div>
        <p class="fine">Estimate only, based on our published prices. Your final price is set at the gate from what you actually bring. Free items like whitegoods, scrap metal and car batteries cost nothing. <a href="${u('price-list/')}">Full price list</a></p>
      </aside>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- free items
export const FREE = [
  ['fridge', 'Whitegoods', 'Fridges, washing machines, ovens and more.'],
  ['metal', 'Scrap metal', 'All types, as long as it is clean.'],
  ['box', 'Cardboard', 'Up to 0.5 m³, clean, dry, no polystyrene.'],
  ['poly', 'Polystyrene', 'Up to 0.5 m³ of clean EPS packaging.'],
  ['tv', 'TVs and screens', 'Plus mobile phones.'],
  ['paint', 'Paint', 'Up to 100 L of decorative paint, through Paintback.'],
  ['battery', 'Car batteries', 'Straight to the battery station.'],
  ['layers', 'Ink cartridges', 'Printer cartridges, household and office sized.'],
];

export function freeGrid({ n = '03' } = {}) {
  return `<section class="sec on-green" aria-labelledby="free-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div><h2 id="free-h">Eight things you can drop off free</h2></div>
      <p class="lede" style="color:var(--ink)">Recyclables shouldn't cost you money to do the right thing. Bring these in on their own, or with a paid load.</p>
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
  const S = [
    ['Sort it at home', `Keep green waste, metal, e-waste and general rubbish apart as you load. It's quicker at the bays and halves the rate.`, 'bins-small-items'],
    ['Drive in under cover', `Head to ${SITE.address.line1}, behind Coates Hire. Follow the hanging signs to the right bay.`, 'drive-in'],
    ['Unload by material', 'Each material has its own bay, cage or tank. Not sure where something goes? Ask the team on the floor.', 'trailer-cardboard'],
    ['We take it from there', `${SITE.facility.streams} material streams, each with somewhere to go that isn't landfill.`, 'rubbish-bays-arrow'],
  ];
  return `<section class="sec on-paper" aria-labelledby="visit-h">
  <div class="wrap">
    ${bay(n)}
    <div class="sec-head split">
      <div><span class="kicker">How a visit works</span><h2 id="visit-h" class="lines" style="margin-top:18px"><span class="ln">Four steps.</span><span class="ln">That's it.</span></h2></div>
      <p class="lede">Come in any time we're open: ${HOURS.label}. Rain or shine, it's all under cover.</p>
    </div>
    <div class="steps">
      ${S.map(([t, d, ph], i) => `<div class="step rv"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p><div class="step-photo">${img(ph, { sizes: '(max-width: 900px) 90vw, 22vw' })}</div></div>`).join('')}
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- register band
export function registerBand() {
  return `<section class="sec on-green" id="register" aria-labelledby="reg-h">
  <div class="wrap register">
    <div><h2 id="reg-h" class="lines"><span class="ln">10% off.</span><span class="ln">Every visit.</span></h2></div>
    <div>
      <p style="font-size:19px;font-weight:600;margin:0">Residents and businesses in these council areas can register once and save 10%:</p>
      <div class="councils">${SITE.discountCouncils.map((c) => `<span>${c}</span>`).join('')}</div>
      <div class="btns">
        <a class="btn black" href="${SITE.links.registerResident}">Register as a resident${icon('arrow')}</a>
        <a class="btn ghost" style="--fg:var(--ink);border-color:var(--ink)" href="${SITE.links.registerTrade}">Trade or business${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>`;
}

export function pickupList() {
  return `<div class="pickups">
    <a class="pickup" href="${SITE.links.bookCollection}"><span><b>Rubbish or junk collection</b><span>We come to you and load it.</span></span>${icon('arrow')}</a>
    <a class="pickup" href="${SITE.links.mattressPickup}" target="_blank" rel="noopener"><span><b>Mattress or bed base pickup</b><span>Through The Mattress Recycling Company.</span></span>${icon('external')}</a>
  </div>`;
}

export function partnersList() {
  return `<div class="partners">${FREECYCLE.partners.map((p) => `<span>${p}</span>`).join('')}<span>and more</span></div>`;
}

export function pageHero({ crumbs, kicker, title, lede, image, extra = '' }) {
  return `<section class="page-hero${image ? ' has-img' : ''}">
  ${image ? img(image, { eager: true, alt: '' }) : ''}
  <div class="wrap">
    <div class="crumbs"><a href="${u('')}">Home</a><span>/</span><span>${crumbs}</span></div>
    ${kicker ? `<span class="kicker" style="margin-top:28px">${kicker}</span>` : ''}
    <h1>${title}</h1>
    ${lede ? `<p class="lede" style="color:#deded9;max-width:52ch">${lede}</p>` : ''}
    ${extra}
  </div>
</section>`;
}
