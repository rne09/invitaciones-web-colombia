(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function pintarTextos() {
    $$("[data-campo]").forEach((el) => {
      const valor = DATOS[el.dataset.campo];
      if (valor === undefined || valor === null || valor === "") {
        el.textContent = "";
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.textContent = valor;
    });
    document.title = `${DATOS.evento || "Invitación"} - ${DATOS.novio || ""} & ${DATOS.novia || ""}`;
  }

  function pintarEnlaces() {
    const ceremonia = $("#btnMapaCeremonia");
    const recepcion = $("#btnMapaRecepcion");
    if (ceremonia) ceremonia.href = DATOS.mapaCeremonia || "#";
    if (recepcion) recepcion.href = DATOS.mapaRecepcion || "#";

    const wa = $("#btnWhatsapp");
    const nombreInvitado = $("#nombreInvitado");
    const bloqueConfirmar = $(".bloque--confirmar");
    const num = (DATOS.whatsapp || "").replace(/\D/g, "");

    if (!wa || !num) {
      if (wa) wa.hidden = true;
      if (bloqueConfirmar) bloqueConfirmar.hidden = true;
      return;
    }

    if (bloqueConfirmar) bloqueConfirmar.hidden = false;

    const actualizar = () => {
      const nombre = nombreInvitado ? nombreInvitado.value.trim() : "";
      const base = DATOS.whatsappMensaje || "";
      const mensaje = nombre
        ? base.replace("{nombre}", nombre)
        : base.replace("soy {nombre} y ", "").replace("Soy {nombre} y ", "");
      wa.href = `https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`;
    };

    if (nombreInvitado) {
      try {
        const guardado = localStorage.getItem("bodaNombreInvitado");
        if (guardado) nombreInvitado.value = guardado;
      } catch (e) {}
      nombreInvitado.addEventListener("input", () => {
        try { localStorage.setItem("bodaNombreInvitado", nombreInvitado.value.trim()); } catch (e) {}
        actualizar();
      });
    }
    actualizar();
  }

  function iconoTimeline(texto) {
    const t = String(texto || "").toLowerCase();
    if (t.includes("eucarist") || t.includes("ceremon")) return "img/iglesia.webp";
    if (t.includes("recepción") || t.includes("recepcion")) return "img/copas.webp";
    if (t.includes("entrada")) return "img/anillos.webp";
    if (t.includes("brindis") || t.includes("cena")) return "img/clochecena.webp";
    if (t.includes("baile") || t.includes("pista") || t.includes("fiesta")) return "img/musica.webp";
    if (t.includes("ramo")) return "img/flores-separadores.webp";
    return "img/anillos.webp";
  }

  function pintarTimeline() {
    const cont = $("#timeline");
    if (!cont) return;
    cont.innerHTML = "";
    (DATOS.timeline || []).forEach(([hora, texto]) => {
      const item = document.createElement("div");
      item.className = "timeline__item";

      const icono = document.createElement("div");
      icono.className = "timeline__icono";
      icono.setAttribute("aria-hidden", "true");
      const img = document.createElement("img");
      img.src = iconoTimeline(texto);
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      icono.appendChild(img);

      const time = document.createElement("time");
      time.textContent = hora;
      const span = document.createElement("span");
      span.textContent = texto;

      item.append(icono, time, span);
      cont.appendChild(item);
    });
  }

  let fotoActual = 0;
  let carruselActual = 0;
  let carruselTimer = null;

  function pintarGaleria() {
    const cont = $("#galeria");
    const puntos = $("#carruselPuntos");
    if (!cont) return;
    cont.innerHTML = "";
    if (puntos) puntos.innerHTML = "";

    const fotos = DATOS.fotos || [];
    fotos.forEach((src, i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "carrusel__item";
      item.setAttribute("aria-label", `Ver foto ${i + 1} de ${DATOS.novia} y ${DATOS.novio} en grande`);

      const img = document.createElement("img");
      img.src = src;
      img.alt = `Foto ${i + 1} de ${DATOS.novia} y ${DATOS.novio}`;
      img.loading = i === 0 ? "eager" : "lazy";
      img.decoding = "async";
      img.className = "galeria__foto";
      img.addEventListener("load", () => {
        const vertical = img.naturalHeight > img.naturalWidth;
        item.classList.toggle("es-vertical", vertical);
        item.classList.toggle("es-horizontal", !vertical);
      });

      item.appendChild(img);
      item.addEventListener("click", () => abrirLightbox(i));
      cont.appendChild(item);

      if (puntos) {
        const punto = document.createElement("button");
        punto.type = "button";
        punto.className = "carrusel-punto";
        punto.setAttribute("aria-label", `Ir a foto ${i + 1}`);
        punto.addEventListener("click", () => irAFotoCarrusel(i, true));
        puntos.appendChild(punto);
      }
    });

    if (!fotos.length) {
      const bloque = cont.closest(".bloque");
      if (bloque) bloque.hidden = true;
      return;
    }

    actualizarPuntos(0);
    prepararCarrusel();
    prepararLightbox();
  }

  function actualizarPuntos(indice) {
    $$(".carrusel-punto").forEach((punto, i) => {
      punto.classList.toggle("activo", i === indice);
    });
  }

  function irAFotoCarrusel(indice, reiniciar = false) {
    const cont = $("#galeria");
    const items = $$("#galeria .carrusel__item");
    if (!cont || !items.length) return;
    const total = items.length;
    carruselActual = (indice + total) % total;
    const item = items[carruselActual];
    const izquierda = item.offsetLeft - Math.max(0, (cont.clientWidth - item.clientWidth) / 2);
    cont.scrollTo({ left: izquierda, behavior: "smooth" });
    actualizarPuntos(carruselActual);
    if (reiniciar) reiniciarCarruselAutomatico();
  }

  function prepararCarrusel() {
    const cont = $("#galeria");
    const prev = $("#prevFoto");
    const next = $("#nextFoto");
    const items = $$("#galeria .carrusel__item");
    if (!cont || !items.length) return;

    prev?.addEventListener("click", () => irAFotoCarrusel(carruselActual - 1, true));
    next?.addEventListener("click", () => irAFotoCarrusel(carruselActual + 1, true));

    let rafPendiente = false;
    cont.addEventListener("scroll", () => {
      if (rafPendiente) return;
      rafPendiente = true;
      requestAnimationFrame(() => {
        rafPendiente = false;
        const centro = cont.scrollLeft + cont.clientWidth / 2;
        let mejor = 0;
        let distancia = Infinity;
        items.forEach((item, i) => {
          const centroItem = item.offsetLeft + item.clientWidth / 2;
          const d = Math.abs(centro - centroItem);
          if (d < distancia) {
            distancia = d;
            mejor = i;
          }
        });
        carruselActual = mejor;
        actualizarPuntos(mejor);
      });
    }, { passive: true });

    ["pointerdown", "touchstart", "wheel"].forEach((evento) => {
      cont.addEventListener(evento, reiniciarCarruselAutomatico, { passive: true });
    });

    window.addEventListener("resize", () => irAFotoCarrusel(carruselActual));
    iniciarCarruselAutomatico();
  }

  function iniciarCarruselAutomatico() {
    detenerCarruselAutomatico();
    if ((DATOS.fotos || []).length < 2) return;
    carruselTimer = setInterval(() => {
      const invitacion = $("#invitacion");
      const lightbox = $("#lightbox");
      if (document.hidden || !invitacion?.classList.contains("visible") || !lightbox?.hidden) return;
      irAFotoCarrusel(carruselActual + 1);
    }, 4800);
  }

  function detenerCarruselAutomatico() {
    if (carruselTimer) {
      clearInterval(carruselTimer);
      carruselTimer = null;
    }
  }

  function reiniciarCarruselAutomatico() {
    iniciarCarruselAutomatico();
  }

  function prepararLightbox() {
    const lightbox = $("#lightbox");
    const fondo = $("#lightboxFondo");
    const cerrar = $("#cerrarLightbox");
    const prev = $("#lbPrev");
    const next = $("#lbNext");
    if (!lightbox) return;

    fondo?.addEventListener("click", cerrarLightbox);
    cerrar?.addEventListener("click", cerrarLightbox);
    prev?.addEventListener("click", () => cambiarFotoLightbox(-1));
    next?.addEventListener("click", () => cambiarFotoLightbox(1));

    let inicioX = null;
    lightbox.addEventListener("touchstart", (e) => {
      inicioX = e.changedTouches?.[0]?.clientX ?? null;
    }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (inicioX === null) return;
      const finX = e.changedTouches?.[0]?.clientX ?? inicioX;
      const delta = finX - inicioX;
      inicioX = null;
      if (Math.abs(delta) > 55) cambiarFotoLightbox(delta > 0 ? -1 : 1);
    }, { passive: true });
  }

  function abrirLightbox(indice) {
    const lightbox = $("#lightbox");
    if (!lightbox || !(DATOS.fotos || []).length) return;
    fotoActual = indice;
    pintarFotoLightbox();
    lightbox.hidden = false;
    document.body.classList.add("modal-abierto");
    detenerCarruselAutomatico();
    $("#cerrarLightbox")?.focus();
  }

  function cerrarLightbox() {
    const lightbox = $("#lightbox");
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("modal-abierto");
    iniciarCarruselAutomatico();
  }

  function cambiarFotoLightbox(paso) {
    const total = (DATOS.fotos || []).length;
    if (!total) return;
    fotoActual = (fotoActual + paso + total) % total;
    pintarFotoLightbox();
  }

  function pintarFotoLightbox() {
    const img = $("#lightboxImg");
    const contador = $("#lightboxContador");
    const fotos = DATOS.fotos || [];
    if (!img || !fotos.length) return;
    img.src = fotos[fotoActual];
    img.alt = `Foto ${fotoActual + 1} de ${DATOS.novia} y ${DATOS.novio}`;
    if (contador) contador.textContent = `${fotoActual + 1} / ${fotos.length}`;
  }

  const audio = $("#audio");
  const btnMus = $("#btnMusica");
  const controlMus = $("#controlMusica");

  function prepararMusica() {
    if (!DATOS.musica || !audio || !btnMus) {
      if (controlMus) controlMus.hidden = true;
      return;
    }
    audio.src = DATOS.musica;
    audio.volume = Math.max(0, Math.min(1, Number(DATOS.volumenInicial ?? 0.5)));
    audio.addEventListener("error", () => { if (controlMus) controlMus.hidden = true; });
    btnMus.addEventListener("click", () => audio.paused ? reproducir() : audio.pause());
    audio.addEventListener("play", () => marcarMusica(true));
    audio.addEventListener("pause", () => marcarMusica(false));
  }

  function marcarMusica(sonando) {
    if (!btnMus) return;
    btnMus.classList.toggle("sonando", sonando);
    const texto = btnMus.querySelector(".btn-musica__txt");
    if (texto) texto.textContent = sonando ? "Pause" : "Play";
    btnMus.setAttribute("aria-label", sonando ? "Pausar música" : "Reproducir música");
  }

  function reproducir() {
    if (!audio || !DATOS.musica) return;
    const intento = audio.play();
    if (intento && intento.catch) intento.catch(() => {});
  }

  function arrancarCuenta() {
    let destino = new Date(DATOS.fechaISO).getTime();
    /* Plantilla de muestra: la cuenta regresiva nunca se vence (se reinicia cada 60 dias). */
    if (DATOS.muestra) { const ciclo = 60 * 864e5; destino = (Math.floor(Date.now() / ciclo) + 1) * ciclo + ciclo / 2; }
    const bloque = $(".bloque--cuenta");
    if (Number.isNaN(destino)) {
      if (bloque) bloque.hidden = true;
      return;
    }

    const dd = $("#cDias"), hh = $("#cHoras"), mm = $("#cMin"), ss = $("#cSeg");
    const dos = (n) => String(n).padStart(2, "0");
    let reloj = null;

    function tick() {
      const falta = destino - Date.now();
      if (falta <= 0) {
        dd.textContent = hh.textContent = mm.textContent = ss.textContent = "00";
        if (reloj) clearInterval(reloj);
        return;
      }
      const seg = Math.floor(falta / 1000);
      dd.textContent = dos(Math.floor(seg / 86400));
      hh.textContent = dos(Math.floor(seg % 86400 / 3600));
      mm.textContent = dos(Math.floor(seg % 3600 / 60));
      ss.textContent = dos(seg % 60);
    }

    tick();
    reloj = setInterval(tick, 1000);
  }

  function prepararApertura() {
    const portada = $("#portada");
    const invitacion = $("#invitacion");
    const abrir = $("#abrirSobre");
    const volver = $("#btnVolverPortada");
    if (!portada || !invitacion || !abrir) return;

    let abierta = false;
    document.body.classList.add("bloqueado");

    function mostrar() {
      if (abierta) return;
      abierta = true;
      abrir.classList.add("abierto");
      reproducir();
      setTimeout(() => portada.classList.add("se-va"), 650);
      setTimeout(() => {
        portada.hidden = true;
        invitacion.classList.add("visible");
        invitacion.setAttribute("aria-hidden", "false");
        document.body.classList.remove("bloqueado");
        window.scrollTo(0, 0);
        observarBloques();
      }, 1200);
    }

    function regresar() {
      abierta = false;
      portada.hidden = false;
      portada.classList.remove("se-va");
      invitacion.classList.remove("visible");
      invitacion.setAttribute("aria-hidden", "true");
      abrir.classList.remove("abierto");
      document.body.classList.add("bloqueado");
      window.scrollTo(0, 0);
    }

    abrir.addEventListener("click", mostrar);
    volver?.addEventListener("click", regresar);
  }

  function observarBloques() {
    const bloques = $$(".revelar");
    if (!("IntersectionObserver" in window)) {
      bloques.forEach((b) => b.classList.add("dentro"));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("dentro");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px 18% 0px" });
    bloques.forEach((b) => obs.observe(b));
  }

  document.addEventListener("keydown", (e) => {
    const lightbox = $("#lightbox");
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") cerrarLightbox();
    if (e.key === "ArrowLeft") cambiarFotoLightbox(-1);
    if (e.key === "ArrowRight") cambiarFotoLightbox(1);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) reiniciarCarruselAutomatico();
  });

  function paso(nombre, fn) {
    try { fn(); }
    catch (e) { console.error("[boda] fallo en " + nombre, e); }
  }

  paso("textos", pintarTextos);
  paso("enlaces", pintarEnlaces);
  paso("timeline", pintarTimeline);
  paso("galeria", pintarGaleria);
  paso("cuenta", arrancarCuenta);
  paso("musica", prepararMusica);
  paso("apertura", prepararApertura);
})();