"""Genera las plantillas de muestra en plantillas/<slug>/ a partir del motor comun (herramientas/motor)."""
import io, json, os, shutil, sys, urllib.request
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOTOR = os.path.join(RAIZ, "herramientas", "motor")
MUSICA = os.path.join(RAIZ, "herramientas", "_musica")
WA = "573025299255"

ICONOS = {
    "fecha": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="7" y="10" width="34" height="30" rx="5"/><path d="M7 19h34M16 6v8M32 6v8"/><path d="M21 29l3 3 6-7"/></svg>',
    "lugar": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M24 43s13-12.5 13-23a13 13 0 0 0-26 0c0 10.5 13 23 13 23z"/><circle cx="24" cy="20" r="5"/></svg>',
    "vestir": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6l-3 8 5 5-9 23h24l-9-23 5-5-3-8"/><path d="M19 6c2 3 8 3 10 0"/></svg>',
    "regalo": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="18" width="32" height="24" rx="3"/><path d="M6 12h36v6H6zM24 12v30"/><path d="M24 12c-4-7-12-6-10-1 1 2 6 1 10 1zM24 12c4-7 12-6 10-1-1 2-6 1-10 1z"/></svg>',
    "confirmar": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h32v22H20l-8 7v-7H8z"/><path d="M17 23l5 5 9-10"/></svg>',
    "padrinos": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="17" cy="16" r="6"/><circle cx="31" cy="16" r="6"/><path d="M6 40c1-8 6-12 11-12s10 4 11 12M22 33c2-3 5-5 9-5 5 0 10 4 11 12"/></svg>',
    "mesa": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><ellipse cx="24" cy="22" rx="16" ry="6"/><path d="M24 28v12M16 42h16M8 22v8M40 22v8"/></svg>',
    "galeria": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="12" width="36" height="28" rx="4"/><path d="M17 12l3-5h8l3 5"/><circle cx="24" cy="26" r="7"/></svg>',
    "voto": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M24 40S7 30 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22z"/></svg>',
    "musica": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 36V10l22-4v26"/><circle cx="13" cy="36" r="5"/><circle cx="35" cy="32" r="5"/><path d="M18 17l22-4"/></svg>',
    "itinerario": '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="24" cy="24" r="17"/><path d="M24 13v11l7 5"/></svg>',
}

MOTIVOS = {
    "flor": '<path d="M140 20c-6-10-18-12-24-6 8 0 16 2 24 6zM140 20c6-10 18-12 24-6-8 0-16 2-24 6zM140 20c-5-4-5-11 0-15 5 4 5 11 0 15zM140 20c-4 4-4 9 0 13 4-4 4-9 0-13z" stroke-width="1.1"/><circle cx="140" cy="20" r="2.4" fill="C" stroke="none"/>',
    "estrella": '<path d="M140 6c1.5 8 4 11 12 14-8 3-10.5 6-12 14-1.5-8-4-11-12-14 8-3 10.5-6 12-14z" fill="C" stroke="none"/><circle cx="124" cy="20" r="1.5" fill="C" stroke="none"/><circle cx="156" cy="20" r="1.5" fill="C" stroke="none"/>',
    "corazon": '<path d="M140 31s-11-7-11-15a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 8-11 15-11 15z" stroke-width="1.3"/>',
    "hoja": '<path d="M140 20c-10-9-22-9-28-3 7 5 18 6 28 3zM140 20c10-9 22-9 28-3-7 5-18 6-28 3z" stroke-width="1.2"/><path d="M112 17l56 6" stroke-width=".8"/>',
    "cruz": '<path d="M140 5v30M131 14h18" stroke-width="1.6"/><circle cx="118" cy="20" r="1.6" fill="C" stroke="none"/><circle cx="162" cy="20" r="1.6" fill="C" stroke="none"/>',
    "globo": '<ellipse cx="140" cy="15" rx="7" ry="9" stroke-width="1.3"/><path d="M140 24l-2 3h4zM140 27c-3 4 3 6 0 10" stroke-width="1"/>',
    "linea": '<circle cx="140" cy="20" r="3" fill="C" stroke="none"/><circle cx="140" cy="20" r="7" stroke-width="1"/>',
}


def separador(color, motivo):
    m = MOTIVOS[motivo].replace('"C"', f'"{color}"')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 40" fill="none" stroke="{color}" stroke-linecap="round">'
            f'<path d="M8 20H104M176 20H272" stroke-width="1"/>{m}</svg>')


def seccion(ico, cuerpo):
    return f'''  <div class="separador revelar" aria-hidden="true"></div>
  <section class="revelar">
    <div class="ico">{ICONOS[ico]}</div>
{cuerpo}
  </section>
'''


def construir(p):
    slug = p["slug"]
    dest = os.path.join(RAIZ, "plantillas", slug)
    if os.path.isdir(dest):
        shutil.rmtree(dest)
    os.makedirs(os.path.join(dest, "img")); os.makedirs(os.path.join(dest, "css")); os.makedirs(os.path.join(dest, "js"))
    # imagen de portada
    datos = urllib.request.urlopen(p["imagen"]).read()
    im = Image.open(io.BytesIO(datos)).convert("RGB")
    w, h = im.size; r = 9 / 16
    if w / h > r:
        nw = int(h * r); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / r); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize((1080, 1920), Image.LANCZOS).save(os.path.join(dest, "img", "portada.webp"), quality=84)
    open(os.path.join(dest, "img", "separador.svg"), "w", encoding="utf-8").write(separador(p["vars"]["acento"], p["motivo"]))
    shutil.copy(os.path.join(MUSICA, p["musica"] + ".mp3"), os.path.join(dest, "img", "musica.mp3"))
    shutil.copy(os.path.join(MOTOR, "estilos.css"), os.path.join(dest, "css", "estilos.css"))
    shutil.copy(os.path.join(MOTOR, "app.js"), os.path.join(dest, "js", "app.js"))
    if p.get("premium"):
        shutil.copy(os.path.join(MOTOR, "premium.js"), os.path.join(dest, "js", "premium.js"))
    if p.get("munequito"):
        m = Image.open(io.BytesIO(urllib.request.urlopen(p["munequito"]).read())).convert("RGBA")
        m = m.crop(m.getchannel("A").getbbox())
        m.thumbnail((700, 700), Image.LANCZOS)
        m.save(os.path.join(dest, "img", "munequito.webp"), quality=88)

    datosjs = {
        "nombre": p["nombre"], "evento": p["evento"], "fechaISO": p["fechaISO"], "fechaTexto": p["fechaTexto"],
        "anioHora": p["anioHora"], "lugar": p["lugar"], "direccion": p["direccion"], "ciudad": p["ciudad"],
        "mapa": "https://www.google.com/maps/search/?api=1&query=" + urllib.request.quote(p["ciudad"]),
        "whatsapp": WA, "whatsappMensaje": "¡Hola! Soy {nombre} y confirmo mi asistencia a " + p["evento"] + " 💛",
        "musica": "img/musica.mp3", "apertura": p["apertura"], "particulas": p["particulas"],
        "colores": p.get("colores"), "muestra": True,
    }
    if p.get("premium"):
        datosjs["premium"] = p["premium"]
    if p.get("lugar2"):
        datosjs.update({"lugar2": p["lugar2"][0], "direccion2": p["lugar2"][1],
                        "mapa2": "https://www.google.com/maps/search/?api=1&query=" + urllib.request.quote(p["ciudad"])})
    open(os.path.join(dest, "js", "datos.js"), "w", encoding="utf-8").write(
        "/* Datos de la plantilla de muestra: cambia aqui textos, fecha, lugar, musica y numero. */\nconst DATOS = "
        + json.dumps(datosjs, ensure_ascii=False, indent=2) + ";\n")

    # ---------- secciones ----------
    s = seccion("fecha", '''    <p class="dato" data-campo="fechaTexto"></p>
    <p class="sub" data-campo="anioHora"></p>
    <div class="cuenta"><div><b id="cDias">00</b><span>días</span></div><div><b id="cHoras">00</b><span>horas</span></div><div><b id="cMin">00</b><span>min</span></div><div><b id="cSeg">00</b><span>seg</span></div></div>''')
    if p.get("padrinos"):
        s += seccion("padrinos", f'''    <h3 class="tit">{p["padrinos"][0]}</h3>
    <p class="sub">{p["padrinos"][1]}</p>''')
    s += seccion("lugar", f'''    <h3 class="tit">{p.get("titLugar", "Lugar")}</h3>
    <p class="dato" data-campo="lugar"></p>
    <p class="sub" data-campo="direccion"></p>
    <p class="sub" data-campo="ciudad"></p>
    <a class="boton" data-mapa="mapa" href="#" target="_blank" rel="noopener">Ver ubicación</a>''')
    if p.get("lugar2"):
        s += seccion("lugar", f'''    <h3 class="tit">{p["lugar2"][2]}</h3>
    <p class="dato" data-campo="lugar2"></p>
    <p class="sub" data-campo="direccion2"></p>
    <a class="boton boton--claro" data-mapa="mapa2" href="#" target="_blank" rel="noopener">Ver ubicación</a>''')
    if p.get("itinerario"):
        filas = "\n".join(f'      <div class="linea"><b>{a}</b><span>{b}</span></div>' for a, b in p["itinerario"])
        s += seccion("itinerario", f'''    <h3 class="tit">Itinerario</h3>
    <div>
{filas}
    </div>''')
    if p.get("vestir"):
        filas = "\n".join(f'      <div class="linea"><b>{a}</b><span>{b}</span></div>' for a, b in p["vestir"]["lineas"])
        puntos = "".join(f'<i class="punto" style="background:{c}"></i>' for c in p["vestir"].get("colores", []))
        extra = f'\n    <div class="puntos">{puntos}</div>' if puntos else ""
        nota = f'\n    <p class="sub">{p["vestir"]["nota"]}</p>' if p["vestir"].get("nota") else ""
        s += seccion("vestir", f'''    <h3 class="tit">Vestimenta</h3>
    <div>
{filas}
    </div>{extra}{nota}''')
    if p.get("voto"):
        s += seccion("voto", f'''    <h3 class="tit">¿Tú qué crees?</h3>
    <p class="sub">Vota y cuéntanos tu corazonada</p>
    <div class="votos"><button type="button" data-voto="Niño 💙" style="background:#7fb2e5">Niño</button><button type="button" data-voto="Niña 💗" style="background:#f19bbd">Niña</button></div>''')
    s += seccion("regalo", f'''    <h3 class="tit">{p["regalo"][0]}</h3>
    <p class="sub">{p["regalo"][1]}</p>''')
    if p.get("premium"):
        s += seccion("mesa", '''    <h3 class="tit">Encuentra tu mesa</h3>
    <p class="sub">Escribe el código de tu invitación o tu nombre</p>
    <input class="campo" id="codigoMesa" type="text" placeholder="Ej: FAMGOMEZ o Carolina" autocomplete="off">
    <div class="resultado" id="resultadoMesa"></div>
    <button class="boton boton--claro" id="btnMesa" type="button">Buscar mi mesa</button>''')
        s += seccion("galeria", '''    <h3 class="tit">Galería de invitados</h3>
    <p class="sub">Comparte las fotos que tomes en la boda. ¡Todos podrán verlas aquí!</p>
    <input class="campo" id="autorFoto" type="text" placeholder="Tu nombre" autocomplete="name">
    <label class="boton boton-subir">📸 Subir mis fotos<input id="subirFotos" type="file" accept="image/*" multiple></label>
    <p class="estado" id="estadoGaleria">Cargando fotos…</p>
    <div class="galeria" id="galeria"></div>''')
        s += seccion("musica", '''    <h3 class="tit">Nuestra playlist</h3>
    <p class="sub">La música que sonará en la fiesta. ¿Falta tu canción? ¡Sugiérela!</p>
    <div class="playlist" id="playlist"></div>
    <a class="boton boton--claro" id="abrirPlaylist" href="#" target="_blank" rel="noopener">Abrir playlist</a>
    <div class="dos-campos"><input class="campo" id="cancion" type="text" placeholder="Canción"><input class="campo" id="artista" type="text" placeholder="Artista"></div>
    <button class="boton" id="btnCancion" type="button">Sugerir canción</button>
    <p class="estado" id="estadoCancion"></p>
    <ul class="canciones" id="listaCanciones"></ul>''')
    s += seccion("confirmar", f'''    <h3 class="tit">Confirma tu asistencia</h3>
    <p class="sub">{p.get("confirmaTexto", "Nos encantará saber que vienes.")}</p>
    <label class="oculto" for="nombreInvitado">Tu nombre</label>
    <input class="campo" id="nombreInvitado" type="text" placeholder="Escribe tu nombre" autocomplete="name">
    <p class="error" id="errorNombre" hidden>Escribe tu nombre para confirmar</p>''' + ('''
    <select class="selector" id="cuposInvitado" aria-label="Cuántos asisten"><option value="1">1 persona</option><option value="2">2 personas</option></select>''' if p.get("premium") else "") + f'''
    <button class="boton" id="btnConfirmar" type="button">Confirmar por WhatsApp</button>''' +
                 (f'\n    <p class="nota">{p["nota"]}</p>' if p.get("nota") else ""))
    s += f'''  <div class="separador revelar" aria-hidden="true"></div>
  <footer class="cierre revelar">
    <p class="tit">{p["cierre"]}</p>
    <p class="nombre" data-campo="nombre"></p>
  </footer>
'''

    v = p["vars"]
    mun = p.get("munequito")
    mun_portada = f'  <img class="munequito" src="img/munequito.webp" alt="" style="--mun-top:{p.get("munTop", "8%")}">\n' if mun and p.get("munPortada", True) else ""
    cabecera = '<img class="munequito munequito--hoja" src="img/munequito.webp" alt="">' if mun else '<div class="arco" role="img" aria-label=""></div>'
    saludo = '\n    <p class="saludo" id="saludoInvitado" hidden><b></b><span></span></p>' if p.get("premium") else ""
    premium_js = '\n<script src="js/premium.js"></script>' if p.get("premium") else ""
    raiz = ";".join(f"--{k}:{val}" for k, val in v.items())
    rasca = ""
    if p["apertura"] == "rasca":
        rasca = f'  <div class="rasca"><div class="rasca__msg">{p["rascaMsg"]}</div><canvas aria-label="Rasca para descubrir"></canvas></div>\n'
    pista = "Rasca el círculo" if p["apertura"] == "rasca" else p.get("pista", "Toca para abrir")
    boton = "" if p["apertura"] == "rasca" else '  <button class="portada__boton" id="abrir" type="button" aria-label="Abrir la invitación"></button>\n'
    sub = f'\n    <p class="subnombre">{p["subnombre"]}</p>' if p.get("subnombre") else ""
    html = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{p["titulo"]}</title>
<meta name="description" content="{p["evento"].capitalize()} · {p["fechaTexto"]} · Invitación de muestra de Invitaciones Web Colombia">
<meta name="theme-color" content="{v["fondo"]}">
<meta property="og:title" content="{p["titulo"]}">
<meta property="og:image" content="img/portada.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{"&".join("family=" + f for f in p["fuentes"])}&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="img/portada.webp">
<link rel="stylesheet" href="css/estilos.css">
<style>:root{{{raiz}}}</style>
<script>
  (function () {{
    var r = document.documentElement.style, u = function (f) {{ return 'url("' + new URL(f, location.href).href + '")'; }};
    r.setProperty("--arte", u("img/portada.webp"));
    r.setProperty("--separador", u("img/separador.svg"));
  }})();
</script>
</head>
<body class="cerrado iconos--{p.get("iconos", "linea")}">

<section class="portada{" portada--rasca" if p["apertura"] == "rasca" else ""}" id="portada" aria-label="Portada">
  <div class="arte"></div>
  <div class="portada__velo"></div>
  <div class="escena" id="escena"></div>
  <div class="particulas particulas--portada" aria-hidden="true"></div>
  <div class="portada__texto">
    <p class="portada__eti">{p["eti"]}</p>
    <h1 class="portada__nombre">{p["nombre"]}</h1>
    <p class="portada__fecha">{p["fechaCorta"]}</p>
  </div>
{mun_portada}{rasca}  <div class="manito" aria-hidden="true">👆</div>
  <p class="portada__pista">{pista}</p>
{boton}</section>

<main class="invitacion" id="invitacion">
  <div class="particulas particulas--hoja" aria-hidden="true"></div>
  <button class="musica" id="musica" type="button" aria-label="Pausar o reproducir música">♪</button>

  <header class="inicio">
    {cabecera}
    <p class="eti">{p["eti"]}</p>
    <h2 class="nombre" data-campo="nombre"></h2>{sub}
    <p class="frase">{p["frase"]}</p>{saludo}
  </header>

{s}</main>

<audio id="audio" preload="auto" loop></audio>
<script src="js/datos.js"></script>
<script src="js/app.js"></script>{premium_js}
</body>
</html>
'''
    open(os.path.join(dest, "index.html"), "w", encoding="utf-8").write(html)
    open(os.path.join(dest, "README.md"), "w", encoding="utf-8").write(
        f"# {p['tarjeta']} ({p['categoria']})\n\nPlantilla de muestra con datos ficticios. Apertura: **{p['apertura']}** · "
        f"partículas: **{p['particulas']}** · música propia sin derechos (`herramientas/musica_libre.py`, estilo `{p['musica']}`).\n\n"
        "Generada con `herramientas/crear_plantillas.py` (motor en `herramientas/motor/`). Para un cliente: copiar a "
        "`clientes/<evento>/`, editar `js/datos.js` (quitar `muestra`), el nombre en `index.html` y la música.\n")
    print("ok", slug)


if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from plantillas_config import PLANTILLAS
    solo = sys.argv[1:]
    for p in PLANTILLAS:
        if not solo or p["slug"] in solo:
            construir(p)
