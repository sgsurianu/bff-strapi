import type { APIRoute } from "astro";

export const prerender = false;

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * GET /api/panel/site-settings
 * Obtiene la configuración del sitio (banner, etc.)
 */
export const GET: APIRoute = async () => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const r = await fetch(`${STRAPI_URL}/api/site-setting?populate=*`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const txt = await r.text();

    return new Response(txt, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error en GET /api/panel/site-settings:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * PUT /api/panel/site-settings
 * Actualiza la configuración del sitio.
 * Acepta:
 * - bannerImage (number) => id del archivo subido a Strapi
 */
export const PUT: APIRoute = async ({ request }) => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({
        error: "Falta STRAPI_API_TOKEN en web/.env",
      }),
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

  const safeBody: Record<string, any> = {};

  // bannerImage debe ser un número (id de upload en Strapi)
  if (typeof body.bannerImage === "number" && Number.isFinite(body.bannerImage)) {
    safeBody.bannerImage = body.bannerImage;
  }

  const payload = { data: safeBody };

  const r = await fetch(`${STRAPI_URL}/api/site-setting`, {
    method: "PUT",
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
