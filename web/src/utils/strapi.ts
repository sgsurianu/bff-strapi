/**
 * Utilidades para trabajar con Strapi API
 */

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/**
 * Resuelve la URL completa de un objeto media de Strapi
 * Soporta distintas estructuras de Strapi v4 y v5
 */
export function resolveMediaUrl(media: any): string | null {
  if (!media) return null;

  // Soporta distintas formas del objeto media (según Strapi/config)
  const url =
    media?.url ??
    media?.data?.attributes?.url ??
    media?.data?.url ??
    media?.attributes?.url ??
    null;

  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Extrae los campos de un servicio de Strapi
 * Compatible con variantes de estructura v4/v5
 */
export function pickServiceFields(raw: any) {
  // Compatibilidad v4/v5: a veces viene en attributes, a veces al nivel raíz.
  const src = raw?.attributes ?? raw ?? {};

  const title = src.title ?? "";
  const description = src.description ?? "";
  const icon = src.icon ?? "";

  // Imagen puede venir:
  // - v4: src.image.data.attributes
  // - v5: src.image (objeto directo) o src.image.data.attributes
  let image = src.image ?? null;

  if (image?.data?.attributes) image = image.data.attributes;
  if (image?.data?.url) image = image.data; // por si fuese "data" directo

  return { title, description, icon, image };
}

/**
 * Obtiene la mejor URL disponible de una imagen de servicio
 * Prioriza: small -> thumbnail -> url original
 */
export function pickServiceImageBestUrl(image: any): string | null {
  if (!image) return null;

  // Preferir small -> thumbnail -> url, con compatibilidad de estructuras
  const formats =
    image?.formats ??
    image?.data?.attributes?.formats ??
    image?.attributes?.formats ??
    null;

  const url =
    formats?.small?.url ??
    formats?.thumbnail?.url ??
    image?.url ??
    image?.data?.attributes?.url ??
    image?.data?.url ??
    null;

  return url;
}

/**
 * Obtiene la URL completa de una imagen de servicio
 */
export function getServiceImageUrl(image: any): string | null {
  const bestUrl = pickServiceImageBestUrl(image);
  return bestUrl ? resolveMediaUrl({ url: bestUrl }) : null;
}
