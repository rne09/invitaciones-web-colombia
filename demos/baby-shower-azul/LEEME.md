# Invitación web — Baby Shower

Página de una sola pantalla con sobre animado, música, cuenta regresiva,
mapa y confirmación por WhatsApp. Sin dependencias: HTML, CSS y JavaScript.

---

## Cómo personalizarla

Todo se edita en **`js/datos.js`**. Abre ese archivo, cambia los textos entre
comillas, guarda y recarga. No hace falta tocar nada más.

---

## El patrón de fondo (toile)

El fondo es un **mosaico que se repite**. Necesita ser *sin costura* (seamless):
que al pegarlo junto a sí mismo no se noten las uniones.

### Especificaciones para Photoshop

| Punto | Valor |
|---|---|
| Tamaño del lienzo | **1200 × 1200 px** (cuadrado) |
| Mínimo aceptable | 600 × 600 px |
| Resolución | 72 ppp |
| Modo de color | RGB / sRGB |
| Formato | **PNG-24 con transparencia** (preferido) o JPG |
| Peso | por debajo de 400 KB |
| Nombre del archivo | `patron-toile.png` |
| Dónde va | carpeta `assets/` |

Se guarda a 1200 px y se muestra a 300 px, así se ve nítido en pantallas
retina de móvil. Si tu patrón tiene motivos grandes y quieres que se vean más
grandes en pantalla, sube `patronTamano` en `js/datos.js` (por ejemplo a 360).

### Cómo hacerlo sin costura en Photoshop

1. Lienzo nuevo de 1200 × 1200 px, fondo transparente.
2. Coloca los motivos (jirafa, elefante, globo, árbol) **sin que toquen los bordes**.
3. `Filtro > Otro > Desplazamiento`, desplazamiento horizontal **600** y
   vertical **600**, opción **Dar la vuelta**. Ahora ves la unión en el centro.
4. Rellena esa cruz central con más motivos, cuidando de nuevo no tocar los bordes.
5. Vuelve a aplicar el desplazamiento de 600/600 para comprobar. Repite si hace falta.
6. `Archivo > Exportar > Exportar como…` → PNG, sin redimensionar.

> Truco: en Photoshop 2021 en adelante existe `Filtro > Otro > Desplazamiento`
> y también puedes usar `Edición > Definir motivo` para previsualizar el mosaico.

### Si prefieres no montar el mosaico

Déjame los motivos sueltos en PNG con fondo transparente (una jirafa, un
elefante, un globo, un árbol, unas estrellas) a unos **600 px de alto cada uno**
y yo compongo el mosaico sin costura.

### El patrón que ya está puesto

`assets/patron-toile.png` (386 × 767 px, fondo transparente) se extrajo de
`assets/mosaico-original.jpg` con `herramientas/hacer-tile.py`. El script
detectó que el motivo se repetía cada 386 px en horizontal y 767 en vertical,
y recortó exactamente un azulejo.

**Importante:** el azulejo es rectangular, no cuadrado. Ese es su periodo real;
recortarlo a cuadrado rompería la repetición vertical. En CSS se indica solo el
ancho (`patronTamano`) y el alto sale solo.

### La portada

`assets/arco-original.jpg` es la plantilla del arco. Los textos y el sobre se
colocan encima en porcentajes, dentro de la zona blanca útil:

| Referencia | Valor medido |
|---|---|
| Ancho útil del arco al 26% de alto | 74% |
| Ancho útil entre el 30% y el 60% | 80–87% |
| Altura del ápice del arco | 16% |
| Altura a la que entra la jirafa | 61% |

Por eso el contenido vive entre el **26% y el 62%** de altura, con 15% de margen
lateral. Si cambias la plantilla por otra, hay que volver a medir esos valores.

---

## Otros archivos que puedes poner en `assets/`

| Archivo | Para qué | Formato sugerido |
|---|---|---|
| `foto-papas.jpg` | Foto de los papás en la sección de regalos | JPG, ~1000 px de ancho |
| `ultrasonido.jpg` | Polaroid del ultrasonido | JPG cuadrado, ~700 px |
| `musica.mp3` | Música de fondo | MP3, 1–2 min, menos de 3 MB |
| `portada-og.jpg` | Miniatura al compartir por WhatsApp | JPG 1200 × 630 px |

Si un archivo no existe, esa parte simplemente no se muestra. No se rompe nada.

---

## Cómo verla en tu computadora

```bash
python -m http.server 5599 --directory "G:\invitacion-thiago"
```

Luego abre `http://localhost:5599` en el navegador.

---

## Cómo publicarla gratis

1. Crea una cuenta en [Netlify](https://app.netlify.com/drop) (o Cloudflare Pages).
2. Arrastra la carpeta `invitacion-thiago` completa a la zona de "drop".
3. Te da un enlace tipo `https://algo.netlify.app` — ese es el que compartes por WhatsApp.
4. Para actualizar, vuelves a arrastrar la carpeta.

Sin límite de visitas, sin marca de agua, gratis.
