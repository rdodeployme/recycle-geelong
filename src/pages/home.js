import { SITE, HOURS } from '../data/site.js';
import { u, img, icon, bay, alt } from '../lib.js';
import { finder, estimator, freeGrid, floorWalk, journey, visitSteps, registerBand, pickupList, partnersList } from '../components.js';
import { newsTeaser } from './news.js';

const HERO = [
  ['hall-hero', '-2%', '-1%', '60%', '40%'],
  ['skips-row', '1.5%', '-1%', '40%', '55%'],
  ['green-bins', '-1.5%', '1%', '55%', '50%'],
];

export function home() {
  const slides = HERO.map(([n, dx, dy, ox, oy], i) => `<figure class="${i === 0 ? 'on' : ''}" style="--dx:${dx};--dy:${dy};--ox:${ox};--oy:${oy}">${img(n, { eager: i === 0, alt: i === 0 ? undefined : '' })}</figure>`).join('');
  const body = `
<section class="hero" aria-labelledby="hero-h">
  <div class="hero-media" data-slides>${slides}</div>
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <span class="sign">Public transfer station · North Geelong</span>
        <h1 id="hero-h" class="lines"><span class="ln">Drive in.</span><span class="ln">Drop off.</span><span class="ln"><span class="g">We sort it.</span></span></h1>
        <p class="lede">Geelong's undercover transfer station and recycling centre. ${SITE.facility.area} under one roof, ${SITE.facility.streams} material streams, open six days a week.</p>
        <div class="hero-ctas">
          <a class="btn" href="#finder">What can I bring?${icon('down')}</a>
          <a class="btn ghost" href="#cost">Price my load</a>
        </div>
        <div class="hero-facts">
          <div><b>${SITE.facility.area}</b><span>under cover</span></div>
          <div><b>${SITE.facility.streams}</b><span>material streams</span></div>
          <div><b>8</b><span>items free to drop off</span></div>
          <div><b>10%</b><span>off for locals</span></div>
        </div>
      </div>
      <aside class="today" aria-label="Opening hours today">
        <h3>Today</h3>
        <div class="big" data-status-big>Open Mon–Sat</div>
        <div class="sub" data-status-sub>${HOURS.label}</div>
        <dl>
          <dt>Address</dt><dd>${SITE.address.line1}, North Geelong<br><span class="small">${SITE.address.note}</span></dd>
          <dt>Phone</dt><dd><a href="${SITE.phoneHref}">${SITE.phone}</a></dd>
          <dt>Sunday</dt><dd>Closed</dd>
        </dl>
        <a class="btn" href="${SITE.address.directions}" target="_blank" rel="noopener">${icon('pin')}Get directions</a>
      </aside>
    </div>
  </div>
</section>

${finder({ n: '01' })}
${estimator({ n: '02' })}
${freeGrid({ n: '03' })}
${floorWalk({ n: '04' })}
${journey({ n: '05' })}
${visitSteps({ n: '06' })}

<section class="sec" aria-labelledby="num-h">
  <div class="wrap">
    ${bay('07')}
    <div class="sec-head split">
      <div><span class="kicker">Built for it</span><h2 id="num-h" class="lines" style="margin-top:18px"><span class="ln">Not a tip.</span><span class="ln">A recovery centre.</span></h2></div>
      <p class="lede">The same site runs a mattress recycling plant, polystyrene densifying and cardboard baling, so what you drop off has somewhere to go.</p>
    </div>
    <div class="numbers">
      <div class="rv"><b>20,000</b><span>square metres under one roof, on concrete hardstand</span></div>
      <div class="rv"><b>${SITE.facility.streams}</b><span>material streams separated on site</span></div>
      <div class="rv"><b>12–30<em>k</em></b><span>mattresses recycled on site every month</span></div>
      <div class="rv"><b>50<em>%+</em></b><span>of Victoria's discarded mattresses are recycled by our group</span></div>
    </div>
    <div class="accred">${SITE.accreditations.map((a) => `<div><b>${a.code}</b><span>${a.label}${a.code === 'EPA' ? ' · ' + a.detail : ''}</span></div>`).join('')}</div>
  </div>
</section>

<section class="sec on-ink2" aria-labelledby="doors-h">
  <div class="wrap">
    ${bay('08')}
    <h2 id="doors-h" class="sr-only">Trade and collection services</h2>
    <div class="doors">
      <a class="door" href="${u('recycle-corporate-services/')}">
        ${img('forklift-bale', { sizes: '(max-width: 900px) 100vw, 58vw' })}
        <span class="kicker">Trade and corporate</span>
        <h3 class="h2l">Recycling for business</h3>
        <p>Bins and scheduled collections, or bring it in on a semi or B-double. E-waste handled to AS/NZS 5377, with certificates of destruction for data.</p>
        <ul><li>Cardboard</li><li>E-waste</li><li>Mattresses</li><li>Scrap metal</li><li>Pallets</li><li>Gas bottles</li></ul>
        <span class="link">Trade services${icon('arrow')}</span>
      </a>
      <div class="door plain">
        <span class="kicker">Can't bring it in?</span>
        <h3 class="h2l">We'll come to you</h3>
        <p>For bigger clean-outs or heavy items, book a collection and the crew does the lifting.</p>
        ${pickupList()}
      </div>
    </div>
  </div>
</section>

<section class="sec on-paper" aria-labelledby="com-h">
  <div class="wrap">
    ${bay('09')}
    <div class="split">
      <div>
        <span class="kicker">Freecycle</span>
        <h2 id="com-h" style="margin:18px 0 22px">If it helps someone, it isn't waste</h2>
        <p class="lede">Every week our team sets aside furniture, mattresses and homewares in good condition and passes them to charities, crisis services and transitional housing, for people starting again.</p>
        ${partnersList()}
        <p style="margin-top:26px"><a class="link" href="${u('community/')}">More about Freecycle${icon('arrow')}</a></p>
      </div>
      <div class="ph-stack">
        <figure>${img('furniture-dropoff', { sizes: '(max-width: 900px) 50vw, 25vw' })}<figcaption class="cap">${alt('furniture-dropoff')}.</figcaption></figure>
        <figure>${img('bedding', { sizes: '(max-width: 900px) 50vw, 25vw' })}<figcaption class="cap">${alt('bedding')}.</figcaption></figure>
      </div>
    </div>
    <div class="give" style="margin-top:56px">
      <div class="rv"><h3>A home again</h3><p>Furniture and homewares for people moving on from crisis, homelessness or hardship.</p></div>
      <div class="rv"><h3>Warmth in winter</h3><p>Free untreated pallets for locals to use as kindling and firewood.</p></div>
      <div class="rv"><h3>Schools and aged care</h3><p>Offcuts for craft and learning, and books, puzzles and games for aged care homes.</p></div>
    </div>
  </div>
</section>

${registerBand()}
${newsTeaser()}
`;
  return { path: '', title: 'Home', desc: `${SITE.name}: Geelong's undercover public transfer station and recycling centre. Free drop-off for whitegoods, scrap metal, cardboard and more. Open Monday to Saturday, 7:30am to 5pm.`, body, current: '' };
}
