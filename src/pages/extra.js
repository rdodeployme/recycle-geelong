// FAQ, terms, privacy and nearby-suburb pages.
// Facts come from data/site.js and the business's own published terms of entry
// (recycle.net.au/tc, Oct 2026). Nothing here is invented: where a fact is not
// known, the answer points people to the gate or the phone instead.
import { SITE, HOURS, VEHICLES, loadPrice } from '../data/site.js';
import { u, icon, bay, esc } from '../lib.js';
import { pageHero, registerBand } from '../components.js';

const ENTITY = 'The Trustee for Recycle Group Discretionary Trust, trading as Recycle North Geelong';
const ABN = '47 979 319 472';
const FREE = ['whitegoods', 'hot water services', 'scrap metal and aluminium', 'computers, laptops and iPads', 'TVs, LED screens and mobile phones', 'printer cartridges', 'cardboard and polystyrene (up to 0.5 m³ each)', 'up to 100 litres of decorative paint', 'car batteries'];
const councils = SITE.discountCouncils.join(', ').replace(/, ([^,]*)$/, ' and $1');

// ---------------------------------------------------------------- FAQ
export const FAQ = [
  ['Before you come', [
    ['When are you open?', `${HOURS.label}. Closed on Sundays. ${HOURS.sunday.replace(/^Closed Sundays\. /, '')}`],
    ['Do you open on public holidays?', `Public holiday hours can change. Check our <a href="${SITE.social.facebook}" target="_blank" rel="noopener">Facebook page</a> or call <a href="${SITE.phoneHref}">${SITE.phone}</a> before you head out.`],
    ['What can I bring?', `Most household, garden and trade waste, sorted into ${SITE.facility.streams} material streams. Type any item into the <a href="${u('#finder')}">item finder</a> to see if we take it, what it costs and where it goes, or see the <a href="${u('what-we-take/')}">full A to Z</a>.`],
    ['What do you not accept?', `Asbestos (or anything that might be asbestos), household and garden chemicals, fuels and solvents, medical waste, explosives and ammunition, unlabelled liquids, soil, fertilisers, unsorted mixed loads, and mixed construction and demolition waste. Unsorted building loads can go to Sycle at Fyansford. For asbestos, use a licensed asbestos removalist.`],
    ['What vehicles can I bring in?', `${VEHICLES.yes.join(', ')}. We can't take ${VEHICLES.no.map((v) => v.toLowerCase()).join(', ')}.`],
    ['Is it undercover?', `Yes. The whole drop-off area is undercover concrete, about ${SITE.facility.area}, so we're never closed for bad weather. No rain, no mess, no fuss.`],
  ]],
  ['Prices and paying', [
    ['How much will it cost?', `Loads are priced by size and by type of waste. General waste starts at $${loadPrice('bins', '30', 0)} for a 30 litre bag, and a level ute or small trailer is $${loadPrice('small', 'level', 0)}. Green waste costs less and building waste costs more. Some items such as mattresses, tyres and gas bottles are priced each. Use <a href="${u('#cost')}">Price my load</a> for an estimate, or see the <a href="${u('price-list/')}">full price list</a>. Prices include GST.`],
    ['Do I have to sort my load?', `Yes. Everything is unloaded by material at its own bay, and unsorted mixed loads aren't accepted. Keep green waste, metal, e-waste, cardboard, mattresses and general rubbish apart as you pack. <a href="${u('unsorted-loads/')}">How to sort a load</a>.`],
    ['What is free?', `${FREE.map((f, i) => (i === 0 ? f[0].toUpperCase() + f.slice(1) : f)).join(', ').replace(/, ([^,]*)$/, ' and $1')}. Conditions apply to some items.`],
    ['How do I pay?', 'By card only: debit, EFTPOS or credit. We don\'t accept cash. Payment is made in full at the gate, before you unload.'],
    ['How is my load checked?', 'An attendant looks over your load at the gate, confirms the price and takes payment before you unload. Declare every item that is priced separately, such as tyres, mattresses and gas bottles.'],
    ['Is there a discount for locals and trades?', `Yes. Residents and locals in ${councils} can register once and get ${SITE.discount.resident}% off. All trades and businesses can register for ${SITE.discount.trade}% off every waste type, including general and building waste. <a href="${SITE.links.registerResident}">Register as a resident</a> or <a href="${SITE.links.registerTrade}">register a trade or business</a>. Valid identification may be required for some transactions.`],
  ]],
  ['On site', [
    ['What should I wear?', 'Enclosed shoes are a must. Bare feet, thongs and sandals are not allowed. Staff may ask you to wear a high-visibility vest in some areas.'],
    ['Can my kids or dog get out of the car?', 'No. Children must be supervised and stay in the vehicle, and animals must be secured in the vehicle at all times.'],
    ['Will someone help me unload?', `Yes. Our staff help you unload, and we're Victoria's only transfer station and recycling centre that does. Not sure where something goes? Ask the team on the floor. For a bigger job, <a href="${SITE.links.bookCollection}">book a collection</a> and our crew does the lifting and loading.`],
    ['Can I take things home from the tip?', 'No. Scavenging is not allowed. Good furniture and homewares go to charity partners through our <a href="' + u('community/') + '">Freecycle program</a>.'],
    ['Do you record my number plate?', `Yes. Vehicle registrations are recorded for compliance and operational reasons, and security cameras operate across the site. See our <a href="${u('privacy/')}">privacy policy</a>.`],
  ]],
  ['After you tip', [
    ['What happens to my rubbish?', `It's separated by material and sent for recovery: mattresses are dismantled, polystyrene is densified, cardboard is baled. What's left is shredded before it goes to landfill. <a href="${u('recycling-matters/')}">Follow it through</a>.`],
    ['Can you pick it up instead?', `Yes. Recycle North Geelong has an at-home collection service. <a href="${SITE.links.bookCollection}">Book a collection</a> and our crew does the lifting and loading.`],
    ['I have a business. Can you help?', `Yes: scheduled collections, on-site bins and bulk drop-offs. Call ${SITE.trade.contact} on <a href="${SITE.trade.phoneHref}">${SITE.trade.phone}</a> or see <a href="${u('recycle-corporate-services/')}">trade services</a>.`],
  ]],
];

const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

export function faq() {
  const ld = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.flatMap(([, qs]) => qs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } }))),
  };
  const body = `${pageHero({ crumbs: 'Questions', kicker: 'FAQ', title: 'Questions people ask', lede: 'Quick answers before you load up. Still stuck? Call ' + SITE.phone + '.' })}
<section class="sec on-paper">
  <div class="wrap faq-wrap">
    ${FAQ.map(([g, qs], gi) => `<div class="faq-group">
      ${bay(String(gi + 1).padStart(2, '0'))}
      <h2 class="faq-h">${g}</h2>
      ${qs.map(([q, a]) => `<details class="faq"><summary>${q}${icon('plus')}</summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}
    </div>`).join('')}
  </div>
</section>
${registerBand()}`;
  return { path: 'faq/', title: 'Questions', desc: 'Opening hours, what we take, prices, paying by card, resident and trade discounts and site rules at Recycle North Geelong.', body, current: '', ld };
}

// ---------------------------------------------------------------- terms (ported from the published terms of entry)
const TERMS = [
  ['Liability and damage waiver', null, [
    `${SITE.name} takes no responsibility for any damage to vehicles, equipment, property or persons whilst on site. By entering this site you agree to indemnify ${SITE.name} against any injury, loss, damage or accident that may occur whilst on the premises. All visitors are responsible for ensuring their vehicle is suitable for the conditions. Visitors use the facility at their own risk. Personal protective equipment is recommended.`,
  ]],
  ['Safety', 1, [
    'Full adherence to all traffic rules and displayed speed limits is mandatory.',
    'All vehicles must give way to site machinery. Strictly no entry to areas where equipment is working or otherwise signed.',
    'Compliance with signage and requests of staff is mandatory at all times.',
    'Suitable enclosed footwear is mandatory. Bare feet, thongs and sandals are not permitted.',
    'High visibility vests may be required in some areas and at the direction of facility staff.',
    'Children must be supervised and remain in the vehicle at all times.',
    'Animals must be secured in the vehicle at all times.',
    'Smoking, vaping and e-cigarettes are strictly prohibited on site.',
    'Waste must be safely transferred from the vehicle to bins. Visitors must be on level ground before placing waste in bins. No throwing of waste or unloading of trailers is allowed.',
  ]],
  ['Waste and recycling disposal', 10, [
    'Vehicles are not permitted to unload until an attendant has inspected your load and relevant payments have been made per the payment terms below.',
    'Waste and recyclables may only be disposed of in approved locations. Management reload fees apply for any waste incorrectly declared or disposed of in an incorrect area.',
    'Unlawful entry, unauthorised scavenging and unauthorised disposal of waste is prohibited.',
    'Any waste not clearly identified on site signage cannot be accepted at this site (examples include explosives, biowaste, asbestos, chemical and radioactive waste).',
    'All drop-offs must comply with local environmental regulations. Loads must be appropriately secured and must not contain prohibited waste.',
  ]],
  ['Payments', 15, [
    'All prices are as advertised at the point of entry and advised by facility staff prior to entry. Prices are inclusive of GST and subject to change without notice.',
    'All payable items (including tyres, mattresses and gas bottles) must be declared and paid at the time of entry.',
    'Payments are accepted by card only (debit, EFTPOS or credit). No cash is accepted at our facilities.',
    'Payments must be made in full prior to entry to the facility.',
  ]],
  ['General terms of entry', 19, [
    'Maintain reasonable community dress standards.',
    'Respectful behaviour towards staff and visitors is expected at all times. Offensive and abusive language and/or aggressive behaviour will not be tolerated.',
    'Valid identification may be required for certain transactions.',
    'Surveillance cameras are in use throughout the facility for the safety and security of all staff and visitors.',
    'Vehicle registrations are recorded for compliance and operations purposes. This information may be used for tracking drop-offs, confirming service use or compliance with local, state and federal law.',
    `${SITE.name} reserves the right to refuse service to any individual or vehicle not complying with these terms and conditions. Non-compliant visitors may be asked to leave the premises immediately.`,
  ]],
];

export function terms() {
  const body = `${pageHero({ crumbs: 'Terms and conditions', kicker: 'Terms of entry', title: 'Terms and conditions of entry' })}
<section class="sec">
  <div class="wrap">
    <div class="article legal">
      <p class="small">${ENTITY}. ABN ${ABN}. Head office: ${SITE.address.line1}, ${SITE.address.line2}.</p>
      <p class="lede" style="max-width:none">By entering our facility, engaging with our service, accepting a quotation or making a payment, you agree to be bound by the terms and conditions below.</p>
      ${TERMS.map(([h, start, items]) => `<h2>${h}</h2>${start ? `<ol start="${start}">${items.map((t) => `<li>${t}</li>`).join('')}</ol>` : items.map((t) => `<p>${t}</p>`).join('')}`).join('\n')}
      <p class="small" style="margin-top:48px">See also our <a href="${u('privacy/')}">privacy policy</a>.</p>
    </div>
  </div>
</section>`;
  return { path: 'terms-and-conditions/', title: 'Terms and conditions', desc: `Terms and conditions of entry for ${SITE.name}: safety, disposal, payment (card only) and general terms.`, body, current: '' };
}

// ---------------------------------------------------------------- privacy (draft for sign-off)
export function privacy() {
  const sec = (h, ps) => `<h2>${h}</h2>${ps.map((p) => (p.startsWith('<') ? p : `<p>${p}</p>`)).join('')}`;
  const body = `${pageHero({ crumbs: 'Privacy', kicker: 'Privacy policy', title: 'How we handle your information' })}
<section class="sec">
  <div class="wrap">
    <div class="article legal">
      <p class="draft-note">Draft for review. This policy has not yet been approved by ${SITE.name}.</p>
      <p class="lede" style="max-width:none">This policy explains what personal information ${SITE.name} collects, why, and how you can access or correct it. We handle personal information in line with the Australian Privacy Principles in the <i>Privacy Act 1988</i> (Cth).</p>
      <p class="small">${ENTITY}. ABN ${ABN}. ${SITE.address.line1}, ${SITE.address.line2}.</p>
      ${sec('What we collect', [
        '<ul><li><b>When you register</b> for the resident or trade discount: your name, contact details, address or business details, and your council area.</li><li><b>When you contact us or book a collection</b>: your name, phone number, email, address and the details of what you want collected or recycled.</li><li><b>When you visit the site</b>: your vehicle registration, and images from the security cameras that operate across the facility.</li><li><b>When you pay</b>: payments are by card at the gate. Card details are handled by our payment provider; we do not store full card numbers.</li></ul>',
      ])}
      ${sec('Why we collect it', [
        '<ul><li>To provide our services, including pricing your load, applying your discount and arranging collections.</li><li>To run the site safely and securely.</li><li>To track drop-offs, confirm use of our services and meet our obligations under local, state and federal law, including environmental and waste regulations.</li><li>To answer your enquiries.</li></ul>',
        'We do not sell your personal information.',
      ])}
      ${sec('Who we share it with', [
        `We may share information with related businesses in Recycle Group that help deliver a service you have asked for (for example, a collection), with service providers who support our operations (such as payment and IT providers), and with regulators or law enforcement where the law requires or allows it.`,
      ])}
      ${sec('This website', [
        'This website does not ask you to create an account. The location map is provided by Google Maps, which may set its own cookies when it loads. If we add website analytics, we will update this policy.',
      ])}
      ${sec('Keeping it safe', [
        'We take reasonable steps to protect personal information from misuse, loss and unauthorised access, and to destroy or de-identify it when it is no longer needed.',
      ])}
      ${sec('Access, correction and complaints', [
        `You can ask to see or correct the personal information we hold about you, or make a privacy complaint, by emailing <a href="mailto:${SITE.email}">${SITE.email}</a> or calling <a href="${SITE.phoneHref}">${SITE.phone}</a>. We will respond within a reasonable time. If you are not satisfied with our response, you can contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener">oaic.gov.au</a>.`,
      ])}
      <p class="small" style="margin-top:48px">See also our <a href="${u('terms-and-conditions/')}">terms and conditions of entry</a>.</p>
    </div>
  </div>
</section>`;
  return { path: 'privacy/', title: 'Privacy policy', desc: `How ${SITE.name} collects, uses and protects personal information.`, body, current: '' };
}

// ---------------------------------------------------------------- nearby suburbs
export const SUBURBS = [
  ['lara', 'Lara', 'Greater Geelong'],
  ['corio', 'Corio', 'Greater Geelong'],
  ['norlane', 'Norlane', 'Greater Geelong'],
  ['bell-park', 'Bell Park', 'Greater Geelong'],
  ['geelong', 'Geelong', 'Greater Geelong'],
  ['belmont', 'Belmont', 'Greater Geelong'],
  ['grovedale', 'Grovedale', 'Greater Geelong'],
  ['leopold', 'Leopold', 'Greater Geelong'],
  ['ocean-grove', 'Ocean Grove', 'Greater Geelong'],
  ['torquay', 'Torquay', 'Surf Coast'],
  ['bannockburn', 'Bannockburn', 'Golden Plains'],
  ['werribee', 'Werribee', 'Wyndham'],
];
const dirFrom = (name) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(name + ' VIC')}&destination=${encodeURIComponent(SITE.address.line1 + ' ' + SITE.address.line2)}`;

export function areasIndex() {
  const body = `${pageHero({ crumbs: 'Areas', kicker: 'Where our customers come from', title: 'Your nearest undercover tip', lede: `One site at ${SITE.address.line1}, North Geelong, open ${HOURS.short}. Locals in six council areas save ${SITE.discount.resident}%, trades ${SITE.discount.trade}%.` })}
<section class="sec on-paper">
  <div class="wrap">
    ${bay('01')}
    <div class="area-grid">${SUBURBS.map(([slug, name, c]) => `<a class="area-card" href="${u('tip/' + slug + '/')}"><b>${name}</b><span>${c} council area · ${SITE.discount.resident}% off for registered locals</span>${icon('arrow')}</a>`).join('')}</div>
    <p class="small" style="margin-top:28px">Not listed? Residents anywhere in ${councils} can register for ${SITE.discount.resident}% off. All trades and businesses get ${SITE.discount.trade}%.</p>
  </div>
</section>`;
  return { path: 'tip/', title: 'Areas', desc: `Recycle North Geelong is the undercover tip and recycling centre for Geelong, the Bellarine, Surf Coast, Golden Plains and Wyndham.`, body, current: '' };
}

export function suburbPages() {
  return SUBURBS.map(([slug, name, c]) => {
    const body = `${pageHero({
      crumbs: `<a href="${u('tip/')}">Areas</a></span><span>/</span><span>${name}`, kicker: 'Undercover tip and recycling centre',
      title: `Tip near ${name}`,
      lede: `Recycle North Geelong is an undercover public tip at ${SITE.address.line1}, North Geelong, open ${HOURS.label}.`,
      extra: `<div class="hero-ctas"><a class="btn" href="${dirFrom(name)}" target="_blank" rel="noopener">${icon('pin')}Directions from ${name}</a><a class="btn ghost" href="${u('#finder')}">What can I bring?</a></div>`,
    })}
<section class="sec on-paper">
  <div class="wrap">
    ${bay('01')}
    <div class="split" style="align-items:start">
      <div>
        <h2 class="faq-h">${name} locals save ${SITE.discount.resident}%</h2>
        <p class="lede">${name} is in the ${c} council area, so residents can register once and get <b>${SITE.discount.resident}% off every visit</b>. All trades and businesses get <b>${SITE.discount.trade}% off</b> every waste type.</p>
        <p class="btns"><a class="btn" href="${SITE.links.registerResident}">Register as a resident${icon('arrow')}</a> <a class="btn ghost" href="${SITE.links.registerTrade}">Trade or business${icon('arrow')}</a></p>
      </div>
      <div class="box">
        <h3>Before you drive over</h3>
        <ul class="ticks">
          <li>${icon('check')}<span>Open ${HOURS.label}. Closed Sundays.</span></li>
          <li>${icon('check')}<span>Pay by card at the gate. No cash.</span></li>
          <li>${icon('check')}<span>Sort your load by material before you come.</span></li>
          <li>${icon('check')}<span>Our staff help you unload. Fully undercover, never closed for weather.</span></li>
          <li>${icon('check')}<span>Enclosed shoes. Kids and pets stay in the car.</span></li>
          <li>${icon('check')}<span>No asbestos, chemicals or mixed building waste.</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    ${bay('02')}
    <h2 class="faq-h">Free to drop off</h2>
    <p class="lede" style="max-width:60ch">${FREE.map((f, i) => (i === 0 ? f[0].toUpperCase() + f.slice(1) : f)).join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p>
    <div class="hero-ctas" style="margin-top:28px"><a class="btn" href="${u('price-list/')}">Full price list${icon('arrow')}</a><a class="btn ghost" href="${u('faq/')}">Questions</a></div>
  </div>
</section>
${registerBand()}`;
    return { path: `tip/${slug}/`, title: `Tip near ${name}`, desc: `Undercover tip and recycling centre near ${name}. Free whitegoods, scrap metal and cardboard; ${name} locals save ${SITE.discount.resident}%. Open ${HOURS.short}.`, body, current: '' };
  });
}
