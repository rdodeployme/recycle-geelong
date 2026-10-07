# Recycle North Geelong site: open items

Staging: https://recycle-north-geelong.netlify.app (noindex; the live WordPress site is untouched)

## Fix on the live WordPress site now (independent of the rebuild)
- Every page on recycle.net.au carries `noindex, nofollow`, so Google is told to drop the site.
  Settings → Reading → untick "Discourage search engines", and check the SEO plugin's per-page setting.

## Contradictions on the current site that need a decision
I picked the reading below for the new site. Confirm or correct.
| Topic | Current site says | New site uses |
|---|---|---|
| Closing time | 4pm and 5pm | 5pm (confirmed by Andy, 7 Oct) |
| Floor area | "3 acres", "4.5 acres", "20,000 m²" | 20,000 m² |
| Streams | "60 categories" | 90+ (group figure) |
| Gas bottles over 9 kg | $25 on price list; "not accepted" on What we take | $25, "call ahead" |
| Household / lithium batteries | Not accepted (except car/truck); there is a Battery Station sign | "Check first, call ahead" |
| Pool chemicals, pesticides, herbicides | Both accepted (small, labelled) and not accepted | Not accepted |
| Varnish | Both accepted (sealed) and not accepted | Not accepted |
| Paint over 100 L | $1/L and $2/L | Decorative over 100 L $1/L; industrial and automotive $2/L any volume |
| "100% landfill-free commitment" | Hero badge | Removed. Site says "landfill last" |
| Steel per mattress | "1.5 kg" | ~30% of a mattress; 99% of that steel recovered |

## Still on WordPress (linked from the new site until moved)
- Book a collection: /book-now/
- Resident and trade registration for the 10% discount
- Terms and conditions
Decide whether these move into the new site or point at JUNK / Trash. booking.

## Content to supply
- Full-resolution originals of the 34 floor photos (the copies received are 640 px, so they are used small).
- The walkthrough video from the other chat: drop the MP4 into `public/video/` and set `tourVideoSrc` in `src/data/site.js`.
- Public holiday hours, if they differ.
- Trade enquiry form: confirm where submissions should go (Netlify Forms is on; set the notification email).

## Go-live
- Point recycle.net.au at the new site, then build with `INDEX=1 node build.mjs` so pages are indexable.
- Old URLs are kept (/price-list/, /what-we-take/, /unsorted-loads/, /our-location/, /recycling-matters/, /recycle-corporate-services/, /about-us/, and the six news posts).
- Not yet built: /gallery/, /book-now/, registration pages, /tc. Add redirects or pages before cutover.
