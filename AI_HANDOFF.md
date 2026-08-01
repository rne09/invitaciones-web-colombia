# AI Handoff - Invitaciones Web Colombia

Este archivo es para que otra IA pueda continuar el proyecto sin perder contexto.

## Estado publicado

Repositorio:

```text
https://github.com/rne09/invitaciones-web-colombia
```

Sitio actual en GitHub Pages:

```text
https://rne09.github.io/invitaciones-web-colombia/
```

Version verificada mas reciente:

```text
https://rne09.github.io/invitaciones-web-colombia/?v=a156f1f
```

## Que existe ahora

Proyecto estatico sin build:

- HTML
- CSS
- JavaScript puro
- Sin framework
- Sin backend
- Sin base de datos

Paginas principales:

- `/` landing comercial boutique.
- `/catalogo/` catalogo filtrable.
- `/pedido/` formulario que arma mensaje para WhatsApp.
- `/admin/` admin demo con preview, guardado local y exportacion JSON.
- `/politicas/` politicas base.
- `/terminos/` terminos base.

Plantillas demo:

- `/demos/baby-shower-azul/`
- `/plantillas/boda-editorial/`
- `/plantillas/quince-glam/`
- `/plantillas/baby-safari/`
- `/plantillas/bautizo-capilla/`
- `/plantillas/revelacion-celeste-rosa/`
- `/plantillas/cumple-garden/`
- `/plantillas/primera-comunion/`

## Archivos clave

```text
index.html                 Landing principal
css/estilos.css            Todo el sistema visual
js/config.js               Marca, WhatsApp, Instagram y dominio
js/templates.js            Datos del catalogo
js/app.js                  Menu, filtros, WhatsApp y pedido
admin/index.html           Admin demo
pedido/index.html          Pedido por WhatsApp
TODO.md                    Tablero de tareas
PROJECT_BRIEF.md           Contexto general
docs/                      Planeacion e investigacion
```

## No romper

- No cambiar rutas publicas sin actualizar `sitemap.xml`, enlaces internos y catalogo.
- No eliminar `demos/baby-shower-azul/`; es la demo mas completa.
- No poner datos reales de clientes en plantillas demo.
- No cambiar `admin/` como si fuera seguro; por ahora es prototipo visual/local.
- No borrar `netlify.toml`, `_headers`, `.nojekyll` ni `site.webmanifest`.

## Pendientes importantes

1. Cambiar el WhatsApp temporal `573000000000` en `js/config.js`.
2. Definir marca final, dominio e Instagram comercial.
3. Conectar Netlify al repo o decidir seguir en GitHub Pages.
4. Convertir las plantillas demo en plantillas completas tipo `demos/baby-shower-azul`.
5. Crear backend real para admin:
   - login
   - base de datos
   - subida de fotos
   - subida de musica
   - generador por cliente
   - deploy por evento
6. Construir premium real:
   - codigos por invitado
   - mesas
   - galeria colaborativa
   - permisos de borrado
   - enlace Pixieset

## Mejoras recomendadas primero

1. Hacer una demo completa de boda editorial.
2. Hacer una demo completa de quince glam.
3. Mejorar visualmente las tarjetas del catalogo con miniaturas reales.
4. Reemplazar textos legales base por textos finales del negocio.
5. Crear logo final en SVG editable.
6. Agregar imagen Open Graph final.
7. Mejorar SEO usando dominio real.

## Criterio visual

La direccion elegida es boutique/editorial:

- elegante
- emocional
- mobile first
- orientada a vender por WhatsApp
- menos SaaS generico
- mas experiencia de evento

Evitar:

- plantillas corporativas frias
- degradados morados/azules genericos
- copiar assets de terceros
- textos largos
- elementos que no funcionen bien en movil

## Verificacion rapida sugerida

Antes de entregar cambios:

```powershell
node --check js/app.js
node --check js/templates.js
python -m http.server 4177 --bind 127.0.0.1
```

Probar estas rutas:

```text
/
/catalogo/
/pedido/
/admin/
/plantillas/boda-editorial/
/plantillas/primera-comunion/
```

Luego subir:

```powershell
git add .
git commit -m "mensaje claro"
git push
```

