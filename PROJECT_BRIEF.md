# Project Brief - Invitaciones Web Colombia

## Que es

Sitio comercial estatico para vender invitaciones web/digitales para eventos sociales en Colombia.

Eventos objetivo:

- Bodas
- Quinceanos
- Baby showers
- Bautizos
- Primera comunion
- Revelaciones de genero
- Cumpleanos

## Estado actual

MVP estatico en HTML, CSS y JavaScript puro. No requiere build ni framework.

Se puede abrir localmente con:

```text
file:///G:/invitaciones-web-colombia/index.html
```

Tambien se puede publicar directamente en Netlify arrastrando la carpeta o conectando GitHub.

## Marca provisional

Nombre:

```text
Invitaciones Web Colombia
```

Dominio provisional usado en `sitemap.xml` y `robots.txt`:

```text
https://invitacionesweb.co
```

WhatsApp temporal configurado:

```text
573000000000
```

Antes de publicar comercialmente, cambiar ese numero en:

```text
js/config.js
```

## Estructura principal

```text
index.html                         Landing principal
catalogo/index.html                Catalogo filtrable
pedido/index.html                  Formulario de cotizacion por WhatsApp
admin/index.html                   Maqueta visual del panel privado
css/estilos.css                    Estilos globales
js/config.js                       Configuracion central
js/templates.js                    Datos de plantillas del catalogo
js/app.js                          Menu, WhatsApp, pedido y filtros
demos/baby-shower-azul/            Demo real anonima basada en plantilla previa
docs/                              Planeacion del negocio y tecnica
robots.txt                         SEO basico
sitemap.xml                        URLs publicas
netlify.toml                       Configuracion Netlify
_headers                           Headers Netlify
```

## Paginas creadas

Landing:

```text
/
```

Catalogo:

```text
/catalogo/
```

Pedido:

```text
/pedido/
```

Paginas SEO:

```text
/invitaciones-web-bodas/
/invitaciones-web-quinceanos/
/invitaciones-baby-shower/
/invitaciones-bautizo/
/invitaciones-primera-comunion/
/invitaciones-revelacion-genero/
/invitaciones-cumpleanos/
```

Admin prototipo:

```text
/admin/
```

Demo:

```text
/demos/baby-shower-azul/
```

## Importante sobre el admin

`admin/index.html` es solo una maqueta visual. No tiene login real, base de datos ni seguridad funcional.

El admin real se debe construir despues con autenticacion y base de datos.

## Demo Baby Shower Azul

La demo fue creada a partir de una invitacion previa, pero fue anonimizda:

- No contiene foto real de clientes.
- No contiene musica real.
- No contiene numero de la clienta anterior.
- Usa datos ficticios: Mateo, Valentina y Santiago.

## Validaciones realizadas

Se probaron con Playwright:

- Home
- Catalogo
- Pedido
- Admin
- Paginas SEO
- Demo Baby Shower Azul

Anchos probados:

- 390 px movil
- 1366 px escritorio

Resultado:

- Sin errores JS.
- Sin desbordes horizontales.
- CSS cargando.
- Catalogo filtrable funcionando.
- Formulario de pedido genera mensaje de WhatsApp.
- Admin marcado como `noindex`.

## Siguiente decision humana

Antes de publicar como marca real, decidir:

- Nombre definitivo.
- Usuario de Instagram.
- Dominio final.
- WhatsApp comercial real.
- Si el repo debe ser publico o privado.
- Si Netlify se conectara al repo o se subira manualmente.

