// Line icons drawn for this site: 24×24 grid, 1.75 stroke, round joins.
// Rendered once as an inline sprite; used with <svg><use href="#i-name"/></svg>.
const I = {
  bin: '<path d="M6 7h12l-1.2 13H7.2z"/><path d="M5 7h14"/><path d="M9 4h6l1 3H8z"/><circle cx="8.5" cy="20.5" r="1.3"/>',
  car: '<path d="M3 15v-3l2-5h11l3 5h2v3z"/><path d="M5.5 12h13"/><circle cx="7" cy="16.5" r="1.8"/><circle cx="17" cy="16.5" r="1.8"/>',
  wagon: '<path d="M2.5 15v-3.5L5 7h14l2.5 4.5V15z"/><path d="M5 11.5h16"/><path d="M12 7v4.5"/><circle cx="7" cy="16.5" r="1.8"/><circle cx="17" cy="16.5" r="1.8"/>',
  ute: '<path d="M2.5 15v-3l2-4h6v4h11v3z"/><path d="M10.5 12V8"/><circle cx="6.5" cy="16.5" r="1.8"/><circle cx="17.5" cy="16.5" r="1.8"/>',
  trailer: '<path d="M4 9h13v6H4z"/><path d="M17 13h4"/><path d="M6 9V6.5h9V9"/><circle cx="10.5" cy="17" r="2"/>',
  truck: '<path d="M2.5 6h11v10h-11z"/><path d="M13.5 9h4l3 3.5V16h-7"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>',
  sofa: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/><path d="M5 17v2M19 17v2"/>',
  mattress: '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M3 12h18"/><path d="M7.5 8v8M12 8v8M16.5 8v8" stroke-dasharray="1.6 1.6"/>',
  fridge: '<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M6 10h12"/><path d="M9 6v2M9 13v3"/>',
  washer: '<rect x="4.5" y="3" width="15" height="18" rx="1.5"/><path d="M4.5 7h15"/><circle cx="12" cy="14" r="4"/><circle cx="7.5" cy="5" r=".4"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="1"/><path d="M9 21h6M12 17v4"/>',
  laptop: '<rect x="4" y="5" width="16" height="10.5" rx="1"/><path d="M2 19h20l-1.5-3.5h-17z"/>',
  heater: '<rect x="7" y="3" width="10" height="16" rx="5"/><path d="M10 19v2.5M14 19v2.5M10 9h4"/><circle cx="12" cy="13.5" r="1.6"/>',
  can: '<path d="M7 6.5c0-1.4 2.2-2.5 5-2.5s5 1.1 5 2.5v11c0 1.4-2.2 2.5-5 2.5s-5-1.1-5-2.5z"/><path d="M7 6.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5M7 10h10"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  tyre: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 3.5v4.5M12 16v4.5M3.5 12H8M16 12h4.5"/>',
  gas: '<path d="M8 8a4 4 0 0 1 8 0v12H8z"/><path d="M10 4h4M12 2.5V4"/><path d="M8 12h8"/>',
  paint: '<path d="M5 7h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M5 7c0-2 3.1-3 7-3s7 1 7 3"/><path d="M9 4.5C9 3 13 2 15 4"/><path d="M12 7v4"/>',
  battery: '<rect x="3" y="7" width="16" height="10" rx="1.5"/><path d="M19 10h2v4h-2"/><path d="M7 12h4M9 10v4"/><path d="M14 12h2"/>',
  box: '<path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/><path d="M7.5 6l9 4"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l8-8"/>',
  brick: '<rect x="3" y="5" width="18" height="14"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19"/>',
  metal: '<path d="M3 17l4-10h10l4 10z"/><path d="M7 7l2 10M17 7l-2 10"/>',
  poly: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/><circle cx="8" cy="11.5" r=".6"/><circle cx="16" cy="11.5" r=".6"/><circle cx="12" cy="7.5" r=".6"/>',
  oil: '<path d="M12 3c3 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-6.5 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
  shirt: '<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
  solar: '<path d="M4 6h16l-2 10H6z"/><path d="M4.8 11h14.4M9.3 6l-.8 10M14.7 6l.8 10"/><path d="M12 16v4M9 20h6"/>',
  ban: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  call: '<path d="M5 4h4l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  down: '<path d="M12 4v15M6 13l6 6 6-6"/>',
  check: '<path d="M4.5 12.5l4.5 4.5 10.5-10.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  hand: '<path d="M4 14h3l4 2h4a1.5 1.5 0 0 0 0-3h-3"/><path d="M7 21H4v-7"/><path d="M15 13l4-2a1.5 1.5 0 0 1 1.5 2.5L14 18.5 7 18"/><path d="M14.5 4.5a2.3 2.3 0 0 1 3.3 0 2.3 2.3 0 0 1 3.2 3.2L17.8 11l-3.3-3.3a2.3 2.3 0 0 1 0-3.2z"/>',
  building: '<path d="M3 21V9l6-3v15M9 21V3h12v18M3 21h18"/><path d="M13 7h4M13 11h4M13 15h4"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v6M12 7.5v.5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  sort: '<path d="M4 6h10M4 12h7M4 18h4"/><path d="M17 5v14M14 16l3 3 3-3"/>',
};

export const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${Object.entries(I)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`)
  .join('')}</svg>`;

export const icon = (name, cls = 'ic') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// category → icon for the item finder
export const CAT_ICON = {
  Whitegoods: 'fridge', Metal: 'metal', Packaging: 'box', 'E-waste': 'tv', Batteries: 'battery',
  Furniture: 'sofa', Mattresses: 'mattress', Household: 'bin', Garden: 'leaf', Building: 'brick',
  Liquids: 'oil', Gas: 'gas', Tyres: 'tyre', 'Not accepted': 'ban',
};
