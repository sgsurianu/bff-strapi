# Arquitectura CMS Headless con Strapi + Astro

## 1. Objetivo del documento

Este documento describe la arquitectura, decisiones técnicas y flujos implementados hasta el momento para la construcción de un **CMS headless con panel propio**, usando **Strapi como backend de contenidos** y **Astro como frontend + backend ligero (BFF)**.

---

## 2. Visión general de la solución

La solución implementa un **CMS headless real**, donde:

- Strapi **no se usa como interfaz editorial**
- El panel administrativo genérico de Strapi se limita a:
  - configuración técnica
  - modelado de contenidos
  - gestión inicial de permisos
- La **edición de contenidos** se realiza desde un **panel propio**, desarrollado en Astro

### Principio clave

> Strapi actúa únicamente como motor de contenidos (API + base de datos).
> Astro actúa como frontend público y como panel CMS personalizado.

---

## 3. Estructura del proyecto

```
strapi_astro_headless/
│
├─ cms/                 # Backend Strapi
│   ├─ config/
│   ├─ src/
│   └─ ...
│
└─ web/                 # Astro (web pública + panel CMS)
    ├─ src/
    │   └─ pages/
    │       ├─ index.astro           # Web pública
    │       ├─ editor/
    │       │   └─ home.astro        # Panel CMS propio
    │       └─ api/
    │           └─ panel/
    │               ├─ home.ts       # BFF Home
    │               └─ upload.ts     # BFF Upload
    └─ .env
```

---

## 4. Rol de cada tecnología

### 4.1 Strapi

**Rol:** Backend de contenidos (Headless CMS)

Responsabilidades:
- Definición del modelo de datos (`Home`)
- Persistencia de datos (SQLite en este MVP)
- Exposición de API REST
- Gestión de media
- Validación de permisos

Strapi **NO**:
- Renderiza vistas
- Define UX editorial
- Es usado directamente por editores

El admin de Strapi se utiliza **solo por el equipo técnico**.

---

### 4.2 Astro

Astro cumple **dos roles simultáneos**:

#### a) Web pública
- Renderiza contenido institucional
- Consume Strapi vía `GET /api/home?populate=*`
- No escribe datos

#### b) Panel CMS propio
- Implementa pantallas editoriales (`/editor/home`)
- Expone endpoints server-side (`/api/panel/*`)
- Maneja credenciales de Strapi de forma segura

Astro funciona como un **BFF (Backend For Frontend)**.

---

## 5. Modelo de contenido actual

### Single Type: `Home`

Campos:
- `heroTitle` (Text)
- `heroSubtitle` (Text)
- `heroImage` (Media, single)

Este modelo se usa como primer caso estable para validar:
- lectura
- escritura
- media

---

## 6. Web pública (`/`)

Archivo:
```
web/src/pages/index.astro
```

Función:
- Lee contenido desde Strapi
- Renderiza `heroTitle`, `heroSubtitle`, `heroImage`

Flujo:
```
Navegador → Astro → Strapi API → DB
```

La web pública **no tiene permisos de escritura**.

---

## 7. Panel CMS propio (`/editor/home`)

Archivo:
```
web/src/pages/editor/home.astro
```

### Qué es

- Una página Astro
- HTML + JavaScript puro
- Sin frameworks adicionales

### Qué hace

1. **Carga contenido actual**
   - Llama a `GET /api/panel/home`
   - Precarga formulario con datos reales

2. **Edita textos**
   - Envía JSON vía `PUT /api/panel/home`

3. **Sube imagen**
   - Envía archivo a `POST /api/panel/upload`
   - Recibe `id` del media
   - Asigna `heroImage` con `PUT /api/panel/home`

---

## 8. Endpoints server-side (BFF)

### 8.1 `/api/panel/home`

Archivo:
```
web/src/pages/api/panel/home.ts
```

Funciones:
- `GET`: lee Home desde Strapi
- `PUT`: actualiza Home en Strapi

Características:
- `export const prerender = false`
- Ejecuta en runtime (no estático)
- Usa `STRAPI_API_TOKEN`
- El token **nunca se expone al navegador**

---

### 8.2 `/api/panel/upload`

Archivo:
```
web/src/pages/api/panel/upload.ts
```

Funciones:
- Recibe archivo desde el navegador (`FormData`)
- Reenvía a `POST /api/upload` de Strapi
- Devuelve JSON con metadata del archivo

Este endpoint encapsula toda la lógica de media.

---

## 9. Seguridad

- El navegador **nunca** llama directamente a Strapi para escribir
- Todas las escrituras pasan por Astro server-side
- El API Token:
  - vive en `web/.env`
  - no se serializa al cliente

Este patrón evita fugas de credenciales.

---

## 10. Flujo completo de edición

### Lectura
```
/editor/home
  → GET /api/panel/home
    → GET /api/home (Strapi)
```

### Escritura
```
Formulario
  → PUT /api/panel/home
    → PUT /api/home (Strapi)
```

### Media
```
File input
  → POST /api/panel/upload
    → POST /api/upload (Strapi)
  → PUT /api/panel/home (heroImage=id)
```

---

## 11. Estado actual del proyecto

Funciona correctamente:
- Lectura de contenido
- Edición de textos
- Subida de imágenes
- Asignación de media
- Renderizado público

No se ha implementado aún:
- Autenticación de editores
- Collection Types adicionales
- Components
- Populate profundo

---

## 12. Próximos pasos recomendados

1. Collection Type `service` + CRUD
2. Autenticación del panel
3. Roles editoriales
4. Modularización del panel
5. Documentación institucional

---

## 13. Conclusión

La arquitectura implementada demuestra que:

- Strapi funciona eficazmente como CMS headless
- Es viable (y recomendable) usar un panel propio
- Astro es adecuado como frontend + BFF
- El sistema es escalable y mantenible

Este patrón es válido para entornos institucionales donde la UX editorial debe ser controlada y personalizada.

