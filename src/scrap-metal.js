// Scrap metal panel: free drop-off at the gate + free bin drop-off. Same markup/CSS as the
// standalone WordPress snippet (scrap-metal-panel.html in the project).
import { SITE, HOURS } from './data/site.js';
import { ICONS } from './icons.js';
const getPath = (n) => ICONS[n];
const ic = (n, cls = 'rngsm-ic') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${getPath(n)}</svg>`;
const body = ['Hi Recycle North Geelong,', '', "I'd like a free scrap metal bin dropped off.", '', 'Name:', 'Phone:', 'Drop-off address:', 'What metal, and roughly how much:', 'Preferred drop-off date:', 'Anything about access (gate, driveway, power lines):'].join('\n');
const mail = `mailto:${SITE.email}?subject=${encodeURIComponent('Free scrap metal bin request')}&amp;body=${encodeURIComponent(body)}`;

export const css = `
.rngsm, .rngsm * { box-sizing: border-box; }
.rngsm { --g: #39ff13; --ink: #050505; --ink2: #0d0d0d; --ink3: #161616; --line: rgba(255,255,255,.14); --mute: #a7a7a2; --soft: #d6d6d1;
  container-type: inline-size; font-family: 'Archivo', 'Arial Narrow', Arial, sans-serif; color: #fff; line-height: 1.5; -webkit-font-smoothing: antialiased; margin: 0 auto; max-width: 1320px; scroll-margin-top: 110px; }
.rngsm p { margin: 0; }
.rngsm-card { background: var(--ink3); border: 1px solid var(--line); border-radius: 4px; overflow: hidden; }
.rngsm-top { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); align-items: stretch; }
.rngsm-top > * { min-width: 0; }
.rngsm-intro { padding: clamp(24px, 5cqi, 56px) clamp(24px, 5cqi, 56px) clamp(20px, 3cqi, 36px); align-self: center; }
.rngsm-kicker { display: flex; align-items: center; gap: .6em; color: var(--g); font-stretch: 110%; font-weight: 800; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; }
.rngsm-kicker::before { content: ''; width: 22px; height: 3px; background: currentColor; flex: none; }
.rngsm-h { font-family: inherit; color: #fff; font-stretch: 125%; font-weight: 900; text-transform: uppercase; line-height: .95; letter-spacing: 0; font-size: clamp(30px, 4.6cqi, 56px); margin: 14px 0 16px; padding: 0; }
.rngsm-h span { color: var(--g); }
.rngsm-lede { font-size: clamp(17px, 1.9cqi, 20px); color: var(--soft); max-width: 44ch; }
.rngsm-gal { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px; background: var(--ink); margin: 0; align-self: stretch; }
.rngsm-tile { position: relative; margin: 0; overflow: hidden; aspect-ratio: 4 / 3; background: var(--ink); }
.rngsm-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; max-width: none; margin: 0; border: 0; border-radius: 0; box-shadow: none; }
.rngsm-tile figcaption { position: absolute; left: 10px; bottom: 10px; right: 10px; display: flex; }
.rngsm-tile figcaption span { background: rgba(5,5,5,.86); color: #fff; font-stretch: 112%; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: .06em; line-height: 1.25; padding: 6px 9px; border-radius: 2px; border-left: 3px solid var(--g); }
.rngsm-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; padding: 0 clamp(16px, 3cqi, 32px) clamp(16px, 3cqi, 32px); margin-top: clamp(16px, 3cqi, 32px); }
.rngsm-opt { display: flex; flex-direction: column; background: var(--ink2); border: 2px solid var(--g); border-radius: 4px; padding: clamp(20px, 3cqi, 32px); min-width: 0; }
.rngsm-opt-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.rngsm-opt-no { font-stretch: 110%; font-weight: 800; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute); }
.rngsm-opt-ic { width: 44px; height: 44px; border-radius: 4px; background: var(--ink3); border: 1px solid var(--line); display: grid; place-items: center; color: var(--g); flex: none; }
.rngsm-opt-ic .rngsm-ic { width: 26px; height: 26px; }
.rngsm-free { display: inline-block; align-self: flex-start; background: var(--g); color: var(--ink); font-stretch: 125%; font-weight: 900; text-transform: uppercase; font-size: clamp(26px, 3.4cqi, 38px); line-height: 1; padding: 7px 12px 5px; border-radius: 2px; }
.rngsm-opt-h { font-family: inherit; color: #fff; font-stretch: 125%; font-weight: 900; text-transform: uppercase; line-height: 1; font-size: clamp(22px, 2.8cqi, 30px); margin: 14px 0 10px; padding: 0; letter-spacing: 0; }
.rngsm-opt-sub { font-stretch: 112%; font-weight: 800; text-transform: uppercase; font-size: 13px; letter-spacing: .08em; color: var(--g); margin-bottom: 12px !important; }
.rngsm-opt p.rngsm-opt-txt { font-size: 16px; color: var(--soft); margin-bottom: 16px; }
.rngsm-list { list-style: none !important; margin: 0 0 20px !important; padding: 0 !important; display: grid; gap: 10px; }
.rngsm-list li { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 10px; align-items: start; font-size: 15px; color: var(--soft); margin: 0; list-style: none; line-height: 1.45; }
.rngsm-list li::before, .rngsm-list li::marker { content: none; }
.rngsm-list li b { color: #fff; }
.rngsm-list .rngsm-ic { width: 22px; height: 22px; color: var(--g); margin-top: 1px; }
.rngsm-n { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--g); color: var(--g); display: grid; place-items: center; font-weight: 900; font-size: 13px; line-height: 1; }
.rngsm-opt-foot { margin-top: auto; display: flex; flex-wrap: wrap; gap: 10px; }
.rngsm-btn { display: inline-flex; align-items: center; justify-content: center; gap: .6em; min-height: 52px; padding: 0 22px; background: var(--g); color: var(--ink) !important; border: 2px solid var(--g); border-radius: 4px; font-stretch: 112%; font-weight: 800; font-size: 15px; letter-spacing: .04em; text-transform: uppercase; text-decoration: none !important; transition: transform .2s; line-height: 1.2; text-align: center; }
.rngsm-btn:hover { transform: translateY(-2px); }
.rngsm-btn.ghost { background: transparent; color: #fff !important; border-color: rgba(255,255,255,.3); }
.rngsm-btn.ghost:hover { border-color: #fff; }
.rngsm-btn .rngsm-ic { width: 20px; height: 20px; }
.rngsm-note { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--mute); padding: 0 clamp(16px, 3cqi, 32px) clamp(18px, 3cqi, 28px); }
.rngsm-note .rngsm-ic { width: 18px; height: 18px; flex: none; color: var(--g); }
.rngsm-ic { display: block; flex: none; }
@container (max-width: 820px) {
  .rngsm-top { grid-template-columns: minmax(0, 1fr); }
  .rngsm-gal { order: -1; }
  .rngsm-opts { grid-template-columns: minmax(0, 1fr); }
  .rngsm-h { font-size: clamp(28px, 8cqi, 52px); }
}
@container (max-width: 480px) {
  .rngsm-btn { flex: 1 1 100%; white-space: normal; }
  .rngsm-free { font-size: 30px; }
  .rngsm-tile figcaption { left: 6px; right: 6px; bottom: 6px; }
  .rngsm-tile figcaption span { font-size: 10px; padding: 4px 7px; letter-spacing: .04em; }
}`.trim();

export const SCRAP_EXAMPLES = [
  ['scrap-steel-offcuts', 'Steel and iron offcuts'],
  ['scrap-roofing-fencing', 'Roofing iron and fencing'],
  ['scrap-machinery', 'Old machinery and car parts'],
  ['scrap-nonferrous', 'Copper, brass and aluminium'],
];

// imgFor(name) returns an <img> tag for one example photo.
export function markup(imgFor) {
  const tiles = SCRAP_EXAMPLES.map(([n, label]) => `<figure class="rngsm-tile">${imgFor(n)}<figcaption><span>${label}</span></figcaption></figure>`).join('');
  return `<section class="rngsm" id="scrap-metal" aria-labelledby="rngsm-h">
  <div class="rngsm-card">
    <div class="rngsm-top">
      <div class="rngsm-intro">
        <p class="rngsm-kicker">Scrap metal recycling</p>
        <h2 class="rngsm-h no-fit" id="rngsm-h">Got scrap metal?<br><span>It's free.<br>Two ways.</span></h2>
        <p class="rngsm-lede">Bring it to us and drop it off for free. Or, if you've got too much for a ute or trailer, we'll drop a bin off to you for free.</p>
      </div>
      <div class="rngsm-gal">${tiles}</div>
    </div>
    <div class="rngsm-opts">
      <div class="rngsm-opt">
        <div class="rngsm-opt-head"><span class="rngsm-opt-no">Option 1</span><span class="rngsm-opt-ic">${ic('car')}</span></div>
        <span class="rngsm-free">Free</span>
        <h3 class="rngsm-opt-h">Bring it in</h3>
        <p class="rngsm-opt-sub">Free scrap metal drop-off</p>
        <p class="rngsm-opt-txt">Drive in, unload at the metals area and drive out. No charge for scrap metal.</p>
        <ul class="rngsm-list">
          <li>${ic('pin')}<span><b>${SITE.address.line1}, North Geelong</b><br>${SITE.address.note}</span></li>
          <li>${ic('clock')}<span><b>${HOURS.label.replace(':00pm', 'pm').replace(' – ', '&nbsp;–&nbsp;')}</b><br>Fully undercover</span></li>
          <li>${ic('check')}<span>Steel, iron, aluminium, copper and other clean scrap metal</span></li>
        </ul>
        <div class="rngsm-opt-foot">
          <a class="rngsm-btn" href="${SITE.address.directions}" target="_blank" rel="noopener">${ic('pin')}Get directions</a>
        </div>
      </div>
      <div class="rngsm-opt">
        <div class="rngsm-opt-head"><span class="rngsm-opt-no">Option 2</span><span class="rngsm-opt-ic">${ic('truck')}</span></div>
        <span class="rngsm-free">Free</span>
        <h3 class="rngsm-opt-h">We bring a bin</h3>
        <p class="rngsm-opt-sub">Free bin drop-off for big loads</p>
        <p class="rngsm-opt-txt">For shed and farm clean-ups, old machinery, fencing and roofing iron, workshops, and demolition or renovation jobs.</p>
        <ul class="rngsm-list">
          <li><b class="rngsm-n">1</b><span><b>We drop off a bin</b> at your home, farm, workshop or job site.</span></li>
          <li><b class="rngsm-n">2</b><span><b>You fill it</b> at your own pace. Scrap metal only.</span></li>
          <li><b class="rngsm-n">3</b><span><b>We collect it</b> when you call to say it's full.</span></li>
        </ul>
        <div class="rngsm-opt-foot">
          <a class="rngsm-btn" href="${SITE.phoneHref}">${ic('call')}Call ${SITE.phone}</a>
          <a class="rngsm-btn ghost" href="${mail}">Request a bin${ic('arrow')}</a>
        </div>
      </div>
    </div>
    <p class="rngsm-note">${ic('info')}<span>Scrap metal only in the bins. We'll confirm bin size and timing when you get in touch.</span></p>
  </div>
</section>`;
}

