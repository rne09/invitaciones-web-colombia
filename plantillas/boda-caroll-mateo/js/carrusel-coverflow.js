(function () {
  "use strict";

  function iniciarGaleriaContinua() {
    const galeria = document.querySelector("#galeria");
    if (!galeria || galeria.dataset.movimientoContinuo === "1") return;

    const items = galeria.querySelectorAll(".carrusel__item");
    if (items.length < 2) {
      requestAnimationFrame(iniciarGaleriaContinua);
      return;
    }

    galeria.dataset.movimientoContinuo = "1";

    const scrollToNativo = galeria.scrollTo.bind(galeria);
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    let direccion = 1;
    let velocidad = 0;
    const velocidadBase = prefersReduced ? 0 : 18; // px/segundo: movimiento intencionalmente lento
    let ultimoTiempo = performance.now();
    let pausaHasta = 0;
    let permitirSaltoHasta = 0;
    let animacionManual = 0;

    function maxScroll() {
      return Math.max(0, galeria.scrollWidth - galeria.clientWidth);
    }

    function pausar(ms = 2300) {
      pausaHasta = performance.now() + ms;
    }

    function marcarControlManual() {
      permitirSaltoHasta = performance.now() + 1000;
      pausar(2600);
    }

    function cancelarAnimacionManual() {
      if (!animacionManual) return;
      cancelAnimationFrame(animacionManual);
      animacionManual = 0;
    }

    function easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function desplazarManual(destino, duracion = 720) {
      cancelarAnimacionManual();
      const limite = maxScroll();
      const final = Math.max(0, Math.min(limite, destino));
      const inicio = galeria.scrollLeft;
      const distancia = final - inicio;
      if (Math.abs(distancia) < 1) return;

      const comienzo = performance.now();
      function frame(ahora) {
        const progreso = Math.min(1, (ahora - comienzo) / duracion);
        galeria.scrollLeft = inicio + distancia * easeInOutCubic(progreso);
        if (progreso < 1) animacionManual = requestAnimationFrame(frame);
        else animacionManual = 0;
      }
      animacionManual = requestAnimationFrame(frame);
    }

    /* app.js intenta mover una foto completa cada 4.8 s. Para obtener el efecto
       continuo solicitado, ignoramos esos saltos automaticos. Si el usuario
       toca flechas o puntos, si dejamos pasar ese movimiento manual. */
    galeria.scrollTo = function (opciones, y) {
      if (typeof opciones === "object" && opciones !== null && Number.isFinite(opciones.left)) {
        if (opciones.behavior === "smooth") {
          if (performance.now() <= permitirSaltoHasta) {
            desplazarManual(opciones.left);
          }
          return;
        }
      }

      if (typeof opciones === "number" && Number.isFinite(opciones)) {
        scrollToNativo(opciones, Number.isFinite(y) ? y : 0);
        return;
      }

      scrollToNativo(opciones);
    };

    document.querySelector("#prevFoto")?.addEventListener("click", marcarControlManual, true);
    document.querySelector("#nextFoto")?.addEventListener("click", marcarControlManual, true);
    document.querySelector("#carruselPuntos")?.addEventListener("click", marcarControlManual, true);

    ["pointerdown", "touchstart", "wheel"].forEach((evento) => {
      galeria.addEventListener(evento, () => {
        cancelarAnimacionManual();
        pausar(2800);
      }, { passive: true });
    });

    function mover(ahora) {
      const dt = Math.min(0.05, Math.max(0, (ahora - ultimoTiempo) / 1000));
      ultimoTiempo = ahora;

      const invitacion = document.querySelector("#invitacion");
      const lightbox = document.querySelector("#lightbox");
      const visible = invitacion?.classList.contains("visible") && (!lightbox || lightbox.hidden);

      if (!prefersReduced && visible && ahora >= pausaHasta && !animacionManual) {
        const limite = maxScroll();
        if (limite > 1) {
          if (galeria.scrollLeft >= limite - 0.5 && direccion > 0) direccion = -1;
          if (galeria.scrollLeft <= 0.5 && direccion < 0) direccion = 1;

          /* La velocidad cambia gradualmente al invertir direccion. Esto evita
             el golpe visual al llegar a cada extremo. */
          const objetivo = direccion * velocidadBase;
          const suavizado = Math.min(1, dt * 2.6);
          velocidad += (objetivo - velocidad) * suavizado;

          let siguiente = galeria.scrollLeft + velocidad * dt;
          if (siguiente < 0) siguiente = 0;
          if (siguiente > limite) siguiente = limite;
          galeria.scrollLeft = siguiente;
        }
      } else {
        velocidad *= Math.max(0, 1 - dt * 4);
      }

      requestAnimationFrame(mover);
    }

    requestAnimationFrame(mover);
  }

  if (document.readyState === "complete") iniciarGaleriaContinua();
  else window.addEventListener("load", iniciarGaleriaContinua, { once: true });
})();
