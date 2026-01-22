# Development

## Development Principles

- **Type Safety First**: TypeScript throughout, leverage Drizzle's type inference
- **Single Source of Truth**: Database schema in `lib/db/schema.ts`
- **AI-Assisted Development**: Structure code for maximum AI assistant effectiveness
- **Progressive Enhancement**: Start simple, add complexity as needed
- **Performance Conscious**: Optimize queries, use caching, minimize database calls
- **User Experience**: Fast, intuitive, responsive, delightful

## Development Workflow

### Branching Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Individual features (e.g., `feature/player-search`)
- **fix/**: Bug fixes (e.g., `fix/scoring-calculation`)
- **etl/**: ETL pipeline changes (e.g., `etl/nfl-stats-ingestion`)

### Code Organization
```
app/                    # Next.js App Router
  (pages)/             # Public pages
  api/                 # API routes
  layout.tsx           # Root layout
lib/
  db/                  # Database
    schema.ts          # Drizzle schema definitions
    index.ts           # DB client
    migrations/        # Migration files
  etl/                 # ETL pipeline
    sources/           # Data source adapters
    transformers/      # Data transformation
    loaders/           # Database loaders
  utils/               # Shared utilities
  types/               # Shared TypeScript types
components/            # React components
  ui/                  # shadcn/ui components
  features/            # Feature-specific components
workers/               # Background workers
public/                # Static assets
```

### AI Assistant Usage Patterns
- **Schema Changes**: Update `lib/db/schema.ts`, then ask AI to generate migration
- **API Routes**: Describe endpoint, AI generates route with types
- **Components**: Describe UI need, AI creates component with proper types
- **ETL Tasks**: Describe data source, AI creates adapter/transformer/loader
- **Queries**: Describe what data needed, AI writes optimized Drizzle query

### Testing Strategy
- **Unit Tests**: Critical business logic (scoring, calculations)
- **Integration Tests**: API routes, database operations
- **E2E Tests**: Key user flows (draft, lineup, scoring)
- **ETL Tests**: Data transformation accuracy, error handling

### Code Review Process
- All PRs require review before merge
- Focus on: Type safety, performance, security, user experience
- AI-generated code should be reviewed for correctness and optimization

### Local Development
1. Clone repository
2. Install dependencies: `npm install` or `bun install`
3. Set up environment variables (`.env.local`)
4. Run database migrations: `npx drizzle-kit migrate`
5. Start dev server: `npm run dev`
6. Start workers (if needed): `npm run dev:worker`

### Build Optimizations
- **Package Import Optimization**: Next.js `optimizePackageImports` configured for:
  - `@radix-ui/react-icons` - Tree-shaking for icon imports
  - `lucide-react` - Optimized icon bundle
  - `@radix-ui/react-slot` - Reduced bundle size
- **TypeScript Dev Builds**: Some strict checks disabled in dev for faster builds:
  - `noUnusedLocals` and `noUnusedParameters` disabled
  - Full type checking still runs via `npm run type-check` script
  - Production builds maintain full type safety
