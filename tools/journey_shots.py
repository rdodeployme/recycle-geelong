"""Viewport screenshots through the 3D journey at several scroll positions.
python3 tools/journey_shots.py <out_dir> [path] [width height]
"""
import os, sys, threading, http.server, functools
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
PATH = sys.argv[2] if len(sys.argv) > 2 else ''
W, H = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1440, 900)
os.makedirs(OUT, exist_ok=True)


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8767), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': W, 'height': H})
    logs = []
    pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}'))
    pg.on('pageerror', lambda e: logs.append(f'pageerror: {e}'))
    pg.goto(f'http://127.0.0.1:8767/{PATH}', wait_until='networkidle')
    pg.add_style_tag(content='html{scroll-behavior:auto!important}')
    top = pg.evaluate("document.querySelector('[data-journey]').getBoundingClientRect().top + scrollY")
    total = pg.evaluate("document.querySelector('[data-journey]').offsetHeight - innerHeight")
    pg.evaluate(f'window.scrollTo(0,{top - 200})')
    pg.wait_for_timeout(2500)
    marks = [float(x) for x in os.environ.get('MARKS', '0.0 0.1 0.2 0.24 0.33 0.41 0.52 0.6 0.7 0.76 0.86 0.96').split()]
    for i, m in enumerate(marks):
        pg.evaluate(f'window.scrollTo(0,{top + m * total})')
        pg.wait_for_timeout(2500)
        pg.screenshot(path=os.path.join(OUT, f'j{W}_{i:02d}.jpg'), type='jpeg', quality=70, timeout=90000)
    print('mode', pg.evaluate("document.querySelector('[data-journey]').dataset.mode"), 'label', pg.evaluate("document.querySelector('[data-journey-label]').textContent"))
    for l in logs[:15]:
        print(' ', l)
    b.close()
srv.shutdown()
