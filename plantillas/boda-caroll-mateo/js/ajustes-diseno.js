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
       la misma fuente, tamaño, color y peso visual que Caroll. */
    mateo.textContent = "Mateo";

    bloque.append(caroll, amp, mateo);
    bloque.classList.add("nombres-ordenados");
    bloque.dataset.ordenNombres = "1";
  }

  function actualizarTextosEstaticos() {
    document.title = "Boda Caroll & Mateo";

    const descripcion = document.querySelector('meta[name="description"]');
    if (descripcion) descripcion.content = "Invitación a la boda de Caroll y Mateo. 31 de octubre de 2026, Valledupar.";

    const ogTitulo = document.querySelector('meta[property="og:title"]');
    if (ogTitulo) ogTitulo.content = "Caroll & Mateo";

    const portada = document.querySelector(".portada");
    if (portada) portada.setAttribute("aria-label", "Portada de la invitación de Caroll y Mateo");

    const fotoPortada = document.querySelector(".portada__foto");
    if (fotoPortada) fotoPortada.alt = "Caroll y Mateo";

    const abrir = document.querySelector("#abrirSobre");
    if (abrir) abrir.setAttribute("aria-label", "Abrir invitación de Caroll y Mateo");

    const galeria = document.querySelector("#galeria");
    if (galeria) galeria.setAttribute("aria-label", "Galería de Caroll y Mateo");
  }

  function limpiarContenidoGenerado() {
    document.querySelectorAll(".timeline__icono").forEach((icono) => icono.remove());

    document.querySelectorAll("#galeria .carrusel__item").forEach((item, i) => {
      item.setAttribute("aria-label", `Ver foto ${i + 1} de Caroll y Mateo en grande`);
    });
    document.querySelectorAll("#galeria .galeria__foto").forEach((img, i) => {
      img.alt = `Foto ${i + 1} de Caroll y Mateo`;
    });
  }

  function agregarFotoInterior() {
    const intro = document.querySelector(".bloque--intro");
    if (!intro || document.querySelector(".foto-despues-separador")) return;

    const marco = document.createElement("div");
    marco.className = "foto-despues-separador revelar";

    const video = document.createElement("video");
    video.src = "img/caroll-mateo-sin-audio.mp4";
    video.setAttribute("aria-label", "Video de Caroll y Mateo");
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

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
