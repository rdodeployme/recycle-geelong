import { SITE } from '../data/site.js';
import { u, img, icon, bay, alt } from '../lib.js';
import { finder, estimator, freeGrid, journey, visitSteps, registerBand, partnersList, jimsPanel, dealsSection, whyStrip, notATip, heroVideo, marquee, photoRun, scale, tourDialog } from '../components.js';

export function home() {
  const body = `
${heroVideo()}
${whyStrip()}
${notATip()}
${finder({ n: '01' })}
${estimator({ n: '02' })}
${freeGrid({ n: '03' })}
<section class="sec on-ink2" aria-labelledby="biz-h">
  <div class="wrap">
    ${bay('04')}
    <div class="door biz-door">
      ${img('forklift-bale', { sizes: '100vw' })}
      <div class="biz-in">
        <div class="biz-l">
          <span class="kicker">Built for trade. Equipped for business.</span>
          <h2 id="biz-h">Trade &amp;<br>Commercial<br>Services</h2>
          <ul class="trade-pills"><li>${icon('tag')}${SITE.discount.trade}% trade discount</li><li>${icon('hand')}Assisted unloading</li><li>${icon('truck')}Commercial vehicle access</li></ul>
          <p class="biz-strap">Drive in. Unload. Recycle. Drive out.</p>
          <a class="btn" href="${u('recycle-corporate-services/')}">Trade &amp; commercial services${icon('arrow')}</a>
        </div>
        <div class="biz-r">
          <p>Recycle North Geelong offers a dedicated Trade &amp; Commercial Recycling Service, providing trade customers with a ${SITE.discount.trade}% discount on standard rates, assisted unloading and purpose-built facilities designed to make recycling faster, easier and more cost-effective.</p>
          <p>Our undercover, all-weather facility accommodates a wide range of commercial vehicles, including utes, trailers, tray trucks, tautliners, tipping trailers, tip trucks, skip bin trucks and hook bin trucks.</p>
          <p>With experienced operators and specialised equipment on site, we provide forklift-assisted unloading for palletised and bulky commercial loads, while our excavators can efficiently unload large volumes of green waste and other suitable bulk materials.</p>
          <p>Our dedicated trade unloading areas allow contractors, builders, landscapers, transport operators and commercial businesses to unload efficiently, minimising downtime and getting vehicles back on the road sooner.</p>
        </div>
      </div>
    </div>
    ${jimsPanel()}
  </div>
</section>

${visitSteps({ n: '05' })}

<section class="sec on-ink2" aria-labelledby="col-h">
  <div class="wrap">
    ${bay('06')}
    <div class="collect">
      <div>
        <span class="kicker">At-home collection</span>
        <h2 id="col-h" class="col-h">Can't bring&nbsp;it&nbsp;in?<br><span class="g">We'll come to you.</span></h2>
        <p class="lede">Recycle North Geelong collects from your home. Bigger clean-out or heavy items? Book a collection and our crew does the lifting and loading.</p>
        <div class="btns"><a class="btn" href="${SITE.links.bookCollection}">Book a collection${icon('arrow')}</a></div>
      </div>
      <div class="pickups">
        <a class="pickup" href="${SITE.links.bookCollection}"><span><b>Rubbish and junk collection</b><span>Our crew does the lifting and loading.</span></span>${icon('arrow')}</a>
        <a class="pickup" href="${SITE.links.bookCollection}"><span><b>House and garage clean-outs</b><span>Bigger jobs, sorted and recycled.</span></span>${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>

${dealsSection({ n: '07' })}

${registerBand()}
${tourDialog()}
`;
  return { path: '', title: 'Home', desc: `${SITE.name}: Geelong's undercover public transfer station and recycling centre. Free drop-off for whitegoods, scrap metal, cardboard and more. Open Monday to Saturday, 7:30am to 4pm.`, body, current: '' };
}
