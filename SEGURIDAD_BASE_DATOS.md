# 🛡️ Protocolo de Seguridad - Base de Datos

## ⚠️ REGLAS CRÍTICAS - NUNCA HACER

### ❌ **PROHIBIDO ABSOLUTAMENTE:**

1. **NUNCA** ejecutar `rm -rf .tmp/`
2. **NUNCA** ejecutar `rm -rf cms/.tmp/`
3. **NUNCA** borrar `cms/.tmp/data.db*` sin backup previo
4. **NUNCA** ejecutar comandos destructivos sin confirmación explícita del usuario
5. **NUNCA** limpiar cache de Strapi (`rm -rf .strapi dist`) sin verificar backup

---

## ✅ Procedimientos Seguros

### **Antes de CUALQUIER operación que pueda afectar la DB:**

1. **SIEMPRE hacer backup primero:**
   ```bash
   cd cms
   ./scripts/backup-db.sh
   ```

2. **Verificar que el backup existe:**
   ```bash
   ls -lh backups/db/
   ```

3. **Solo entonces** proceder con la operación

---

## 📦 Sistema de Backups

### **Crear backup manual:**
```bash
cd cms
./scripts/backup-db.sh
```

### **Ver backups disponibles:**
```bash
cd cms
./scripts/restore-db.sh
```

### **Restaurar desde backup:**
```bash
cd cms
./scripts/restore-db.sh data_20260114_153000.db
```

### **Backup automático diario (recomendado):**

Agrega esto a tu crontab (ejecuta: `crontab -e`):
```bash
0 9 * * * cd /Users/sgsurianu/Documents/strapi_astro_headless/cms && ./scripts/backup-db.sh >> backups/backup.log 2>&1
```

Esto hará backup todos los días a las 9 AM.

---

## 🔄 Workflow Seguro para Resolver Problemas

### **Si hay un error con Strapi:**

1. ✅ **Primero:** Verificar logs de error
2. ✅ **Si es problema de código:** Arreglar el código, NO tocar la DB
3. ✅ **Si es problema de cache:** Hacer backup, luego limpiar cache
4. ❌ **NUNCA:** Asumir que borrar la DB es la solución

### **Si es ABSOLUTAMENTE necesario resetear la DB:**

1. ✅ Hacer backup: `./scripts/backup-db.sh`
2. ✅ Confirmar con el usuario: "¿Estás seguro? Se perderán TODOS los datos"
3. ✅ Esperar confirmación EXPLÍCITA del usuario
4. ✅ Proceder solo si el usuario dice "SÍ, BORRA LA DB"
5. ✅ Documentar qué datos se perdieron

---

## 📍 Ubicaciones Importantes

- **Base de datos:** `cms/.tmp/data.db`
- **Backups:** `cms/backups/db/`
- **Scripts:** `cms/scripts/`

---

## 🚨 Qué Hacer si se Borró la DB por Error

1. **Inmediatamente:**
   ```bash
   cd cms
   ./scripts/restore-db.sh
   ```

2. **Seleccionar el backup más reciente**

3. **Reiniciar Strapi**

4. **Verificar que los datos están OK**

---

## 📊 Frecuencia de Backups Recomendada

- **Desarrollo activo:** Cada vez que agregues contenido importante
- **Producción:** Diariamente (automático con cron)
- **Antes de cambios grandes:** Siempre manual

---

## ✅ Checklist de Seguridad

Antes de cualquier operación riesgosa:

- [ ] ¿Hice backup?
- [ ] ¿Verifiqué que el backup existe?
- [ ] ¿El usuario autorizó esta operación?
- [ ] ¿Sé cómo restaurar si algo sale mal?
- [ ] ¿Documenté qué voy a hacer?

**Si alguna respuesta es NO, DETENTE.**

---

## 🎯 Reglas para Asistentes IA

Como asistente IA trabajando en este proyecto:

1. **NUNCA sugieras** borrar `.tmp/` o `data.db`
2. **SIEMPRE pregunta** antes de operaciones destructivas
3. **SIEMPRE crea backup** antes de operaciones riesgosas
4. **SIEMPRE documenta** qué cambios se harán
5. **SIEMPRE espera confirmación explícita** del usuario

---

## 📝 Historial de Incidentes

### 2026-01-14: Pérdida de datos
- **Qué pasó:** Se borró `cms/.tmp/data.db*` sin backup
- **Consecuencia:** Se perdieron todos los datos de Strapi
- **Lección:** Implementar sistema de backups obligatorio
- **Prevención:** Este documento y scripts de backup

---

**Última actualización:** 2026-01-14  
**Responsable:** Sistema de seguridad del proyecto
