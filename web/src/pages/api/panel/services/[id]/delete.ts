import type { APIRoute } from "astro";

export const prerender = false;

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const TOKEN = import.meta.env.STRAPI_API_TOKEN;

export const POST: APIRoute = async ({ params }) => {
  const documentId = params.id;

  console.log("[DELETE API] Iniciando eliminación - documentId:", documentId);

  if (!documentId) {
    console.error("[DELETE API] Error: Falta documentId");
    return new Response(JSON.stringify({ error: "Falta documentId" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!TOKEN) {
    console.error("[DELETE API] Error: Falta STRAPI_API_TOKEN");
    return new Response(JSON.stringify({ error: "Falta STRAPI_API_TOKEN en web/.env" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = `${STRAPI_URL}/api/services/${documentId}`;
  console.log("[DELETE API] URL de Strapi:", url);
  console.log("[DELETE API] Token presente:", TOKEN ? "Sí" : "No");

  try {
    const r = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    // Si Strapi devuelve 204, no hay body. Si devuelve error, puede venir con JSON/texto.
    const text = await r.text();
    console.log("[DELETE API] Respuesta de Strapi - Status:", r.status);
    console.log("[DELETE API] Respuesta de Strapi - Body:", text);

    if (!r.ok) {
      console.error("[DELETE API] Error eliminando:", r.status, text);
      return new Response(JSON.stringify({ 
        error: text || `Error eliminando (HTTP ${r.status})` 
      }), {
        status: r.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[DELETE API] ✅ Eliminación exitosa. Redirigiendo...");
    // Redirige al listado del panel después de borrar
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/editor/servicios",
      },
    });
  } catch (error) {
    console.error("[DELETE API] Error de red:", error);
    return new Response(JSON.stringify({ 
      error: "Error de red al conectar con Strapi",
      details: String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
