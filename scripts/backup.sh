#!/bin/bash
# Balkly Database Backup Script
# Runs every 12 hours via cron

set -e

# Configuration
BACKUP_DIR="/var/www/balkly/backups"
MYSQL_CONTAINER="balkly_mysql"
DB_NAME="balkly"
DB_USER="balkly"
DB_PASS="balkly_pass"
RETENTION_DAYS=14  # Keep backups for 14 days

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/balkly_backup_$TIMESTAMP.sql"
BACKUP_GZ="$BACKUP_FILE.gz"

echo "========================================"
echo "🔄 Balkly Database Backup"
echo "📅 Date: $(date)"
echo "========================================"

# Create backup
echo "📦 Creating backup..."
docker exec "$MYSQL_CONTAINER" mysqldump \
    -u"$DB_USER" \
    -p"$DB_PASS" \
    --single-transaction \
    --quick \
    --lock-tables=false \
    --routines \
    --triggers \
    "$DB_NAME" > "$BACKUP_FILE"

# Check if backup was successful
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    # Compress backup
    echo "🗜️  Compressing backup..."
    gzip "$BACKUP_FILE"
    
    BACKUP_SIZE=$(du -h "$BACKUP_GZ" | cut -f1)
    echo "✅ Backup created: $BACKUP_GZ ($BACKUP_SIZE)"
    
    # Delete old backups (older than RETENTION_DAYS)
    echo "🧹 Cleaning old backups (older than $RETENTION_DAYS days)..."
    find "$BACKUP_DIR" -name "balkly_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    # Count remaining backups
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/balkly_backup_*.sql.gz 2>/dev/null | wc -l)
    echo "📊 Total backups: $BACKUP_COUNT"
    
    # Show disk usage
    TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    echo "💾 Total backup size: $TOTAL_SIZE"
    
    echo "========================================"
    echo "✅ Backup completed successfully!"
    echo "========================================"
else
    echo "❌ ERROR: Backup failed - file is empty or not created"
    exit 1
fi
