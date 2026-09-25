/* Funciones Premium: invitado personalizado (?i=CODIGO), mesas, galería de invitados y playlist. */
(function () {
  "use strict";
  const P = DATOS.premium;
  if (!P) return;
  const $ = (s) => document.querySelector(s);
  const API = (DATOS.api || "/api").replace(/\/$/, "");
  const normal = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  // ---------- Invitado personalizado ----------
  const codigoURL = (new URLSearchParams(location.search).get("i") || "").toUpperCase();
  const invitado = P.invitados.find((x) => x.codigo === codigoURL);
  function mostrarMesa(inv, destino) {
    destino.innerHTML = "";
    const b = document.createElement("div");
    b.className = "tarjeta-mesa";
    b.innerHTML = '<p class="tarjeta-mesa__nombre"></p><p class="tarjeta-mesa__mesa"></p><p class="tarjeta-mesa__cupos"></p>';
    b.children[0].textContent = inv.nombre;
    b.children[1].textContent = "Mesa " + inv.mesa;
    b.children[2].textContent = inv.cupos === 1 ? "1 cupo reservado" : inv.cupos + " cupos reservados";
    destino.appendChild(b);
  }
  if (invitado) {
    const saludo = $("#saludoInvitado");
    saludo.hidden = false;
    saludo.querySelector("b").textContent = invitado.nombre;
    saludo.querySelector("span").textContent = invitado.cupos === 1 ? "Hemos reservado 1 lugar para ti" : "Hemos reservado " + invitado.cupos + " lugares para ustedes";
    mostrarMesa(invitado, $("#resultadoMesa"));
    const nombre = $("#nombreInvitado");
    if (nombre) nombre.value = invitado.nombre;
    const cupos = $("#cuposInvitado");
    if (cupos) {
      cupos.innerHTML = "";
      for (let i = invitado.cupos; i >= 1; i--) cupos.add(new Option(i === 1 ? "1 persona" : i + " personas", i));
    }
  }
  // confirmar con cupos y mesa
  const btnConfirmar = $("#btnConfirmar");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", (e) => {
      const n = $("#nombreInvitado").value.trim();
      if (n.length < 2) return;
      e.stopImmediatePropagation();
      const cupos = $("#cuposInvitado") ? $("#cuposInvitado").value : "1";
      let t = DATOS.whatsappMensaje.replace("{nombre}", n) + " · Asistiremos: " + cupos;
      if (invitado) t += " · Código " + invitado.codigo + " (mesa " + invitado.mesa + ")";
      window.open("https://wa.me/" + DATOS.whatsapp + "?text=" + encodeURIComponent(t), "_blank");
    }, true);
  }

  // ---------- Buscar mesa ----------
  $("#btnMesa").addEventListener("click", () => {
    const q = $("#codigoMesa").value.trim();
    const out = $("#resultadoMesa");
    if (q.length < 3) { out.textContent = "Escribe tu código o tu nombre"; return; }
    const inv = P.invitados.find((x) => x.codigo === q.toUpperCase()) ||
      P.invitados.find((x) => normal(x.nombre).includes(normal(q)));
    if (inv) mostrarMesa(inv, out);
    else out.textContent = "No encontramos ese nombre. Revisa el código de tu invitación 💌";
  });

  // ---------- Galería de invitados ----------
  const TOKEN_KEY = "galeria-token";
  let token = "";
  try { token = localStorage.getItem(TOKEN_KEY) || ""; } catch (e) {}
  if (!token) {
    token = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
    try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
  }
  let mias = [];
  try { mias = JSON.parse(localStorage.getItem("galeria-mias-" + P.evento) || "[]"); } catch (e) {}
  const guardarMias = () => { try { localStorage.setItem("galeria-mias-" + P.evento, JSON.stringify(mias)); } catch (e) {} };

  if (!$("#visor")) {
    const v = document.createElement("div");
    v.className = "visor"; v.id = "visor"; v.hidden = true;
    v.innerHTML = '<img alt=""><p></p>';
    document.body.appendChild(v);
  }
  const grid = $("#galeria");
  const estado = $("#estadoGaleria");
  const urlFoto = (id) => API + "/fotos?evento=" + P.evento + "&id=" + id;

  async function cargarGaleria() {
    try {
      const r = await fetch(API + "/fotos?evento=" + P.evento);
      const { fotos } = await r.json();
      grid.innerHTML = "";
      if (!fotos.length) { estado.textContent = "Aún no hay fotos. ¡Sé el primero en compartir un recuerdo! 📸"; return; }
      estado.textContent = fotos.length + (fotos.length === 1 ? " foto compartida" : " fotos compartidas");
      fotos.forEach((f) => {
        const fig = document.createElement("figure");
        const img = document.createElement("img");
        img.loading = "lazy"; img.src = urlFoto(f.id); img.alt = "Foto de " + f.nombre;
        img.addEventListener("click", () => abrirVisor(f));
        const cap = document.createElement("figcaption"); cap.textContent = f.nombre;
        fig.append(img, cap);
        if (mias.includes(f.id)) {
          const x = document.createElement("button");
          x.type = "button"; x.className = "borrar"; x.textContent = "✕"; x.title = "Borrar mi foto";
          x.addEventListener("click", () => borrar(f.id));
          fig.appendChild(x);
        }
        grid.appendChild(fig);
      });
    } catch (e) { estado.textContent = "No se pudo cargar la galería. Revisa tu conexión."; }
  }

  function abrirVisor(f) {
    const v = $("#visor");
    v.querySelector("img").src = urlFoto(f.id);
    v.querySelector("p").textContent = "📷 " + f.nombre;
    v.hidden = false;
  }
  $("#visor").addEventListener("click", () => { $("#visor").hidden = true; });

  async function borrar(id) {
    if (!confirm("¿Borrar esta foto?")) return;
    const r = await fetch(API + "/fotos?evento=" + P.evento + "&id=" + id, { method: "DELETE", headers: { "X-Token": token } });
    if (r.ok) { mias = mias.filter((x) => x !== id); guardarMias(); cargarGaleria(); }
    else alert("No se pudo borrar la foto.");
  }

  function comprimir(archivo) {
    return new Promise((ok, mal) => {
      const img = new Image();
      img.onload = () => {
        const max = 1600, esc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * esc); c.height = Math.round(img.height * esc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => (b ? ok(b) : mal()), "image/jpeg", 0.82);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = mal;
      img.src = URL.createObjectURL(archivo);
    });
  }

  $("#subirFotos").addEventListener("change", async (e) => {
    const archivos = [...e.target.files].slice(0, 10);
    e.target.value = "";
    if (!archivos.length) return;
    let autor = $("#autorFoto").value.trim() || (invitado && invitado.nombre) || "";
    if (autor.length < 2) { estado.textContent = "Escribe tu nombre antes de subir las fotos 🙂"; $("#autorFoto").focus(); return; }
    let hechas = 0;
    for (const a of archivos) {
      estado.textContent = "Subiendo " + (hechas + 1) + " de " + archivos.length + "…";
      try {
        const blob = await comprimir(a);
        const r = await fetch(API + "/fotos", {
          method: "POST",
          headers: { "Content-Type": "image/jpeg", "X-Evento": P.evento, "X-Nombre": encodeURIComponent(autor), "X-Token": token },
          body: blob,
        });
        if (!r.ok) throw new Error();
        const { id } = await r.json();
        mias.push(id); guardarMias(); hechas++;
      } catch (err) { /* sigue con la siguiente */ }
    }
    estado.textContent = hechas ? "¡Gracias! Se subieron " + hechas + " foto(s) 💛" : "No se pudieron subir las fotos. Intenta de nuevo.";
    cargarGaleria();
  });
  cargarGaleria();

  // ---------- Playlist ----------
  function embed(p) {
    const u = p.url || "";
    let m;
    if ((m = u.match(/open\.spotify\.com\/(playlist|album)\/([A-Za-z0-9]+)/))) return "https://open.spotify.com/embed/" + m[1] + "/" + m[2];
    if ((m = u.match(/[?&]list=([A-Za-z0-9_-]+)/))) return "https://www.youtube.com/embed/videoseries?list=" + m[1];
    if (u.includes("music.apple.com")) return u.replace("music.apple.com", "embed.music.apple.com");
    return "";
  }
  const src = embed(P.playlist || {});
  if (src) {
    const f = document.createElement("iframe");
    f.src = src; f.loading = "lazy"; f.title = "Playlist de la boda";
    f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    $("#playlist").appendChild(f);
    const a = $("#abrirPlaylist");
    a.href = P.playlist.url;
    a.textContent = { spotify: "Abrir en Spotify", youtube: "Abrir en YouTube Music", apple: "Abrir en Apple Music" }[P.playlist.app] || "Abrir playlist";
  }

  const lista = $("#listaCanciones");
  const buscar = (c) => {
    const q = encodeURIComponent(c.cancion + " " + (c.artista || ""));
    return { spotify: "https://open.spotify.com/search/" + q, youtube: "https://music.youtube.com/search?q=" + q, apple: "https://music.apple.com/search?term=" + q }[(P.playlist || {}).app] || "https://www.youtube.com/results?search_query=" + q;
  };
  async function cargarCanciones() {
    try {
      const r = await fetch(API + "/canciones?evento=" + P.evento);
      const { canciones } = await r.json();
      lista.innerHTML = "";
      canciones.slice(0, 30).forEach((c) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = buscar(c); a.target = "_blank"; a.rel = "noopener";
        a.textContent = "🎵 " + c.cancion + (c.artista ? " — " + c.artista : "");
        const s = document.createElement("small"); s.textContent = "sugerida por " + c.nombre;
        li.append(a, s); lista.appendChild(li);
      });
    } catch (e) {}
  }
  $("#btnCancion").addEventListener("click", async () => {
    const cancion = $("#cancion").value.trim(), artista = $("#artista").value.trim();
    const nombre = $("#autorFoto").value.trim() || (invitado && invitado.nombre) || $("#nombreInvitado").value.trim() || "Invitado";
    const msg = $("#estadoCancion");
    if (cancion.length < 2) { msg.textContent = "Escribe el nombre de la canción"; return; }
    msg.textContent = "Enviando…";
    const r = await fetch(API + "/canciones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evento: P.evento, cancion, artista, nombre }) });
    msg.textContent = r.ok ? "¡Gracias! La pareja verá tu sugerencia 🎶" : "No se pudo enviar. Intenta de nuevo.";
    if (r.ok) { $("#cancion").value = ""; $("#artista").value = ""; cargarCanciones(); }
  });
  cargarCanciones();
})();
