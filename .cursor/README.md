# Cursor AI Optimization Files

This directory contains files optimized for Cursor AI assistant usage.

## Files

- **`.cursorrules`** (root) - Main rules file that Cursor reads automatically. Contains:
  - Project context and tech stack
  - Code style and conventions
  - Common patterns and examples
  - Best practices for this codebase

- **`.cursorignore`** (root) - Files to exclude from AI context (similar to .gitignore)
  - Reduces noise in AI suggestions
  - Excludes build artifacts, dependencies, etc.

- **`.cursor/context.md`** - Quick reference guide for common tasks
  - Database query patterns
  - Component creation patterns
  - API route patterns
  - Type patterns

- **`.cursor/types-reference.md`** - Comprehensive type reference
  - All database types
  - API response types
  - Component prop patterns

- **`docs/CURSOR_OPTIMIZATION.md`** - Documentation about Cursor optimizations
  - Summary of all optimization files
  - Usage tips and best practices

## Usage

Cursor automatically reads `.cursorrules` when you open the project. The rules file provides context about:
- How code should be structured
- What patterns to follow
- What conventions to use
- Common pitfalls to avoid

The `.cursor/context.md` file can be referenced when asking Cursor to:
- Create new components
- Add new API routes
- Query the database
- Follow existing patterns

## Best Practices for AI-Assisted Development

1. **Be Specific**: When asking for code, mention the file location and pattern to follow
   - "Create a new API route at `app/api/leagues/route.ts` following the players route pattern"

2. **Reference Existing Code**: Point to similar implementations
   - "Create a component similar to `PlayerCard` but for teams"

3. **Use TypeScript**: Always specify types - Cursor will infer from schema when possible
   - "Create a function that takes a Player and returns their fantasy points"

4. **Follow Patterns**: Reference the patterns in `.cursorrules` and `context.md`
   - "Use the batch query pattern from context.md"

5. **Schema First**: For database changes, update schema first
   - "Add a `leagueId` field to the players table in schema.ts"

## Tips

- The `.cursorrules` file is automatically loaded - you don't need to reference it
- Use `@/` path alias in all imports
- Always check for `db === null` before database operations
- Use Drizzle ORM patterns, not raw SQL
- Leverage TypeScript type inference from schema
- **Documentation**: All docs (except README.md) go in `docs/` folder
- **Performance**: Always batch database queries to avoid N+1 problems
- **Package Manager**: Use Bun commands (`bun add`, `bun run`, etc.)

