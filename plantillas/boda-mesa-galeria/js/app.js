(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const azar = (a, b) => a + Math.random() * (b - a);

  // ---------- Textos ----------
  $$("[data-campo]").forEach((el) => { el.textContent = DATOS[el.dataset.campo] || ""; });
  $$("[data-mapa]").forEach((el) => { el.href = DATOS[el.dataset.mapa]; });

  // ---------- Música ----------
  const audio = $("#audio");
  const btnMusica = $("#musica");
  audio.src = DATOS.musica;
  btnMusica.addEventListener("click", () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  audio.addEventListener("play", () => btnMusica.classList.remove("pausa"));
  audio.addEventListener("pause", () => btnMusica.classList.add("pausa"));

  // ---------- Partículas ----------
  function particulas(caja, tipo, cantidad) {
    if (!caja) return;
    for (let i = 0; i < cantidad; i++) {
      const p = document.createElement("i");
      p.className = "p p--" + tipo;
      p.style.left = azar(0, 100) + "%";
      p.style.top = azar(0, 100) + "%";
      p.style.setProperty("--d", azar(0, 6).toFixed(2) + "s");
      p.style.setProperty("--t", azar(0.7, 1.4).toFixed(2));
      p.style.setProperty("--x", azar(-40, 40).toFixed(0) + "px");
      if (DATOS.colores) p.style.setProperty("--c", DATOS.colores[i % DATOS.colores.length]);
      caja.appendChild(p);
    }
  }
  particulas($(".particulas--portada"), DATOS.particulas, 18);
  particulas($(".particulas--hoja"), DATOS.particulas, 12);

  function estallido(cantidad) {
    const caja = document.createElement("div");
    caja.className = "estallido";
    document.body.appendChild(caja);
    const cx = innerWidth / 2, cy = innerHeight * 0.45;
    const colores = DATOS.colores || ["#f5c542", "#ff6b5b", "#4cc9f0", "#b388eb"];
    for (let i = 0; i < cantidad; i++) {
      const c = document.createElement("i");
      c.style.background = colores[i % colores.length];
      c.style.left = cx + "px"; c.style.top = cy + "px";
      caja.appendChild(c);
      const ang = azar(0, Math.PI * 2), vel = azar(120, Math.max(innerWidth, innerHeight) * 0.7);
      c.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * vel}px, ${Math.sin(ang) * vel + 260}px) rotate(${azar(-720, 720)}deg)`, opacity: 0 }
      ], { duration: azar(1200, 2200), easing: "cubic-bezier(.12,.7,.3,1)", fill: "forwards" });
    }
    setTimeout(() => caja.remove(), 2600);
  }

  // ---------- Piezas de la portada (para las aperturas) ----------
  const portada = $("#portada");
  const escena = $("#escena");
  function pieza(x, y, w, h, clase) {
    const d = document.createElement("div");
    d.className = "pieza " + (clase || "");
    Object.assign(d.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    const img = document.createElement("div");
    img.className = "pieza__img";
    Object.assign(img.style, { left: -x + "px", top: -y + "px", width: innerWidth + "px", height: innerHeight + "px" });
    d.appendChild(img);
    escena.appendChild(d);
    return d;
  }
  const W = () => innerWidth, H = () => innerHeight;
  const cuadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const APERTURAS = {
    async puertas() {
      const a = pieza(0, 0, W() / 2, H(), "o-izq"), b = pieza(W() / 2, 0, W() / 2, H(), "o-der");
      await cuadro();
      a.style.transform = "rotateY(-108deg)"; b.style.transform = "rotateY(108deg)";
      await espera(1600);
    },
    async cortina() {
      const a = pieza(0, 0, W() / 2, H(), "o-izq"), b = pieza(W() / 2, 0, W() / 2, H(), "o-der");
      await cuadro();
      a.style.transform = "translateX(-100%) scaleX(.35)"; b.style.transform = "translateX(100%) scaleX(.35)";
      await espera(1500);
    },
    async libro() {
      const a = pieza(0, 0, W(), H(), "o-izq libro");
      await cuadro();
      a.style.transform = "rotateY(-118deg)";
      await espera(1600);
    },
    async sobre() {
      const cuerpo = pieza(0, 0, W(), H(), "cuerpo");
      const solapa = pieza(0, 0, W(), H() * 0.46, "solapa");
      await cuadro();
      solapa.style.transform = "rotateX(180deg)";
      await espera(900);
      cuerpo.style.transform = solapa.style.transform + " translateY(0)";
      cuerpo.style.transform = "translateY(105%)";
      solapa.style.opacity = "0";
      await espera(1200);
    },
    async persiana() {
      const n = 7, w = W() / n, tiras = [];
      for (let i = 0; i < n; i++) tiras.push(pieza(i * w, 0, w + 1, H(), "tira"));
      await cuadro();
      tiras.forEach((t, i) => { t.style.transitionDelay = i * 90 + "ms"; t.style.transform = "rotateY(90deg)"; });
      await espera(1500);
    },
    async fotos() {
      const cols = 2, filas = 3, w = W() / cols, h = H() / filas, fotos = [];
      for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) fotos.push(pieza(c * w, f * h, w, h, "foto"));
      await cuadro();
      fotos.forEach((p) => p.classList.add("foto--marco"));
      await espera(450);
      fotos.forEach((p, i) => {
        p.style.transitionDelay = i * 110 + "ms";
        p.style.transform = `translate(${azar(-1, 1) * W()}px, ${azar(-0.6, 1.2) * H()}px) rotate(${azar(-50, 50)}deg) scale(.7)`;
        p.style.opacity = "0";
      });
      await espera(1700);
    },
    async subir() {
      const a = pieza(0, 0, W(), H(), "subir");
      await cuadro();
      a.style.transform = "translateY(-112%) rotate(-4deg)";
      await espera(1300);
    },
    async resplandor() {
      const a = pieza(0, 0, W(), H());
      const luz = document.createElement("div"); luz.className = "luz"; escena.appendChild(luz);
      await cuadro();
      luz.classList.add("luz--crece");
      await espera(1100);
      a.remove();
      luz.classList.add("luz--se-va");
      await espera(1000);
    },
    async nubes() {
      const a = pieza(0, 0, W(), H());
      const nubes = [];
      for (let i = 0; i < 10; i++) {
        const n = document.createElement("div");
        n.className = "nube " + (i % 2 ? "nube--der" : "nube--izq");
        n.style.top = (i * 11 - 8) + "%";
        n.style.setProperty("--s", azar(0.8, 1.3).toFixed(2));
        escena.appendChild(n); nubes.push(n);
      }
      await cuadro();
      nubes.forEach((n) => n.classList.add("nube--entra"));
      await espera(900);
      a.remove();
      nubes.forEach((n, i) => { n.style.transitionDelay = i * 40 + "ms"; n.classList.add("nube--sale"); });
      await espera(1500);
    },
    async globo() {
      const a = pieza(0, 0, W(), H(), "globo");
      await cuadro();
      estallido(110);
      a.style.transform = "scale(1.35)"; a.style.opacity = "0";
      await espera(900);
    },
    async iris() {
      const a = pieza(0, 0, W(), H(), "iris");
      await cuadro();
      a.style.clipPath = "circle(0% at 50% 50%)";
      await espera(1300);
    }
  };

  // ---------- Rasca y descubre ----------
  function prepararRasca() {
    const caja = $(".rasca");
    if (!caja) return null;
    const lienzo = caja.querySelector("canvas");
    const ctx = lienzo.getContext("2d");
    const r = caja.getBoundingClientRect();
    lienzo.width = r.width; lienzo.height = r.height;
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#d9dde6"); g.addColorStop(.5, "#f4f6fa"); g.addColorStop(1, "#bfc6d4");
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "#7d8599"; ctx.font = "600 17px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("RASCA AQUÍ", r.width / 2, r.height / 2 + 6);
    ctx.globalCompositeOperation = "destination-out";
    return new Promise((listo) => {
      let terminado = false;
      function rascar(e) {
        const t = e.touches ? e.touches[0] : e;
        const b = lienzo.getBoundingClientRect();
        ctx.beginPath(); ctx.arc(t.clientX - b.left, t.clientY - b.top, 30, 0, Math.PI * 2); ctx.fill();
        e.preventDefault();
        trazos++;
        if (trazos % 6 === 0) revisar();
      }
      let trazos = 0;
      function revisar() {
        if (terminado) return;
        const px = ctx.getImageData(0, 0, lienzo.width, lienzo.height).data;
        let vacios = 0;
        for (let i = 3; i < px.length; i += 64) if (px[i] === 0) vacios++;
        if (vacios / (px.length / 64) > 0.4 || trazos > 60) { terminado = true; lienzo.style.opacity = "0"; listo(); }
      }
      lienzo.addEventListener("pointerup", revisar);
      ["pointerdown", "pointermove", "touchmove"].forEach((ev) => lienzo.addEventListener(ev, (e) => {
        if (ev === "pointermove" && !(e.buttons || e.pointerType === "touch")) return;
        audio.play().catch(() => {});
        caja.classList.add("rasca--activa");
        rascar(e);
      }, { passive: false }));
    });
  }

  let abierta = false;
  async function abrir() {
    if (abierta) return;
    abierta = true;
    audio.play().catch(() => {});
    portada.classList.add("abriendo");
    await espera(250);
    portada.classList.add("sin-arte");
    await (APERTURAS[DATOS.apertura] || APERTURAS.iris)();
    portada.classList.add("fuera");
    document.body.classList.remove("cerrado");
    await espera(450);
    portada.remove();
  }

  const rasca = prepararRasca();
  if (rasca) {
    rasca.then(async () => { estallido(90); await espera(1600); abrir(); });
  } else {
    $("#abrir").addEventListener("click", abrir);
  }

  // ---------- Cuenta regresiva ----------
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
  contar(); setInterval(contar, 1000);

  // ---------- WhatsApp ----------
  const campo = $("#nombreInvitado"), error = $("#errorNombre");
  function whatsapp(texto) {
    window.open("https://wa.me/" + DATOS.whatsapp + "?text=" + encodeURIComponent(texto), "_blank");
  }
  $("#btnConfirmar").addEventListener("click", () => {
    const nombre = campo.value.trim();
    if (nombre.length < 2) { error.hidden = false; campo.focus(); return; }
    error.hidden = true;
    whatsapp(DATOS.whatsappMensaje.replace("{nombre}", nombre));
  });
  campo.addEventListener("input", () => { error.hidden = true; });
  $$("[data-voto]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-voto]").forEach((x) => x.classList.toggle("elegido", x === b));
    estallido(50);
    whatsapp("¡Hola! Mi voto para la revelación es: " + b.dataset.voto + " 🎉");
  }));
  const mesa = $("#btnMesa");
  if (mesa) mesa.addEventListener("click", () => {
    const c = $("#codigoMesa").value.trim();
    $("#resultadoMesa").textContent = c ? "¡Te esperamos en la mesa " + ((c.length % 9) + 1) + "! 🥂" : "Escribe el código de tu invitación";
  });

  // ---------- Aparición suave ----------
  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".revelar").forEach((el) => obs.observe(el));
})();
