#!/bin/bash

# Configuration
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"furniture_quote_db"}
DB_USER=${DB_USER:-"gyungchulbae"}
BACKUP_DIR="./backups/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"
REGIONS=("us-east-1" "us-west-2" "ap-northeast-2")  # 백업할 리전 목록

# Create backup directory
mkdir -p $BACKUP_PATH

# Database backup
echo "Starting database backup..."
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f "$BACKUP_PATH/db_backup.dump"

# Verify backup
if [ $? -eq 0 ]; then
    echo "Database backup completed successfully"
else
    echo "Database backup failed"
    exit 1
fi

# Cross-region backup
for region in "${REGIONS[@]}"; do
    echo "Copying backup to $region..."
    aws s3 cp "$BACKUP_PATH/db_backup.dump" "s3://snap-codex-backups-$region/db/backup_$TIMESTAMP.dump" --region $region
    
    if [ $? -eq 0 ]; then
        echo "Backup copied to $region successfully"
    else
        echo "Failed to copy backup to $region"
        exit 1
    fi
done

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*" -type d -mtime +7 -exec rm -rf {} \;

# Cleanup S3 backups
for region in "${REGIONS[@]}"; do
    aws s3 ls "s3://snap-codex-backups-$region/db/" | sort -r | awk 'NR>7 {print $4}' | while read -r file; do
        aws s3 rm "s3://snap-codex-backups-$region/db/$file" --region $region
    done
done

echo "Backup process completed successfully" 