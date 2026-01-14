# 🛠️ Scripts de Mantenimiento

## 📦 Backup y Restauración

### **Crear backup manual:**
```bash
./scripts/backup-db.sh
```

### **Ver backups disponibles:**
```bash
./scripts/restore-db.sh
```

Salida:
```
📦 Backups disponibles:
=====================
backups/db/data_20260114_161022.db (1.1M) Jan 14 16:10
backups/db/data_20260113_090000.db (1.0M) Jan 13 09:00
```

### **Restaurar backup:**
```bash
./scripts/restore-db.sh data_20260114_161022.db
```

---

## ⚙️ Configurar backup automático

### **macOS/Linux (cron):**

1. Edita crontab:
```bash
crontab -e
```

2. Agrega esta línea (backup diario a las 9 AM):
```bash
0 9 * * * cd /Users/sgsurianu/Documents/strapi_astro_headless/cms && ./scripts/backup-db.sh >> backups/backup.log 2>&1
```

3. Guarda y sal

### **Verificar que funciona:**
```bash
crontab -l
```

---

## 📝 Uso rutinario

**Antes de trabajar cada día:**
```bash
./scripts/backup-db.sh
```

**Antes de cualquier cambio importante:**
```bash
./scripts/backup-db.sh
```

**Si algo sale mal:**
```bash
./scripts/restore-db.sh  # Ver lista
./scripts/restore-db.sh data_YYYYMMDD_HHMMSS.db  # Restaurar
```

---

## 🔒 Los backups se mantienen:
- **Localmente:** En `cms/backups/db/`
- **NO en Git:** Por seguridad y tamaño
- **Últimos 10:** Se auto-eliminan los más antiguos

---

Ver más información en: [SEGURIDAD_BASE_DATOS.md](../../SEGURIDAD_BASE_DATOS.md)
