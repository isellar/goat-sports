# Background Workers

This directory contains background worker services for long-running ETL processes.

## Structure

- `ingest-stats.ts` - Weekly/daily stats ingestion
- `ingest-schedules.ts` - Schedule updates
- `update-injuries.ts` - Injury report updates

## Running Workers

```bash
# Development
npm run dev:worker

# Production
npm run worker
```

Workers should be deployed separately (Railway, Render, Fly.io) or run as separate processes.

