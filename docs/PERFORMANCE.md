# Performance

## Performance Targets

### Frontend Performance
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### API Performance
- **API Response Time**: < 200ms (p95)
- **Database Query Time**: < 100ms (p95)
- **Complex Queries**: < 500ms (p95) - acceptable for analytics
- **Real-time Update Latency**: < 1s from source to UI

### Database Performance
- **Query Optimization**: All queries use indexes
- **Connection Pooling**: Properly configured
- **Caching Strategy**: 
  - Frequently accessed data cached
  - Player stats cached for current week
  - League standings cached with TTL

### ETL Performance
- **Daily Ingestion**: Complete within 30 minutes
- **Real-time Updates**: Process within 5 seconds of data availability
- **Batch Processing**: Handle 10,000+ records efficiently
- **Error Recovery**: Automatic retry with exponential backoff

### Scalability Targets
- **Concurrent Users**: Support 1,000+ simultaneous users
- **Database Connections**: Efficient connection pooling
- **API Rate Limiting**: Prevent abuse, allow legitimate usage
- **CDN Caching**: Static assets cached at edge

### Build Performance
- **Package Import Optimization**: Next.js `optimizePackageImports` configured for:
  - `@radix-ui/react-icons` - Tree-shaking for icon imports
  - `lucide-react` - Optimized icon bundle
  - `@radix-ui/react-slot` - Reduced bundle size
- **TypeScript Compilation**: 
  - Dev builds: Some strict checks disabled for faster iteration
  - Production builds: Full type checking via `type-check` script
  - Incremental compilation enabled

### Monitoring & Optimization
- **Performance Budgets**: Set and monitor bundle sizes
- **Regular Audits**: Lighthouse, WebPageTest
- **Database Query Analysis**: Monitor slow queries
- **API Monitoring**: Track response times and error rates

