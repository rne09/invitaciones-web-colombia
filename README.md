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

MVP estatico publicable.

URL publica:

```text
https://rne09.github.io/invitaciones-web-colombia/
```

Documento principal:

```text
docs/01-estructura-web.md
docs/02-nombre-seo.md
docs/03-mapa-contenido.md
```

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

## Siguiente paso recomendado

Convertir las plantillas conceptuales en demos completas vendibles, empezando por:

1. `plantillas/boda-editorial/`
2. `plantillas/quince-glam/`
3. `plantillas/primera-comunion/`

Luego construir backend real para el admin.

Nota: antes de publicar, reemplazar el numero temporal `573000000000` por el
WhatsApp comercial real.

Tambien reemplazar el dominio provisional `https://invitacionesweb.co/` en
`sitemap.xml` y `robots.txt` cuando se defina el dominio final.
