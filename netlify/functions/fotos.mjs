// Galería de invitados (Premium): subir, listar, ver y borrar fotos de un evento.
// Las fotos se guardan en Netlify Blobs, en la cuenta del negocio.
import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Evento,X-Nombre,X-Token",
};
const MAX_BYTES = 4.5 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];
const eventoValido = (e) => /^[a-z0-9-]{3,60}$/.test(e || "");
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...CORS, "Content-Type": "application/json" } });

async function hash(texto) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  const store = getStore({ name: "galeria-invitados", consistency: "strong" });

  if (req.method === "GET") {
    const evento = url.searchParams.get("evento");
    const id = url.searchParams.get("id");
    if (!eventoValido(evento)) return json({ error: "evento no válido" }, 400);
    if (id) {
      const r = await store.getWithMetadata(`${evento}/${id}`, { type: "arrayBuffer" });
      if (!r) return new Response("No existe", { status: 404, headers: CORS });
      return new Response(r.data, { headers: { ...CORS, "Content-Type": r.metadata.tipo || "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" } });
    }
    const { blobs } = await store.list({ prefix: `${evento}/` });
    const fotos = await Promise.all(blobs.slice(-300).map(async (b) => {
      const m = await store.getMetadata(b.key);
      return m ? { id: b.key.split("/")[1], nombre: m.metadata.nombre, fecha: m.metadata.fecha } : null;
    }));
    return json({ fotos: fotos.filter(Boolean).sort((a, b) => b.fecha - a.fecha) });
  }

  if (req.method === "POST") {
    const evento = req.headers.get("x-evento");
    const token = req.headers.get("x-token") || "";
    const tipo = (req.headers.get("content-type") || "").split(";")[0];
    if (!eventoValido(evento)) return json({ error: "evento no válido" }, 400);
    if (!TIPOS.includes(tipo)) return json({ error: "Solo se permiten fotos" }, 415);
    if (token.length < 16) return json({ error: "falta token" }, 400);
    const datos = await req.arrayBuffer();
    if (datos.byteLength > MAX_BYTES) return json({ error: "La foto es muy pesada" }, 413);
    const nombre = decodeURIComponent(req.headers.get("x-nombre") || "Invitado").slice(0, 60);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    await store.set(`${evento}/${id}`, datos, { metadata: { nombre, fecha: Date.now(), tipo, autor: await hash(token) } });
    return json({ id }, 201);
  }

  if (req.method === "DELETE") {
    const evento = url.searchParams.get("evento");
    const id = url.searchParams.get("id") || "";
    const token = req.headers.get("x-token") || "";
    if (!eventoValido(evento) || !/^[a-z0-9]+$/.test(id)) return json({ error: "datos no válidos" }, 400);
    const m = await store.getMetadata(`${evento}/${id}`);
    if (!m) return json({ error: "No existe" }, 404);
    const admin = process.env.CLAVE_ADMIN && token === process.env.CLAVE_ADMIN;
    if (!admin && m.metadata.autor !== (await hash(token))) return json({ error: "Solo quien subió la foto puede borrarla" }, 403);
    await store.delete(`${evento}/${id}`);
    return json({ ok: true });
  }
  return json({ error: "Método no permitido" }, 405);
};

export const config = { path: "/api/fotos" };
