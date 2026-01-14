import type { APIRoute } from "astro";

export const prerender = false;

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * GET /api/panel/services/[id]
 * Obtiene un servicio específico por documentId
 */
export const GET: APIRoute = async ({ params }) => {
  const documentId = params.id;
  if (!documentId) {
    return new Response(JSON.stringify({ error: "Falta documentId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const r = await fetch(`${STRAPI_URL}/api/services/${documentId}?populate=*`, {
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
 * PUT /api/panel/services/[id]
 * Actualiza un servicio existente en Strapi.
 * Acepta:
 * - title (string)
 * - description (string)
 * - icon (string)
 * - image (number) => id del archivo subido a Strapi
 */
export const PUT: APIRoute = async ({ params, request }) => {
  const documentId = params.id;

  console.log("[PUT API] Iniciando actualización - documentId:", documentId);

  if (!documentId) {
    console.error("[PUT API] Error: Falta documentId");
    return new Response(JSON.stringify({ error: "Falta documentId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!TOKEN) {
    console.error("[PUT API] Error: Falta STRAPI_API_TOKEN");
    return new Response(
      JSON.stringify({
        error: "Falta STRAPI_API_TOKEN en web/.env",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const raw = await request.text();
  console.log("[PUT API] Body recibido (primeros 200 chars):", raw.slice(0, 200));

  if (!raw.trim()) {
    console.error("[PUT API] Error: Body vacío");
    return new Response(JSON.stringify({ error: "Body vacío" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
    console.log("[PUT API] Body parseado:", body);
  } catch (e) {
    console.error("[PUT API] Error parseando JSON:", e);
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Permitimos solo los campos esperados
  const safeBody: Record<string, any> = {};

  if (typeof body.title === "string") safeBody.title = body.title;
  if (typeof body.description === "string") safeBody.description = body.description;
  if (typeof body.icon === "string") safeBody.icon = body.icon;

  // image: id del media en Strapi
  if (typeof body.image === "number" && Number.isFinite(body.image)) {
    safeBody.image = body.image;
  }

  const payload = { data: safeBody };
  console.log("[PUT API] Payload a enviar a Strapi:", JSON.stringify(payload));

  const url = `${STRAPI_URL}/api/services/${documentId}`;
  console.log("[PUT API] URL de Strapi:", url);
  console.log("[PUT API] Token presente:", TOKEN ? "Sí" : "No");

  try {
    const r = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const out = await r.text();
    console.log("[PUT API] Respuesta de Strapi - Status:", r.status);
    console.log("[PUT API] Respuesta de Strapi - Body:", out);

    if (!r.ok) {
      console.error("[PUT API] Error actualizando:", r.status, out);
      return new Response(JSON.stringify({
        error: out || `Error actualizando (HTTP ${r.status})`
      }), {
        status: r.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[PUT API] ✅ Actualización exitosa");
    return new Response(out, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[PUT API] Error de red:", error);
    return new Response(JSON.stringify({
      error: "Error de red al conectar con Strapi",
      details: String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
