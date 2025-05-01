#!/bin/bash

# Configuration
TEST_DB_HOST=${TEST_DB_HOST:-"localhost"}
TEST_DB_PORT=${TEST_DB_PORT:-"5432"}
TEST_DB_NAME=${TEST_DB_NAME:-"snap_codex_test"}
TEST_DB_USER=${TEST_DB_USER:-"postgres"}
BACKUP_DIR="/backups/db"
LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n 1)
TEST_REGION=${TEST_REGION:-"us-west-2"}

# Create test database
echo "Creating test database..."
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d postgres -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;"
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d postgres -c "CREATE DATABASE $TEST_DB_NAME;"

# Restore from local backup
echo "Restoring from local backup..."
PGPASSWORD=$DB_PASSWORD pg_restore -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d $TEST_DB_NAME "$BACKUP_DIR/$LATEST_BACKUP/db_backup.dump"

if [ $? -ne 0 ]; then
    echo "Local backup restore failed"
    exit 1
fi

# Verify database integrity
echo "Verifying database integrity..."
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d $TEST_DB_NAME -c "SELECT COUNT(*) FROM pg_tables;" > /dev/null

if [ $? -ne 0 ]; then
    echo "Database integrity check failed"
    exit 1
fi

# Test cross-region restore
echo "Testing cross-region restore..."
aws s3 cp "s3://snap-codex-backups-$TEST_REGION/db/$(basename $LATEST_BACKUP).dump" /tmp/cross_region_backup.dump --region $TEST_REGION

if [ $? -ne 0 ]; then
    echo "Failed to download backup from $TEST_REGION"
    exit 1
fi

# Create another test database for cross-region restore
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${TEST_DB_NAME}_cross_region;"
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d postgres -c "CREATE DATABASE ${TEST_DB_NAME}_cross_region;"

# Restore from cross-region backup
PGPASSWORD=$DB_PASSWORD pg_restore -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d ${TEST_DB_NAME}_cross_region /tmp/cross_region_backup.dump

if [ $? -ne 0 ]; then
    echo "Cross-region backup restore failed"
    exit 1
fi

# Compare databases
echo "Comparing local and cross-region restored databases..."
LOCAL_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d $TEST_DB_NAME -t -c "SELECT COUNT(*) FROM pg_tables;")
CROSS_REGION_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d ${TEST_DB_NAME}_cross_region -t -c "SELECT COUNT(*) FROM pg_tables;")

if [ "$LOCAL_COUNT" != "$CROSS_REGION_COUNT" ]; then
    echo "Database comparison failed"
    exit 1
fi

# Cleanup
echo "Cleaning up test databases..."
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d postgres -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;"
PGPASSWORD=$DB_PASSWORD psql -h $TEST_DB_HOST -p $TEST_DB_PORT -U $TEST_DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${TEST_DB_NAME}_cross_region;"
rm -f /tmp/cross_region_backup.dump

echo "Recovery test completed successfully" 