import type { APIRoute } from "astro";

const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

export const prerender = false;

/**
 * GET /api/panel/noticias
 * Soporta paginación y filtros
 * Query params:
 * - page: número de página (default: 1)
 * - pageSize: tamaño de página (default: 10)
 * - search: búsqueda por texto en title y content
 * - tag: filtrar por etiqueta específica
 */
export const GET: APIRoute = async ({ url }) => {
  if (!TOKEN) {
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parámetros de paginación
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const search = url.searchParams.get("search") || "";
    const tag = url.searchParams.get("tag") || "";

    // Construir query params para Strapi
    const params = new URLSearchParams({
      "populate": "*",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
      "sort[0]": "publishedDate:desc",
      "sort[1]": "createdAt:desc",
    });

    // Filtro de búsqueda por texto
    if (search) {
      params.append("filters[$or][0][title][$containsi]", search);
      params.append("filters[$or][1][content][$containsi]", search);
    }

    // Filtro por tag (búsqueda en el array JSON)
    if (tag) {
      params.append("filters[tags][$contains]", tag);
    }

    const strapiUrl = `${STRAPI_URL}/api/noticias?${params.toString()}`;
    
    const r = await fetch(strapiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
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
    console.error("Error en GET /api/panel/noticias:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * POST /api/panel/noticias
 * Crear una nueva noticia
 */
export const POST: APIRoute = async ({ request }) => {
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
    const r = await fetch(`${STRAPI_URL}/api/noticias`, {
      method: "POST",
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
    console.error("Error en POST /api/panel/noticias:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
