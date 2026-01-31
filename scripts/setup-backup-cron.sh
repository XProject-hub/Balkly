#!/bin/bash
# Setup automated backup cron job for Balkly
# Run this once to set up the cron job

set -e

SCRIPT_DIR="/var/www/balkly/scripts"
BACKUP_SCRIPT="$SCRIPT_DIR/backup.sh"
LOG_FILE="/var/log/balkly-backup.log"

echo "🔧 Setting up Balkly automated backup..."

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"
echo "✅ Made backup script executable"

# Create log file
touch "$LOG_FILE"
chmod 666 "$LOG_FILE"
echo "✅ Created log file: $LOG_FILE"

# Add cron job (every 12 hours at 00:00 and 12:00)
CRON_JOB="0 */12 * * * $BACKUP_SCRIPT >> $LOG_FILE 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "balkly/scripts/backup.sh"; then
    echo "⚠️  Cron job already exists, updating..."
    # Remove old balkly backup cron jobs
    crontab -l 2>/dev/null | grep -v "balkly/scripts/backup.sh" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added: Every 12 hours"
echo ""
echo "📋 Current cron jobs:"
crontab -l
echo ""
echo "========================================"
echo "✅ Backup automation setup complete!"
echo ""
echo "📁 Backups will be saved to: /var/www/balkly/backups/"
echo "📝 Logs: $LOG_FILE"
echo "⏰ Schedule: Every 12 hours (00:00 and 12:00)"
echo "🗑️  Retention: 14 days"
echo ""
echo "To run a backup now:"
echo "  $BACKUP_SCRIPT"
echo "========================================"
