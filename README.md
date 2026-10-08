# Recycle North Geelong website

Live (staging, noindex): https://rdodeployme.github.io/recycle-geelong/

| Path | What it is |
|---|---|
| `/` | New site (Oct 2026): home with item finder, load estimator and 3D "after you tip" journey; prices, what we take, sorted vs unsorted, hours & location, trade, community, about, news |
| `/trade/` | Trade landing page (earlier prototype, kept for ad links) |
| `/one-pager/` | Single-page version with the load builder (earlier prototype) |
| `/v1/` | The earlier Phase 1 prototype home page |

This branch (`main`) is the built site served by GitHub Pages. The source (build script, page templates,
Blender model script, photos) is on the `source` branch: `npm install && BASE=/recycle-geelong/ node build.mjs`,
then copy `dist/` here.
