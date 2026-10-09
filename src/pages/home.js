import { SITE } from '../data/site.js';
import { u, img, icon, bay, alt } from '../lib.js';
import { finder, estimator, freeGrid, journey, visitSteps, registerBand, pickupList, partnersList, heroVideo, marquee, photoRun, scale, tourDialog } from '../components.js';

export function home() {
  const body = `
${heroVideo()}
${finder({ n: '01' })}
${estimator({ n: '02' })}
${freeGrid({ n: '03' })}
${visitSteps({ n: '04' })}

<section class="sec on-ink2" aria-labelledby="doors-h">
  <div class="wrap">
    ${bay('05')}
    <h2 id="doors-h" class="sr-only">Trade and collection services</h2>
    <div class="doors">
      <a class="door" href="${u('recycle-corporate-services/')}">
        ${img('forklift-bale', { sizes: '(max-width: 900px) 100vw, 58vw' })}
        <span class="kicker">Trade and corporate</span>
        <h3 class="h2l">Recycling for business</h3>
        <p>Scheduled collections and on-site bins, or bring it in on a semi. E-waste to AS/NZS 5377.</p>
        <ul><li>Cardboard</li><li>E-waste</li><li>Mattresses</li><li>Scrap metal</li><li>Pallets</li><li>Gas bottles</li></ul>
        <span class="link">Trade services${icon('arrow')}</span>
      </a>
      <div class="door plain">
        <span class="kicker">Can't bring it in?</span>
        <h3 class="h2l">We'll come to you</h3>
        <p>Bigger clean-out or heavy items? Book a collection and the crew does the lifting.</p>
        ${pickupList()}
      </div>
    </div>
  </div>
</section>

${registerBand()}
${tourDialog()}
`;
  return { path: '', title: 'Home', desc: `${SITE.name}: Geelong's undercover public transfer station and recycling centre. Free drop-off for whitegoods, scrap metal, cardboard and more. Open Monday to Saturday, 7:30am to 5pm.`, body, current: '' };
}
