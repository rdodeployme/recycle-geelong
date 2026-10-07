// Single source of truth for facts used across the site.
// Everything here comes from the live recycle.net.au pages (Oct 2026) or from
// facts the business has supplied. Anything still to be confirmed is listed in
// OPEN_ITEMS.md, not on the page.

export const SITE = {
  name: 'Recycle North Geelong',
  short: 'Recycle',
  tagline: "Don't trash it, recycle it",
  url: 'https://recycle.net.au',
  phone: '0460 555 222',
  phoneHref: 'tel:0460555222',
  email: 'info@recycle.net.au',
  address: {
    line1: '116 Furner Avenue',
    line2: 'North Geelong VIC 3215',
    note: 'Behind Coates Hire',
    maps: 'https://www.google.com/maps/search/?api=1&query=116+Furner+Avenue+North+Geelong+VIC+3215',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=116+Furner+Avenue+North+Geelong+VIC+3215',
    embed: 'https://maps.google.com/maps?q=116%20Furner%20Avenue%20North%20Geelong%20VIC%203215&t=m&z=15&output=embed&iwloc=near',
  },
  epa: 'R000312600',
  social: {
    facebook: 'https://www.facebook.com/recyclenorthgeelong',
    instagram: 'https://www.instagram.com/recyclenorthgeelong/',
    tiktok: 'https://www.tiktok.com/@recyclenorthgeelong',
  },
  // Existing working pages on the current WordPress site. These keep working
  // until the forms are moved (see OPEN_ITEMS.md).
  links: {
    bookCollection: 'https://recycle.net.au/book-now/',
    registerResident: 'https://recycle.net.au/residence-register-now/',
    registerTrade: 'https://recycle.net.au/trade-commercial-register/',
    terms: 'https://recycle.net.au/tc',
    mattressPickup: 'https://themattressrecyclingcompany.com.au/',
    tourVideo: 'https://youtu.be/FOliqELWvxU',
  },
  trade: {
    contact: 'Nigel Taylor',
    title: 'Director, Corporate and Trade Recycling',
    phone: '0427 888 222',
    phoneHref: 'tel:0427888222',
  },
  facility: {
    area: '20,000 m²',
    streams: '90+',
    days: 'Six days',
  },
  discountCouncils: ['Greater Geelong', 'Queenscliff', 'Surf Coast', 'Golden Plains', 'Wyndham', 'Colac Otway'],
  accreditations: [
    { code: 'EPA', label: 'EPA Victoria registered', detail: 'R000312600' },
    { code: 'ISO 9001', label: 'Quality management', detail: 'ISO 9001:2015' },
    { code: 'ISO 14001', label: 'Environmental management', detail: 'ISO 14001:2015' },
    { code: 'ISO 45001', label: 'Health and safety', detail: 'ISO 45001:2018' },
    { code: 'AS/NZS 5377', label: 'E-waste handling', detail: 'AS/NZS 5377' },
    { code: 'NIST 800-88', label: 'Data sanitisation', detail: 'NIST 800-88' },
  ],
  // Set to a video URL (mp4) once the walkthrough video is ready; it then
  // plays above the photo walk on the homepage.
  tourVideoSrc: '',
  // Leave empty unless there is a special-hours notice to show.
  // { from: '2026-12-24', to: '2027-01-02', text: 'Holiday hours: ...' }
  notices: [],
};

// Monday = 1 ... Sunday = 0. Times are local Geelong time.
export const HOURS = {
  tz: 'Australia/Melbourne',
  days: { 1: [7.5, 17], 2: [7.5, 17], 3: [7.5, 17], 4: [7.5, 17], 5: [7.5, 17], 6: [7.5, 17], 0: null },
  label: 'Monday to Saturday, 7:30am – 5:00pm',
  short: 'Mon–Sat 7:30am–5pm',
  sunday: 'Closed Sundays. Cardboard and polystyrene can go to the City of Greater Geelong centre at 21 Slevin Street, North Geelong, on Sundays.',
};

// ---------------------------------------------------------------- prices
export const LOADS = [
  { id: 'bin120', name: 'Wheelie bin', sub: '120 litre', m3: 0.125, sorted: 19, unsorted: null, icon: 'bin' },
  { id: 'bin240', name: 'Wheelie bin', sub: '240 litre', m3: 0.25, sorted: 29, unsorted: null, icon: 'bin' },
  { id: 'boot', name: 'Car boot', sub: 'Standard boot', m3: 0.5, sorted: 49, unsorted: null, icon: 'car' },
  { id: 'wagon', name: 'Station wagon', sub: 'Wagon boot', m3: 0.75, sorted: 69, unsorted: null, icon: 'wagon' },
  { id: 'ute', name: 'Ute or 6×4 trailer', sub: 'Level load', m3: 1, sorted: 99, unsorted: 199, icon: 'ute' },
  { id: 'uteHeaped', name: 'Ute or 6×4 trailer', sub: 'Caged or heaped', m3: 1.5, sorted: 149, unsorted: 299, icon: 'trailer' },
  { id: 'large', name: '8×5 trailer', sub: 'Level load', m3: 1.5, sorted: 149, unsorted: 299, icon: 'trailer' },
  { id: 'largeHeaped', name: '8×5 trailer', sub: 'Caged or heaped', m3: 2.5, sorted: 249, unsorted: 499, icon: 'trailer' },
  { id: 'm3', name: 'Van, truck or bigger', sub: 'Charged per m³', m3: null, sorted: 99, unsorted: 199, perM3: true, icon: 'truck' },
];

export const PRICE_GROUPS = [
  {
    id: 'free', title: 'Free drop-off', note: 'Conditions apply to some items.',
    rows: [
      ['Whitegoods', 'Fridges, washing machines, ovens and similar', 'Free'],
      ['Scrap metal', 'All types, clean', 'Free'],
      ['Cardboard', 'Up to 0.5 m³, clean, dry and free of polystyrene. Over 0.5 m³ is $69 per m³', 'Free'],
      ['Polystyrene', 'Up to 0.5 m³, clean expanded polystyrene (EPS) only. Over 0.5 m³ is $69 per m³', 'Free'],
      ['Printer cartridges', 'Household and office sized', 'Free'],
      ['Selected e-waste', 'Mobile phones, TVs and LED screens', 'Free'],
      ['Paint', 'Up to 100 litres of architectural and decorative paint, in partnership with Paintback', 'Free'],
      ['Car batteries', '', 'Free'],
    ],
  },
  {
    id: 'sorted', title: 'Sorted loads', note: 'Household furniture, waste and recyclables, sorted by material.',
    rows: [
      ['Wheelie bin, 120 L', '0.125 m³', '$19'],
      ['Wheelie bin, 240 L', '0.25 m³', '$29'],
      ['Car boot', 'Standard, 0.5 m³', '$49'],
      ['Station wagon boot', 'Standard, 0.75 m³', '$69'],
      ['Ute or 6×4 trailer', 'Standard ute tray, 1 m³', '$99'],
      ['Ute or 6×4 trailer, caged or heaped', '1.5 m³', '$149'],
      ['8×5 trailer', '1.5 m³', '$149'],
      ['8×5 trailer, caged or heaped', '2.5 m³', '$249'],
      ['Vans, trailers and trucks', 'Per m³', '$99'],
    ],
  },
  {
    id: 'unsorted', title: 'Unsorted loads', note: 'Mixed household furniture, waste and recyclables. Double the sorted rate.',
    rows: [
      ['Ute or 6×4 trailer', 'Standard ute tray, 1 m³', '$199'],
      ['Ute or 6×4 trailer, caged or heaped', '1.5 m³', '$299'],
      ['8×5 trailer', '1.5 m³', '$299'],
      ['8×5 trailer, caged or heaped', '2.5 m³', '$499'],
      ['Vans, trailers and trucks', 'Per m³', '$199'],
    ],
  },
  {
    id: 'mattress', title: 'Mattresses', note: 'Priced each.',
    rows: [['Cot', '', '$10'], ['Single', '', '$29'], ['Double or queen', '', '$39'], ['King', '', '$49'], ['Latex', '', '$69']],
  },
  {
    id: 'tyres', title: 'Tyres', note: 'Priced each.',
    rows: [['Motorbike', '', '$12'], ['Car, off rim', '', '$19'], ['Car, on rim', '', '$25'], ['Light truck', '', '$44'], ['Heavy truck', '', '$59'], ['Tractor', '', 'Price on application']],
  },
  {
    id: 'liquids', title: 'Paint, oils and aerosols', note: 'Priced per litre unless shown.',
    rows: [
      ['Decorative paint over 100 L', 'The first 100 L is free', '$1 per L'],
      ['Industrial and automotive paint', 'Any volume', '$2 per L'],
      ['Motor oil', '', '$1 per L'],
      ['Coolant', '', '$3.50 per L'],
      ['Cooking oil', '', '$1 per L'],
      ['Aerosol cans', '', '$1'],
    ],
  },
  {
    id: 'gas', title: 'Gas bottles and fire extinguishers', note: 'Priced each.',
    rows: [
      ['Gas bottle, under 9 kg', '', '$15'],
      ['Gas bottle, over 9 kg', 'Call ahead before bringing large cylinders', '$25'],
      ['Fire extinguisher, under 3 kg', '', '$10'],
      ['Fire extinguisher, over 3 kg', '', '$15'],
      ['Nitrous canister, under 0.5 kg / 2 L', '', '$10'],
      ['Nitrous canister, over 0.5 kg / 2 L', '', '$20'],
    ],
  },
  {
    id: 'other', title: 'Other items', note: '',
    rows: [
      ['Green waste', 'Per m³. One m³ is a 6×4 trailer or a standard ute load', '$79'],
      ['Solar panels', 'Each', '$39'],
      ['Oily rags', 'Per 34 L bag (standard kitchen bin)', '$30'],
      ['Oil filter, small', 'Each', '$2'],
      ['Oil filter, large', 'Each', '$3'],
    ],
  },
  {
    id: 'building', title: 'Building materials', note: 'Sorted loads only.',
    rows: [
      ['Sorted building materials', 'Clean bricks, concrete, timber, tiles, PVC pipe, AC ducts, carpet, underlay, treated or laminated timber, broken furniture, roof and porcelain tiles', '$199 per m³'],
      ['Mixed construction waste', 'Not accepted. Take unsorted C&D loads to Sycle at Fyansford', 'Not accepted'],
    ],
  },
];

export const EXTRAS = [
  { id: 'mCot', label: 'Cot mattress', price: 10, group: 'Mattresses' },
  { id: 'mSingle', label: 'Single mattress', price: 29, group: 'Mattresses' },
  { id: 'mQueen', label: 'Double or queen mattress', price: 39, group: 'Mattresses' },
  { id: 'mKing', label: 'King mattress', price: 49, group: 'Mattresses' },
  { id: 'mLatex', label: 'Latex mattress', price: 69, group: 'Mattresses' },
  { id: 'tMoto', label: 'Motorbike tyre', price: 12, group: 'Tyres' },
  { id: 'tOff', label: 'Car tyre, off rim', price: 19, group: 'Tyres' },
  { id: 'tOn', label: 'Car tyre, on rim', price: 25, group: 'Tyres' },
  { id: 'tLt', label: 'Light truck tyre', price: 44, group: 'Tyres' },
  { id: 'gSmall', label: 'Gas bottle, under 9 kg', price: 15, group: 'Other items' },
  { id: 'fSmall', label: 'Fire extinguisher, under 3 kg', price: 10, group: 'Other items' },
  { id: 'solar', label: 'Solar panel', price: 39, group: 'Other items' },
];

// ---------------------------------------------------------------- where it goes
export const STREAMS = {
  mattress: 'Dismantled on site. About 30% of a mattress is steel, and 99% of that steel is recovered and baled. Foam, fabric and timber are separated.',
  cardboard: 'Flattened, baled on site and sent for paper-making.',
  poly: 'Densified on site. Expanded polystyrene is up to 98% air, so a mountain of foam becomes a dense block that can be made into new products.',
  metal: 'Separated and sent for metal recycling.',
  whitegoods: 'Gas and oil are removed safely, then the steel and other metals are separated for recycling.',
  ewaste: 'Handled to the AS/NZS 5377 e-waste standard. Metals, plastics and circuit boards are separated for recovery.',
  paint: 'Collected through Paintback, the national paint stewardship program.',
  oil: 'Collected at the waste oil station and sent for re-refining.',
  furniture: 'Good pieces go to charity and community partners through our Freecycle program. The rest is dismantled so the timber, metal and fabric can be separated.',
  green: 'Kept separate from general waste for organics processing.',
  tyres: 'Kept separate and sent for tyre recycling.',
  gas: 'Degassed safely, then the steel is recycled.',
  battery: 'Kept separate at the battery station and sent for recycling.',
  textiles: 'Kept separate for textile reuse and recovery.',
  building: 'Separated by material so bricks, concrete, timber and metal can be recovered.',
  general: 'Sorted for anything recoverable. What is left is shredded to about a quarter of its volume before it goes to landfill. Landfill last.',
  solar: 'Frames, glass and cells are separated for recovery.',
  timber: 'Separated for reuse and recovery.',
  none: '',
};

// status: free | paid | cond | no
// price: shown on the card. stream: key into STREAMS.
export const ITEMS = [
  // whitegoods + metal
  { n: 'Fridge', aka: ['refrigerator', 'freezer', 'bar fridge'], s: 'free', p: 'Free', st: 'whitegoods', c: 'Whitegoods' },
  { n: 'Washing machine', aka: ['washer', 'front loader', 'top loader'], s: 'free', p: 'Free', st: 'whitegoods', c: 'Whitegoods' },
  { n: 'Dryer', aka: ['clothes dryer', 'tumble dryer'], s: 'free', p: 'Free', st: 'whitegoods', c: 'Whitegoods' },
  { n: 'Dishwasher', aka: [], s: 'free', p: 'Free', st: 'whitegoods', c: 'Whitegoods' },
  { n: 'Oven or stove', aka: ['cooktop', 'range', 'stove'], s: 'free', p: 'Free', st: 'whitegoods', c: 'Whitegoods' },
  { n: 'Scrap metal', aka: ['steel', 'iron', 'metal'], s: 'free', p: 'Free', note: 'All types, clean.', st: 'metal', c: 'Metal' },
  { n: 'Aluminium and copper', aka: ['copper pipe', 'aluminium', 'cans'], s: 'free', p: 'Free', note: 'Clean and separated.', st: 'metal', c: 'Metal' },
  { n: 'Pool fencing', aka: ['aluminium fence', 'glass fence'], s: 'cond', p: 'By load size', note: 'Priced with your load.', st: 'metal', c: 'Metal' },
  { n: 'Hot water service', aka: ['hot water system', 'hws', 'water heater'], s: 'cond', p: 'Ask at the gate', note: 'Accepted. Priced on arrival.', st: 'metal', c: 'Metal' },
  { n: 'Air conditioner', aka: ['split system', 'aircon', 'heat pump'], s: 'cond', p: 'Ask at the gate', note: 'All types accepted. Priced on arrival.', st: 'whitegoods', c: 'Whitegoods' },
  // paper + packaging
  { n: 'Cardboard', aka: ['boxes', 'carton', 'moving boxes'], s: 'free', p: 'Free to 0.5 m³', note: 'Clean, dry and free of polystyrene. Over 0.5 m³ is $69 per m³.', st: 'cardboard', c: 'Packaging' },
  { n: 'Polystyrene', aka: ['styrofoam', 'eps', 'foam packaging', 'styro'], s: 'free', p: 'Free to 0.5 m³', note: 'Clean expanded polystyrene only, no food. Over 0.5 m³ is $69 per m³.', st: 'poly', c: 'Packaging' },
  { n: 'Paper', aka: ['newspaper', 'magazines', 'office paper'], s: 'cond', p: 'By load size', note: 'Bring it sorted with your load.', st: 'cardboard', c: 'Packaging' },
  { n: 'Bottles, cans and glass', aka: ['glass', 'jars', 'bottles', 'cans'], s: 'cond', p: 'By load size', note: 'Household quantities.', st: 'general', c: 'Packaging' },
  { n: 'Plastic pellets', aka: ['plastic', 'nurdles'], s: 'cond', p: 'By load size', st: 'general', c: 'Packaging' },
  // e-waste
  { n: 'TV', aka: ['television', 'led tv', 'plasma', 'lcd'], s: 'free', p: 'Free', st: 'ewaste', c: 'E-waste' },
  { n: 'LED screen', aka: ['monitor screen', 'display'], s: 'free', p: 'Free', st: 'ewaste', c: 'E-waste' },
  { n: 'Mobile phone', aka: ['phone', 'iphone', 'smartphone', 'mobile'], s: 'free', p: 'Free', st: 'ewaste', c: 'E-waste' },
  { n: 'Printer cartridges', aka: ['toner', 'ink cartridges'], s: 'free', p: 'Free', note: 'Household and office sized.', st: 'ewaste', c: 'E-waste' },
  { n: 'Computer or laptop', aka: ['pc', 'laptop', 'desktop', 'server'], s: 'cond', p: 'Ask at the gate', note: 'Accepted. Phones, TVs and screens are free; ask about other e-waste.', st: 'ewaste', c: 'E-waste' },
  { n: 'Monitor, tablet or keyboard', aka: ['ipad', 'tablet', 'keyboard', 'mouse'], s: 'cond', p: 'Ask at the gate', st: 'ewaste', c: 'E-waste' },
  { n: 'Modems, routers and cables', aka: ['cables', 'cords', 'wiring', 'router'], s: 'cond', p: 'Ask at the gate', st: 'ewaste', c: 'E-waste' },
  { n: 'Stereo and speakers', aka: ['speaker', 'hifi', 'amplifier'], s: 'cond', p: 'Ask at the gate', st: 'ewaste', c: 'E-waste' },
  { n: 'Small appliances', aka: ['toaster', 'kettle', 'microwave', 'vacuum', 'blender'], s: 'cond', p: 'By load size', st: 'ewaste', c: 'E-waste' },
  { n: 'Photocopier', aka: ['copier', 'printer'], s: 'cond', p: 'Ask at the gate', st: 'ewaste', c: 'E-waste' },
  { n: 'Solar panels', aka: ['solar panel', 'pv panel'], s: 'paid', p: '$39 each', st: 'solar', c: 'E-waste' },
  { n: 'Fluorescent tubes and globes', aka: ['light bulbs', 'globes', 'tubes', 'fluoro'], s: 'cond', p: 'Ask at the gate', note: 'Boxed or protected so they arrive unbroken.', st: 'ewaste', c: 'E-waste' },
  { n: 'CDs, DVDs and records', aka: ['cd', 'dvd', 'vinyl', 'records'], s: 'cond', p: 'By load size', st: 'general', c: 'Household' },
  { n: 'X-rays', aka: ['xray', 'x-ray film'], s: 'cond', p: 'Ask at the gate', st: 'general', c: 'Household' },
  // batteries
  { n: 'Car battery', aka: ['truck battery', 'lead acid battery'], s: 'free', p: 'Free', st: 'battery', c: 'Batteries' },
  { n: 'Household batteries', aka: ['batteries', 'aa', 'lithium battery', 'power tool battery'], s: 'cond', p: 'Ask at the gate', note: 'Call ahead to check before bringing household or lithium batteries. Never put them in your general load.', st: 'battery', c: 'Batteries' },
  { n: 'Electric vehicle battery', aka: ['ev battery'], s: 'no', p: 'Not accepted', st: 'none', c: 'Batteries' },
  // furniture + household
  { n: 'Couch or sofa', aka: ['lounge', 'couch', 'sofa bed', 'recliner', 'armchair'], s: 'paid', p: 'By load size', note: 'Priced with your load. Sort your load and pay half the unsorted rate.', st: 'furniture', c: 'Furniture' },
  { n: 'Table and chairs', aka: ['dining table', 'chair', 'desk', 'outdoor furniture'], s: 'paid', p: 'By load size', st: 'furniture', c: 'Furniture' },
  { n: 'Wardrobe or drawers', aka: ['cupboard', 'chest of drawers', 'cabinet', 'bookshelf'], s: 'paid', p: 'By load size', st: 'furniture', c: 'Furniture' },
  { n: 'Office furniture', aka: ['filing cabinet', 'office chair', 'office desk'], s: 'paid', p: 'By load size', st: 'furniture', c: 'Furniture' },
  { n: 'Bed base', aka: ['ensemble base', 'bed frame', 'slat base'], s: 'paid', p: 'Ask at the gate', st: 'furniture', c: 'Furniture' },
  { n: 'Mattress', aka: ['mattresses', 'queen mattress', 'single mattress', 'king mattress'], s: 'paid', p: 'From $10', note: 'Cot $10, single $29, double or queen $39, king $49, latex $69.', st: 'mattress', c: 'Mattresses' },
  { n: 'Clothing and fabric', aka: ['clothes', 'textiles', 'linen', 'shoes', 'bedding', 'pillows'], s: 'cond', p: 'By load size', note: 'There is a clothing bin and a fabric cage in the unloading area.', st: 'textiles', c: 'Household' },
  { n: 'Homewares', aka: ['kitchenware', 'crockery', 'toys', 'books'], s: 'paid', p: 'By load size', st: 'furniture', c: 'Household' },
  { n: 'Musical instruments', aka: ['piano', 'guitar', 'keyboard instrument'], s: 'paid', p: 'By load size', st: 'furniture', c: 'Household' },
  { n: 'General household rubbish', aka: ['rubbish', 'junk', 'household waste', 'garage clean out'], s: 'paid', p: 'From $19', note: 'Priced by load size. Sorted loads are half the unsorted rate.', st: 'general', c: 'Household' },
  { n: 'Deceased estate load', aka: ['estate', 'deceased estate', 'house clean out'], s: 'paid', p: 'By load size', note: 'Mixed car and truck loads of furniture, whitegoods, mattresses, books and homewares are accepted.', st: 'furniture', c: 'Household' },
  // garden
  { n: 'Green waste', aka: ['garden waste', 'branches', 'grass clippings', 'leaves', 'prunings', 'weeds'], s: 'paid', p: '$79 per m³', note: 'Utes, trailers and tip trucks.', st: 'green', c: 'Garden' },
  { n: 'Garden rocks', aka: ['rocks', 'stones'], s: 'cond', p: 'By load size', st: 'building', c: 'Garden' },
  { n: 'Soil', aka: ['dirt', 'fill', 'contaminated soil'], s: 'no', p: 'Not accepted', note: 'Soil and contaminated or untested soil are not accepted.', st: 'none', c: 'Garden' },
  // building
  { n: 'Bricks and concrete', aka: ['bricks', 'concrete', 'rubble', 'pavers'], s: 'cond', p: '$199 per m³', note: 'Sorted loads only.', st: 'building', c: 'Building' },
  { n: 'Tiles', aka: ['roof tiles', 'porcelain tiles', 'ceramic'], s: 'cond', p: '$199 per m³', note: 'Sorted loads only.', st: 'building', c: 'Building' },
  { n: 'Timber', aka: ['wood', 'treated pine', 'laminated timber', 'mdf'], s: 'cond', p: '$199 per m³', note: 'Sorted building loads. Untreated pallets are also accepted.', st: 'timber', c: 'Building' },
  { n: 'Pallets', aka: ['pallet', 'wooden pallets'], s: 'cond', p: 'By load size', st: 'timber', c: 'Building' },
  { n: 'Plasterboard', aka: ['gyprock', 'drywall', 'plaster'], s: 'cond', p: '$199 per m³', note: 'Sorted loads only.', st: 'building', c: 'Building' },
  { n: 'Carpet and underlay', aka: ['carpet', 'underlay', 'rugs'], s: 'cond', p: '$199 per m³', note: 'Sorted loads only.', st: 'building', c: 'Building' },
  { n: 'PVC pipe and ducting', aka: ['pvc', 'ducts', 'ac ducts'], s: 'cond', p: '$199 per m³', note: 'Sorted loads only.', st: 'building', c: 'Building' },
  { n: 'Mixed building waste', aka: ['c&d', 'construction waste', 'demolition waste', 'renovation waste', 'mixed c&d'], s: 'no', p: 'Not accepted', note: 'Unsorted construction and demolition loads go to Sycle at Fyansford.', st: 'none', c: 'Building' },
  { n: 'Asbestos', aka: ['fibro', 'asbestos sheeting', 'suspected asbestos'], s: 'no', p: 'Not accepted', note: 'Asbestos and suspected asbestos are never accepted. Use a licensed asbestos removalist.', st: 'none', c: 'Building' },
  // liquids, gas, trade
  { n: 'Paint', aka: ['house paint', 'paint tins', 'decorative paint'], s: 'free', p: 'Free to 100 L', note: 'Architectural and decorative paint, sealed. Over 100 L is $1 per litre. Industrial and automotive paint is $2 per litre.', st: 'paint', c: 'Liquids' },
  { n: 'Motor oil', aka: ['engine oil', 'sump oil', 'waste oil'], s: 'paid', p: '$1 per L', st: 'oil', c: 'Liquids' },
  { n: 'Hydraulic oil', aka: ['hydraulic fluid'], s: 'cond', p: 'Ask at the gate', note: 'There is a hydraulic oil tank at the waste oil station.', st: 'oil', c: 'Liquids' },
  { n: 'Cooking oil', aka: ['frying oil', 'vegetable oil'], s: 'paid', p: '$1 per L', note: 'Sealed, household quantities.', st: 'oil', c: 'Liquids' },
  { n: 'Coolant', aka: ['radiator coolant', 'antifreeze'], s: 'paid', p: '$3.50 per L', st: 'oil', c: 'Liquids' },
  { n: 'Oil filters', aka: ['oil filter'], s: 'paid', p: '$2–$3 each', st: 'metal', c: 'Liquids' },
  { n: 'Oily rags', aka: ['workshop rags', 'rags'], s: 'paid', p: '$30 per bag', note: 'Per 34 L bag, about a standard kitchen bin.', st: 'general', c: 'Liquids' },
  { n: 'Aerosol cans', aka: ['spray cans', 'aerosols'], s: 'paid', p: '$1', st: 'gas', c: 'Gas' },
  { n: 'Gas bottle', aka: ['lpg', 'bbq gas bottle', 'gas cylinder'], s: 'paid', p: 'From $15', note: 'Under 9 kg $15. Over 9 kg $25: call ahead before bringing large cylinders.', st: 'gas', c: 'Gas' },
  { n: 'Fire extinguisher', aka: ['extinguisher'], s: 'paid', p: 'From $10', note: 'Under 3 kg $10, over 3 kg $15.', st: 'gas', c: 'Gas' },
  { n: 'Nitrous canisters', aka: ['nos', 'nangs', 'cream chargers', 'nitrous oxide'], s: 'paid', p: 'From $10', note: 'Under 0.5 kg or 2 L $10, over $20.', st: 'gas', c: 'Gas' },
  { n: 'Tyres', aka: ['tyre', 'tire', 'wheels'], s: 'paid', p: 'From $12', note: 'Motorbike $12, car off rim $19, car on rim $25, light truck $44, heavy truck $59, tractor on application.', st: 'tyres', c: 'Tyres' },
  // not accepted
  { n: 'Chemicals', aka: ['pool chemicals', 'pesticide', 'herbicide', 'weed killer', 'insecticide', 'fertiliser', 'rat poison', 'cleaning products', 'oven cleaner'], s: 'no', p: 'Not accepted', note: 'Household and garden chemicals are not accepted here. Your local council can advise on chemical drop-off.', st: 'none', c: 'Not accepted' },
  { n: 'Fuels and solvents', aka: ['petrol', 'diesel', 'thinners', 'turps', 'turpentine', 'brake fluid', 'transmission fluid', 'paint stripper', 'varnish', 'wood preservative'], s: 'no', p: 'Not accepted', st: 'none', c: 'Not accepted' },
  { n: 'Medical waste', aka: ['sharps', 'syringes', 'needles', 'clinical waste'], s: 'no', p: 'Not accepted', st: 'none', c: 'Not accepted' },
  { n: 'Explosives and ammunition', aka: ['flares', 'firearms', 'weapons', 'ammo', 'marine flares'], s: 'no', p: 'Not accepted', st: 'none', c: 'Not accepted' },
  { n: 'Unlabelled liquids', aka: ['unknown liquid', 'drums', 'unidentified liquid'], s: 'no', p: 'Not accepted', note: 'Unidentified liquids and drums with hazardous residue are not accepted.', st: 'none', c: 'Not accepted' },
  { n: 'Animal carcasses', aka: ['dead animal'], s: 'no', p: 'Not accepted', st: 'none', c: 'Not accepted' },
  { n: 'Radioactive material', aka: ['smoke detector'], s: 'no', p: 'Not accepted', st: 'none', c: 'Not accepted' },
  { n: 'Mercury switches', aka: ['mercury'], s: 'no', p: 'Not accepted', st: 'none', c: 'Not accepted' },
];

export const POPULAR = ['Mattress', 'Couch or sofa', 'Fridge', 'TV', 'Green waste', 'Tyres', 'Paint', 'Polystyrene', 'Gas bottle', 'Asbestos'];

export const VEHICLES = {
  yes: ['Car boots', 'Station wagons', 'Utes', 'Single axle trailers', 'Dual axle trailers', 'Vans of all sizes', 'Tip trucks up to 4,500 kg GVM', 'Box trucks up to 4,500 kg GVM', 'Tipping trailers of all types'],
  no: ['Tip trucks over 4,500 kg GVM', 'Box trucks over 4,500 kg GVM', 'Skip bin trucks', 'Garbage trucks'],
};

export const FREECYCLE = {
  partners: ['The Orange Door', 'St Vincent de Paul Society Victoria', 'Uniting Vic.Tas', 'Wintringham', 'Meli', 'Give Where You Live Foundation', 'Wathaurong Aboriginal Co-operative', 'MOSS', 'Wellways', 'Mind Australia', 'headspace', 'The Power In You Project', 'Feed Me', 'Neami National', 'The Salvation Army'],
};

export const NEWS_DATES = {
  'how-recycle-north-geelong-turns-cardboard-waste-into-agricultural-gold': '2025-08-06',
  'recycle-north-geelong-responsible-recycling-for-gas-bottles-canisters-fire-extinguishers': '2025-08-04',
  'recycle-your-paint-the-right-way-at-recycle-north-geelong': '2025-08-04',
  'recycle-north-geelong-australian-paper-recovery-leading-change': '2025-08-04',
  'the-ultimate-guide-to-recycling-turning-trash-into-treasure': '2025-07-10',
  'recycle-north-geelong-your-free-recycling-hub': '2025-07-09',
};
