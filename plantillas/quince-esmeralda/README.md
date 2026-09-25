# Plantilla XV - Esmeralda y Lazo

Invitacion de 15 anos. Datos de ejemplo ficticios (Valentina, 13 de marzo, Salon Jardin Real).

## Como funciona

1. **Portada:** terciopelo esmeralda con lazo champan (`img/lazo-0.webp`), tiara, estrellitas que titilan, manito y "Toca el lazo para abrir" parpadeando.
2. **Al tocar:** suena la musica, se reproduce `img/lazo.mp4` (lazo desatandose: 5 cuadros de Recraft fundidos a 30 fps) y la tarjeta se abre como dos puertas (`img/lazo-2.webp` partido en dos, CSS 3D).
3. **Interior:** sin cuadros, todo centrado, separadores florales (`img/separador.svg`): fecha + cuenta regresiva, lugar + Maps, vestimenta (pastel sugerido / verde reservado), lluvia de sobres, confirmacion por WhatsApp con nota sutil de solo adultos.

## Para un cliente nuevo

- Copiar la carpeta a `clientes/<evento>/`.
- Cambiar todo en `js/datos.js` (quitar `muestra: true` para que cuente a la fecha real) y el nombre en `index.html` (portada, `<title>`, metas).
- Reemplazar `img/musica.mp3` por la cancion del cliente.
- Fuentes: solo Great Vibes + Cormorant Garamond (`lining-nums` para que el 15 no salga pequeno).
