# Plantilla de invitacion web Baby Shower

Plantilla de invitacion web estatica para Baby Shower. Esta hecha con HTML, CSS y JavaScript puro, sin framework ni build step, para que se pueda abrir localmente o publicar directo en GitHub Pages, Netlify, Cloudflare Pages o Vercel.

## Resumen para otra IA

Este proyecto fue creado como una invitacion movil estilo tarjeta/sobre:

- Portada vertical con fondo toile azul, arco cerrado, mono superior, jirafa y elefante en PNG.
- Sobre azul con sello dorado de pies de bebe. Al tocar el sello, el sobre se abre y aparece la invitacion.
- Puntero animado indicando donde tocar.
- Musica instrumental con control de play/pause y volumen al 50% por defecto.
- Estrellitas tipo destello de cuatro puntas que aparecen y desaparecen rapidamente.
- Secciones con animacion al hacer scroll.
- Cuenta regresiva al evento. Cuando llega a cero muestra un mensaje final.
- Lugar con boton a Google Maps.
- Confirmacion por WhatsApp con campo de nombre guardado en `localStorage`.
- Mensaje de dress code indicando que el azul esta reservado para los papas.

## Estructura

```text
.
|-- index.html
|-- css/
|   `-- estilos.css
|-- js/
|   |-- datos.js
|   `-- app.js
|-- assets/
|   |-- arco-portada-limpio.jpg
|   |-- patron-toile-soft.jpg
|   |-- jirafa-ai.png
|   |-- elefante-ai.png
|   |-- mono-real.png
|   |-- sello-pies.png
|   |-- foto-papas.jpg
|   `-- musica.mp3
`-- herramientas/
    |-- hacer-tile.py
    `-- recortar-animales.py
```

## Donde cambiar los datos

La mayoria de cambios se hacen en:

```text
js/datos.js
```

Campos importantes:

- `bebe`: nombre del bebe.
- `padres`: nombres de los papas.
- `fechaISO`: fecha real para la cuenta regresiva.
- `fechaTexto`, `horaTexto`: texto visible.
- `lugarNombre`, `lugarDetalle`, `lugarDireccion`: datos del lugar.
- `lugarMapa`: enlace del mapa.
- `whatsapp`: numero que recibe confirmaciones.
- `mensajeWhatsapp`: plantilla del mensaje.
- `dressCode`: texto del color reservado.
- `musica`: ruta del MP3.
- `patron`, `patronTamano`, `arco`: fondos visuales.

## Assets principales

- `assets/arco-portada-limpio.jpg`: imagen de portada con arco cerrado.
- `assets/patron-toile-soft.jpg`: mosaico de fondo suavizado.
- `assets/jirafa-ai.png` y `assets/elefante-ai.png`: animales en PNG con fondo transparente.
- `assets/mono-real.png`: mono azul proporcionado por el cliente.
- `assets/sello-pies.png`: sello dorado aprobado con pies de bebe.
- `assets/foto-papas.jpg`: foto de los papas.
- `assets/musica.mp3`: instrumental de fondo.

## Como se hizo el diseno

La base visual viene de referencias de invitaciones moviles de Baby Shower con tema azul, toile, arco, mono superior, animales infantiles y sobre con sello. El sitio se armo como una sola pagina responsive pensada primero para celular.

Detalles importantes:

- La portada usa porcentajes para posicionar contenido dentro del arco.
- El sobre se anima con transformaciones CSS para que la carta salga desde adentro.
- Las estrellitas no son texto: son mascaras SVG en CSS con forma de destello.
- El scroll reveal se controla con `IntersectionObserver` en `js/app.js`.
- La musica solo intenta reproducirse despues de abrir el sobre, para respetar restricciones del navegador.
- El formulario de asistencia guarda el nombre localmente y arma un mensaje de WhatsApp como: `Hola, soy {nombre} y confirmo mi asistencia.`

## Como probar localmente

Puedes abrir directamente:

```text
file:///G:/invitacion-thiago/index.html
```

O levantar un servidor local:

```powershell
python -m http.server 5599 --directory "G:\invitacion-thiago"
```

Luego abrir:

```text
http://localhost:5599
```

## Como crear otra invitacion similar

1. Duplica la carpeta o crea una copia del repositorio.
2. Cambia los datos en `js/datos.js`.
3. Reemplaza fotos, musica y PNGs en `assets/`.
4. Si cambia la plantilla del arco, ajusta posiciones en `css/estilos.css`.
5. Prueba en un viewport movil, idealmente 390 x 844.
6. Verifica que el sobre abra, que la musica suene despues del click, que WhatsApp use el nombre y que el mapa abra bien.

## Publicacion

Este proyecto no necesita compilacion. Para publicarlo, basta con subir la raiz del repositorio donde estan `index.html`, `css/`, `js/` y `assets/`.

Opciones recomendadas:

- GitHub Pages: ideal si quieres usar el mismo repositorio.
- Netlify Drop: rapido, arrastrando la carpeta.
- Cloudflare Pages: gratis y estable para sitios estaticos.
- Vercel: tambien funciona, aunque para este caso es mas de lo necesario.

## Notas

- No subir capturas `debug-*.png`; estan ignoradas en `.gitignore`.
- No subir archivos de musica duplicados ni `.wav` si no se usan.
- Para compartir por WhatsApp conviene agregar `assets/portada-og.jpg` de 1200 x 630 px y dejarlo referenciado en `index.html`.
