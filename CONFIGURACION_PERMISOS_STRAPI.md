# 🔐 Configuración de Permisos en Strapi

## 📚 Entendiendo la autenticación

### Tipos de autenticación en este proyecto:

| Componente | Tipo de Auth | Configuración necesaria |
|------------|--------------|------------------------|
| **Panel del Editor** (`/editor/*`) | API Token | Settings > API Tokens |
| **Página Pública** (`/`, `/noticias`) | Public (opcional) | Settings > Users & Permissions > Roles > Public |

---

## ✅ Configuración paso a paso

### 1. Crear y configurar API Token (REQUERIDO)

Este token es usado por todos los endpoints del panel del editor.

1. Ve a Strapi Admin: http://localhost:1337/admin
2. **Settings** → **API Tokens**
3. **Create new API Token** (o edita el existente si ya tienes uno)
4. Configura:
   - **Name**: `BFF Token` (o el que prefieras)
   - **Token duration**: `Unlimited` o `90 days`
   - **Token type**: Selecciona **Custom**

5. En la sección **Permissions**, activa:

```
✅ Home
   ☑ find
   ☑ update

✅ Info-block
   ☑ find
   ☑ findOne
   ☑ create
   ☑ update
   ☑ delete

✅ Noticia
   ☑ find
   ☑ findOne
   ☑ create
   ☑ update
   ☑ delete

✅ Service (si lo sigues usando)
   ☑ find
   ☑ findOne
   ☑ create
   ☑ update
   ☑ delete

✅ Site-setting
   ☑ find
   ☑ update

✅ Upload
   ☑ upload
```

6. **Save**
7. **Copia el token** que se genera (aparece solo una vez)
8. Pégalo en `web/.env`:

```bash
STRAPI_API_TOKEN=tu-token-muy-largo-aqui-xxxxxxxxxxxxxxxxx
PUBLIC_STRAPI_URL=http://localhost:1337
```

9. **Reinicia** el servidor de Astro:
```bash
# En la terminal web/
Ctrl + C
pnpm dev
```

---

### 2. Configurar permisos Public (OPCIONAL - para página pública)

Si quieres que la página pública (`/noticias`, `/`) acceda directamente a Strapi desde el navegador (actualmente NO lo hace, usa el BFF), configura:

1. **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Activa SOLO lectura:

```
✅ Home
   ☑ find

✅ Info-block
   ☑ find
   ☑ findOne

✅ Noticia
   ☑ find
   ☑ findOne

✅ Site-setting
   ☑ find
```

⚠️ **IMPORTANTE**: NO actives `create`, `update`, o `delete` en Public. Sería un riesgo de seguridad.

---

## 🔍 Verificación

### Comprobar que el API Token funciona:

1. Ve a: http://localhost:4321/editor/inicio
   - Si carga correctamente → ✅ Token configurado
   - Si ves error 401/403 → ❌ Token falta o permisos incorrectos

2. Ve a: http://localhost:4321/editor/inicio/banner
   - Intenta subir una imagen
   - Si funciona → ✅ Permisos de upload configurados

3. Ve a: http://localhost:4321/editor/noticias
   - Si lista noticias → ✅ Permisos de noticia configurados
   - Si ves 404 → ❌ Strapi no reconoce el content type (reinicia Strapi)
   - Si ves 403 → ❌ Faltan permisos en el API Token

---

## 🐛 Solución de problemas

### Error: "STRAPI_API_TOKEN no configurado"
- **Causa**: Falta el token en `web/.env`
- **Solución**: Agrega `STRAPI_API_TOKEN=...` y reinicia `pnpm dev`

### Error: 401 Unauthorized
- **Causa**: Token inválido o expirado
- **Solución**: Genera un nuevo token en Strapi y actualiza `.env`

### Error: 403 Forbidden
- **Causa**: Token válido pero sin permisos
- **Solución**: Ve a Settings > API Tokens > (tu token) > Permissions y activa los permisos necesarios

### Error: 404 Not Found
- **Causa**: El content type no existe en Strapi
- **Solución**: Reinicia Strapi para que cargue los nuevos content types

---

## 📝 Archivos clave

- `web/.env` - Contiene `STRAPI_API_TOKEN`
- `web/src/pages/api/panel/*` - Todos usan el API Token
- `cms/src/api/*` - Content Types de Strapi

---

## 🎯 Resumen visual

```
┌─────────────────────────────────────────┐
│  NAVEGADOR                              │
│  http://localhost:4321/editor/inicio    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ASTRO (BFF)                            │
│  /api/panel/home                        │
│  Authorization: Bearer ${API_TOKEN} ────┼─┐
└─────────────────────────────────────────┘ │
                                            │
                                            ▼
                              ┌─────────────────────────┐
                              │  STRAPI                 │
                              │  Verifica API Token     │
                              │  Comprueba permisos     │
                              │  Devuelve datos         │
                              └─────────────────────────┘
```

---

## ✅ Checklist de configuración

- [ ] API Token creado en Strapi
- [ ] Permisos configurados para el token
- [ ] Token copiado a `web/.env`
- [ ] Servidor de Astro reiniciado
- [ ] Strapi reiniciado (si creaste nuevos content types)
- [ ] Probado acceso a `/editor/inicio`
- [ ] Probado subir imagen en `/editor/inicio/banner`
- [ ] Probado crear/editar noticias

Una vez completados todos los pasos, todo el sistema debería funcionar correctamente.
