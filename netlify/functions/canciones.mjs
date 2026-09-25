// Sugerencias de canciones de los invitados (Premium).
import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const eventoValido = (e) => /^[a-z0-9-]{3,60}$/.test(e || "");
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const limpio = (t, n) => String(t || "").replace(/[<>]/g, "").trim().slice(0, n);

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const store = getStore({ name: "canciones-invitados", consistency: "strong" });

  if (req.method === "GET") {
    const evento = new URL(req.url).searchParams.get("evento");
    if (!eventoValido(evento)) return json({ error: "evento no válido" }, 400);
    const { blobs } = await store.list({ prefix: `${evento}/` });
    const lista = await Promise.all(blobs.slice(-300).map((b) => store.get(b.key, { type: "json" })));
    return json({ canciones: lista.filter(Boolean).sort((a, b) => b.fecha - a.fecha) });
  }

  if (req.method === "POST") {
    let d;
    try { d = await req.json(); } catch { return json({ error: "datos no válidos" }, 400); }
    if (!eventoValido(d.evento)) return json({ error: "evento no válido" }, 400);
    const cancion = limpio(d.cancion, 80), artista = limpio(d.artista, 60), nombre = limpio(d.nombre, 60) || "Invitado";
    if (cancion.length < 2) return json({ error: "Escribe el nombre de la canción" }, 400);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    await store.setJSON(`${d.evento}/${id}`, { id, cancion, artista, nombre, fecha: Date.now() });
    return json({ ok: true }, 201);
  }
  return json({ error: "Método no permitido" }, 405);
};

export const config = { path: "/api/canciones" };
