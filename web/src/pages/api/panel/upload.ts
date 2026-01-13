import type { APIRoute } from "astro";

export const prerender = false;

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * POST /api/panel/upload
 * Recibe un archivo desde el navegador (FormData),
 * lo reenvía a Strapi /api/upload usando el API Token,
 * y devuelve el JSON de Strapi (incluye id, url, etc).
 */
export const POST: APIRoute = async ({ request }) => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({
        error: "Falta STRAPI_API_TOKEN en web/.env",
        hint: "Agrega STRAPI_API_TOKEN=... y reinicia pnpm dev",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const incoming = await request.formData();
  const file = incoming.get("files");

  if (!(file instanceof File)) {
    return new Response(
      JSON.stringify({
        error: 'No se recibió archivo. Debes enviar FormData con la clave "files".',
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Construimos un nuevo FormData para Strapi
  const fd = new FormData();
  fd.append("files", file, file.name);

  const r = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      // No seteamos Content-Type: fetch lo pone con el boundary correcto
    },
    body: fd,
  });

  const out = await r.text();

  return new Response(out, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
};
