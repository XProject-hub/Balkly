#!/bin/bash
# Balkly Complete Backup Script

BACKUP_DIR="/var/www/balkly_backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="balkly_backup_${DATE}"

echo "🔒 Creating backup: $BACKUP_FILE"
echo ""

# Create backup directory
mkdir -p $BACKUP_DIR

cd /var/www/balkly

# 1. Backup Database
echo "📊 Backing up MySQL database..."
docker exec balkly_mysql mysqldump -u balkly -pbalkly_pass balkly > "$BACKUP_DIR/${BACKUP_FILE}_database.sql"
echo "✓ Database backed up"

# 2. Backup MinIO/S3 media
echo "📸 Backing up media files..."
docker exec balkly_minio mc alias set local http://localhost:9000 balkly balkly_minio_pass 2>/dev/null
docker exec balkly_minio mc mirror local/balkly-media /tmp/media_backup 2>/dev/null
docker cp balkly_minio:/tmp/media_backup "$BACKUP_DIR/${BACKUP_FILE}_media" 2>/dev/null || echo "Media backup skipped (no files)"

# 3. Backup .env files
echo "⚙️  Backing up configuration..."
cp balkly-api/.env "$BACKUP_DIR/${BACKUP_FILE}_api.env"
cp balkly-web/.env.local "$BACKUP_DIR/${BACKUP_FILE}_web.env" 2>/dev/null || echo "No web .env"

# 4. Create info file
echo "📝 Creating backup info..."
cat > "$BACKUP_DIR/${BACKUP_FILE}_info.txt" << EOF
Balkly Backup Information
========================
Date: $(date)
Database: MySQL
Media: MinIO S3

Contents:
- ${BACKUP_FILE}_database.sql (MySQL dump)
- ${BACKUP_FILE}_media/ (Media files)
- ${BACKUP_FILE}_api.env (Backend config)

Restore Instructions:
1. Import database:
   docker exec -i balkly_mysql mysql -u balkly -pbalkly_pass balkly < ${BACKUP_FILE}_database.sql

2. Restore media:
   docker cp ${BACKUP_FILE}_media balkly_minio:/tmp/
   docker exec balkly_minio mc mirror /tmp/media_backup local/balkly-media

3. Restore .env:
   cp ${BACKUP_FILE}_api.env balkly-api/.env
   docker-compose restart api

========================
EOF

# 5. Compress everything
echo "📦 Compressing backup..."
cd $BACKUP_DIR
tar -czf "${BACKUP_FILE}.tar.gz" ${BACKUP_FILE}_* 2>/dev/null
rm -f ${BACKUP_FILE}_database.sql ${BACKUP_FILE}_*.env ${BACKUP_FILE}_info.txt
rm -rf ${BACKUP_FILE}_media

# Calculate size
SIZE=$(du -sh "${BACKUP_FILE}.tar.gz" | cut -f1)

echo ""
echo "=========================================="
echo "✅ BACKUP COMPLETE!"
echo "=========================================="
echo ""
echo "📦 File: ${BACKUP_FILE}.tar.gz"
echo "💾 Size: $SIZE"
echo "📍 Location: $BACKUP_DIR"
echo ""
echo "To download:"
echo "scp root@your-server:$BACKUP_DIR/${BACKUP_FILE}.tar.gz ."
echo ""
echo "To restore:"
echo "tar -xzf ${BACKUP_FILE}.tar.gz"
echo "Follow instructions in ${BACKUP_FILE}_info.txt"
echo ""

