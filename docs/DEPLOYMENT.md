# Deployment

## Deployment Strategy

### Environments
- **Development**: Local development
- **Staging**: Pre-production testing (Vercel preview deployments)
- **Production**: Live application (Vercel production)

### Vercel Deployment
- **Automatic Deployments**: 
  - `main` branch → Production
  - PR branches → Preview deployments
- **Environment Variables**: Managed in Vercel dashboard
- **Build Process**: Automatic on push
- **Rollback**: One-click rollback to previous deployment

### Database Migrations
1. **Development**: 
   - Create migration: `npx drizzle-kit generate`
   - Apply locally: `npx drizzle-kit migrate`
   - Test migration
2. **Staging**: 
   - Apply migration to staging database
   - Verify application works
3. **Production**:
   - Apply migration during low-traffic window
   - Monitor for issues
   - Have rollback plan ready

### Worker Deployment
- **Railway/Render/Fly.io**: Separate deployment for background workers
- **Environment Sync**: Same environment variables as main app
- **Monitoring**: Log aggregation and error tracking
- **Scaling**: Scale workers independently based on ETL load

### CI/CD Pipeline
1. **On Push**: 
   - Run linter
   - Type check
   - Build application
   - Run tests (if implemented)
2. **On PR**: 
   - Create preview deployment
   - Run full test suite
3. **On Merge to main**:
   - Deploy to production
   - Run database migrations (manual or automated)
   - Health check verification

### Rollback Procedure
1. **Code Rollback**: Use Vercel rollback feature
2. **Database Rollback**: 
   - Create reverse migration
   - Apply to production
   - Verify data integrity
3. **Worker Rollback**: Redeploy previous worker version

### Monitoring & Alerts
- **Vercel Analytics**: Performance monitoring
- **Error Tracking**: Sentry (to be implemented)
- **Uptime Monitoring**: External service (UptimeRobot, etc.)
- **Database Monitoring**: Supabase dashboard or managed PostgreSQL monitoring

