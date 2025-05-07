#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
fi

# Build the project
echo "Building project..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo "Build failed: dist directory not found"
    exit 1
fi

# Backup current deployment
if [ -d "/var/www/snap-codex" ]; then
    echo "Backing up current deployment..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    mv /var/www/snap-codex "/var/www/snap-codex_backup_$timestamp"
fi

# Deploy new build
echo "Deploying new build..."
cp -r dist/* /var/www/snap-codex/

# Set permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/snap-codex
chmod -R 755 /var/www/snap-codex

# Verify deployment
echo "Verifying deployment..."
if [ -f "/var/www/snap-codex/index.html" ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed: index.html not found"
    exit 1
fi

# Cleanup old backups (keep last 5)
echo "Cleaning up old backups..."
ls -t /var/www/snap-codex_backup_* | tail -n +6 | xargs -r rm

echo "Deployment completed successfully!" 