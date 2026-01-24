# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GOAT Sports is a fantasy sports platform built with Next.js 15 (App Router), TypeScript, Drizzle ORM, and PostgreSQL. The platform focuses on NHL fantasy sports with plans to expand to other leagues.

## Essential Commands

### Development
```bash
bun run dev              # Start development server on localhost:3000
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
bun run type-check       # Run TypeScript type checking (strict checks)
```

### Testing
```bash
bun run test             # Run tests with Vitest
bun run test:watch       # Run tests in watch mode
bun run test:ui          # Open Vitest UI
bun run test:coverage    # Generate coverage report
```

### Database Operations
```bash
bun run db:generate      # Generate migrations from schema changes
bun run db:migrate       # Apply migrations to database
bun run db:push          # Push schema directly to database (dev only)
bun run db:studio        # Open Drizzle Studio for database inspection
bun run db:seed          # Seed database with sample NHL data
```

## Architecture

### Database as Source of Truth
- **Schema Location**: `lib/db/schema.ts` is the single source of truth for all data models
- **Type Inference**: All database types are inferred from the Drizzle schema using `typeof table.$inferSelect`
- **Never manually type database results** - always use Drizzle's type inference
- **Relations**: Defined in schema using Drizzle's relations API for type-safe joins

### API Route Structure
All API routes follow Next.js 15 App Router conventions:
- Location: `app/api/[resource]/route.ts`
- Export `GET`, `POST`, `PUT`, `DELETE` functions as needed
- Always check if `db` exists before querying (return 503 if not configured)
- Return appropriate HTTP status codes (200, 400, 404, 500, 503)
- Use Drizzle ORM for all database queries - never raw SQL

### Component Architecture
- **Server Components by default** - only use `'use client'` when needed for:
  - Browser APIs (localStorage, window)
  - Event handlers and interactivity
  - React hooks (useState, useEffect, etc.)
- **UI Components**: Located in `components/ui/` - these are shadcn/ui components (don't modify directly)
- **Feature Components**: Organized in `components/[feature]/` by feature area
- **Type Props Explicitly**: Always use TypeScript interfaces for component props

### State Management
- **Server State**: React Query (TanStack Query) for caching and refetching
- **Real-time**: Supabase real-time subscriptions for live updates
- **Local State**: React hooks (useState, useReducer) for component-level state

### ETL Pipeline (Planned)
- Hybrid approach: Next.js API routes for quick jobs, separate workers for long-running processes
- Structure: `lib/etl/sources/` (API adapters), `lib/etl/transformers/` (data transformation), `lib/etl/loaders/` (DB operations)
- Workers: `workers/` directory for background processes

## Critical Performance Patterns

### Avoid N+1 Queries
Always batch database operations:

```typescript
// ✅ GOOD: Batch query
const teamIds = results.map(r => r.teamId).filter(Boolean);
const teams = await db.select().from(teams).where(inArray(teams.id, teamIds));

// ❌ BAD: N+1 query
for (const result of results) {
  const team = await db.select().from(teams).where(eq(teams.id, result.teamId));
}
```

### Database Query Optimization
- Use `inArray()` for batch fetching related records
- Leverage Drizzle's query builder for complex filtering
- Always consider index usage for frequently queried columns

## Code Patterns

### Standard API Route Template
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tableName } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    // Query logic
    const results = await db.select().from(tableName);
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Component Props Pattern
```typescript
interface ComponentProps {
  player: Player;
  showStats?: boolean;
  onSelect?: (player: Player) => void;
}

export function Component({ player, showStats = false, onSelect }: ComponentProps) {
  // Implementation
}
```

### Fantasy Points Calculation
Use the utility in `lib/utils/fantasy.ts`:
```typescript
import { calculateFantasyPoints } from '@/lib/utils/fantasy';
const points = calculateFantasyPoints(player);
```

## Testing Strategy

### Test Organization
- **API Routes**: Tests co-located with routes as `route.test.ts`
- **Components**: Tests co-located with components as `ComponentName.test.tsx`
- **Utilities**: Tests in `lib/utils/[util].test.ts`
- **Setup**: Test setup in `__tests__/setup.ts`

### Test Environments
- **Node**: Default for API tests
- **jsdom**: Automatically used for component tests (configured in vitest.config.ts)

## Schema Changes Workflow

1. Update schema in `lib/db/schema.ts`
2. Generate migration: `bun run db:generate`
3. Review generated migration in `drizzle/` directory
4. Apply migration: `bun run db:migrate` (production) or `bun run db:push` (development)
5. Types are automatically inferred - no manual type updates needed

## Package Management

- **Preferred**: Bun (`bun add [package]`, `bun add -d [package]`)
- **Alternative**: npm works but Bun is faster
- **Path Alias**: `@/` maps to project root for imports

## Key Files & Locations

- **Database Schema**: `lib/db/schema.ts` - all table definitions and relations
- **Database Client**: `lib/db/index.ts` - database connection setup
- **Migrations**: `drizzle/` - generated migration files
- **API Routes**: `app/api/` - RESTful endpoints
- **Pages**: `app/(pages)/` - public-facing pages
- **Components**: `components/` - React components organized by feature
- **Utilities**: `lib/utils/` - shared utility functions (fantasy points, draft logic, player helpers)
- **Documentation**: `docs/` - all documentation files (except README.md)

## Security Best Practices

### Input Validation
- **Always validate inputs** using Zod schemas for all API endpoints
- **Drizzle ORM prevents SQL injection** - use parameterized queries (automatic with Drizzle)
- **XSS prevention**: React automatically escapes output; sanitize user-generated content
- **Never store secrets in code** - use environment variables for API keys, database credentials

### API Security
- Return appropriate error messages without exposing sensitive details
- Check database connection (`if (!db)`) before queries, return 503 if unavailable
- Implement rate limiting for production endpoints
- Validate request bodies and parameters

### Authentication (Planned)
- Supabase Auth with JWT tokens
- Row-Level Security (RLS) policies for data access control
- Role-based permissions (admin, premium, free users; league commissioners vs members)

## Performance Targets & Optimizations

### API Performance
- **Target**: < 200ms response time (p95) for standard queries
- **Complex queries**: < 500ms acceptable for analytics
- **Real-time updates**: < 1s latency from source to UI

### Recent Optimizations Achieved
- **N+1 Query Fix**: API response time improved 90%+ (42s → 2-3s) by batching queries
- **Bundle Size**: 25-35% reduction by removing unused dependencies
- **Dev Startup**: 20-35% faster with TypeScript optimizations
- **Package Imports**: Tree-shaking configured for `@radix-ui/*` and `lucide-react`

### Query Optimization Rules
- All frequent queries should use database indexes
- Use `inArray()` for batch operations instead of loops
- Cache frequently accessed data (player stats, league standings)
- Monitor slow queries and optimize proactively

## Data Sources & ETL Strategy

### Primary Data Sources
- **SportsDataIO**: Primary sports data API (comprehensive NHL, NFL, NBA, MLB data)
- **Weather APIs**: OpenWeatherMap for game conditions
- **News APIs**: Injury reports and player news
- **Strategy**: Cache aggressively, implement rate limiting, use free sources where possible

### Database Schema Key Points
- **Skater Stats**: Goals, Assists, Points, Plus/Minus, PIM, SOG, PPP, SHP, Hits, Blocks, Takeaways
- **Goalie Stats**: Wins, Overtime stats, Goals Against, Saves, Shutouts
- **Analytics Fields**: Position Rank, Heat Score (-3 to 3), Trend Score, Fantasy Points
- **Indexing**: Composite indexes on common filters (position + team + date), full-text search on player names

## Known Limitations & Constraints

### Platform Constraints
- **Vercel Free Tier**: 10s timeout for API routes (60s on Pro)
  - Long-running ETL operations must use separate worker services
  - Use Next.js API routes for quick operations only (< 10s)
- **Database connections**: Use connection pooling to avoid exhausting limits
- **API costs**: Sports data APIs are expensive; aggressive caching required

### Technical Trade-offs Made
- **Drizzle over Prisma**: More verbose but better for complex fantasy sports queries
- **Next.js API Routes over separate backend**: Faster development, shared types, simpler deployment
- **Hybrid ETL**: Next.js routes for quick jobs, separate workers for long-running processes
- **Supabase**: Vendor lock-in acceptable for built-in auth, real-time, storage benefits

## Deployment Strategy

### Environments
- **Production**: Vercel (main app), Railway/Render/Fly.io (workers)
- **Staging**: Vercel preview deployments on PR branches
- **Development**: Local with `bun run dev`

### Migration Workflow
1. Create migration: `bun run db:generate`
2. Test locally: `bun run db:migrate`
3. Apply to staging database and verify
4. Apply to production during low-traffic window
5. Have rollback plan ready (reverse migrations)

### CI/CD
- Automatic deployment: `main` branch → Production
- PR branches → Preview deployments
- Run linting, type-check, and tests before deployment

## Important Constraints

- **Never commit `.env.local`** - it's in `.gitignore`
- **Use TypeScript strict mode** - run `bun run type-check` before commits
- **Drizzle ORM only** - no raw SQL unless absolutely necessary
- **Batch database queries** - always avoid N+1 query patterns
- **Use shadcn/ui components** - don't build custom UI primitives
- **Follow Next.js 15 conventions** - App Router, Server Components, API Routes
- **Node.js version**: 24.12.0 (LTS) or Bun 1.0+
