import type { APIRoute } from "astro";

export const prerender = false;

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * GET /api/panel/services
 * Lista servicios desde Strapi.
 * - Por ahora: lectura abierta vía BFF (aunque Strapi también tenga Public).
 * - Más adelante: podemos exigir auth del panel.
 */
export const GET: APIRoute = async () => {
  const r = await fetch(`${STRAPI_URL}/api/services?populate=*`);
  const txt = await r.text();

  return new Response(txt, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * POST /api/panel/services
 * Crear un servicio (se usará en el siguiente paso).
 */
export const POST: APIRoute = async ({ request }) => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "Falta STRAPI_API_TOKEN en web/.env" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const raw = await request.text();
  if (!raw.trim()) {
    return new Response(JSON.stringify({ error: "Body vacío" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Permitimos solo campos esperados
  const safeBody: Record<string, any> = {};
  if (typeof body.title === "string") safeBody.title = body.title;
  if (typeof body.description === "string") safeBody.description = body.description;
  if (typeof body.icon === "string") safeBody.icon = body.icon;

  // image: id del media en Strapi
  if (typeof body.image === "number" && Number.isFinite(body.image)) {
    safeBody.image = body.image;
  }

  const payload = { data: safeBody };

  const r = await fetch(`${STRAPI_URL}/api/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  const out = await r.text();
  return new Response(out, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
};
