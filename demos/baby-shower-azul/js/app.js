/* ==========================================================================
   Logica de la invitacion. No hace falta tocar este archivo:
   todo lo personalizable esta en js/datos.js
   ========================================================================== */

(function () {
  "use strict";

  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------------------------------------------------------------
     1. Volcar los datos en la pagina
     --------------------------------------------------------------- */
  function pintarTextos() {
    $$("[data-campo]").forEach((el) => {
      const valor = DATOS[el.dataset.campo];
      if (valor === undefined || valor === null || valor === "") {
        // sin dato: escondemos el elemento para no dejar huecos
        el.textContent = "";
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.textContent = valor;
    });

    document.title = (DATOS.evento || "Invitación") + " · " + (DATOS.bebe || "");

    const bloqueFecha = $(".bloque--fecha");
    if (bloqueFecha && !(DATOS.diaSemana && DATOS.diaNumero && DATOS.mes && DATOS.anio)) {
      bloqueFecha.hidden = true;
    }
  }

  /* ---------------------------------------------------------------
     1b. Patron de fondo
     --------------------------------------------------------------- */
  /* OJO: si una variable CSS lleva un url() relativo, el navegador lo resuelve
     contra la hoja de estilos (css/), no contra el documento. Por eso hay que
     convertirlo a URL absoluta antes de meterlo en la variable.              */
  function urlCss(ruta) {
    return 'url("' + new URL(ruta, document.baseURI).href + '")';
  }

  function aplicarPatron() {
    const raiz = document.documentElement;

    raiz.style.setProperty("--patron", DATOS.patron ? urlCss(DATOS.patron) : "none");

    if (DATOS.patronTamano) {
      raiz.style.setProperty("--patron-tam", DATOS.patronTamano + "px");
    }
    if (DATOS.arco) {
      raiz.style.setProperty("--arco", urlCss(DATOS.arco));
    }
    if (DATOS.fondoToile) {
      raiz.style.setProperty("--fondo-toile", DATOS.fondoToile);
    }

    // En un <svg> la propiedad .hidden no existe: hay que poner el atributo.
    const mono = $("#mono");
    if (mono) {
      if (DATOS.mostrarMono === false) mono.setAttribute("hidden", "");
      else mono.removeAttribute("hidden");
    }
  }

  /* ---------------------------------------------------------------
     2. Dress code
     --------------------------------------------------------------- */
  function pintarPaleta() {
    const cont = $("#paleta");
    if (!cont) return;
    const colores = DATOS.dressCode || [];
    cont.innerHTML = "";
    colores.forEach((c) => {
      const i = document.createElement("i");
      i.style.background = c;
      i.title = c;
      cont.appendChild(i);
    });
    if (!colores.length) {
      cont.hidden = true;
      if (!DATOS.dressCodeNota) cont.closest(".bloque").hidden = true;
    }
  }

  /* ---------------------------------------------------------------
     3. Enlaces: mapa y WhatsApp
     --------------------------------------------------------------- */
  function pintarEnlaces() {
    const mapa = $("#btnMapa");
    if (mapa) {
      if (DATOS.lugarMapa) {
        mapa.href = DATOS.lugarMapa;
      } else {
        mapa.hidden = true;
      }
    }

    const wa = $("#btnWhatsapp");
    const nombreInvitado = $("#nombreInvitado");
    if (wa) {
      const num = (DATOS.whatsapp || "").replace(/\D/g, "");
      if (num) {
        const guardarNombre = () => {
          if (!nombreInvitado) return;
          try { localStorage.setItem("invitacionNombreInvitado", nombreInvitado.value.trim()); }
          catch (e) { /* localStorage puede estar bloqueado */ }
        };
        const actualizarMensaje = () => {
          const nombre = nombreInvitado ? nombreInvitado.value.trim() : "";
          const base = DATOS.whatsappMensaje || "";
          const mensaje = nombre
            ? base.replace("{nombre}", nombre)
            : base
                .replace("Soy {nombre} y ", "")
                .replace("soy {nombre} y ", "");
          wa.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(mensaje);
        };
        if (nombreInvitado) {
          try {
            const guardado = localStorage.getItem("invitacionNombreInvitado");
            if (guardado) nombreInvitado.value = guardado;
          } catch (e) { /* localStorage puede estar bloqueado */ }
          nombreInvitado.addEventListener("input", () => {
            guardarNombre();
            actualizarMensaje();
          });
        }
        actualizarMensaje();
      } else {
        wa.hidden = true;
      }
    }
  }

  /* ---------------------------------------------------------------
     4. Fotos (se ocultan solas si el archivo no existe)
     --------------------------------------------------------------- */
  function pintarFotos() {
    const marco   = $("#fotoMarco");
    const papas   = $("#fotoPapas");
    const polar   = $("#polaroid");
    const ultra   = $("#fotoUltra");
    let visibles  = 0;

    if (DATOS.fotoPapas) {
      papas.src = DATOS.fotoPapas;
      papas.hidden = false;
      visibles++;
      papas.addEventListener("error", () => { papas.hidden = true; revisarMarco(); });
    }
    if (DATOS.fotoUltrasonido) {
      ultra.src = DATOS.fotoUltrasonido;
      polar.hidden = false;
      visibles++;
      ultra.addEventListener("error", () => { polar.hidden = true; revisarMarco(); });
    }

    function revisarMarco() {
      const quedan = (!papas.hidden ? 1 : 0) + (!polar.hidden ? 1 : 0);
      marco.classList.toggle("vacio", quedan === 0);
      // sin foto grande, la polaroid se centra en vez de colgar del borde
      if (papas.hidden && !polar.hidden) {
        polar.style.position = "static";
        polar.style.width = "62%";
        polar.style.margin = "0 auto";
        polar.style.transform = "rotate(-4deg)";
      }
    }

    if (!visibles) marco.classList.add("vacio");
  }

  /* ---------------------------------------------------------------
     5. Cuenta regresiva
     --------------------------------------------------------------- */
  function arrancarCuenta() {
    const destino = new Date(DATOS.fechaISO).getTime();
    const bloque  = $(".bloque--cuenta");
    if (isNaN(destino)) { if (bloque) bloque.hidden = true; return; }

    const dd = $("#cDias"), hh = $("#cHoras"), mm = $("#cMin"), ss = $("#cSeg");
    const dos = (n) => String(n).padStart(2, "0");

    // se declara antes de tick(): si la fecha ya paso, la primera llamada
    // necesita poder pararlo, y con const aun sin inicializar reventaba.
    let reloj = null;
    let avisado = false;

    function tick() {
      const falta = destino - Date.now();

      if (falta <= 0) {
        dd.textContent = hh.textContent = mm.textContent = ss.textContent = "00";
        if (!avisado) {
          avisado = true;
          const cont = $("#cuenta");
          if (cont) cont.insertAdjacentHTML("afterend",
            '<p class="cuenta-final">La espera termino. Hoy celebramos este momento con mucho amor.</p>');
        }
        if (reloj) { clearInterval(reloj); reloj = null; }
        return;
      }

      const seg = Math.floor(falta / 1000);
      dd.textContent = dos(Math.floor(seg / 86400));
      hh.textContent = dos(Math.floor(seg % 86400 / 3600));
      mm.textContent = dos(Math.floor(seg % 3600 / 60));
      ss.textContent = dos(seg % 60);
    }

    tick();
    if (destino > Date.now()) reloj = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     6. Musica
     --------------------------------------------------------------- */
  const audio = $("#audio");
  const btnMus = $("#btnMusica");
  const controlMus = $("#controlMusica");
  const volumenMus = $("#volumenMusica");

  function prepararMusica() {
    if (!DATOS.musica) {
      if (controlMus) controlMus.hidden = true;
      else btnMus.hidden = true;
      return;
    }
    audio.src = DATOS.musica;
    audio.volume = Math.max(0, Math.min(1, Number(DATOS.volumenInicial ?? 0.5)));
    if (volumenMus) volumenMus.value = Math.round(audio.volume * 100);

    // si el archivo no existe, quitamos el boton en vez de mostrar un control roto
    audio.addEventListener("error", () => {
      if (controlMus) controlMus.hidden = true;
      else btnMus.hidden = true;
    });

    btnMus.addEventListener("click", () => {
      if (audio.paused) reproducir(); else pausar();
    });
    if (volumenMus) {
      volumenMus.addEventListener("input", () => {
        audio.volume = Number(volumenMus.value) / 100;
      });
    }

    audio.addEventListener("play",  () => marcar(true));
    audio.addEventListener("pause", () => marcar(false));
  }

  function marcar(sonando) {
    btnMus.classList.toggle("sonando", sonando);
    btnMus.querySelector(".btn-musica__txt").textContent = sonando ? "Pause" : "Play";
    btnMus.setAttribute("aria-label", sonando ? "Pausar música" : "Reproducir música");
  }

  function reproducir() {
    if (!DATOS.musica) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => { /* el navegador la bloqueo; el boton sigue ahi */ });
  }
  function pausar() { audio.pause(); }

  /* ---------------------------------------------------------------
     7. Abrir el sobre
     --------------------------------------------------------------- */
  function prepararSobre() {
    const portada = $("#portada");
    const sobre   = $("#abrirSobre");
    const invi    = $("#invitacion");
    const volver  = $("#btnVolverPortada");

    if (!portada || !invi) return;         // sin portada no hay nada que abrir
    let abierto = false;

    document.body.classList.add("bloqueado");

    function abrir() {
      if (abierto) return;
      abierto = true;

      if (sobre) sobre.classList.add("abierto");
      try { reproducir(); } catch (e) { /* el clic cuenta como gesto del usuario */ }

      setTimeout(() => portada.classList.add("se-va"), 900);

      setTimeout(() => {
        portada.style.display = "none";
        document.body.classList.remove("bloqueado");
        invi.classList.add("visible");
        invi.setAttribute("aria-hidden", "false");
        window.scrollTo(0, 0);
        observarBloques();
      }, 1600);
    }

    function volverPortada() {
      abierto = false;
      if (sobre) sobre.classList.remove("abierto");
      invi.classList.remove("visible");
      invi.setAttribute("aria-hidden", "true");
      portada.style.display = "";
      portada.classList.remove("se-va");
      document.body.classList.add("bloqueado");
      window.scrollTo(0, 0);
    }

    // Se abre tocando el sobre o cualquier punto de la portada.
    portada.addEventListener("click", abrir);
    // Respaldo para navegadores que no disparan click sobre el SVG del sello.
    portada.addEventListener("pointerup", abrir);
    // Y con el teclado, por accesibilidad.
    portada.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
    });
    if (volver) volver.addEventListener("click", volverPortada);

    prepararSobre.abrir = abrir;           // util para depurar desde la consola
    prepararSobre.volverPortada = volverPortada;
  }

  /* ---------------------------------------------------------------
     8. Aparicion suave al hacer scroll
     --------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------
     Arranque
     --------------------------------------------------------------- */
  /* Cada paso va aislado: si uno falla, los demas siguen funcionando.
     Lo importante es que prepararSobre() se ejecute pase lo que pase.      */
  function paso(nombre, fn) {
    try { fn(); }
    catch (e) { console.error("[invitacion] fallo en " + nombre + ":", e); }
  }

  paso("patron",   aplicarPatron);
  paso("textos",   pintarTextos);
  paso("paleta",   pintarPaleta);
  paso("enlaces",  pintarEnlaces);
  paso("fotos",    pintarFotos);
  paso("cuenta",   arrancarCuenta);
  paso("musica",   prepararMusica);
  paso("sobre",    prepararSobre);

})();
