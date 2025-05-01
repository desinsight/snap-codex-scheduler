#!/bin/bash

# Backup directory
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_PATH

# Backup configuration files
cp -r config $BACKUP_PATH/
cp -r k8s $BACKUP_PATH/

# Backup environment variables
cp .env* $BACKUP_PATH/

# Create a tarball of the backup
tar -czf "$BACKUP_PATH.tar.gz" -C $BACKUP_DIR "backup_$TIMESTAMP"

# Remove the uncompressed backup directory
rm -rf $BACKUP_PATH

# Keep only the last 7 backups
find $BACKUP_DIR -name "backup_*.tar.gz" -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_PATH.tar.gz" 