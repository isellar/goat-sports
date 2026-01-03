# Limitations & Trade-offs

## Known Limitations

### Current Limitations

#### Technology Stack
- **Next.js API Routes**: 10s timeout on Hobby plan (60s on Pro)
  - **Impact**: Long-running operations must use workers
  - **Mitigation**: Use separate worker services for ETL
- **Vercel Free Tier**: Limited function execution time and bandwidth
  - **Impact**: May need to upgrade for production scale
  - **Mitigation**: Optimize code, use caching, consider Pro tier

#### Data Sources
- **API Costs**: Sports data APIs can be expensive
  - **Impact**: Budget constraints may limit data sources
  - **Mitigation**: Cache aggressively, use free sources where possible
- **Rate Limits**: External APIs have rate limits
  - **Impact**: May need to queue requests or upgrade plans
  - **Mitigation**: Implement rate limiting, request queuing, retry logic

#### Database
- **Supabase Free Tier**: Limited database size and connections
  - **Impact**: May need to upgrade for production
  - **Mitigation**: Optimize queries, use connection pooling, monitor usage
- **Migration Complexity**: Complex migrations require careful planning
  - **Impact**: Schema changes can be risky
  - **Mitigation**: Test migrations thoroughly, have rollback plans

### Technical Debt

#### Migration from React/Vite
- **Incomplete Migration**: Current codebase is React + Vite, needs full Next.js migration
  - **Priority**: High (Phase 1)
  - **Effort**: Significant refactoring required

#### ETL Pipeline
- **Initial Implementation**: ETL pipeline structure exists but needs completion
  - **Priority**: High (Phase 1-3)
  - **Effort**: Build out sources, transformers, loaders

#### Testing
- **Test Coverage**: Limited test coverage currently
  - **Priority**: Medium (ongoing)
  - **Effort**: Build out test suite incrementally

#### Documentation
- **API Documentation**: No formal API documentation yet
  - **Priority**: Medium
  - **Effort**: Document as we build

## Trade-offs Made

### Drizzle over Prisma
- **Trade-off**: More verbose queries, steeper learning curve
- **Benefit**: Better performance, more flexibility, better for complex queries
- **Acceptable**: Yes, given fantasy sports query complexity

### Next.js API Routes over Separate Backend
- **Trade-off**: Less separation of concerns, potential scaling limits
- **Benefit**: Faster development, shared types, simpler deployment
- **Acceptable**: Yes, can extract to separate service later if needed

### Hybrid ETL Approach
- **Trade-off**: More complex architecture (two deployment targets)
- **Benefit**: Right tool for each job, better performance
- **Acceptable**: Yes, necessary for production-quality ETL

### Supabase over Standalone PostgreSQL
- **Trade-off**: Vendor lock-in, potential cost at scale
- **Benefit**: Built-in auth, real-time, storage, easier setup
- **Acceptable**: Yes, can migrate to standalone PostgreSQL later if needed

## Future Improvements Needed

### Performance
- **Caching Layer**: Implement Redis for frequently accessed data
- **CDN Optimization**: Optimize static assets and API responses
- **Database Optimization**: Query optimization, indexing strategy refinement

### Features
- **Real-time Updates**: Enhance real-time capabilities for live games
- **Mobile App**: Native mobile app or enhanced PWA
- **Offline Support**: Service workers for offline functionality

### Infrastructure
- **Monitoring**: Comprehensive monitoring and alerting
- **Logging**: Centralized logging and log aggregation
- **Backup Strategy**: Automated backup and disaster recovery

### Developer Experience
- **Testing**: Comprehensive test suite
- **Documentation**: API documentation, developer guides
- **CI/CD**: Full CI/CD pipeline with automated testing

## Risk Areas

### Data Reliability
- **External API Failures**: Sports data APIs may go down
  - **Mitigation**: Multiple data sources, caching, graceful degradation
- **Data Quality**: Inconsistent or incorrect data from sources
  - **Mitigation**: Data validation, error detection, manual review process

### Scalability
- **Database Performance**: Complex queries may slow down at scale
  - **Mitigation**: Query optimization, caching, read replicas if needed
- **API Performance**: High traffic may impact API response times
  - **Mitigation**: Caching, rate limiting, CDN, edge functions

### Cost Management
- **API Costs**: Sports data APIs can be expensive at scale
  - **Mitigation**: Efficient caching, optimize API usage, negotiate rates
- **Infrastructure Costs**: Hosting costs increase with scale
  - **Mitigation**: Optimize resource usage, use cost-effective providers

## Decisions to Revisit

### When to Extract Backend
- **Trigger**: If API routes become too complex or hit scaling limits
- **Consideration**: Extract to separate Node.js/Express service
- **Timeline**: Evaluate after Phase 2 or 3

### When to Add Caching Layer
- **Trigger**: If database queries become bottleneck
- **Consideration**: Add Redis for caching
- **Timeline**: Evaluate during Phase 3 (Analytics phase)

### When to Optimize for Mobile
- **Trigger**: Significant mobile user base or mobile-specific features needed
- **Consideration**: Native app vs. enhanced PWA
- **Timeline**: Phase 6 or based on user feedback

