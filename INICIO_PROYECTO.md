# Inicio del Proyecto - Guía Rápida

## Comandos para Iniciar

### 1. Iniciar Strapi (CMS)
```bash
cd cms
pnpm develop
```

**Puerto:** `1337`

### 2. Iniciar Astro (Web)
```bash
cd web
pnpm dev
```

**Puerto:** `4321`

> **Nota:** Abre dos terminales diferentes, una para cada comando, o ejecuta uno en segundo plano.

## Enlaces a Abrir

Una vez que ambos servicios estén corriendo, abre estos enlaces en tu navegador:

### Frontend (Astro)
- **Página principal:** http://localhost:4321/
- **Editor Home:** http://localhost:4321/editor/inicio

### Backend (Strapi)
- **Panel de administración:** http://localhost:1337/admin

## Orden Recomendado

1. Primero inicia **Strapi** (`cd cms && pnpm develop`)
2. Espera a que Strapi esté completamente iniciado
3. Luego inicia **Astro** (`cd web && pnpm dev`)
4. Abre los enlaces en tu navegador

## Verificación

- ✅ Strapi está corriendo si ves: `Server started on port 1337`
- ✅ Astro está corriendo si ves: `Local: http://localhost:4321/`

---

## Implementación: Funcionalidad de Eliminación de Servicios

### Contexto del Problema

Se necesitaba implementar la funcionalidad para eliminar servicios desde la página de listado (`/editor/services`). El proyecto usa Strapi v5 como CMS headless y Astro como frontend.

### Solución Implementada

#### 1. Endpoint de Eliminación (`/api/panel/services/[id]/delete.ts`)

Se creó un endpoint POST dedicado para manejar la eliminación:

```typescript
export const POST: APIRoute = async ({ params }) => {
  const documentId = params.id;
  
  // Validaciones
  if (!documentId) return error 400
  if (!TOKEN) return error 500
  
  // Llamada a Strapi Content API
  const r = await fetch(`${STRAPI_URL}/api/services/${documentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  
  // Redirección automática después de eliminar
  return new Response(null, {
    status: 302,
    headers: { Location: "/editor/services" }
  });
}
```

**Características clave:**
- Usa `documentId` (no `id` numérico) porque Strapi v5 Content API requiere `documentId`
- Manejo de errores con logging detallado
- Redirección automática (302) al listado después de eliminar
- Respuestas JSON estructuradas para errores

#### 2. Integración en la Página de Listado (`/editor/services`)

Se agregó un formulario HTML para cada servicio en el listado:

```html
<form
  method="POST"
  action={`/api/panel/services/${s.documentId ?? String(s.id)}/delete`}
  onsubmit="return confirm('¿Seguro que deseas eliminar este servicio? Esta acción no se puede deshacer.');"
  style="display:inline;"
>
  <button type="submit" style="...">Eliminar</button>
</form>
```

**Características:**
- Confirmación del usuario antes de enviar (JavaScript nativo)
- Usa `documentId` preferentemente, con fallback a `id` numérico
- Formulario HTML tradicional (no requiere JavaScript adicional)

#### 3. Limpieza de Código Obsoleto

Se eliminaron los siguientes archivos/código relacionados con edición (ya no necesarios):
- `/editor/services/[id].astro` - Página de edición completa
- `/api/panel/services/[id].ts` - Endpoints GET, PUT, DELETE antiguos
- Enlace "Editar" del listado de servicios
- Variable `editKey` que ya no se usaba

### Flujo Completo

1. **Usuario en `/editor/services`** → Ve lista de servicios con botón "Eliminar"
2. **Click en "Eliminar"** → Confirmación del navegador (JavaScript nativo)
3. **Si confirma** → POST a `/api/panel/services/{documentId}/delete`
4. **Endpoint procesa** → DELETE a Strapi Content API (`/api/services/{documentId}`)
5. **Strapi elimina** → Devuelve 204 (No Content) o 200
6. **Endpoint redirige** → 302 a `/editor/services` (recarga automática)

### Archivos Clave

- **Endpoint:** `web/src/pages/api/panel/services/[id]/delete.ts`
- **Vista:** `web/src/pages/editor/services.astro` (líneas 126-143)
- **Variables de entorno necesarias:**
  - `PUBLIC_STRAPI_URL` (default: `http://localhost:1337`)
  - `STRAPI_API_TOKEN` (requerido para autenticación)

### Notas Técnicas Importantes

1. **Strapi v5 usa `documentId`**: El Content API de Strapi v5 requiere `documentId` (UUID) en lugar de `id` numérico para las rutas `/api/services/:documentId`
2. **Autenticación**: Se requiere `STRAPI_API_TOKEN` en las variables de entorno
3. **Redirección**: Se usa código 302 para redirección después de POST (patrón PRG - Post-Redirect-Get)
4. **Confirmación**: Se usa `onsubmit` con `confirm()` nativo del navegador (no requiere librerías)

### Testing

Para probar la funcionalidad:
1. Ir a `http://localhost:4321/editor/services`
2. Hacer clic en "Eliminar" en cualquier servicio
3. Confirmar en el diálogo
4. Verificar que el servicio desaparece y se recarga la página

