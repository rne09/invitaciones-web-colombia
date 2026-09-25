"""Toma una captura de la portada de cada plantilla (360x720) para assets/miniaturas/.
Requiere un servidor local: python -m http.server 8931 --bind 127.0.0.1 (en la raiz del repo)."""
import os, subprocess, sys, tempfile
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(EDGE):
    EDGE = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
tmp = tempfile.mkdtemp()
for slug in sys.argv[1:]:
    html = os.path.join(tmp, "m.html")
    open(html, "w").write(f'<html><body style="margin:0;background:#000"><iframe src="http://127.0.0.1:8931/plantillas/{slug}/" '
                          'style="border:0;width:360px;height:720px"></iframe></body></html>')
    png = os.path.join(tmp, slug + ".png")
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=5000",
                    "--window-size=600,720", "--screenshot=" + png, "file:///" + html.replace("\\", "/")], capture_output=True)
    Image.open(png).convert("RGB").crop((0, 0, 360, 720)).save(os.path.join(RAIZ, "assets", "miniaturas", slug + ".webp"), quality=85)
    print("ok", slug)
