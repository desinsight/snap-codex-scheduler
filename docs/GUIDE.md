# User Guide

## Getting Started

### Prerequisites
- Node.js 16.x or later
- Redis 6.x or later
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-org/snap-codex-scheduler.git
cd snap-codex-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the application:
```bash
npm start
```

## Authentication

### Login
1. Send a POST request to `/api/auth/login` with your credentials:
```json
{
  "username": "your-username",
  "password": "your-password"
}
```

2. Use the returned token in subsequent requests:
```
Authorization: Bearer <your-token>
```

### Token Refresh
When your token expires:
1. Send a POST request to `/api/auth/refresh` with your expired token
2. Use the new token for future requests

## Cache Management

### Viewing Cache Metrics
1. Access the cache dashboard
2. Select a time range (24h, 7d, 30d)
3. View metrics including:
   - Hit rate
   - Response time
   - Memory usage
   - Item count

### Configuring Cache
1. Navigate to the cache settings
2. Adjust parameters:
   - Maximum size
   - Maximum age
   - Update age on get
   - Eviction policy

### Clearing Cache
1. Access the cache management section
2. Click "Clear Cache" to remove all entries
3. Confirm the action

## Performance Monitoring

### Viewing Performance Metrics
1. Access the performance dashboard
2. Select a time range
3. Monitor:
   - CPU usage
   - Memory usage
   - Response time
   - Error rate

### Setting Alerts
1. Navigate to the alert settings
2. Configure thresholds for:
   - CPU usage
   - Memory usage
   - Response time
   - Error rate
3. Set notification preferences

## Best Practices

### Cache Usage
1. Use appropriate TTL values
2. Monitor hit rates regularly
3. Adjust cache size based on memory usage
4. Implement proper eviction policies

### Performance Optimization
1. Monitor response times
2. Set up alerts for anomalies
3. Review error rates
4. Scale resources as needed

### Security
1. Keep tokens secure
2. Use HTTPS for all requests
3. Implement rate limiting
4. Monitor for suspicious activity

## Troubleshooting

### Common Issues
1. **High Error Rate**
   - Check server logs
   - Review recent changes
   - Verify resource usage

2. **Slow Response Time**
   - Check cache hit rate
   - Review database queries
   - Monitor resource usage

3. **Authentication Issues**
   - Verify token validity
   - Check user permissions
   - Review security settings

### Getting Help
1. Check the documentation
2. Review error logs
3. Contact support
4. Submit an issue on GitHub 