# Invitaciones Web Colombia

Proyecto para crear una marca y plataforma de invitaciones digitales para eventos:
bodas, quinceanos, bautizos, primera comunion, baby showers, revelaciones,
cumpleanos y eventos personalizados.

## Lectura rapida para IA

Empieza por:

```text
PROJECT_BRIEF.md
TODO.md
docs/01-estructura-web.md
docs/02-nombre-seo.md
docs/03-mapa-contenido.md
docs/04-siguiente-fase-admin.md
```

## Estado actual

MVP estatico en construccion.

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
- Prototipo visual de panel privado en `admin/index.html`.
- Pagina de pedido/cotizacion en `pedido/index.html`.
- Configuracion central en `js/config.js`.
- `robots.txt` y `sitemap.xml` con dominio provisional.
- `netlify.toml` y `_headers` para publicar como sitio estatico.
- `PROJECT_BRIEF.md` para contexto rapido.
- `TODO.md` como tablero de pendientes.

## Primera meta

Construir una pagina publica sencilla que venda el servicio y tenga:

- Inicio
- Catalogo
- Precios
- Como funciona
- Preguntas frecuentes
- Contacto por WhatsApp

La parte privada funcional y premium se construye despues de validar la oferta.

## Siguiente paso

Completar el MVP visual de la landing page:

- `index.html`
- `css/estilos.css`
- `js/app.js`
- carpeta `assets/`

La primera version debe incluir home, categorias, demos, precios, premium,
preguntas frecuentes y boton a WhatsApp.

Nota: antes de publicar, reemplazar el numero temporal `573000000000` por el
WhatsApp comercial real.

Tambien reemplazar el dominio provisional `https://invitacionesweb.co/` en
`sitemap.xml` y `robots.txt` cuando se defina el dominio final.
