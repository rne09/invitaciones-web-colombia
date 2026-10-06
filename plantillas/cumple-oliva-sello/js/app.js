(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);

  document.querySelectorAll("[data-campo]").forEach((el) => {
    el.textContent = DATOS[el.dataset.campo] || "";
  });
  $("#btnMapa").href = DATOS.mapa;

  const portada = $("#portada");
  const abrir = $("#abrir");
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  let abierta = false;

  abrir.addEventListener("click", async () => {
    if (abierta) return;
    abierta = true;
    portada.classList.add("abriendo");
    await espera(1050);
    portada.classList.add("fuera");
    document.body.classList.remove("cerrado");
    await espera(520);
    portada.remove();
  });

  let meta = new Date(DATOS.fechaISO).getTime();
  if (DATOS.muestra) {
    const ciclo = 60 * 864e5;
    meta = (Math.floor(Date.now() / ciclo) + 1) * ciclo + ciclo / 2;
  }
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

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".revelar").forEach((el) => obs.observe(el));
})();
