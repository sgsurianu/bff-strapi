import type { APIRoute } from "astro";

const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

export const prerender = false;

/**
 * POST /api/panel/noticias/:id/delete
 * Endpoint para eliminar una noticia
 */
export const POST: APIRoute = async ({ params }) => {
  const documentId = params.id;

  console.log("[DELETE NOTICIA] Iniciando eliminación...");
  console.log("[DELETE NOTICIA] documentId recibido:", documentId);

  if (!documentId) {
    console.error("[DELETE NOTICIA] ERROR: Falta documentId");
    return new Response(
      JSON.stringify({ error: "Falta el parámetro id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!TOKEN) {
    console.error("[DELETE NOTICIA] ERROR: STRAPI_API_TOKEN no configurado");
    return new Response(
      JSON.stringify({ error: "STRAPI_API_TOKEN no configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `${STRAPI_URL}/api/noticias/${documentId}`;
  console.log("[DELETE NOTICIA] URL de Strapi:", url);

  try {
    const r = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    console.log("[DELETE NOTICIA] Status HTTP de Strapi:", r.status, r.statusText);

    if (!r.ok) {
      const text = await r.text();
      console.error("[DELETE NOTICIA] ERROR de Strapi:", text);
      return new Response(
        JSON.stringify({
          error: `Error ${r.status} de Strapi`,
          details: text,
        }),
        { status: r.status, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[DELETE NOTICIA] Noticia eliminada exitosamente. Redirigiendo...");

    // Redirigir al listado de noticias
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/editor/noticias",
      },
    });
  } catch (err) {
    console.error("[DELETE NOTICIA] ERROR de red:", err);
    return new Response(
      JSON.stringify({
        error: "Error de red",
        details: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
