# Recycle North Geelong website

Static site. No framework, no CMS.

    npm install
    node build.mjs                 # staging build into dist/ (noindex)
    INDEX=1 node build.mjs         # production build (indexable)
    BASE=/repo-name/ node build.mjs  # if served from a GitHub Pages project sub-path

- Facts, prices, hours and the item list: `src/data/site.js` (one place to edit)
- Pages: `src/pages/*.js`, shared sections: `src/components.js`
- Styles: `src/styles/main.css`
- Item finder, load estimator, open/closed status: `src/js/main.js`
- 3D "After you tip" scene: `src/js/journey.js` (Three.js); props built in Blender by `tools/models.py`
  (`python tools/models.py` with Blender's bpy module, then compress with
  `npx gltf-transform meshopt raw/journey-full.glb public/models/journey.min.glb`)
- Photos: put sources in `raw/`, list them in `tools/images.py`, run `python3 tools/images.py`

See OPEN_ITEMS.md for decisions still needed before go-live.
