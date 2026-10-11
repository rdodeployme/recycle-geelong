"""Convert source photos to web sizes (WebP) and write a manifest with real captions.

Usage: python3 tools/images.py
"""
import json, os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'raw')
OUT = os.path.join(ROOT, 'public', 'img')
os.makedirs(OUT, exist_ok=True)

# name, source (relative to raw/), alt text describing what the photo actually shows
PHOTOS = [
    ('hall-hero', 'gallery/g05_7FE1258E-41BD-49A8-BA73-1E6065DA4077-min-scaled.jpg',
     'The undercover hall at Recycle North Geelong, with the gas bottle, fire extinguisher and car battery cages under hanging signs'),
    ('waste-oil-station', 'gallery/g11_Image_20250805_113209_476-scaled.jpeg',
     'The waste oil station with bays for paint, motor oil, hydraulic oil and engine oils'),
    ('forklift-cardboard', 'gallery/g12_Image_20250806_121025_827-min-scaled.jpeg',
     'A forklift carrying a bale of cardboard past the cardboard and polystyrene bays'),
    ('forklift-bale', 'gallery/g13_Image_20250806_121025_913-min-scaled.jpeg',
     'A forklift moving a baled block of cardboard down the hall'),
    ('car-sedan-bays', 'gallery/g25_unnamed-13-min.jpg',
     'Marked car and sedan unloading bays beside a row of general rubbish skips'),
    ('skips-row', 'gallery/g23_unnamed-10-min.jpg',
     'A long row of skips and cages under cover along the hall'),
    ('green-bins', 'gallery/g24_unnamed-12-min.jpg',
     'Rows of wheelie bins and cages at the recycling stations'),
    ('tyres-bay', 'gallery/g26_unnamed-14-min.jpg',
     'The tyres bay inside the hall'),
    ('paint-wide', 'gallery/g27_unnamed-15-min.jpg',
     'The paint drop-off and wheelie bins along the hall'),
    ('cardboard-cage', 'gallery/g01_3889FCEA-6507-447D-BED0-FD35B53D4560-min-scaled.jpg',
     'Flattened cardboard in a cage under a cardboard sign'),
    ('mattresses', 'gallery/g02_427EFC2F-FCAD-4B3D-8FD6-8C77CCCAD457-min-scaled.jpg',
     'Mattresses stacked at the mattress recycling area'),
    ('bedding', 'gallery/g03_702FCB2C-CB47-4A23-A111-3DA01F5A8B2C-min-scaled.jpg',
     'A cage of bedding and pillows'),
    ('excluded-board', 'gallery/g04_7F1638DC-7D31-48F0-82C6-BB766B9C1A6E-min-scaled.jpg',
     'The excluded items board at the entry, next to a numbered bay sign'),
    ('hydraulic-oil', 'gallery/g06_8F1EF8FD-DE26-4659-B76C-9D94AD0DCF53-min-scaled.jpg',
     'The hydraulic oil tank behind a safety rail'),
    ('polystyrene-cages', 'gallery/g07_BE713C00-67AB-471C-B7C7-110B2C261CFA-min-scaled.jpg',
     'Cages of clean polystyrene packaging'),
    ('motor-oils', 'gallery/g08_D4434113-D1B5-45DC-8A08-9059F336E3E2-min-scaled.jpg',
     'The motor oil drop-off tray'),
    ('fabric-clothing', 'gallery/g09_F0B7D061-41D1-4A91-BBA8-E0CDC2F2A1DB-min-scaled.jpg',
     'Fabric cage and clothing donation bin in the car and sedan unloading area'),
    ('whitegoods', 'gallery/g10_IMG_0980-min-scaled.jpg',
     'Fridges and washing machines lined up under the whitegoods sign'),
    # 640px sources: small placements only
    ('unload-car-cardboard', 'gallery/g14_thumbnail_IMG_0926.jpg',
     'A customer unloading boxes from a car at the cardboard bays'),
    ('unload-car', 'gallery/g15_thumbnail_IMG_1075-min.jpg',
     'A car parked in an unloading bay inside the hall'),
    ('unload-ute', 'gallery/g16_thumbnail_IMG_1089-min.jpg',
     'A ute in the car and sedan unloading area'),
    ('unload-trailer', 'gallery/g17_thumbnail_IMG_1092-min.jpg',
     'A customer unloading a trailer beside the cardboard bays'),
    ('green-waste', 'gallery/g18_thumbnail_IMG_1093-min.jpg',
     'Customers unloading green waste into a skip'),
    ('trailer-skip', 'gallery/g19_thumbnail_IMG_1096-min.jpg',
     'Unloading a trailer into a skip at the materials area'),
    ('excavator-bin', 'gallery/g20_thumbnail_IMG_3874-min.jpg',
     'An excavator loading a hook bin inside the hall'),
    ('gas-aerosols', 'gallery/g21_thumbnail_image0-1.jpg',
     'Gas bottles, fire extinguishers and aerosol cans brought in for recycling'),
    ('paint-tins', 'gallery/g22_thumbnail_image0.jpg',
     'Paint tins under the paint sign'),
    ('general-rubbish', 'dcf17553-3d5c-4da8-a30d-7e1c4aec7d95.jpg',
     'General rubbish skips along marked bays'),
    ('car-sedan-sign', '25569f97-c6b7-4121-a3da-9c25be984b7d.jpg',
     'The car and sedan unloading area sign over a row of skips'),
    ('car-batteries', '5cca2a84-2a2c-45fc-b7c8-7a1bf6f91d6a.jpg',
     'Cages for car batteries in the unloading area'),
    ('cardboard-row', '14003bdd-7738-430d-a737-e6f26142849f.jpg',
     'The row of cardboard cages under the cardboard signs'),
    # supplied by Andy, Oct 2026 (640px copies; originals still to come)
    ('bins-small-items', 'andy/7a1a453b-image.jpg', 'Wheelie bins for food waste, aerosol cans and e-waste'),
    ('car-sedan-wide', 'andy/704dfbdb-image.jpg', 'The car and sedan unloading area, with general rubbish skips along marked bays'),
    ('trailer-area', 'andy/dacea930-image.jpg', 'The tipping truck and trailer area, with its own lane for commercial vehicles'),
    ('building-materials', 'andy/ba95947d-image.jpg', 'Skips for sorted building materials'),
    ('scrap-steel-aisle', 'andy/ba36c30e-image.jpg', 'The aisle past the scrap steel and car parts bins'),
    ('metals-area', 'andy/cf7da333-image.jpg', 'The recycled metals area, with bins for scrap steel'),
    ('small-items-row', 'andy/5be51f30-image.jpg', 'A row of wheelie bins for smaller recyclables near the exit'),
    ('rubbish-bays-tall', 'andy/427ccea0-image.jpg', 'General rubbish skips along the marked unloading bays'),
    ('hall-long', 'andy/e5c899d6-image.jpg', 'Looking down the length of the hall'),
    ('cardboard-row-2', 'andy/f7566482-image.jpg', 'Cardboard cages under the hanging cardboard signs'),
    ('ewaste-cages', 'andy/dfddbd80-image.jpg', 'E-waste and TV cages along the unloading area'),
    ('cardboard-signs', 'andy/631b899f-image.jpg', 'Cardboard cages, with the polystyrene bays further along'),
    ('gas-arrow', 'andy/4d0cf62b-image.jpg', 'A floor arrow leading to the gas bottle and tyre bays'),
    ('oil-station-tall', 'andy/3ac8a19a-image.jpg', 'The oil station drop-off, with the paint cages beside it'),
    ('skip-single', 'andy/6c12365d-image.jpg', 'A general rubbish skip in front of the polystyrene and paper cages'),
    ('oil-station', 'andy/f5ba112d-image.jpg', 'The oil station drop-off sign beside the paint cages and waste oil tanks'),
    ('oil-containers', 'andy/7b0ee6d4-image.jpg', 'Oil container and oil filter cages at the oil station'),
    ('tyres-cages', 'andy/82b976dc-image.jpg', 'The tyres bay, with separate cages for car tyres'),
    ('furniture-dropoff', 'andy/1760f142-image.jpg', 'Furniture set down at the furniture drop-off sign'),
    ('clothing-hub', 'andy/e23e8735-image.jpg', 'The clothing donation hub in the unloading area'),
    ('printers-cage', 'andy/aefc74e4-image.jpg', 'The printers cage'),
    ('ewaste-cage', 'andy/5803fc57-image.jpg', 'An e-waste cage'),
    ('oil-station-wide', 'andy/1ddd1b2d-image.jpg', 'The waste oil station, seen from the end of the hall'),
    ('gas-cages', 'andy/5502a61a-image.jpg', 'Gas bottle and gas canister cages beside a sign asking that pets stay in the vehicle'),
    ('aerosols-paint', 'andy/ad4c7a28-image.jpg', 'The aerosols, paint cans and hazards area, with paint cages'),
    ('paint-dropoff', 'andy/7c4cd27a-image.jpg', 'A customer carrying paint from a ute to the paint cages'),
    ('trailer-cardboard', 'andy/cedddaef-image.jpg', 'A customer unloading cardboard from a trailer at the cardboard cages'),
    ('drive-in', 'andy/ab0b1470-image.jpg', 'A car towing a trailer and a van driving into the hall'),
    ('car-gas-bay', 'andy/60efdd89-image.jpg', 'A car parked beside the gas bottle cages under the hanging signs'),
    ('rubbish-bays-arrow', 'andy/de0130e1-image.jpg', 'General rubbish bays, with a floor arrow showing the way through'),
    ('cooking-oil', 'andy/b07d1e5f-image.jpg', 'The cooking oil drop-off tray at the oil station'),
    ('coolant', 'andy/ad00ee5c-image.jpg', 'The coolant tank at the oil station'),
    ('rubbish-panorama', 'andy/897dbbb9-image.jpg', 'The row of general rubbish skips in the car and sedan unloading area'),
]


def save(im, name, width):
    im = im.copy()
    if im.width > width:
        h = round(im.height * width / im.width)
        im = im.resize((width, h), Image.LANCZOS)
    path = os.path.join(OUT, f'{name}-{width}.webp')
    im.save(path, 'WEBP', quality=78, method=6)
    return im.width, im.height


manifest = {}
for name, src, alt in PHOTOS:
    im = ImageOps.exif_transpose(Image.open(os.path.join(RAW, src))).convert('RGB')
    w0 = im.width
    widths = [1920, 960] if w0 >= 1800 else ([1280, 640] if w0 >= 1200 else [w0])
    if im.height > im.width and w0 >= 1800:
        widths = [1200, 600]
    if name == 'hall-hero':
        widths = [2400, 1280]
    sizes = {}
    for w in widths:
        sizes[w] = save(im, name, min(w, w0))
    manifest[name] = {
        'alt': alt,
        'w': w0, 'h': im.height,
        'sizes': {str(min(w, w0)): f'img/{name}-{min(w, w0)}.webp' for w in widths},
        'small': w0 < 1000,
    }
    print(name, im.size, list(manifest[name]['sizes']))

json.dump(manifest, open(os.path.join(ROOT, 'src', 'data', 'images.json'), 'w'), indent=1)

# logo + EPA badge
logo = Image.open(os.path.join(RAW, 'logo_conv.png')).convert('RGBA')
logo.save(os.path.join(OUT, 'logo.png'), optimize=True)
logo.save(os.path.join(OUT, 'logo.webp'), 'WEBP', lossless=True)
epa = Image.open(os.path.join(RAW, 'epa_conv.png')).convert('RGBA')
epa.save(os.path.join(OUT, 'epa.webp'), 'WEBP', lossless=True)
print('logo', logo.size, 'epa', epa.size)
