# Recycle North Geelong site: open items

Live (GitHub Pages, noindex): https://rdodeployme.github.io/recycle-geelong/ — repo rdodeployme/recycle-geelong (built site on `main`, source on `source`).
The earlier Netlify staging link (recycle-north-geelong.netlify.app) shows the first version only.
The live WordPress site at recycle.net.au is untouched.

## Fix on the live WordPress site now (independent of the rebuild)
- Every page on recycle.net.au carries `noindex, nofollow`, so Google is told to drop the site.
  Settings → Reading → untick "Discourage search engines", and check the SEO plugin's per-page setting.

## Contradictions on the current site that need a decision
I picked the reading below for the new site. Confirm or correct.
| Topic | Current site says | New site uses |
|---|---|---|
| Closing time | 4pm and 5pm; July 2026 price list says 4pm | 5pm (confirmed by Andy, 7 Oct) |
| Floor area | "3 acres", "4.5 acres", "20,000 m²" | 20,000 m² |
| Streams | "60 categories" | 90+ (group figure) |
| Gas bottles over 9 kg | $25 on price list; "not accepted" on What we take | $25 (confirmed by July 2026 price list) |
| Household / lithium batteries | Not accepted (except car/truck); there is a Battery Station sign | "Check first, call ahead" |
| Pool chemicals, pesticides, herbicides | Both accepted (small, labelled) and not accepted | Not accepted (July 2026 list: pesticides, herbicides, fertilisers not accepted) |
| Varnish | Both accepted (sealed) and not accepted | Not accepted |
| Paint over 100 L | $1/L and $2/L | $1/L over 100 L (July 2026 list); industrial and automotive $2/L kept, not on the list |
| "100% landfill-free commitment" | Hero badge | Removed. Site says "landfill last" |
| Steel per mattress | "1.5 kg" | ~30% of a mattress; 99% of that steel recovered |

## Prices: July 2026 price list applied (9 Oct)
Source: "Recycle North Geelong Fees and charges", July 2026 (supplied by Andy). Every price on the list is now on the site.
- Loads are priced by size and by waste type (general, building, green): bins/bags 30–240 L, car boot to heaped ute, and small (6×4), medium (7×5) and large (10×6) trailers at level, caged heaped and caged full. Data: LOADS and WASTE in src/data/site.js.
- The list has no unsorted rate and lists "unsorted mixed loads" as not accepted, so "sort it and pay half" is gone everywhere. /unsorted-loads/ is now "Sort it as you load" (URL kept).
- New prices added: clothing $29 and glass $39 per 240 L wheelie bin.
- Needs confirming:
  - Hours: the list says Mon–Sat 7:30am–4:00pm; the site keeps 5pm as confirmed by Andy on 7 Oct.
  - Vans and trucks: no price on the list, so the site says "priced at the gate, call ahead" (was $99/$199 per m³).
  - Not on the list, kept as before: cardboard and polystyrene over 0.5 m³ at $69 per m³; industrial and automotive paint $2/L; tractor tyres on application; plasterboard, PVC pipe and ducting at $199 per m³; hydraulic oil "ask at the gate".
  - "Aerosol paint $1.00" sits under the list's "price per litre" heading; the site shows $1 per can.

## Still on WordPress (linked from the new site until moved)
- Book a collection: /book-now/
- Resident and trade registration for the 10% discount
Decide whether these move into the new site or point at JUNK / Trash. booking.

## Content to supply
- Full-resolution originals of the 34 floor photos (the copies received are 640 px, so they are used small).
- The home hero is now a still photo of the hall (8 Oct). The AI-assisted hero videos (public/video/hero-*) are unused and can be deleted.
- Facility video (9 Oct): the four step photos on the home page play short silent loops of the same spot while on screen (public/video/step-*.mp4), and "Take a look inside" (hero and Four steps) opens the 39-second drive-through (public/video/tour-*.mp4) only when tapped. All are AI-animated from the 640 px floor photos; swap in real footage (no customers) when it exists. Reduced-motion and data-saver visitors keep the stills.
- Public holiday hours, if they differ.
- Trade enquiry form: confirm where submissions should go (Netlify Forms is on; set the notification email).

## Added 8 Oct, needs sign-off
- Privacy policy (/privacy/) is a DRAFT written from what the site and terms of entry say is collected (registration and booking details, vehicle registrations, CCTV, card payments). It shows a "Draft for review" label; remove the `draft-note` paragraph in src/pages/extra.js once approved.
- Terms and conditions (/terms-and-conditions/) ported word for word from recycle.net.au/tc, with obvious typos fixed ("and damage" to "any damage", "incorrect are" to "an incorrect area", "advised at by" to "advised by", "until attendant" to "until an attendant", "abidance with" to "compliance with", "per the Payment Policy" to "per the payment terms below"). /tc redirects to it.
- Terms item 9 says "no throwing of waste or unloading of trailers is allowed", but the site invites trailer loads. Confirm the intended wording (tipping trailers?).
- Payment: card only (debit, EFTPOS, credit), no cash, paid in full at the gate before unloading. Taken from the terms of entry and now used in the FAQ and suburb pages.
- FAQ (/faq/) with FAQPage structured data. Public holiday answer points to Facebook or a phone call until hours are confirmed.
- Suburb pages (/tip/ and /tip/<suburb>/) for Lara, Corio, Norlane, Bell Park, Geelong, Belmont, Grovedale, Leopold, Ocean Grove, Torquay, Bannockburn, Werribee. Each says which council area the suburb is in (10% discount eligibility) and links directions from that suburb. Add a genuinely local detail to each over time.
- Share image: public/img/og-default.jpg (1200 x 630) from the real hall photo.
- Still unknown: what proof of residence the discount needs at the gate; public holiday hours; who posts closure notices (SITE.notices in src/data/site.js).

## Go-live
- Point recycle.net.au at the new site, then build with `INDEX=1 node build.mjs` so pages are indexable.
- Old URLs are kept (/price-list/, /what-we-take/, /unsorted-loads/, /our-location/, /recycling-matters/, /recycle-corporate-services/, /about-us/, and the six news posts).
- Not yet built: /gallery/, /book-now/, registration pages. Add redirects or pages before cutover. (/tc now redirects to /terms-and-conditions/.)
