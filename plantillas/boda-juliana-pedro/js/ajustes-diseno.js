(function () {
  "use strict";

  function ordenarNombres(selector) {
    const bloque = document.querySelector(selector);
    if (!bloque || bloque.dataset.ordenNombres === "1") return;

    const caroll = bloque.querySelector('[data-campo="novia"]');
    const mateo = bloque.querySelector('[data-campo="novio"]');
    let amp = bloque.querySelector(".amp");

    if (!amp) {
      amp = Array.from(bloque.children).find((el) => !el.hasAttribute("data-campo"));
    }
    if (!caroll || !mateo || !amp) return;

    caroll.classList.add("nombre-caroll");
    mateo.classList.add("nombre-mateo");
    amp.classList.add("amp-ajustado");

    /* Mateo queda como texto normal completo para conservar exactamente
       la misma fuente, tamaño, color y peso visual que la novia. */
    mateo.textContent = DATOS.novio;

    bloque.append(caroll, amp, mateo);
    bloque.classList.add("nombres-ordenados");
    bloque.dataset.ordenNombres = "1";
  }

  function actualizarTextosEstaticos() {
    document.title = `Boda ${DATOS.novia} & ${DATOS.novio}`;

    const descripcion = document.querySelector('meta[name="description"]');
    if (descripcion) descripcion.content = `Invitación a la boda de ${DATOS.novia} y ${DATOS.novio}.`;

    const ogTitulo = document.querySelector('meta[property="og:title"]');
    if (ogTitulo) ogTitulo.content = `${DATOS.novia} & ${DATOS.novio}`;

    const portada = document.querySelector(".portada");
    if (portada) portada.setAttribute("aria-label", `Portada de la invitación de ${DATOS.novia} y ${DATOS.novio}`);

    const fotoPortada = document.querySelector(".portada__foto");
    if (fotoPortada) fotoPortada.alt = `${DATOS.novia} y ${DATOS.novio}`;

    const abrir = document.querySelector("#abrirSobre");
    if (abrir) abrir.setAttribute("aria-label", `Abrir invitación de ${DATOS.novia} y ${DATOS.novio}`);

    const galeria = document.querySelector("#galeria");
    if (galeria) galeria.setAttribute("aria-label", `Galería de ${DATOS.novia} y ${DATOS.novio}`);
  }

  function limpiarContenidoGenerado() {
    document.querySelectorAll(".timeline__icono").forEach((icono) => icono.remove());

    document.querySelectorAll("#galeria .carrusel__item").forEach((item, i) => {
      item.setAttribute("aria-label", `Ver foto ${i + 1} de ${DATOS.novia} y ${DATOS.novio} en grande`);
    });
    document.querySelectorAll("#galeria .galeria__foto").forEach((img, i) => {
      img.alt = `Foto ${i + 1} de ${DATOS.novia} y ${DATOS.novio}`;
    });
  }

  function agregarFotoInterior() {
    const intro = document.querySelector(".bloque--intro");
    if (!intro || document.querySelector(".foto-despues-separador")) return;

    const marco = document.createElement("div");
    marco.className = "foto-despues-separador revelar";

    const video = document.createElement("img");
    video.src = "img/foto-interior.webp";
    video.alt = `${DATOS.novia} y ${DATOS.novio}`;
    video.decoding = "async";

    marco.appendChild(video);
    intro.insertAdjacentElement("afterend", marco);
    requestAnimationFrame(() => marco.classList.add("dentro"));
  }

  function aplicarAjustes() {
    ordenarNombres(".portada__nombres");
    ordenarNombres(".nombres-interior");
    actualizarTextosEstaticos();
    agregarFotoInterior();

    limpiarContenidoGenerado();
    requestAnimationFrame(() => {
      actualizarTextosEstaticos();
      limpiarContenidoGenerado();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarAjustes, { once:true });
  } else {
    aplicarAjustes();
  }
})();
