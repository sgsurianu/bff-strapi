import type { APIRoute } from "astro";

const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

export const prerender = false;

/**
 * GET /api/panel/noticias/:id
 */
export const GET: APIRoute = async ({ params }) => {
  const documentId = params.id;

  if (!documentId) {
    return new Response(
      JSON.stringify({ error: "Falta el parámetro id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const r = await fetch(
      `${STRAPI_URL}/api/noticias/${documentId}?populate=*`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!r.ok) {
      const text = await r.text();
      return new Response(
        JSON.stringify({ error: `Strapi error ${r.status}: ${text}` }),
        { status: r.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const json = await r.json();
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Error en GET /api/panel/noticias/${documentId}:`, err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * PUT /api/panel/noticias/:id
 */
export const PUT: APIRoute = async ({ params, request }) => {
  const documentId = params.id;

  if (!documentId) {
    return new Response(
      JSON.stringify({ error: "Falta el parámetro id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: any;
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return new Response(
        JSON.stringify({ error: "Body vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    body = JSON.parse(rawBody);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "JSON inválido en body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const safeBody: Record<string, any> = {};
  if (typeof body.title === "string") safeBody.title = body.title;
  if (typeof body.content === "string") safeBody.content = body.content;
  if (typeof body.excerpt === "string") safeBody.excerpt = body.excerpt;
  if (typeof body.author === "string") safeBody.author = body.author;
  if (typeof body.publishedDate === "string") safeBody.publishedDate = body.publishedDate;
  
  // Tags como array
  if (Array.isArray(body.tags)) {
    safeBody.tags = body.tags;
  }
  
  // Imagen como ID numérico
  if (typeof body.image === "number" && Number.isFinite(body.image)) {
    safeBody.image = body.image;
  }

  const payload = { data: safeBody };

  try {
    const r = await fetch(`${STRAPI_URL}/api/noticias/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      return new Response(
        JSON.stringify({ error: `Strapi error ${r.status}: ${text}` }),
        { status: r.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const json = await r.json();
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Error en PUT /api/panel/noticias/${documentId}:`, err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
