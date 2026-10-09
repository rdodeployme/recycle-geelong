import { SITE } from '../data/site.js';
import { u, img, icon, bay, alt } from '../lib.js';
import { finder, estimator, freeGrid, journey, visitSteps, registerBand, partnersList, jimsPanel, dealsSection, whyStrip, heroVideo, marquee, photoRun, scale, tourDialog } from '../components.js';

export function home() {
  const body = `
${heroVideo()}
${whyStrip()}
${finder({ n: '01' })}
${estimator({ n: '02' })}
${freeGrid({ n: '03' })}
<section class="sec on-ink2" aria-labelledby="biz-h">
  <div class="wrap">
    ${bay('04')}
    <a class="door biz-door" href="${u('recycle-corporate-services/')}">
      ${img('forklift-bale', { sizes: '100vw' })}
      <span class="kicker">Trade and corporate</span>
      <h2 id="biz-h" class="h2l">Recycling for business</h2>
      <p>Scheduled collections and on-site bins, or bring it in on a semi. E-waste to AS/NZS 5377. All trades and businesses save ${SITE.discount.trade}% on every waste type.</p>
      <ul><li>Cardboard</li><li>E-waste</li><li>Mattresses</li><li>Scrap metal</li><li>Pallets</li><li>Gas bottles</li></ul>
      <span class="link">Trade services${icon('arrow')}</span>
    </a>
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
