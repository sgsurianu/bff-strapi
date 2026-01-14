import type { APIRoute } from "astro";

export const prerender = false;

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * GET /api/panel/home
 * Proxy server-side para leer el single type Home desde Strapi.
 */
export const GET: APIRoute = async () => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const r = await fetch(`${STRAPI_URL}/api/home?populate=*`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  const txt = await r.text();

  return new Response(txt, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * PUT /api/panel/home
 * Actualiza el single type Home en Strapi.
 * Acepta:
 * - heroTitle (string)
 * - heroSubtitle (string)
 * - heroImage (number) => id del archivo subido a Strapi
 */
export const PUT: APIRoute = async ({ request }) => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({
        error: "Falta STRAPI_API_TOKEN en web/.env",
        hint: "Agrega STRAPI_API_TOKEN=... y reinicia pnpm dev",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const raw = await request.text();

  if (!raw.trim()) {
    return new Response(
      JSON.stringify({
        error: "Body vacío. El navegador no envió JSON.",
        hint:
          'Verifica que el fetch incluya headers: {"Content-Type":"application/json"} y body: JSON.stringify(payload)',
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(
      JSON.stringify({
        error: "JSON inválido en el body",
        receivedBodyStart: raw.slice(0, 200),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Permitimos solo los campos esperados
  const safeBody: Record<string, any> = {};

  if (typeof body.heroTitle === "string") safeBody.heroTitle = body.heroTitle;
  if (typeof body.heroSubtitle === "string") safeBody.heroSubtitle = body.heroSubtitle;

  // heroImage debe ser un número (id de upload en Strapi)
  if (typeof body.heroImage === "number" && Number.isFinite(body.heroImage)) {
    safeBody.heroImage = body.heroImage;
  }

  // carouselImages debe ser un array de números (ids de upload en Strapi)
  if (Array.isArray(body.carouselImages)) {
    const validIds = body.carouselImages
      .filter((id: any) => typeof id === "number" && Number.isFinite(id))
      .map((id: number) => id);
    if (validIds.length > 0) {
      safeBody.carouselImages = validIds;
    }
  }

  const payload = { data: safeBody };

  const r = await fetch(`${STRAPI_URL}/api/home`, {
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
