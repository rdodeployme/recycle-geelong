"""Screenshot the first viewport of several pages side by side (hero QA).
python3 tools/heroes.py out.jpg path:w:h [path:w:h ...]   (use 'home' for the home page)"""
import os, sys, threading, http.server, functools
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8781), functools.partial(Q, directory=os.path.join(ROOT, 'dist')))
threading.Thread(target=srv.serve_forever, daemon=True).start()
out, specs = sys.argv[1], sys.argv[2:]
ims = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for s in specs:
        path, w, h = s.split(':'); path = '' if path == 'home' else path
        pg = b.new_page(viewport={'width': int(w), 'height': int(h)})
        pg.goto(f'http://127.0.0.1:8781/{path}', wait_until='networkidle')
        pg.add_style_tag(content='*{animation:none!important}'); pg.wait_for_timeout(400)
        f = out + f'.{len(ims)}.png'; pg.screenshot(path=f); ims.append(Image.open(f)); pg.close()
    b.close()
srv.shutdown()
ims = [i.resize((int(i.width * 600 / i.height), 600)) for i in ims]
c = Image.new('RGB', (sum(i.width for i in ims) + 10 * len(ims), 600), 'white'); x = 0
for i in ims:
    c.paste(i, (x, 0)); x += i.width + 10
c.save(out, quality=82)
