#!/bin/bash

# Script de backup automático de la base de datos de Strapi
# Uso: ./scripts/backup-db.sh

BACKUP_DIR="backups/db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_FILE=".tmp/data.db"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Verificar que existe la base de datos
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Error: No se encontró la base de datos en $DB_FILE"
    exit 1
fi

# Crear backup
BACKUP_FILE="$BACKUP_DIR/data_${TIMESTAMP}.db"
cp "$DB_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup creado exitosamente: $BACKUP_FILE"
    
    # Mantener solo los últimos 10 backups
    ls -t "$BACKUP_DIR"/data_*.db | tail -n +11 | xargs -r rm
    echo "📦 Backups totales: $(ls -1 "$BACKUP_DIR"/data_*.db | wc -l)"
else
    echo "❌ Error al crear backup"
    exit 1
fi
