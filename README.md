# Invitaciones Web Colombia

Proyecto para crear una marca y plataforma de invitaciones digitales para eventos:
bodas, quinceanos, bautizos, primera comunion, baby showers, revelaciones,
cumpleanos y eventos personalizados.

## Lectura rapida para IA

Empieza por:

```text
AI_HANDOFF.md
PROJECT_BRIEF.md
TODO.md
docs/01-estructura-web.md
docs/02-nombre-seo.md
docs/03-mapa-contenido.md
docs/04-siguiente-fase-admin.md
```

## Estado actual

Sitio publicado en Netlify (deploy automatico desde `main` en GitHub):

```text
https://invitacioneswebcolombia.netlify.app/
```

- Marca: **Invitaciones Web | Animadas** - Instagram `@invitacioneswebcolombia`.
- WhatsApp comercial: `573025299255` (en `js/config.js`).
- Colores: esmeralda `#134843`, champan `#f5e3bd`, terracota `#e8744a`.
  Fuentes: Playfair Display + Montserrat.
- Precios: Basica $70.000 - Personalizada desde $90.000 - Premium desde $180.000
  (Premium: invitados suben fotos y sugieren canciones; aun por construir).
- Todo el proyecto vive en `G:\invitaciones-web-colombia`. No guardar en el Escritorio.
- `instagram/` y `clientes/` estan en `.git/info/exclude`: nunca se suben al repo
  (datos privados de clientes y material de redes).

## Orden de trabajo

1. Definir nombre de marca, Instagram y dominio.
2. Crear estructura de la web publica.
3. Disenar la landing page.
4. Crear catalogo de plantillas.
5. Convertir invitaciones existentes en plantillas reutilizables.
6. Crear panel privado para editar invitaciones.
7. Agregar paquete premium con mesas, RSVP y galeria de invitados.
8. Integrar album profesional con Pixieset.

## Ya existe

- Landing publica en `index.html`.
- Catalogo filtrable en `catalogo/index.html`.
- Paginas SEO por tipo de evento.
- Prototipo de panel privado en `admin/index.html` con preview, guardado local y exportacion JSON.
- Pagina de pedido/cotizacion en `pedido/index.html`.
- Plantillas demo en `plantillas/`.
- Demo completa anonima en `demos/baby-shower-azul/`.
- Paginas basicas `politicas/` y `terminos/`.
- Favicon y manifest.
- Configuracion central en `js/config.js`.
- `robots.txt` y `sitemap.xml` con dominio provisional.
- `netlify.toml` y `_headers` para publicar como sitio estatico.
- `PROJECT_BRIEF.md` para contexto rapido.
- `TODO.md` como tablero de pendientes.

## Plantillas publicadas

| Evento | Carpeta | Nota |
|---|---|---|
| Boda | `plantillas/boda-juliana-pedro/` | Muestra completa con imagenes IA |
| Boda | `plantillas/boda-editorial/` | Conceptual, por rehacer |
| 15 anos | `plantillas/quince-esmeralda/` | **Nueva.** Terciopelo con lazo que se desata (video) y se abre en dos puertas. Datos ficticios (Valentina) |
| 15 anos | `plantillas/quince-glam/` | Conceptual, por rehacer |
| Baby shower | `plantillas/baby-shower-thiago/`, `plantillas/baby-safari/` | |
| Otros | `bautizo-capilla`, `primera-comunion`, `revelacion-celeste-rosa`, `cumple-garden` | Conceptuales |

Las plantillas de muestra usan `muestra: true` en `js/datos.js` para que la
cuenta regresiva nunca se venza.

## Invitaciones de clientes

Se guardan en `clientes/<evento>/` (fuera de git) y cada una se publica como
sitio propio de Netlify:

| Cliente | Enlace | Sitio Netlify |
|---|---|---|
| XV Juliana Sofia | https://xv-juliana-sofia.netlify.app | `36958838-e444-4a77-83b1-ae8e64e63930` |

Publicar (copiar solo `index.html css js img`, nunca `diseno/`):

```bash
netlify deploy --prod --dir <carpeta-copia> --site <site-id>
```

Ojo: los sitios nuevos de Netlify salen **privados**. Hacerlos publicos con:

```bash
netlify api updateSite --data '{"site_id":"<id>","body":{"sso_login":false}}'
```

## Siguiente paso recomendado

Convertir las plantillas conceptuales en demos completas vendibles, empezando por:

1. `plantillas/boda-editorial/`
2. `plantillas/quince-glam/`
3. `plantillas/primera-comunion/`

Luego construir backend real para el admin.

## Boda Premium (funcional)

Plantillas: `plantillas/boda-premium-olivo/`, `plantillas/boda-premium-toile/`, `plantillas/boda-mesa-galeria/`.

- **Galería de invitados:** los invitados suben fotos (se comprimen en el celular a 1600 px) y todos las ven.
  Se guardan en Netlify Blobs (tienda `galeria-invitados`) mediante `netlify/functions/fotos.mjs` → `/api/fotos`.
  Solo quien subió una foto puede borrarla. Para borrar como administrador: variable de entorno `CLAVE_ADMIN` en Netlify.
- **Mesas y cupos:** lista `premium.invitados` en `js/datos.js` (`codigo`, `nombre`, `mesa`, `cupos`).
  Enlace personal por invitado: `https://.../?i=CODIGO` → saludo con su nombre, cupos y mesa; la confirmación
  por WhatsApp incluye cuántos asisten y la mesa. También pueden buscar su mesa por código o nombre.
- **Playlist:** `premium.playlist = { app: "spotify" | "youtube" | "apple", url }` (se incrusta sola).
  Los invitados sugieren canciones (`/api/canciones`, tienda `canciones-invitados`).
- **Para un cliente:** copiar la plantilla a `clientes/<evento>/`, cambiar `premium.evento` por un id único
  (ej. `boda-ana-luis-2027`), cargar la lista de invitados, y agregar en `datos.js`
  `"api": "https://invitacioneswebcolombia.netlify.app/api"` (porque el sitio del cliente es otro dominio).
- Pixieset no sirve para fotos de invitados (no permite subidas públicas y exigiría exponer la cuenta);
  se usa solo como enlace al álbum profesional.
