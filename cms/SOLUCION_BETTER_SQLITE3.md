# Solución: Error de better-sqlite3 con pnpm

## Problema

Al intentar ejecutar `pnpm develop` en un proyecto Strapi, aparece el siguiente error:

```
Error: Could not locate the bindings file. Tried:
→ /path/to/node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3/build/better_sqlite3.node
```

## Causa

Este error ocurre porque:

1. **better-sqlite3 es un módulo nativo** que requiere compilación durante la instalación
2. **pnpm bloquea scripts de compilación por seguridad** por defecto
3. Los bindings nativos (`.node`) no se generan automáticamente durante `pnpm install`

## Soluciones

### Solución 1: Compilar manualmente (Rápida)

Si ya tienes las dependencias instaladas, compila el módulo manualmente:

```bash
cd cms
cd node_modules/.pnpm/better-sqlite3@12.4.1/node_modules/better-sqlite3
npm run build-release
cd ../../../../..
```

Luego intenta ejecutar `pnpm develop` nuevamente.

### Solución 2: Aprobar scripts de compilación (Recomendada)

Aprobar los scripts de compilación para que se ejecuten automáticamente:

```bash
cd cms
pnpm approve-builds
```

Cuando aparezca el menú interactivo:
- Presiona `<space>` para seleccionar `better-sqlite3`
- Presiona `<Enter>` para confirmar

Luego reinstala las dependencias:

```bash
pnpm install
```

### Solución 3: Configuración automática (Preventiva)

Para evitar este problema en futuros proyectos, crea o actualiza el archivo `.npmrc` en el directorio `cms`:

```bash
cd cms
echo "enable-pre-post-scripts=true" >> .npmrc
echo "ignore-scripts=false" >> .npmrc
```

**Nota:** Aunque esta configuración ayuda, pnpm puede seguir requiriendo aprobación explícita de scripts de compilación por seguridad.

### Solución 4: Reinstalación completa

Si ninguna de las soluciones anteriores funciona:

```bash
cd cms
rm -rf node_modules
pnpm install
pnpm approve-builds  # Selecciona better-sqlite3
pnpm rebuild better-sqlite3
```

## Prevención en Nuevos Proyectos

### Al crear un nuevo proyecto Strapi con pnpm:

1. **Crea el archivo `.npmrc` antes de instalar dependencias:**

```bash
cd cms
cat > .npmrc << EOF
enable-pre-post-scripts=true
ignore-scripts=false
EOF
```

2. **Instala las dependencias:**

```bash
pnpm install
```

3. **Aprueba los scripts de compilación inmediatamente:**

```bash
pnpm approve-builds
```

Selecciona `better-sqlite3` y cualquier otro módulo nativo que aparezca.

4. **Verifica la compilación:**

```bash
pnpm rebuild better-sqlite3
```

## Verificación

Para verificar que el módulo se compiló correctamente:

```bash
ls -la node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3/build/Release/better_sqlite3.node
```

Si el archivo existe, la compilación fue exitosa.

## Módulos Nativos Comunes en Strapi

Además de `better-sqlite3`, estos módulos también pueden requerir compilación:

- `@swc/core` - Compilador de TypeScript/JavaScript
- `sharp` - Procesamiento de imágenes
- `esbuild` - Bundler rápido

Si encuentras errores similares con estos módulos, aplica las mismas soluciones.

## Notas Adicionales

- **Node.js**: Asegúrate de tener una versión compatible de Node.js (ver `package.json` → `engines`)
- **Herramientas de compilación**: En macOS, puede que necesites Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
- **Python**: node-gyp requiere Python. La mayoría de sistemas macOS ya lo tienen instalado.

## Referencias

- [Documentación de pnpm sobre scripts](https://pnpm.io/npmrc#enable-pre-post-scripts)
- [Documentación de better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Documentación de Strapi](https://docs.strapi.io/)

