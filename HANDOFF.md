# Recycle North Geelong website: handover

The new site for recycle.net.au. It is a static site (plain HTML, CSS and JavaScript) with no CMS, no database and no server code.

Preview of the current build: https://rdodeployme.github.io/recycle-geelong/

## What's in this zip

| Folder | What it is |
|---|---|
| `site/` | The finished website, built for **https://recycle.net.au** (served from the domain root, search-engine indexing on). Upload the contents of this folder to the web root as-is. |
| `source/` | The source code. Edit here and rebuild to make changes. |

## Going live (quickest path)

1. Upload everything inside `site/` to the hosting web root for recycle.net.au.
2. Check the old URLs still resolve (they were kept on purpose): `/price-list/`, `/what-we-take/`, `/unsorted-loads/`, `/our-location/`, `/recycling-matters/`, `/recycle-corporate-services/`, `/about-us/`, `/community/`, `/news/` and the six news posts.
3. Add redirects for the old WordPress pages that are not in the new site: `/gallery/` and anything else you find in the old sitemap. `/tc` already redirects to `/terms-and-conditions/`.
4. Remove the `noindex, nofollow` setting on the current WordPress site before or at cutover (Settings → Reading, plus the SEO plugin), otherwise Google keeps dropping the domain.

## Hosting notes

- Works on any static host (Netlify, Cloudflare Pages, GitHub Pages, S3, or plain Apache/Nginx).
- `netlify.toml` is included for Netlify (security and cache headers). On other hosts it is ignored.
- Every page is a folder with an `index.html`, so clean URLs work without rewrite rules. `404.html` is the not-found page.
- `robots.txt` and `sitemap.xml` are generated for https://recycle.net.au.

## Things that still point at the old WordPress site

The new site links to these existing pages until they are rebuilt or replaced:

- Book a collection: `https://recycle.net.au/book-now/`
- Resident registration: `https://recycle.net.au/residence-register-now/`
- Trade registration: `https://recycle.net.au/trade-commercial-register/`

**If WordPress is switched off at cutover, these three links will break.** Either keep WordPress running on a subdomain and update the links, or rebuild these forms. All three links live in one place: `links` in `source/src/data/site.js`.

## Forms

- The trade enquiry form (`/recycle-corporate-services/#enquire`) is set up for **Netlify Forms** (`data-netlify="true"`). On Netlify it works with no code; set the notification email in the Netlify dashboard.
- On any other host it needs a form handler (Formspree, a small serverless function, or similar). The form is in `source/src/pages/inner.js`, search for `industry-recycling`.

## Editing and rebuilding

Requirements: Node.js 18 or later.

```
cd source
npm install
INDEX=1 node build.mjs          # production build for recycle.net.au → dist/
node build.mjs                  # staging build (noindex) → dist/
BASE=/sub-path/ node build.mjs  # if served from a sub-folder
```

Where things live:

- **Facts, prices, hours, discounts, the item list, partner logos:** `src/data/site.js` (one file; most content changes happen here)
- **Pages:** `src/pages/*.js` · shared sections: `src/components.js` · page shell, header and footer: `src/layout.js`
- **Styles:** `src/styles/main.css` · **front-end behaviour** (item finder, price estimator, open/closed badge): `src/js/main.js`
- **Images:** already optimised in `public/img/` and listed in `src/data/images.json`. `tools/images.py` regenerates them from original photos (originals are not in this zip; ask if you need them).
- **3D "After you tip" scene:** `src/js/journey.js` (Three.js) with the model in `public/models/`.

## Open items

`source/OPEN_ITEMS.md` lists content still to confirm (trade contact details, a few prices, discount proof at the gate, terms wording). None of these block going live, but some text may change.

Contact: Ryan, ryan@junk.com.au
