# BFF Strapi - Backend for Frontend con Strapi y Astro

Proyecto de arquitectura headless CMS usando Strapi v5 como backend y Astro como frontend con patrón BFF (Backend for Frontend).

## 📋 Descripción

Este proyecto implementa una arquitectura headless CMS donde:
- **Strapi v5** actúa como CMS y API backend
- **Astro** actúa como frontend y BFF (Backend for Frontend)
- El BFF maneja la lógica de negocio y transformación de datos entre el frontend y Strapi

## 🏗️ Estructura del Proyecto

```
├── cms/          # Strapi v5 (Backend/CMS)
├── web/          # Astro (Frontend/BFF)
└── docs/         # Documentación
```

## 🚀 Inicio Rápido

Ver [INICIO_PROYECTO.md](./INICIO_PROYECTO.md) para instrucciones detalladas.

### Comandos Básicos

**Iniciar Strapi:**
```bash
cd cms
pnpm develop
```

**Iniciar Astro:**
```bash
cd web
pnpm dev
```

## 📚 Documentación

- [INICIO_PROYECTO.md](./INICIO_PROYECTO.md) - Guía de inicio y configuración
- [arquitectura_cms_headless_strapi_astro.md](./arquitectura_cms_headless_strapi_astro.md) - Arquitectura detallada del proyecto

## 🛠️ Tecnologías

- **Strapi v5** - CMS Headless
- **Astro** - Framework web
- **TypeScript** - Lenguaje de programación
- **pnpm** - Gestor de paquetes

## 📝 Características Implementadas

- ✅ CRUD de servicios (Create, Delete)
- ✅ Panel de administración básico
- ✅ Integración con Strapi Content API
- ✅ Manejo de imágenes/media
- ✅ BFF pattern para transformación de datos

## 🔧 Configuración

### Variables de Entorno

**Strapi (cms/.env):**
- Configurar base de datos y otras variables según necesidad

**Astro (web/.env):**
- `PUBLIC_STRAPI_URL` - URL de Strapi (default: `http://localhost:1337`)
- `STRAPI_API_TOKEN` - Token de API de Strapi (requerido para operaciones de escritura)

## 📄 Licencia

[Especificar licencia si aplica]
