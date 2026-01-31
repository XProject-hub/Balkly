#!/bin/bash
# Balkly Database Restore Script
# Usage: ./restore.sh [backup_file.sql.gz]

set -e

# Configuration
BACKUP_DIR="/var/www/balkly/backups"
MYSQL_CONTAINER="balkly_mysql"
DB_NAME="balkly"
DB_USER="balkly"
DB_PASS="balkly_pass"

echo "========================================"
echo "🔄 Balkly Database Restore"
echo "========================================"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "📁 Available backups:"
    echo ""
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "No backups found!"
    echo ""
    echo "Usage: $0 <backup_file.sql.gz>"
    echo "Example: $0 $BACKUP_DIR/balkly_backup_2026-01-31_12-00-00.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Confirm restore
echo "⚠️  WARNING: This will OVERWRITE the current database!"
echo "📦 Backup to restore: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 0
fi

echo ""
echo "📦 Restoring database..."

# Decompress and restore
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | docker exec -i "$MYSQL_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME"
else
    docker exec -i "$MYSQL_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$BACKUP_FILE"
fi

echo ""
echo "✅ Database restored successfully!"
echo ""
echo "🔄 You may need to clear Laravel cache:"
echo "   docker exec -it balkly_api php artisan cache:clear"
echo "   docker exec -it balkly_api php artisan config:clear"
echo "========================================"
