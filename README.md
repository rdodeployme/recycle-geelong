# Recycle Geelong website prototype

Static site for the Recycle North Geelong transfer station (116 Furner Avenue, North Geelong).

| Path | What it is |
|---|---|
| `/` | Phase 1 site: Home, Prices, What we take, Trade, Hours & location (hash routes: `#prices`, `#take`, `#trade`, `#visit`) |
| `/trade/` | Trade landing page built around the price board (for ad traffic) |
| `/one-pager/` | Single-page version with the load builder |

No build step. Every page is plain HTML, CSS and JS; images are in `assets/img/`.

## Before going public

- Pages carry `noindex` and `robots.txt` blocks all crawlers. Remove both once the numbers below are confirmed.
- Confirm: trade discount (15%) and whether it applies to per-item charges, summer Mon–Sat hours (shown as 7:30am–5pm), facility size to quote.
- Prices come from recycle.net.au/price-list. Update the arrays at the top of each page's script if prices change.
- Photos are from the Recycle North Geelong gallery; four were upscaled (tradies, trailer, greenw, ute).
