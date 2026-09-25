(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);

  // Rellenar textos
  document.querySelectorAll("[data-campo]").forEach((el) => {
    el.textContent = DATOS[el.dataset.campo] || "";
  });
  $("#btnMapa").href = DATOS.mapa;

  // Música
  const audio = $("#audio");
  const btnMusica = $("#musica");
  audio.src = DATOS.musica;
  btnMusica.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  audio.addEventListener("play", () => { btnMusica.classList.remove("pausa"); btnMusica.setAttribute("aria-label", "Pausar música"); });
  audio.addEventListener("pause", () => { btnMusica.classList.add("pausa"); btnMusica.setAttribute("aria-label", "Reproducir música"); });

  // Apertura: lazo se desata (3 cuadros) y la tarjeta se abre como puertas
  const portada = $("#portada");
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  let abierta = false;

  $("#abrir").addEventListener("click", async () => {
    if (abierta) return;
    abierta = true;
    audio.play().catch(() => {});
    portada.classList.add("abriendo");
    const video = $("#videoLazo");
    await espera(300);
    portada.classList.add("p1");
    await new Promise((listo) => {
      video.addEventListener("ended", listo, { once: true });
      video.play().catch(listo);
      setTimeout(listo, 4000);
    });
    portada.classList.add("p3");
    await espera(60);
    portada.classList.add("p4");
    await espera(1500);
    portada.classList.add("fuera");
    document.body.classList.remove("cerrado");
    await espera(500);
    portada.remove();
  });

  // Cuenta regresiva
  let meta = new Date(DATOS.fechaISO).getTime();
  /* Plantilla de muestra: la cuenta regresiva nunca se vence (se reinicia cada 60 dias). */
  if (DATOS.muestra) { const ciclo = 60 * 864e5; meta = (Math.floor(Date.now() / ciclo) + 1) * ciclo + ciclo / 2; }
  const dos = (n) => String(n).padStart(2, "0");
  function contar() {
    const d = Math.max(0, meta - Date.now());
    $("#cDias").textContent = dos(Math.floor(d / 864e5));
    $("#cHoras").textContent = dos(Math.floor(d / 36e5) % 24);
    $("#cMin").textContent = dos(Math.floor(d / 6e4) % 60);
    $("#cSeg").textContent = dos(Math.floor(d / 1e3) % 60);
  }
  contar();
  setInterval(contar, 1000);

  // Confirmación por WhatsApp
  const campo = $("#nombreInvitado");
  const error = $("#errorNombre");
  $("#btnConfirmar").addEventListener("click", () => {
    const nombre = campo.value.trim();
    if (nombre.length < 2) {
      error.hidden = false;
      campo.focus();
      return;
    }
    error.hidden = true;
    const texto = DATOS.whatsappMensaje.replace("{nombre}", nombre);
    window.open("https://wa.me/" + DATOS.whatsapp + "?text=" + encodeURIComponent(texto), "_blank");
  });
  campo.addEventListener("input", () => { error.hidden = true; });

  // Aparición suave de las secciones
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".revelar").forEach((el) => obs.observe(el));
})();
