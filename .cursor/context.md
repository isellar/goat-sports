# GOAT Sports - AI Context Guide

This file provides context for AI assistants working on this codebase.

## Quick Reference

### Database Schema Location
- **Main Schema**: `lib/db/schema.ts`
- **DB Client**: `lib/db/index.ts`
- **Types**: Inferred from schema using `typeof schema.players.$inferSelect`

### Key Utilities
- **Fantasy Points**: `lib/utils/fantasy.ts` - `calculateFantasyPoints(player)`
- **Player Utils**: `lib/utils/player.ts` - player-related helper functions
- **General Utils**: `lib/utils.ts` - `cn()` for className merging

### Component Library
- **UI Components**: `components/ui/` - shadcn/ui components (Radix UI based)
- **Feature Components**: `components/[feature]/` - feature-specific components
- **Import Pattern**: `import { Button } from '@/components/ui/button'`

### API Routes
- **Pattern**: `app/api/[resource]/route.ts`
- **Export**: Named exports `GET`, `POST`, etc.
- **Response**: Use `NextResponse.json()` with proper status codes

### Documentation
- **Location**: All documentation files (except README.md) go in `docs/` folder
- **Examples**: Architecture docs, development guides, performance notes, etc.

## Common Tasks

### Adding a New Player Field
1. Update `lib/db/schema.ts` - add column to `players` table
2. Run `bun run db:generate` to create migration
3. Run `bun run db:push` (dev) or `bun run db:migrate` (production)
4. Types are automatically inferred - no manual type updates needed

### Creating a New API Endpoint
1. Create `app/api/[resource]/route.ts`
2. Export async function `GET(request: NextRequest)` or `POST`, etc.
3. Use Drizzle to query database
4. Return `NextResponse.json()` with proper status codes
5. Handle errors with try/catch

### Creating a New Component
1. Create file in `components/[feature]/ComponentName.tsx`
2. Define TypeScript interface for props
3. Use shadcn/ui components from `@/components/ui/`
4. Add `'use client'` directive if using hooks or browser APIs
5. Export as named export

### Querying Database
```typescript
// Single record
const player = await db.select().from(players).where(eq(players.id, id)).limit(1);

// Multiple records with filters
const results = await db
  .select()
  .from(players)
  .where(and(
    eq(players.position, 'C'),
    gt(players.points, 50)
  ))
  .orderBy(desc(players.points));

// With joins
const results = await db
  .select({
    player: players,
    team: teams,
  })
  .from(players)
  .leftJoin(teams, eq(players.teamId, teams.id));
```

## Type Patterns

### Player Type
```typescript
import type { Player } from '@/lib/db/schema';
// Player type is automatically inferred from schema
```

### API Response Types
```typescript
// Success response
{ data: T, total?: number, limit?: number, offset?: number }

// Error response
{ error: string }
```

### Component Props
```typescript
interface ComponentProps {
  // Required props
  required: string;
  // Optional props with defaults
  optional?: boolean;
  // Callbacks
  onAction?: (value: string) => void;
}
```

## Performance Considerations

1. **Batch Queries**: Always batch database queries to avoid N+1
2. **React Query**: Use for server state caching
3. **Code Splitting**: Use dynamic imports for heavy components
4. **Image Optimization**: Use Next.js Image component
5. **Memoization**: Use `useMemo` and `useCallback` when appropriate

## Error Handling Patterns

### API Routes
```typescript
try {
  // Logic
  return NextResponse.json({ data });
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

### Components
```typescript
const [error, setError] = useState<string | null>(null);

try {
  // Logic
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}
```

## Testing Checklist

Before considering code complete:
- [ ] Type check passes: `bun run type-check`
- [ ] Linter passes: `bun run lint`
- [ ] No console errors in browser
- [ ] Database queries are optimized (no N+1, use batch queries)
- [ ] Error cases are handled
- [ ] Types are properly inferred (no `any`)
- [ ] Documentation (if created) is in `docs/` folder

## Project Preferences

- **Package Manager**: Bun (preferred), npm as fallback
- **Node.js Version**: 24.12.0 (LTS) or Bun 1.0+
- **TypeScript**: Strict mode enabled, but `noUnusedLocals`/`noUnusedParameters` disabled for faster dev builds
- **Performance**: Always batch database queries, avoid N+1 queries
- **Documentation**: All docs (except README.md) in `docs/` folder
- **Dependencies**: Remove unused packages regularly to keep bundle size small

