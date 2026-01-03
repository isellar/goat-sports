# Project State Analysis

## Overview
Current state: React + Vite application with Supabase integration. Needs migration to Next.js + Drizzle architecture as outlined in the roadmap.

---

## ✅ What's Good

### 1. **UI Component Library**
- ✅ **shadcn/ui** fully set up with Radix UI primitives
- ✅ Comprehensive component library (40+ components)
- ✅ Proper component structure in `src/components/ui/`
- ✅ Custom theme colors (hockey theme) configured
- ✅ Dark mode support via `next-themes`
- ✅ Custom animations and styling

### 2. **State Management**
- ✅ **React Query (TanStack Query)** properly integrated
- ✅ Custom hooks for data fetching (`usePlayers`, `useTeams`, `useDraft`)
- ✅ Query client configured in App.tsx

### 3. **Authentication**
- ✅ **Supabase Auth** integrated
- ✅ AuthContext with proper session management
- ✅ Protected routes component
- ✅ Auth state listening for changes

### 4. **Project Structure**
- ✅ Well-organized component structure
- ✅ Feature-based component organization (roster, dashboard, layout)
- ✅ Custom UI elements separated
- ✅ Hooks properly organized
- ✅ TypeScript path aliases configured (`@/`)

### 5. **Styling**
- ✅ **Tailwind CSS** fully configured
- ✅ Custom design tokens (hockey theme colors)
- ✅ Responsive design considerations
- ✅ Custom animations defined

### 6. **Existing Features**
- ✅ Multiple pages already built (Players, Roster, Draft, Matchup, Standings, etc.)
- ✅ Player filtering and search functionality
- ✅ Data fetching from Supabase
- ✅ Basic fantasy sports features implemented

### 7. **Development Tools**
- ✅ ESLint configured
- ✅ TypeScript setup
- ✅ Vite for fast development
- ✅ Bun as package manager (modern choice)

---

## ⚠️ What's Bad / Needs Fixing

### 1. **Critical Security Issue**
- ❌ **Hardcoded Supabase credentials** in `src/supabase.ts`
  - URL and anon key exposed in source code
  - Should use environment variables
  - **Priority: CRITICAL** - Fix immediately

### 2. **Wrong Framework Stack**
- ❌ Using **React Router** instead of Next.js App Router
- ❌ Using **Vite** instead of Next.js
- ❌ Client-side routing instead of file-based routing
- ❌ No server-side rendering capabilities
- **Impact**: Doesn't match architecture plan, needs full migration

### 3. **No Backend API Layer**
- ❌ All database queries are **client-side** (direct Supabase calls)
- ❌ No API routes for backend logic
- ❌ No server-side data processing
- ❌ Security concerns (exposing database structure to client)
- **Impact**: Can't implement proper backend logic, ETL, or secure operations

### 4. **No Database ORM**
- ❌ Using **Supabase client directly** instead of Drizzle ORM
- ❌ No type-safe database schema definitions
- ❌ No migration management
- ❌ No single source of truth for data models
- **Impact**: Can't leverage Drizzle's benefits for complex queries

### 5. **TypeScript Configuration Too Lenient**
- ❌ `noImplicitAny: false` - allows implicit any types
- ❌ `strictNullChecks: false` - no null safety
- ❌ `noUnusedLocals: false` - allows unused variables
- ❌ `noUnusedParameters: false` - allows unused parameters
- **Impact**: Loses TypeScript's safety benefits, harder to catch bugs

### 6. **No Environment Variable Setup**
- ❌ No `.env` files
- ❌ No `.env.example` template
- ❌ Hardcoded configuration values
- **Impact**: Can't manage different environments, security issues

### 7. **Missing Project Structure**
- ❌ No `lib/db/` directory (for Drizzle schema)
- ❌ No `lib/etl/` directory (for ETL pipeline)
- ❌ No `workers/` directory (for background jobs)
- ❌ No `app/` directory (for Next.js App Router)
- ❌ No `app/api/` directory (for API routes)
- **Impact**: Can't implement planned architecture

### 8. **No ETL Infrastructure**
- ❌ No data ingestion pipeline
- ❌ No worker services
- ❌ No scheduled job infrastructure
- ❌ No data source adapters
- **Impact**: Can't ingest sports data automatically

### 9. **Database Schema Not Defined**
- ❌ No Drizzle schema file (`lib/db/schema.ts`)
- ❌ No migration files
- ❌ Database structure only exists in Supabase (not version controlled)
- **Impact**: Can't track schema changes, no type safety from schema

### 10. **No Development Scripts**
- ❌ No database migration scripts
- ❌ No worker development scripts
- ❌ No environment setup scripts
- **Impact**: Harder to onboard, manual setup required

---

## 🔨 What Needs to Be Added

### Phase 1: Foundation (Critical Path)

#### 1. **Next.js Migration Setup**
- [ ] Install Next.js and dependencies
- [ ] Create `next.config.js`
- [ ] Set up App Router structure (`app/` directory)
- [ ] Migrate pages from React Router to Next.js pages
- [ ] Update routing configuration
- [ ] Set up middleware for auth

#### 2. **Environment Variables**
- [ ] Create `.env.local` file
- [ ] Create `.env.example` template
- [ ] Move Supabase credentials to env vars
- [ ] Update `src/supabase.ts` to use env vars
- [ ] Add `.env.local` to `.gitignore`

#### 3. **Drizzle ORM Setup**
- [ ] Install Drizzle ORM and Drizzle Kit
- [ ] Create `lib/db/` directory structure
- [ ] Create `lib/db/schema.ts` with database schema
- [ ] Create `lib/db/index.ts` for DB client
- [ ] Create `drizzle.config.ts` configuration
- [ ] Generate initial migration from existing Supabase schema
- [ ] Set up migration scripts in package.json

#### 4. **TypeScript Configuration**
- [ ] Enable strict mode (`strict: true`)
- [ ] Enable `noImplicitAny: true`
- [ ] Enable `strictNullChecks: true`
- [ ] Enable `noUnusedLocals: true`
- [ ] Fix all TypeScript errors from stricter config

#### 5. **API Routes Structure**
- [ ] Create `app/api/` directory
- [ ] Set up API route structure
- [ ] Create example API route
- [ ] Migrate data fetching from client to API routes
- [ ] Update hooks to call API routes instead of Supabase directly

#### 6. **Project Structure**
- [ ] Create `lib/etl/` directory structure
  - [ ] `lib/etl/sources/` - Data source adapters
  - [ ] `lib/etl/transformers/` - Data transformation
  - [ ] `lib/etl/loaders/` - Database loaders
- [ ] Create `workers/` directory for background jobs
- [ ] Create `lib/types/` for shared TypeScript types

### Phase 2: Database & Data Layer

#### 7. **Database Schema Migration**
- [ ] Analyze existing Supabase tables
- [ ] Define Drizzle schema matching current database
- [ ] Create migration files
- [ ] Test migrations locally
- [ ] Document schema relationships

#### 8. **Data Fetching Migration**
- [ ] Convert `usePlayers` hook to use API route
- [ ] Convert `useTeams` hook to use API route
- [ ] Convert `useDraft` hook to use API route
- [ ] Create API routes for all data fetching
- [ ] Update all components to use new hooks

### Phase 3: ETL Pipeline Foundation

#### 9. **ETL Infrastructure**
- [ ] Create ETL pipeline structure
- [ ] Set up data source adapters (placeholder)
- [ ] Create transformer utilities
- [ ] Set up database loader utilities
- [ ] Create worker service template

#### 10. **Scheduled Jobs**
- [ ] Set up Vercel Cron configuration (for Next.js)
- [ ] Create example scheduled job
- [ ] Set up worker service deployment config

### Phase 4: Development Experience

#### 11. **Development Scripts**
- [ ] Add `dev:worker` script for local worker development
- [ ] Add database migration scripts
- [ ] Add database seed scripts (if needed)
- [ ] Add type generation scripts

#### 12. **Documentation**
- [ ] Create setup instructions
- [ ] Document environment variables
- [ ] Document database schema
- [ ] Document API routes
- [ ] Create development workflow guide

---

## 📊 Migration Complexity Assessment

### High Complexity (Requires Careful Planning)
1. **Next.js Migration** - Major refactoring of routing and structure
2. **API Routes Migration** - Moving all data fetching to backend
3. **Drizzle Schema Definition** - Need to reverse-engineer existing schema

### Medium Complexity
1. **TypeScript Strict Mode** - Will require fixing many type errors
2. **Environment Variables** - Straightforward but touches many files
3. **ETL Pipeline Setup** - New infrastructure, but well-defined structure

### Low Complexity
1. **Project Structure** - Just creating directories
2. **Development Scripts** - Simple package.json additions
3. **Documentation** - Writing docs

---

## 🎯 Recommended Migration Order

### Step 1: Security & Environment (Quick Win)
1. Fix hardcoded credentials → Environment variables
2. Create `.env` files and templates
3. Update Supabase client to use env vars

### Step 2: TypeScript Strictness (Foundation)
1. Enable strict TypeScript config
2. Fix type errors incrementally
3. Add proper type definitions

### Step 3: Drizzle Setup (Database Layer)
1. Install Drizzle
2. Create schema file
3. Set up migrations
4. Test locally

### Step 4: Next.js Migration (Major Refactor)
1. Install Next.js
2. Create App Router structure
3. Migrate pages one by one
4. Update routing
5. Test thoroughly

### Step 5: API Routes (Backend Layer)
1. Create API route structure
2. Migrate data fetching to API routes
3. Update hooks to call APIs
4. Remove direct Supabase calls from client

### Step 6: ETL Infrastructure (Future)
1. Create ETL directory structure
2. Set up worker services
3. Implement data ingestion

---

## 🔍 Key Files That Need Changes

### Critical Files
- `src/supabase.ts` - **SECURITY**: Move credentials to env vars
- `src/App.tsx` - **MIGRATION**: Convert to Next.js layout
- `package.json` - **SETUP**: Add Next.js, Drizzle, update scripts
- `tsconfig.json` - **QUALITY**: Enable strict mode
- `vite.config.ts` - **MIGRATION**: Replace with `next.config.js`

### Files to Create
- `next.config.js` - Next.js configuration
- `drizzle.config.ts` - Drizzle configuration
- `lib/db/schema.ts` - Database schema
- `lib/db/index.ts` - Database client
- `app/layout.tsx` - Next.js root layout
- `app/api/**/*.ts` - API routes
- `.env.local` - Environment variables
- `.env.example` - Environment template

### Files to Migrate
- All `src/pages/*.tsx` → `app/(pages)/**/page.tsx`
- All `src/components/*` → `components/*` (mostly same)
- `src/contexts/*` → `contexts/*` (mostly same)
- `src/hooks/*` → `hooks/*` (update to use API routes)

---

## 💡 Quick Wins (Can Do Immediately)

1. **Fix Security Issue** (5 minutes)
   - Move Supabase credentials to `.env.local`
   - Update `src/supabase.ts` to use `process.env`

2. **Create Environment Template** (5 minutes)
   - Create `.env.example` with placeholder values

3. **Enable TypeScript Strict Mode** (30 minutes - 2 hours)
   - Update `tsconfig.json`
   - Fix immediate type errors
   - Can fix remaining errors incrementally

4. **Create Directory Structure** (10 minutes)
   - Create `lib/db/`, `lib/etl/`, `workers/` directories
   - Add placeholder README files

5. **Install Drizzle** (15 minutes)
   - Install packages
   - Create basic `drizzle.config.ts`
   - Create placeholder `lib/db/schema.ts`

---

## 📝 Notes

- The existing UI components and styling are excellent and can be mostly reused
- The component structure is well-organized and aligns with Next.js patterns
- React Query setup is good and will work with Next.js
- Authentication flow is solid, just needs Next.js middleware integration
- Most of the "bad" items are about missing infrastructure, not bad code
- The migration is significant but the foundation (UI, components, styling) is solid

---

## 🚀 Next Steps

1. **Start with security fix** - Move credentials to env vars
2. **Set up environment variables** - Create `.env` files
3. **Install Next.js** - Begin framework migration
4. **Set up Drizzle** - Create database schema definitions
5. **Create API routes** - Move data fetching to backend
6. **Migrate pages** - Convert React Router pages to Next.js pages
7. **Set up ETL structure** - Prepare for data ingestion

The project has a solid foundation with good UI/UX work. The main work is migrating to the new architecture and adding the missing backend/data infrastructure.

