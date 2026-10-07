"""Viewport-by-viewport capture, stitched, so sticky/vh sections render as a visitor sees them.
python3 tools/shoot2.py <out_dir> <w> <h> [page ...]
The 3D journey's long scroll track is collapsed for QA so pages stay a sane length.
"""
import os, sys, threading, http.server, functools
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
PAGES = sys.argv[4:] or ['']
os.makedirs(OUT, exist_ok=True)


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8780), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': W, 'height': H})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    for path in PAGES:
        pg.goto(f'http://127.0.0.1:8780/{path}', wait_until='networkidle')
        pg.add_style_tag(content='html{scroll-behavior:auto!important}.journey-scroll{height:0!important}.journey-pin{position:relative!important}*{animation-duration:0s!important}')
        pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
        pg.wait_for_timeout(1500)
        total = pg.evaluate('document.documentElement.scrollHeight')
        shots = []
        y = 0
        while y < total:
            pg.evaluate(f'window.scrollTo(0,{y})')
            pg.wait_for_timeout(250)
            f = os.path.join(OUT, f'_tmp{len(shots)}.png')
            pg.screenshot(path=f)
            real = pg.evaluate('scrollY')
            shots.append((f, real))
            y += H
        canvas = Image.new('RGB', (W, total))
        for f, real in shots:
            canvas.paste(Image.open(f), (0, real))
            os.remove(f)
        name = (path.strip('/').replace('/', '_') or 'home') + f'_{W}'
        step = 2600 if W > 800 else 2200
        for i, yy in enumerate(range(0, total, step)):
            c = canvas.crop((0, yy, W, min(total, yy + step)))
            if W > 800:
                c = c.resize((W // 2, c.height // 2))
            c.save(os.path.join(OUT, f'{name}__{i:02d}.jpg'), quality=74)
        print(name, total, 'slices', (total + step - 1) // step)
    for e in errs[:10]:
        print('ERR', e)
    b.close()
srv.shutdown()
