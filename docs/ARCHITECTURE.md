# Architecture

## Architecture Components

### Frontend
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Next.js App Router with file-based routing
- **Real-time**: Supabase real-time subscriptions for live updates

### Backend
- **API Layer**: Next.js API Routes (RESTful endpoints)
- **Database ORM**: Drizzle ORM for type-safe, flexible database queries
- **Database**: PostgreSQL (via Supabase or standalone)
- **Authentication**: Supabase Auth (with option to migrate to NextAuth.js)
- **File Storage**: Supabase Storage (for user uploads, avatars, etc.)

### Data Layer
- **Database**: PostgreSQL with Drizzle schema definitions
- **Schema Location**: `lib/db/schema.ts` - Single source of truth for data models
- **Migrations**: Drizzle Kit for version-controlled database migrations
- **Type Safety**: Full TypeScript inference from schema definitions

### ETL & Data Ingestion
- **Architecture**: Hybrid approach combining Next.js API routes and separate worker services
- **Scheduled Jobs**: Vercel Cron for quick scheduled tasks (< 60s)
- **Background Workers**: Separate Node.js services for long-running ETL processes
- **Data Sources**:
  - Sports data APIs (NFL, NBA, etc.)
  - Injury reports and news feeds
  - Weather data for game conditions
  - Real-time score updates
- **ETL Pipeline Structure**:
  - `lib/etl/sources/` - Data source adapters (APIs, scrapers)
  - `lib/etl/transformers/` - Data transformation logic
  - `lib/etl/loaders/` - Database loading operations
  - `workers/` - Background worker processes

### Infrastructure
- **Hosting**: Vercel (Next.js frontend + API routes)
- **Workers**: Railway, Render, or Fly.io for background services
- **Database Hosting**: Supabase (PostgreSQL) or managed PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: TBD (consider Vercel Analytics, Sentry)

## Tech Stack Details

### Core Framework
- **Next.js**: 14+ (App Router)
  - Server Components for optimal performance
  - API Routes for backend functionality
  - Built-in optimizations (image, font, script)
- **TypeScript**: 5.5+
  - Strict mode enabled
  - Shared types between frontend and backend

### UI & Styling
- **shadcn/ui**: Component library built on Radix UI primitives
  - Copy-paste components, full customization
  - Accessible by default
  - Theme-aware components
- **Tailwind CSS**: 3.4+
  - Utility-first CSS framework
  - Custom design system tokens
  - Dark mode support via next-themes

### Data & State
- **Drizzle ORM**: Latest version
  - PostgreSQL driver
  - Type-safe queries with full inference
  - Migration management via Drizzle Kit
- **React Query (TanStack Query)**: 5.56+
  - Server state management
  - Caching and background refetching
  - Optimistic updates
- **Supabase**: 2.49+
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Type checking
- **Drizzle Kit**: Database migrations and introspection
- **Vercel CLI**: Local development and deployment

### Key Dependencies
- **React**: 18.3+
- **React DOM**: 18.3+
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation
- **react-hook-form**: Form state management
- **lucide-react**: Icon library
- **recharts**: Data visualization

## Technical Decisions & Rationale

### Why Drizzle over Prisma?
- **Complex Queries**: Fantasy sports requires filtering across multiple dimensions (dates, teams, schedules, stats) simultaneously
- **SQL Flexibility**: Need fine-grained control over query generation for performance
- **Type Safety**: Pure TypeScript inference without code generation step
- **Developer Comfort**: Team comfortable with SQL, benefits from flexibility

### Why Next.js API Routes?
- **Unified Codebase**: Frontend and backend in one repository, shared types
- **Fast Iteration**: No context switching between separate services during development
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Deployment Simplicity**: Single deployment for full-stack application

### Why Hybrid ETL Approach?
- **Next.js API Routes**: Quick scheduled jobs, webhooks, manual triggers
- **Separate Workers**: Long-running processes, complex transformations, better error handling
- **Flexibility**: Right tool for each job, scales independently

## Data Flow

```
External APIs → ETL Pipeline → PostgreSQL Database
                                      ↓
                            Next.js API Routes
                                      ↓
                            React Components (Frontend)
                                      ↓
                            Real-time Updates (Supabase)
```

## Key Modules

1. **Player Management**: Search, filter, view stats, track performance
2. **League Management**: Create/join leagues, manage settings, rosters
3. **Draft System**: Live draft interface, player selection, team building
4. **Matchups & Scoring**: Weekly matchups, real-time scoring, standings
5. **Analytics**: Advanced stats, projections, trade analysis, insights
6. **Social**: Chat, forums, leaderboards, sharing, community
7. **Data Ingestion**: ETL pipelines, scheduled jobs, real-time updates
8. **User Management**: Authentication, profiles, preferences, subscriptions

