#!/bin/bash

# Script para restaurar la base de datos desde un backup
# Uso: ./scripts/restore-db.sh [nombre_del_backup]
# Si no se especifica backup, muestra lista disponible

BACKUP_DIR="backups/db"
DB_FILE=".tmp/data.db"

# Si no se proporciona argumento, mostrar backups disponibles
if [ -z "$1" ]; then
    echo "📦 Backups disponibles:"
    echo "====================="
    ls -lh "$BACKUP_DIR"/data_*.db 2>/dev/null | awk '{print $9, "("$5")", $6, $7, $8}'
    echo ""
    echo "Uso: ./scripts/restore-db.sh NOMBRE_DEL_BACKUP"
    echo "Ejemplo: ./scripts/restore-db.sh data_20260114_153000.db"
    exit 0
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Verificar que existe el backup
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: No se encontró el backup $BACKUP_FILE"
    exit 1
fi

# Crear backup de seguridad antes de restaurar
if [ -f "$DB_FILE" ]; then
    SAFETY_BACKUP=".tmp/data_before_restore_$(date +"%Y%m%d_%H%M%S").db"
    cp "$DB_FILE" "$SAFETY_BACKUP"
    echo "🔒 Backup de seguridad creado: $SAFETY_BACKUP"
fi

# Restaurar
cp "$BACKUP_FILE" "$DB_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Base de datos restaurada exitosamente desde: $BACKUP_FILE"
    echo "⚠️  Reinicia Strapi para que los cambios tomen efecto"
else
    echo "❌ Error al restaurar backup"
    exit 1
fi
