"""Render pages in headless Chromium for visual QA.

python3 tools/shoot.py <out_dir> [page ...]
Pages are paths like '' or 'price-list/'. Starts a static server on dist/.
"""
import os, sys, threading, http.server, functools, time
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
PAGES = sys.argv[2:] or ['']
os.makedirs(OUT, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass
Handler = functools.partial(Quiet, directory=os.path.join(ROOT, 'dist'))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for vw, vh, tag in ((1440, 900, 'd'), (390, 844, 'm')):
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, device_scale_factor=1)
        pg = ctx.new_page()
        errs = []
        pg.on('console', lambda m: errs.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errs.append(f'pageerror: {e}'))
        for path in PAGES:
            pg.goto(f'http://127.0.0.1:8765/{path}', wait_until='networkidle')
            # trigger lazy images + reveals
            h = pg.evaluate('document.body.scrollHeight')
            for y in range(0, h, 700):
                pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(60)
            pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
            pg.wait_for_timeout(1200)
            pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(600)
            name = (path.strip('/').replace('/', '_') or 'home') + f'_{tag}.png'
            pg.screenshot(path=os.path.join(OUT, name), full_page=True)
            ow = pg.evaluate('document.documentElement.scrollWidth')
            print(name, 'height', h, 'overflow-x' if ow > vw else 'ok-x', ow)
        for e in errs[:20]:
            print('  ', e)
        ctx.close()
    b.close()
srv.shutdown()
