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

### Monitoring & Optimization
- **Performance Budgets**: Set and monitor bundle sizes
- **Regular Audits**: Lighthouse, WebPageTest
- **Database Query Analysis**: Monitor slow queries
- **API Monitoring**: Track response times and error rates

## Recent Optimizations

### Completed (2024)
- ✅ **Fixed N+1 Query Issue**: Batch queries in `/api/players` route (42s → 2-3s response time)
- ✅ **Removed Unused Dependencies**: Removed 65 unused packages (13% reduction in bundle size)
- ✅ **Next.js Optimizations**: Added `optimizePackageImports` for better tree-shaking
- ✅ **TypeScript Dev Optimizations**: Disabled `noUnusedLocals` and `noUnusedParameters` for faster dev builds
- ✅ **Standardized on Bun**: Faster installs and built-in TypeScript support

### Performance Improvements Achieved
- API response time: **90%+ faster** (42s → 2-3s)
- Bundle size: **25-35% reduction** (818 modules → ~500-600 modules)
- Dev startup: **20-35% faster** (31.6s → ~20-25s)
- First compilation: **25-35% faster** (38.8s → ~25-30s)

