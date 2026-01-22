# GOAT Sports

A next-generation fantasy sports platform built with modern web technologies, designed for intelligent insights, seamless user experience, and social engagement.

## Quick Links

- [Architecture](./docs/ARCHITECTURE.md) - System architecture, tech stack, and technical decisions
- [Roadmap](./docs/ROADMAP.md) - Development phases and high-level plan
- [Current Features](./docs/CURRENT_FEATURES.md) - Currently implemented features and functionality
- [Development](./docs/DEVELOPMENT.md) - Development workflow, principles, and best practices
- [Deployment](./docs/DEPLOYMENT.md) - Deployment strategy and CI/CD
- [Data](./docs/DATA.md) - Data sources, ETL pipeline, and database schema
- [Security](./docs/SECURITY.md) - Security considerations and best practices
- [Performance](./docs/PERFORMANCE.md) - Performance targets and optimization
- [Limitations](./docs/LIMITATIONS.md) - Known limitations, trade-offs, and technical debt

## Overview

GOAT Sports is a fantasy sports platform that combines:
- **Modern Architecture**: Next.js 15, Drizzle ORM, TypeScript throughout
- **Advanced Analytics**: Insight-forward analytics and predictive modeling
- **Social Features**: Community building, chat, forums, leaderboards
- **Real-time Updates**: Live scoring, game updates, notifications
- **Data-Driven**: Robust ETL pipeline for sports data ingestion

## Tech Stack Summary

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase real-time subscriptions
- **ETL**: Hybrid approach (Next.js API routes + separate workers)
- **Hosting**: Vercel (frontend/API), Railway/Render (workers)

## Getting Started

### Prerequisites

- Node.js 20+ (or Bun)
- PostgreSQL database (or Supabase)
- Environment variables configured

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Set up the database:**
   ```bash
   # Generate migration from schema
   npm run db:generate
   
   # Apply migrations (or use manual migration scripts if needed)
   npm run db:migrate
   
   # Or push schema directly (development)
   npm run db:push
   
   # Seed database with sample NHL data
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database (dev)
- `npm run db:seed` - Seed database with sample NHL data
- `npm run db:studio` - Open Drizzle Studio

## Project Status

✅ **Phase 1: Foundation & Migration** - **IN PROGRESS**
- ✅ Next.js 15 with App Router set up
- ✅ Drizzle ORM configured
- ✅ TypeScript strict mode enabled
- ✅ Project structure established
- ✅ UI components migrated
- ✅ NHL Player database schema implemented
- ✅ Player list/search page with filtering
- ✅ Database migrations and seeding working

**Current Features:**
- NHL player database with comprehensive stats (skaters and goalies)
- Player search and filtering (name, position, team, stats)
- Sortable player table with fantasy points
- Player card component (consolidates name, position, team, age, status)
- Next opponent display with slate highlighting
- Heat score (🔥/❄️) and trend score indicators
- Expandable stats modal with detailed position-specific stats
- Games/schedule tracking
- League management (create, join, view leagues)
- Roster management (add/drop players, manage lineups)
- Draft system (snake draft with live updates)
- Navigation header with theme toggle and mobile menu

**Next Steps:**
- Complete ETL pipeline for real NHL data ingestion
- Implement auction draft type
- Add draft timer functionality
- Implement matchup tracking and scoring
- Add standings and statistics
- Build transaction history (trades, waivers)

See [Roadmap](./docs/ROADMAP.md) for detailed phase information.
