import { SITE, HOURS } from './data/site.js';
import { sprite } from './icons.js';
import { u, esc, icon } from './lib.js';

export const NAV = [
  ['price-list/', 'Prices'],
  ['what-we-take/', 'What we take'],
  ['our-location/', 'Hours & location'],
  ['recycling-matters/', 'After you tip'],
  ['recycle-corporate-services/', 'Trade'],
  ['community/', 'Community'],
  ['about-us/', 'About'],
];

const INDEX = process.env.INDEX === '1';

function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RecyclingCenter',
    name: SITE.name,
    url: SITE.url,
    telephone: '+61460555222',
    email: SITE.email,
    image: SITE.url + '/img/hall-hero-1280.webp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.line1,
      addressLocality: 'North Geelong',
      addressRegion: 'VIC',
      postalCode: '3215',
      addressCountry: 'AU',
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:30', closes: '16:00',
    }],
    sameAs: Object.values(SITE.social),
  };
}

export function layout({ path: p, title, desc, body, current = '', ogImage = 'img/og-default.jpg', journey = false, ld = null }) {
  const fullTitle = p === '' ? `${SITE.name} | Transfer station and recycling centre, Geelong` : `${title} | ${SITE.name}`;
  const navLinks = NAV.map(([href, label]) => `<a href="${u(href)}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const mobile = NAV.map(([href, label]) => `<a class="m" href="${u(href)}">${label}${icon('arrow')}</a>`).join('');
  const notice = (SITE.notices || []).map((n) => `<div class="notice-bar" data-from="${n.from}" data-to="${n.to}" hidden>${esc(n.text)}</div>`).join('');
  return `<!doctype html>
<html lang="en-AU" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${INDEX ? '' : '<meta name="robots" content="noindex, nofollow">'}
<link rel="canonical" href="${SITE.url}/${p}">
<meta name="theme-color" content="#050505">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE.url}/${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u('img/favicon.png')}" type="image/png">
<link rel="preload" href="${u('fonts/archivo.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${u('assets/main.css')}">
<script>document.documentElement.classList.replace('no-js','js');window.__BASE=${JSON.stringify(u(''))};</script>
<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body class="${p === '' ? 'home' : 'inner'}">
${sprite}
<a class="sr-only" href="#main">Skip to content</a>
${notice}
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="${u('')}" aria-label="${SITE.name} home"><img src="${u('img/logo.webp')}" width="561" height="313" alt="Recycle North Geelong"></a>
    <nav class="nav" aria-label="Main">${navLinks}</nav>
    <div class="head-right">
      <span class="status" data-status><i></i><span data-status-text>${HOURS.short}</span></span>
      <a class="btn sm" href="${SITE.address.directions}" target="_blank" rel="noopener">${icon('pin')}Directions</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">${icon('menu')}</button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile" data-open="false">
  ${mobile}
  <div class="m-foot">
    <span class="status" data-status><i></i><span data-status-text>${HOURS.short}</span></span>
    <a class="btn" href="${SITE.address.directions}" target="_blank" rel="noopener">${icon('pin')}Get directions</a>
    <a class="btn ghost" href="${SITE.phoneHref}">${icon('call')}${SITE.phone}</a>
  </div>
</nav>
<main id="main">
${body}
</main>
${footer()}
<script type="module" src="${u('assets/main.js')}"></script>
${journey ? '' : ''}
</body>
</html>`;
}

function footer() {
  return `<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="${u('img/logo.webp')}" width="561" height="313" alt="Recycle North Geelong" loading="lazy">
        <p>A public transfer station and recycling centre in North Geelong. Drive in under cover, drop off by material, and we take it from there.</p>
        <div class="foot-epa"><img src="${u('img/epa.webp')}" width="400" height="236" alt="EPA Victoria registration R000312600" loading="lazy"></div>
      </div>
      <div>
        <h4>Visit</h4>
        <ul>
          <li>${SITE.address.line1}<br>${SITE.address.line2}</li>
          <li class="small">${SITE.address.note}</li>
          <li>${HOURS.short}</li>
          <li><a href="${SITE.address.directions}" target="_blank" rel="noopener">Get directions</a></li>
        </ul>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          ${NAV.map(([href, label]) => `<li><a href="${u(href)}">${label}</a></li>`).join('')}
          <li><a href="${u('unsorted-loads/')}">How to sort your load</a></li>
          <li><a href="${u('faq/')}">Questions</a></li>
          <li><a href="${u('tip/')}">Areas we serve</a></li>
          <li><a href="${u('news/')}">News</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><a href="${SITE.links.bookCollection}">Book a collection</a></li>
          <li><a href="${SITE.links.registerResident}">Register for a discount</a></li>
          <li><a href="${SITE.social.facebook}" target="_blank" rel="noopener">Facebook</a> · <a href="${SITE.social.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${SITE.social.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
        </ul>
      </div>
    </div>
    <div class="giant" aria-hidden="true">Love <span>not</span> landfill</div>
    <div class="foot-base">
      <span>© ${new Date().getFullYear()} ${SITE.name} · EPA Victoria registration ${SITE.epa}</span>
      <span><a href="${u('terms-and-conditions/')}">Terms and conditions</a> · <a href="${u('privacy/')}">Privacy</a></span>
    </div>
  </div>
</footer>`;
}
